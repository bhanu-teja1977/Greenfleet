# GreenFleet-Q — SIH26138

**AI + Quantum-Inspired Green Fleet Decision Support**

GreenFleet-Q is an end-to-end software prototype centered on **fuel consumption prediction and fuel-choice comparison**, with route/environment effects and fleet deployment used as decision factors. It combines a fuel-aware Random Forest model, quantum-inspired optimization, marine/weather data, route alternatives, and cargo allocation.

## What is integrated

1. **Fuel consumption prediction (core)** — Random Forest predicts voyage fuel consumption using vessel type, fuel type, speed, cargo, distance, wave, current and wind features.
2. **Fuel-type comparison** — all five supported fuels are predicted under the same vessel/cargo/speed/environment and compared by fuel consumed, L/tonne, cost index, operational CO₂ and decision score.
3. **Port selection** — searchable port dataset with India-first coverage.
4. **Two candidate routes** — for the SIH Mumbai → Singapore demo, two ocean-side prototype corridors are evaluated; other port pairs receive two geographic prototype alternatives.
5. **Marine conditions** — Open-Meteo Marine API for wave height/direction/period, ocean currents, sea level and sea-surface temperature.
6. **Weather conditions** — Open-Meteo Weather API for wind speed/direction, temperature and precipitation.
7. **Time-aware environmental mapping** — each route waypoint is matched to a forecast hour using cumulative voyage distance and assumed speed.
8. **Segment heat maps** — switch between fuel-penalty intensity, delay intensity, and a clearly labelled prototype traffic-density proxy.
9. **ML fuel prediction pipeline** — Random Forest trained on a synthetic, physics-grounded dataset; training code and sample data are included.
10. **Baseline optimization** — speed-grid search.
11. **QPSO optimization** — quantum-inspired particle swarm optimization over speed + alternative fuel choice, with environmental/emission/economic weights.
12. **Route ranking** — both candidates are independently evaluated with marine/weather conditions, baseline, QPSO and fleet allocation; the lowest QPSO objective is recommended.
13. **Cargo fleet allocation** — divides total cargo across prototype vessel capacities and reports utilization/unused capacity.
14. **Scenario analysis** — normal, bad-weather, high-fuel-price and emission-sensitive cases re-run through the optimizer.
15. **Benchmark** — baseline vs QPSO objective comparison.
16. **Frontend dashboard** — React + Leaflet + Recharts with route cards, heat-map layers, popups, fleet table and comparison charts.

## Folder structure

```text
greenfleet/
├── greenfleet-backend/      # FastAPI + weather + environmental model + QPSO + fleet allocation
├── greenfleet-frontend/     # React + Leaflet + Recharts dashboard
├── greenfleet-ml/           # Dataset generation + training code + sample data + Colab notebook
├── greenfleet-optimizer/    # Standalone optimization reference implementation
├── ports.csv
├── .gitignore
└── README.md
```

## Run on Windows

### Backend

```powershell
cd greenfleet-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Keep this terminal running.

### Frontend

Open a second terminal. A Python venv is **not required** for npm.

```powershell
cd greenfleet-frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`.

### Optional ML retraining

The runnable backend already contains a trained Random Forest model at:

```text
greenfleet-backend/app/ml/fuel_model.pkl
```

You do **not** need to retrain it to run the demo. If you want to reproduce the training pipeline:

```powershell
cd greenfleet-ml
pip install -r requirements.txt
python generate_dataset.py
python train_model.py
copy fuel_model.pkl ..\greenfleet-backend\app\ml\fuel_model.pkl
```

The ML folder intentionally does not duplicate the 39 MB model file; the backend copy is the single runtime artifact.

## Demo flow

```text
Voyage Inputs
   ↓
ML Fuel Consumption Prediction
   ↓
Compare HFO / LNG / Methanol / Hydrogen / Ammonia
   ↓
Baseline + QPSO Optimization (speed + fuel)
   ↓
Two Route Candidates + Marine/Weather Penalties
   ↓
Best Route + Fleet Allocation
   ↓
Dashboard: Fuel + CO₂ + Cost + ETA + Fleet + Heat Maps + Scenarios
```

## GitHub-ready structure

The repository is intentionally pushable as source code:

- `node_modules/`, Python virtual environments, caches and local `.env` files are ignored.
- The ZIP artifact is not part of the repository.
- No API key is required by the current prototype.
- The runtime model is kept under 100 MB so it can be committed to a normal Git repository.
- If the model is later replaced by a larger artifact, use Git LFS rather than committing files over GitHub's hard file-size limit.

Typical first push:

```bash
git init
git add .
git commit -m "Initial GreenFleet-Q prototype"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## Core fuel-model story

The main project output is **fuel consumption**, not route drawing. `fuel_type` is an explicit Random Forest input feature alongside vessel type, speed, cargo, distance, wave, current and wind. The backend predicts fuel separately for HFO, LNG, Methanol, Hydrogen and Ammonia under the same voyage conditions.

The dashboard reports:
- predicted fuel consumed (L)
- litres per cargo tonne
- fuel cost index
- operational CO₂
- CO₂ reduction vs HFO
- lowest-consumption fuel
- lowest-CO₂ fuel
- best balanced fuel under the current economic/emission/schedule objective

QPSO then searches **speed + fuel choice**. Route selection remains a secondary factor: it changes distance and marine/environmental exposure, while the primary decision is how much fuel is consumed and which fuel is preferable.

The included model was trained on 2,500 synthetic/physics-grounded demonstration rows. Its reported validation metrics are R² 0.9723, MAE 1,870.61 L and RMSE 2,582.49 L. These are prototype metrics, not validation against real vessel telemetry.

## Important presentation notes

- The two routes are **geographic decision-support prototypes**, not certified sea lanes or navigation routes.
- Open-Meteo marine data is forecast data and is not a substitute for certified navigation information.
- The ML dataset is **synthetic/physics-grounded**, not proprietary vessel telemetry.
- QPSO is a **quantum-inspired classical metaheuristic**. No quantum computer is required.
- The traffic layer is a **prototype traffic-density proxy**, not live AIS traffic. Do not present it as live vessel tracking.
- Fleet capacities and size factors are **prototype decision-support assumptions**, not vessel-class certification data.
- The prototype does not claim AIS, live vessel tracking, maritime routing certification, or regulatory compliance.

## Extension points

The code is modular so future features can be added without replacing the core demo:

- `route_engine.py` → more route candidates / routing provider integration
- `marine_api.py` → additional weather/ocean providers
- `environmental_model.py` → richer penalty models
- `optimization/optimizer.py` → larger QPSO search spaces
- `fleet_optimizer.py` → vessel/fleet mixed-integer optimization
- `frontend/src/components/MapView.jsx` → additional map layers
- `greenfleet-ml/` → real telemetry or larger training pipelines
