from optimizer import qpso_optimize

def estimate(speed,fuel): return (0.8+0.012*speed**2)*5000
r=qpso_optimize(5000,20000,220,10,18,['HFO','LNG','Methanol'],estimate,40)
assert r['fuel_litres']>0
print(r)
