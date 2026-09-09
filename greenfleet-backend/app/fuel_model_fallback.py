def predict_fuel_fallback(vessel_type,fuel_type,speed_knots,cargo_tonnes,distance_km,avg_penalty=0):
    vessel_factor={'Container':1.0,'Tanker':1.12,'Bulk Carrier':1.08}.get(vessel_type,1.0)
    fuel_factor={'HFO':1.0,'LNG':0.92,'Methanol':0.97,'Hydrogen':0.75,'Ammonia':0.82}.get(fuel_type,1.0)
    litres_per_km=(0.8+0.012*speed_knots**2+0.000015*cargo_tonnes)*vessel_factor*fuel_factor
    return litres_per_km*distance_km*(1+avg_penalty/100)
