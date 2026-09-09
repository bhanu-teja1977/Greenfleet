from typing import List, Optional, Tuple
from pydantic import BaseModel, Field

class Coordinate(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

class Port(BaseModel):
    port_id: int
    port_name: str
    country: str
    country_code: str
    latitude: float
    longitude: float
    unlocode: str
    port_type: str

class VoyageRequest(BaseModel):
    origin_port_id: int
    destination_port_id: int
    cargo_tonnes: float = Field(..., gt=0)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    deadline_hours: Optional[float] = Field(None, gt=0)
    vessel_type: str = 'Container'
    fuel_type: str = 'LNG'
    speed_min_knots: Optional[float] = Field(None, gt=0)
    speed_max_knots: Optional[float] = Field(None, gt=0)

class PredictRequest(BaseModel):
    vessel_type: str = 'Container'
    fuel_type: str = 'LNG'
    speed_knots: float = Field(..., gt=0)
    cargo_tonnes: float = Field(..., gt=0)
    distance_km: float = Field(..., gt=0)
    wave_height_m: float = Field(1.0, ge=0)
    wave_period_s: float = Field(10.0, gt=0)
    current_speed_kmh: float = 0.0
    current_direction: float = 0.0
    vessel_heading: float = 0.0
    wind_speed_kmh: float = 10.0

class OptimizeResponse(BaseModel):
    origin: Port
    destination: Port
    route: dict
    baseline: dict
    optimized: dict
    segment_penalties: list
    savings: dict
    algorithm: str

class ScenarioRequest(VoyageRequest):
    scenario_name: str = 'NORMAL'

class BenchmarkRequest(VoyageRequest):
    pass
