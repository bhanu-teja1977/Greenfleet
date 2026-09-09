# GreenFleet-Q Backend

FastAPI decision-support backend for the SIH26138 prototype.

## Core pipeline

1. Receive vessel, cargo, speed, fuel, deadline and ports.
2. Build two prototype ocean-side route candidates.
3. Fetch marine + weather forecast conditions.
4. Predict fuel consumption with the **fuel-aware Random Forest model**. `fuel_type` is a model feature.
5. Compare HFO, LNG, Methanol, Hydrogen and Ammonia under the same voyage conditions.
6. Run speed-grid baseline and quantum-inspired PSO over speed + fuel.
7. Allocate cargo across a prototype vessel fleet.
8. Return fuel, CO₂, cost, ETA, environmental exposure, route ranking and heat-map data.

## Useful endpoints

- `GET /health`
- `GET /ports`
- `GET /model-info`
- `POST /predict` — single fuel prediction
- `POST /fuel-comparison` — all supported fuel predictions under common conditions
- `POST /optimize` — complete decision-support run
- `POST /scenario` — scenario re-optimization
- `POST /benchmark` — baseline vs QPSO
- `GET /marine-data`
- `GET /route`

## Model

The runtime model is `app/ml/fuel_model.pkl`. It is a Random Forest trained on 2,500 synthetic, physics-grounded demonstration rows. Retraining is optional for the demo; replace the dataset with validated vessel telemetry when available.
