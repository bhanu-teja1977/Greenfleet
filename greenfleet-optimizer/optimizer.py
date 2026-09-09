import numpy as np
from .objective import score, FUEL_PRICE, EMISSION_FACTOR

FUEL_TYPES=['HFO','LNG','Methanol','Hydrogen','Ammonia']


def qpso_optimize(distance_km, cargo_tonnes, deadline_hours, speed_min, speed_max,
                  allowed_fuels, estimate, env_penalty=0, emission_weight=0.25,
                  fuel_price_multiplier=1.0, iterations=20, particles=12):
    rng=np.random.default_rng(42)
    fuel_count=len(allowed_fuels)
    positions=np.column_stack([
        rng.uniform(speed_min,speed_max,particles),
        rng.uniform(0,fuel_count-1,particles)
    ])
    pbest=positions.copy(); pval=np.full(particles,np.inf); gbest=None; gval=np.inf
    best=None
    for it in range(iterations):
        for i in range(particles):
            speed=float(np.clip(positions[i,0],speed_min,speed_max))
            fi=int(np.clip(round(positions[i,1]),0,fuel_count-1))
            fuel=allowed_fuels[fi]
            litres=estimate(speed,fuel,cargo_tonnes,1.0)
            eta=distance_km/(speed*1.852)
            v=score(speed,fuel,litres,eta,deadline_hours,env_penalty,
                    emission_weight=emission_weight,
                    fuel_price_multiplier=fuel_price_multiplier)
            if v<pval[i]: pval[i]=v; pbest[i]=positions[i]
            if v<gval:
                gval=v; gbest=positions[i].copy()
                best={'speed_knots':speed,'fuel_type':fuel,'fuel_litres':litres,
                      'eta_hours':eta,'objective':v}
        beta=0.75-0.45*(it/max(1,iterations))
        mbest=pbest.mean(axis=0)
        u=rng.random((particles,2)); sign=np.where(rng.random((particles,2))<0.5,-1,1)
        attract=(pbest+gbest)/2
        positions=attract + sign*beta*np.abs(mbest-positions)*np.log(1/(u+1e-9))
        positions[:,0]=np.clip(positions[:,0],speed_min,speed_max)
        positions[:,1]=np.clip(positions[:,1],0,fuel_count-1)
    best.update({
        'speed_knots':round(best['speed_knots'],2),
        'fuel_litres':round(best['fuel_litres'],2),
        'eta_hours':round(best['eta_hours'],2),
        'objective':round(best['objective'],2),
        'iterations':iterations,'particles':particles
    })
    best['co2_kg']=round(best['fuel_litres']*EMISSION_FACTOR.get(best['fuel_type'],3.114),2)
    best['fuel_cost']=round(best['fuel_litres']*FUEL_PRICE.get(best['fuel_type'],1)*fuel_price_multiplier,2)
    best['emission_weight']=emission_weight
    best['fuel_price_multiplier']=fuel_price_multiplier
    return best
