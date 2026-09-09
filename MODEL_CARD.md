# GreenFleet-Q Fuel Consumption Model Card

## Purpose

Predict voyage fuel consumption in litres so GreenFleet-Q can compare alternative marine fuels and optimize fuel + speed.

## Model

- Algorithm: Random Forest Regressor
- Target: `fuel_litres`
- Training rows: 2,500 synthetic/physics-grounded demonstration samples
- Fuel-aware: **yes** — `fuel_type` is an explicit input feature

## Input features

`vessel_type`, `fuel_type`, `speed_knots`, `cargo_tonnes`, `distance_km`, `wave_height_m`, `wave_period_s`, `current_speed_kmh`, `current_direction`, `vessel_heading`, `wind_speed_kmh`

## Reported validation metrics

- MAE: 1,870.61 L
- RMSE: 2,582.49 L
- R²: 0.9723

These metrics are from the included demonstration training run. They should not be interpreted as real-world accuracy for a particular vessel.

## Fuel comparison method

For a selected voyage, the backend calls the model separately for:

- HFO
- LNG
- Methanol
- Hydrogen
- Ammonia

Distance, cargo, vessel type, speed and environmental conditions are held constant while fuel type changes. The UI reports predicted fuel, litres/tonne, fuel cost index, operational CO₂ and a decision score.

## Limitations

The training data is synthetic and physics-grounded rather than measured vessel telemetry. The project is designed as a hackathon decision-support prototype. A production system should retrain and validate against vessel-specific operational data, calibrated fuel properties, and a validated well-to-wake/lifecycle emissions dataset.
