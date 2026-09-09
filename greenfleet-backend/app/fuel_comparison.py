from .optimization.objective import FUEL_PRICE, EMISSION_FACTOR, score

FUEL_TYPES = ['HFO', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia']


def compare_fuels(distance_km, cargo_tonnes, deadline_hours, speed_knots, vessel_type,
                  estimate, env_penalty=0.0, emission_weight=0.25,
                  fuel_price_multiplier=1.0):
    """Compare all supported fuels at one common voyage speed/environment.

    The Random Forest fuel model is called separately for every fuel type, so
    the comparison is explicitly fuel-aware rather than using one generic fuel
    estimate. The decision score uses the same economic/emission objective as
    QPSO, while the raw fuel, cost and CO2 values remain visible.
    """
    rows = []
    hfo_litres = None
    for fuel in FUEL_TYPES:
        litres = max(0.0, float(estimate(speed_knots, fuel, cargo_tonnes, 1.0)))
        eta = distance_km / (max(speed_knots, 0.1) * 1.852)
        co2 = litres * EMISSION_FACTOR.get(fuel, 3.114)
        cost = litres * FUEL_PRICE.get(fuel, 1.0) * fuel_price_multiplier
        objective = score(
            speed_knots, fuel, litres, eta, deadline_hours, env_penalty,
            emission_weight=emission_weight,
            fuel_price_multiplier=fuel_price_multiplier,
        )
        if fuel == 'HFO':
            hfo_litres = litres
        rows.append({
            'fuel_type': fuel,
            'predicted_fuel_litres': round(litres, 2),
            'fuel_litres_per_tonne': round(litres / max(cargo_tonnes, 1), 4),
            'fuel_cost_index': round(cost, 2),
            'operational_co2_kg': round(co2, 2),
            'co2_reduction_vs_hfo_percent': 0.0,
            'eta_hours': round(eta, 2),
            'decision_score': round(objective, 2),
        })

    if hfo_litres:
        for row in rows:
            row['fuel_reduction_vs_hfo_percent'] = round(
                (1 - row['predicted_fuel_litres'] / hfo_litres) * 100, 2
            )
            row['co2_reduction_vs_hfo_percent'] = round(
                (1 - row['operational_co2_kg'] / (hfo_litres * EMISSION_FACTOR['HFO'])) * 100, 2
            )
    else:
        for row in rows:
            row['fuel_reduction_vs_hfo_percent'] = 0.0

    rows.sort(key=lambda x: x['decision_score'])
    for rank, row in enumerate(rows, 1):
        row['rank'] = rank
        row['recommended'] = rank == 1
    return rows
