import numpy as np, pandas as pd
rng=np.random.default_rng(42); n=2500
v=rng.choice(['Container','Tanker','Bulk Carrier'],n); f=rng.choice(['HFO','LNG','Methanol','Hydrogen','Ammonia'],n)
s=rng.uniform(9,20,n); c=rng.uniform(1000,30000,n); d=rng.uniform(100,12000,n); w=rng.uniform(.1,5.5,n); p=rng.uniform(5,16,n); cur=rng.uniform(0,2.5,n); wind=rng.uniform(5,35,n)
base=(0.8+.012*s**2+.000015*c)*d
vf=np.where(v=='Tanker',1.12,np.where(v=='Bulk Carrier',1.08,1)); ff=np.select([f=='LNG',f=='Methanol',f=='Hydrogen',f=='Ammonia'],[.92,.97,.75,.82],default=1)
fuel=base*vf*ff*(1+.02*w+.012*cur+.002*wind)+rng.normal(0,base*.025,n)
pd.DataFrame({'vessel_type':v,'fuel_type':f,'speed_knots':s,'cargo_tonnes':c,'distance_km':d,'wave_height_m':w,'wave_period_s':p,'current_speed_kmh':cur,'current_direction':rng.uniform(0,360,n),'vessel_heading':rng.uniform(0,360,n),'wind_speed_kmh':wind,'fuel_litres':fuel}).to_csv('sample_data.csv',index=False)
print('generated',n)
