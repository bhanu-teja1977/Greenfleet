FUEL_PRICE={'HFO':0.75,'LNG':0.90,'Methanol':0.85,'Hydrogen':1.40,'Ammonia':1.10}
EMISSION_FACTOR={'HFO':3.114,'LNG':2.75,'Methanol':1.375,'Hydrogen':0.0,'Ammonia':0.0}


def score(speed, fuel, fuel_litres, eta, deadline, env_penalty,
          emission_weight=0.25, fuel_price_multiplier=1.0, delay_weight=500):
    cost=fuel_litres*FUEL_PRICE.get(fuel,1.0)*fuel_price_multiplier
    delay=max(0,eta-deadline)
    carbon=fuel_litres*EMISSION_FACTOR.get(fuel,3.114)*emission_weight/1000
    return cost + env_penalty*10 + delay*delay_weight + carbon
