from pathlib import Path
import json
import httpx

MARINE_API = 'https://marine-api.open-meteo.com/v1/marine'
WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
FALLBACK = Path(__file__).resolve().parent / 'demo_data' / 'marine_fallback.json'
_MARINE_CACHE = {}
_WEATHER_CACHE = {}


def fallback():
    return json.loads(FALLBACK.read_text())


def _get(client, url, params):
    response = client.get(url, params=params)
    response.raise_for_status()
    return response.json()


def get_marine(latitudes, longitudes, forecast_days=8):
    cache_key = (tuple(round(x, 3) for x in latitudes), tuple(round(y, 3) for y in longitudes), forecast_days)
    if cache_key in _MARINE_CACHE:
        return _MARINE_CACHE[cache_key]
    params = {
        'latitude': ','.join(map(str, latitudes)),
        'longitude': ','.join(map(str, longitudes)),
        'hourly': ','.join([
            'wave_height', 'wave_direction', 'wave_period',
            'ocean_current_velocity', 'ocean_current_direction',
            'sea_level_height_msl', 'sea_surface_temperature'
        ]),
        'forecast_days': forecast_days,
        'timezone': 'GMT',
        'cell_selection': 'sea'
    }
    try:
        with httpx.Client(timeout=20) as client:
            marine = _get(client, MARINE_API, params)
        res = {'source': 'open-meteo', 'data': marine}
        _MARINE_CACHE[cache_key] = res
        return res
    except Exception as exc:
        return {'source': 'fallback', 'error': str(exc), 'data': fallback()}


def get_weather(latitudes, longitudes, forecast_days=8):
    cache_key = (tuple(round(x, 3) for x in latitudes), tuple(round(y, 3) for y in longitudes), forecast_days)
    if cache_key in _WEATHER_CACHE:
        return _WEATHER_CACHE[cache_key]
    # Wind speed/direction are standard weather variables, not marine variables.
    params = {
        'latitude': ','.join(map(str, latitudes)),
        'longitude': ','.join(map(str, longitudes)),
        'hourly': 'wind_speed_10m,wind_direction_10m,temperature_2m,precipitation',
        'wind_speed_unit': 'kmh',
        'forecast_days': forecast_days,
        'timezone': 'GMT',
        'cell_selection': 'sea'
    }
    try:
        with httpx.Client(timeout=20) as client:
            weather = _get(client, WEATHER_API, params)
        res = {'source': 'open-meteo', 'data': weather}
        _WEATHER_CACHE[cache_key] = res
        return res
    except Exception as exc:
        return {'source': 'fallback', 'error': str(exc), 'data': {}}


def _location_data(result, index):
    data = result.get('data', {})
    if isinstance(data, list):
        return data[min(index, len(data) - 1)] if data else {}
    return data


def _hour_value(hourly, key, hour_index, default):
    values = hourly.get(key, [])
    if not values:
        return default
    idx = max(0, min(int(hour_index), len(values) - 1))
    value = values[idx]
    return default if value is None else value


def point_conditions(marine_result, weather_result=None, index=0, hour_index=0):
    marine = _location_data(marine_result, index)
    h = marine.get('hourly', {})
    weather = _location_data(weather_result or {'data': {}}, index)
    wh = weather.get('hourly', {})
    return {
        'wave_height': float(_hour_value(h, 'wave_height', hour_index, 1.0)),
        'wave_direction': float(_hour_value(h, 'wave_direction', hour_index, 0.0)),
        'wave_period': float(_hour_value(h, 'wave_period', hour_index, 10.0)),
        'current_velocity': float(_hour_value(h, 'ocean_current_velocity', hour_index, 0.0)),
        'current_direction': float(_hour_value(h, 'ocean_current_direction', hour_index, 0.0)),
        'sea_level_height_msl': float(_hour_value(h, 'sea_level_height_msl', hour_index, 0.0)),
        'sea_surface_temperature': float(_hour_value(h, 'sea_surface_temperature', hour_index, 28.0)),
        'wind_speed': float(_hour_value(wh, 'wind_speed_10m', hour_index, 12.0)),
        'wind_direction': float(_hour_value(wh, 'wind_direction_10m', hour_index, 0.0)),
        'temperature': float(_hour_value(wh, 'temperature_2m', hour_index, 28.0)),
        'precipitation': float(_hour_value(wh, 'precipitation', hour_index, 0.0)),
        'forecast_hour_index': int(hour_index),
    }
