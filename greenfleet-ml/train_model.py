import pandas as pd, joblib
from pathlib import Path
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

BASE=Path(__file__).resolve().parent
DATA=BASE/'sample_data.csv'
MODEL=BASE/'fuel_model.pkl'
FEATURES=['vessel_type','fuel_type','speed_knots','cargo_tonnes','distance_km','wave_height_m','wave_period_s','current_speed_kmh','current_direction','vessel_heading','wind_speed_kmh']
CATEGORICAL=['vessel_type','fuel_type']

def main():
    df=pd.read_csv(DATA)
    X_train,X_test,y_train,y_test=train_test_split(df[FEATURES],df.fuel_litres,test_size=.2,random_state=42)
    pre=ColumnTransformer([('cat',OneHotEncoder(handle_unknown='ignore'),CATEGORICAL)],remainder='passthrough')
    model=Pipeline([('pre',pre),('rf',RandomForestRegressor(n_estimators=220,max_depth=18,random_state=42,n_jobs=1))])
    model.fit(X_train,y_train)
    pred=model.predict(X_test)
    mae=mean_absolute_error(y_test,pred); rmse=mean_squared_error(y_test,pred)**0.5; r2=r2_score(y_test,pred)
    joblib.dump(model,MODEL)
    print(f'train_rows={len(X_train)} test_rows={len(X_test)}')
    print(f'MAE={mae:.2f} L | RMSE={rmse:.2f} L | R2={r2:.4f}')
    print(f'saved={MODEL}')

if __name__=='__main__': main()
