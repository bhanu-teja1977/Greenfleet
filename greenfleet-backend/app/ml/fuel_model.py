from pathlib import Path
import warnings
import pandas as pd
import joblib
from ..fuel_model_fallback import predict_fuel_fallback

warnings.filterwarnings('ignore')

MODEL_PATH = Path(__file__).resolve().parent / 'fuel_model.pkl'
_model = None

def load_model():
    global _model
    if _model is None and MODEL_PATH.exists():
        with warnings.catch_warnings():
            warnings.simplefilter('ignore')
            _model = joblib.load(MODEL_PATH)
            if hasattr(_model, 'named_steps') and 'rf' in _model.named_steps:
                _model.named_steps['rf'].n_jobs = 1
    return _model

def predict_fuel(features):
    model = load_model()
    if model is None:
        return predict_fuel_fallback(**features)
    x = {k: [v] for k, v in features.items()}
    df = pd.DataFrame(x)
    with warnings.catch_warnings():
        warnings.simplefilter('ignore')
        return float(model.predict(df)[0])
