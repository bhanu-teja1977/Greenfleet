from dataclasses import dataclass
@dataclass
class Candidate:
    speed_knots: float
    fuel_type: str
    fuel_litres: float
    co2_kg: float
    eta_hours: float
    cost: float
