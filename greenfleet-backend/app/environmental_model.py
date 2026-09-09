import math


def directional_component(magnitude, ship_heading, environmental_direction):
    return magnitude * math.cos(math.radians(environmental_direction - ship_heading))


def segment_penalty(env, heading=90.0, segment_distance_km=100.0, base_fuel_litres=1000.0, speed_knots=14.0):
    current_proj = directional_component(env['current_velocity'], heading, env['current_direction'])
    wave_score = env['wave_height'] * 5
    opposing = max(0, -current_proj)
    current_score = (opposing / 3) * 5
    wind_score = env.get('wind_speed', 12) * 0.5
    score = max(0, min(100, (wave_score + current_score + wind_score) * 1.5))
    fuel_pct = min(0.30, 0.02 * env['wave_height'] + 0.015 * opposing + 0.002 * env.get('wind_speed', 12))
    time_hours = (score / 100) * 0.5
    zone = 'SEVERE' if score > 80 else 'HIGH' if score > 60 else 'MODERATE' if score > 30 else 'LOW'
    return {
        'environmental_score': round(score, 2),
        'penalty_zone': zone,
        'fuel_penalty_percent': round(fuel_pct * 100, 2),
        'fuel_penalty_litres': round(base_fuel_litres * fuel_pct, 2),
        'time_penalty_hours': round(time_hours, 2),
        'current_projection_kmh': round(current_proj, 2),
        'recommendation': 'Reduce speed or consider an alternate route segment' if zone in ('HIGH', 'SEVERE') else 'Normal operation',
    }


def route_penalties(route, conditions, speed_knots=14.0, base_total_fuel=10000):
    out = []
    n = max(1, len(route['segments']))
    per_fuel = base_total_fuel / n
    for i, seg in enumerate(route['segments']):
        env = conditions[i % len(conditions)]
        p = segment_penalty(
            env,
            heading=seg.get('heading_deg', 90),
            segment_distance_km=seg['distance_km'],
            base_fuel_litres=per_fuel,
            speed_knots=speed_knots,
        )
        # Normalized indices make the map layers comparable.
        traffic_proxy = min(100.0, max(5.0, 100 - abs(seg.get('heading_deg', 90) - 90) * 0.18 + p['environmental_score'] * 0.18))
        delay_index = min(100.0, p['time_penalty_hours'] * 100)
        fuel_index = min(100.0, p['fuel_penalty_percent'] / 30 * 100)
        out.append({
            'segment_index': i,
            'start': seg['start'],
            'end': seg['end'],
            'distance_km': seg['distance_km'],
            'marine': env,
            'penalty': p,
            'heat': {
                'fuel_penalty_index': round(fuel_index, 2),
                'delay_index': round(delay_index, 2),
                'traffic_proxy_index': round(traffic_proxy, 2),
                'traffic_source': 'Prototype traffic-density proxy; not live AIS traffic',
            },
        })
    return out
