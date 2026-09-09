from .objective import score

def baseline_optimize(distance_km,cargo_tonnes,deadline_hours,speed_min,speed_max,fuel_type,estimate):
    best=None
    for i in range(17):
        speed=speed_min+(speed_max-speed_min)*i/16
        fuel=estimate(speed,fuel_type)
        eta=distance_km/(speed*1.852)
        val=score(speed,fuel_type,fuel,eta,deadline_hours,0)
        if best is None or val<best['objective']: best={'speed_knots':round(speed,2),'fuel_type':fuel_type,'fuel_litres':round(fuel,2),'eta_hours':round(eta,2),'objective':round(val,2),'iterations':17}
    return best
