import joblib, pandas as pd
from pathlib import Path
m=joblib.load(Path(__file__).resolve().parent/'fuel_model.pkl')
def predict(features): return float(m.predict(pd.DataFrame([features]))[0])
