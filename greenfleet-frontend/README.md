# GreenFleet-Q Frontend

React/Vite decision-support dashboard for GreenFleet-Q.

## Run

```bash
npm install
npm run dev
```

The frontend expects the FastAPI backend at `http://localhost:8000`.

## Main UI features

- Fuel-consumption dashboard as the primary result
- ML-predicted comparison for HFO, LNG, Methanol, Hydrogen and Ammonia
- Fuel consumed, L/tonne, cost index, operational CO₂ and CO₂-vs-HFO comparison
- Lowest-consumption, lowest-CO₂ and balanced-fuel indicators
- Baseline vs QPSO vs fleet performance
- Two ranked prototype route candidates
- Fuel-penalty, delay and traffic-proxy segment heat layers
- Marine/weather popups per route segment
- Cargo allocation and utilization table
- Scenario re-optimization
- Fuel comparison charts
