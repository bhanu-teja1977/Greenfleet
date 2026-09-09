from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import statistics
from concurrent.futures import ThreadPoolExecutor
from .models import *
from .ports_repository import PortRepository
from .route_engine import build_route_options, MarineRouteUnavailable
from .marine_api import get_marine, get_weather, point_conditions
from .environmental_model import route_penalties
from .ml.fuel_model import predict_fuel
from .fuel_model_fallback import predict_fuel_fallback
from .fuel_comparison import compare_fuels, FUEL_TYPES
from .optimization.optimizer import qpso_optimize
from .optimization.baseline import baseline_optimize
from .optimization.objective import EMISSION_FACTOR, FUEL_PRICE
from .fleet_optimizer import optimize_fleet
from .voyage_parameters import compute_dynamic_voyage_params

app = FastAPI(
    title='GreenFleet-Q',
    version='3.0.0',
    description='AI + quantum-inspired green fleet decision support prototype',
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
repo = PortRepository()


@app.get('/health')
def health():
    return {
        'status': 'Operational',
        'ports_loaded': len(repo.ports),
        'weather': 'Open-Meteo Marine + Weather',
        'route_engine': 'SeaRoute water-constrained marine routing',
    }


@app.get('/ports', response_model=list[Port])
def ports(query: str = '', limit: int = 20):
    return repo.search(query, max(1, min(limit, 100)))


@app.get('/ports/{port_id}', response_model=Port)
def port(port_id: int):
    p = repo.get(port_id)
    if not p:
        raise HTTPException(404, 'Port not found')
    return p


def _hour_for_distance(cumulative_km, speed_knots):
    return int(round(cumulative_km / (max(speed_knots, 1) * 1.852)))


def _make_route_context(req: VoyageRequest, route, weather_days=8):
    lats = [p['lat'] for p in route['waypoints']]
    lons = [p['lon'] for p in route['waypoints']]
    with ThreadPoolExecutor(max_workers=2) as pool:
        fm = pool.submit(get_marine, lats, lons, weather_days)
        fw = pool.submit(get_weather, lats, lons, weather_days)
        marine = fm.result()
        weather = fw.result()

    conditions = []
    cumulative = 0.0
    cruise_speed = (req.speed_min_knots + req.speed_max_knots) / 2
    for i, _ in enumerate(route['waypoints']):
        if i > 0:
            cumulative += route['segments'][i - 1]['distance_km']
        hour = _hour_for_distance(cumulative, cruise_speed)
        conditions.append(point_conditions(marine, weather, i, hour))

    penalties = route_penalties(route, conditions, cruise_speed, 10000)
    avg_wave = statistics.mean(c['wave_height'] for c in conditions)
    avg_env = statistics.mean(x['penalty']['environmental_score'] for x in penalties)
    return marine, weather, conditions, penalties, avg_wave, avg_env


def make_context(req: VoyageRequest, weather_days=8):
    o = repo.get(req.origin_port_id)
    d = repo.get(req.destination_port_id)
    if not o or not d:
        raise HTTPException(404, 'Origin or destination port not found')
    params = compute_dynamic_voyage_params(
        o, d,
        vessel_type=req.vessel_type,
        fuel_type=req.fuel_type,
        cargo_tonnes=req.cargo_tonnes,
        start_date=req.start_date,
        end_date=req.end_date,
        explicit_deadline_hours=req.deadline_hours,
        explicit_speed_min=req.speed_min_knots,
        explicit_speed_max=req.speed_max_knots,
    )
    if not req.deadline_hours:
        req.deadline_hours = params['deadline_hours']
    if not req.speed_min_knots:
        req.speed_min_knots = params['speed_min_knots']
    if not req.speed_max_knots:
        req.speed_max_knots = params['speed_max_knots']

    try:
        routes = build_route_options(o, d, (req.speed_min_knots + req.speed_max_knots) / 2)
    except MarineRouteUnavailable as exc:
        raise HTTPException(422, str(exc)) from exc
    contexts = [_make_route_context(req, r, weather_days) for r in routes]
    return o, d, routes, contexts, params


def estimate_factory(distance, cargo_default, vessel_type='Container', avg_wave=1.5, avg_current=0.0, avg_wind=12.0):
    cache = {}
    def estimate(speed, fuel, cargo=None, size_factor=1.0):
        cargo = float(cargo if cargo is not None else cargo_default)
        speed_rounded = round(float(speed), 1)
        cache_key = (speed_rounded, fuel, cargo, size_factor)
        if cache_key in cache:
            return cache[cache_key]
        feats = {
            'vessel_type': vessel_type,
            'fuel_type': fuel,
            'speed_knots': speed_rounded,
            'cargo_tonnes': cargo,
            'distance_km': distance,
            'wave_height_m': avg_wave,
            'wave_period_s': 10,
            'current_speed_kmh': avg_current,
            'current_direction': 0,
            'vessel_heading': 90,
            'wind_speed_kmh': avg_wind,
        }
        try:
            val = max(0.0, float(predict_fuel(feats)) * size_factor)
        except Exception:
            val = predict_fuel_fallback(vessel_type, fuel, speed_rounded, cargo, distance, avg_wave) * size_factor
        cache[cache_key] = val
        return val
    return estimate


def _run_optimization(req: VoyageRequest, scenario='NORMAL'):
    o, d, routes, contexts, params = make_context(req)
    name = scenario.upper()
    env_weight = 0.25
    price_multiplier = 1.0
    deadline = req.deadline_hours
    if name == 'BAD_WEATHER':
        env_weight = 0.40
        deadline = req.deadline_hours * 0.92
    elif name == 'HIGH_FUEL_PRICE':
        price_multiplier = 1.25
    elif name == 'STRICT_EMISSION_LIMIT':
        env_weight = 0.90

    route_results = []
    for route, context in zip(routes, contexts):
        marine, weather, cond, penalties, avg_wave, avg_env = context
        avg_current = statistics.mean(c['current_velocity'] for c in cond)
        avg_wind = statistics.mean(c['wind_speed'] for c in cond)
        estimate = estimate_factory(route['distance_km'], req.cargo_tonnes, req.vessel_type, avg_wave, avg_current, avg_wind)
        base = baseline_optimize(
            route['distance_km'], req.cargo_tonnes, deadline,
            req.speed_min_knots, req.speed_max_knots, req.fuel_type, estimate,
        )
        opt = qpso_optimize(
            route['distance_km'], req.cargo_tonnes, deadline,
            req.speed_min_knots, req.speed_max_knots,
            ['HFO', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'],
            estimate, avg_env,
            emission_weight=env_weight,
            fuel_price_multiplier=price_multiplier,
        )
        route_specific_penalties = route_penalties(route, cond, opt['speed_knots'], opt['fuel_litres'])
        fuel_comparison = compare_fuels(
            route['distance_km'], req.cargo_tonnes, deadline, opt['speed_knots'],
            req.vessel_type, estimate, avg_env, env_weight, price_multiplier
        )
        fleet = optimize_fleet(
            req.cargo_tonnes, route['distance_km'], deadline,
            opt['speed_knots'], opt['fuel_type'], estimate, avg_env,
        )
        base['co2_kg'] = round(base['fuel_litres'] * EMISSION_FACTOR.get(base['fuel_type'], 3.114), 2)
        base['fuel_cost'] = round(base['fuel_litres'] * FUEL_PRICE.get(base['fuel_type'], 1) * price_multiplier, 2)
        opt['route_distance_km'] = route['distance_km']
        opt['environmental_score'] = round(avg_env, 2)
        opt['scenario'] = name

        fuel_delta = round(base['fuel_litres'] - opt['fuel_litres'], 2)
        fuel_pct = round((1 - opt['fuel_litres'] / base['fuel_litres']) * 100, 2) if base['fuel_litres'] else 0
        route_score = opt['objective']
        route_results.append({
            'route_id': route['route_id'],
            'label': route['label'],
            'route': route,
            'segment_penalties': route_specific_penalties,
            'baseline': base,
            'optimized': opt,
            'fleet_plan': fleet,
            'fuel_comparison': fuel_comparison,
            'route_score': round(route_score, 2),
            'benchmark': {
                'baseline_objective': base['objective'],
                'qpso_objective': opt['objective'],
                'improvement_percent': round((base['objective'] - opt['objective']) / base['objective'] * 100, 2) if base['objective'] else 0,
            },
            'marine_source': marine['source'],
            'weather_source': weather['source'],
            'avg_environmental_score': round(avg_env, 2),
            'savings': {
                'fuel_litres': fuel_delta,
                'fuel_percent': fuel_pct,
                'label': 'Fuel reduction vs baseline' if fuel_delta >= 0 else 'Fuel difference vs baseline',
            },
        })

    route_results.sort(key=lambda x: x['route_score'])
    for rank, item in enumerate(route_results, 1):
        item['rank'] = rank
        item['recommendation'] = 'Recommended route' if rank == 1 else 'Alternative route'

    best = route_results[0]
    base = best['baseline']
    opt = best['optimized']
    return {
        'origin': o,
        'destination': d,
        'route': best['route'],
        'baseline': base,
        'optimized': opt,
        'fleet_plan': best['fleet_plan'],
        'segment_penalties': best['segment_penalties'],
        'weather_source': best['weather_source'],
        'marine_source': best['marine_source'],
        'savings': best['savings'],
        'fuel_comparison': best['fuel_comparison'],
        'fuel_model': {
            'name': 'Random Forest fuel-consumption predictor',
            'fuel_aware': True,
            'features': ['vessel_type', 'fuel_type', 'speed_knots', 'cargo_tonnes', 'distance_km', 'wave_height_m', 'wave_period_s', 'current_speed_kmh', 'current_direction', 'vessel_heading', 'wind_speed_kmh'],
            'training_data': 'Synthetic, physics-grounded demonstration dataset (2,500 rows)',
            'runtime_artifact': 'greenfleet-backend/app/ml/fuel_model.pkl',
        },
        'algorithm': 'Quantum-inspired Particle Swarm Optimization (QPSO)',
        'benchmark': {
            'baseline_objective': base['objective'],
            'qpso_objective': opt['objective'],
            'improvement_percent': round((base['objective'] - opt['objective']) / base['objective'] * 100, 2) if base['objective'] else 0,
        },
        'scenario_controls': {
            'emission_weight': env_weight,
            'fuel_price_multiplier': price_multiplier,
        },
        'voyage_parameters': params,
        'route_options': route_results,
        'route_selection': {
            'selected_route_id': best['route_id'],
            'selection_basis': 'Lowest QPSO objective across the two prototype route candidates',
            'count': len(route_results),
        },
    }


@app.post('/parameters')
def get_voyage_parameters(req: VoyageRequest):
    o = repo.get(req.origin_port_id)
    d = repo.get(req.destination_port_id)
    if not o or not d:
        raise HTTPException(404, 'Origin or destination port not found')
    return compute_dynamic_voyage_params(
        o, d,
        vessel_type=req.vessel_type,
        fuel_type=req.fuel_type,
        cargo_tonnes=req.cargo_tonnes,
        start_date=req.start_date,
        end_date=req.end_date,
        explicit_deadline_hours=req.deadline_hours,
        explicit_speed_min=req.speed_min_knots,
        explicit_speed_max=req.speed_max_knots,
    )


@app.post('/optimize')
def optimize(req: VoyageRequest):
    return _run_optimization(req, 'NORMAL')


@app.get('/model-info')
def model_info():
    return {
        'model': 'Random Forest fuel-consumption predictor',
        'fuel_aware': True,
        'target': 'fuel_litres',
        'features': ['vessel_type', 'fuel_type', 'speed_knots', 'cargo_tonnes', 'distance_km', 'wave_height_m', 'wave_period_s', 'current_speed_kmh', 'current_direction', 'vessel_heading', 'wind_speed_kmh'],
        'training_rows': 2500,
        'dataset': 'Synthetic, physics-grounded demonstration dataset',
        'runtime_model': 'app/ml/fuel_model.pkl',
        'note': 'Replace the demonstration dataset with validated vessel telemetry when available.',
    }


@app.post('/fuel-comparison')
def fuel_comparison(req: PredictRequest):
    estimate = estimate_factory(
        req.distance_km, req.cargo_tonnes, req.vessel_type,
        req.wave_height_m, req.current_speed_kmh, req.wind_speed_kmh
    )
    rows = compare_fuels(
        req.distance_km, req.cargo_tonnes,
        req.distance_km / (req.speed_knots * 1.852),
        req.speed_knots, req.vessel_type, estimate
    )
    return {
        'comparison_basis': 'Same vessel, cargo, distance, speed and environmental conditions; only fuel type changes.',
        'model': 'Random Forest fuel-consumption predictor',
        'fuel_comparison': rows,
    }


@app.post('/predict')
def predict(req: PredictRequest):
    try:
        litres = predict_fuel(req.model_dump())
    except Exception:
        litres = predict_fuel_fallback(req.vessel_type, req.fuel_type, req.speed_knots, req.cargo_tonnes, req.distance_km, req.wave_height_m)
    return {
        'predicted_fuel_litres': round(litres, 2),
        'predicted_co2_kg': round(litres * EMISSION_FACTOR.get(req.fuel_type, 3.114), 2),
        'eta_hours': round(req.distance_km / (req.speed_knots * 1.852), 2),
    }


@app.get('/route')
def route(origin_port_id: int, destination_port_id: int):
    o = repo.get(origin_port_id)
    d = repo.get(destination_port_id)
    if not o or not d:
        raise HTTPException(404, 'Port not found')
    try:
        return {'routes': build_route_options(o, d)}
    except MarineRouteUnavailable as exc:
        raise HTTPException(
            422,
            {'marine_valid': False, 'error': 'No valid marine route found'},
        ) from exc


@app.get('/marine-data')
def marine_data(origin_port_id: int, destination_port_id: int):
    o = repo.get(origin_port_id)
    d = repo.get(destination_port_id)
    if not o or not d:
        raise HTTPException(404, 'Port not found')
    req = VoyageRequest(origin_port_id=o.port_id, destination_port_id=d.port_id, cargo_tonnes=10000, deadline_hours=240)
    _, _, routes, contexts, _ = make_context(req)
    return {
        'routes': [
            {
                'route': r,
                'source': c[0]['source'],
                'weather_source': c[1]['source'],
                'conditions': c[2],
                'segment_penalties': c[3],
            }
            for r, c in zip(routes, contexts)
        ]
    }


@app.post('/scenario')
def scenario(req: ScenarioRequest):
    name = req.scenario_name.upper()
    if name not in {'NORMAL', 'BAD_WEATHER', 'HIGH_FUEL_PRICE', 'STRICT_EMISSION_LIMIT'}:
        raise HTTPException(400, 'Unknown scenario')
    result = _run_optimization(req, name)
    return {
        'scenario_type': name,
        'result': result,
        'reasoning': {
            'NORMAL': 'Normal operating assumptions.',
            'BAD_WEATHER': 'Higher environmental sensitivity and tighter effective schedule are re-optimized.',
            'HIGH_FUEL_PRICE': 'Fuel cost multiplier is applied inside the optimizer.',
            'STRICT_EMISSION_LIMIT': 'Higher emissions weight is applied inside the optimizer; this is a prototype sensitivity, not a legal limit.',
        }[name],
    }


@app.post('/benchmark')
def benchmark(req: BenchmarkRequest):
    result = _run_optimization(req, 'NORMAL')
    base = result['baseline']
    q = result['optimized']
    return {
        'baseline': base,
        'qpso': q,
        'fleet_plan': result['fleet_plan'],
        'route_options': result['route_options'],
        'improvement_percent': round((base['objective'] - q['objective']) / base['objective'] * 100, 2) if base['objective'] else 0,
    }
