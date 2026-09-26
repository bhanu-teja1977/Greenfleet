# GreenFleet-Q

**AI + Quantum-Inspired Green Fleet Decision Support**

## 1. Professional Project Overview
GreenFleet-Q is an end-to-end software prototype centered on **fuel consumption prediction and fuel-choice comparison**. It leverages machine learning, route/environment effects, and quantum-inspired optimization to assist maritime operators in deploying fleets sustainably. By simulating marine environments, evaluating alternative fuels, and optimally allocating cargo, GreenFleet-Q acts as a comprehensive decision-support system for green maritime logistics.

## 2. Problem Statement / Motivation
The maritime industry faces immense pressure to decarbonize, reduce greenhouse gas (GHG) emissions, and transition toward sustainable alternative fuels. However, predicting fuel consumption across dynamic sea conditions and selecting the most optimal combination of fuel type, vessel speed, and route remains computationally complex. GreenFleet-Q addresses this challenge by providing an intelligent, data-driven prototype to evaluate fuel economics, environmental impacts, and scheduling objectives in a unified dashboard.

## 3. Key Features
- **Predictive ML Modeling**: Accurately estimates voyage fuel consumption using Random Forest.
- **Alternative Fuel Analysis**: Simultaneous evaluation of traditional and next-generation fuels.
- **Dynamic Marine & Weather Conditions**: Real-time integration with Open-Meteo for wave, current, and wind data.
- **QPSO Optimization**: Balances speed, fuel type, and emissions using quantum-inspired techniques.
- **Cargo Fleet Allocation**: Optimally divides total cargo demand across available vessel capacities.
- **Scenario Analysis**: Dynamic evaluation of extreme weather, high fuel prices, and emission-sensitive conditions.
- **Interactive Dashboard**: Modern React-based frontend featuring heat maps, routing layers, and statistical comparisons.

## 4. System Architecture / Workflow
1. **Voyage Inputs**: User selects origin port, destination port, cargo tonnage, and vessel type.
2. **Route Candidates**: The system generates geographic alternative routes and gathers marine/weather condition forecasts.
3. **ML Fuel Prediction**: Predicts consumption for each candidate route based on environment and speed.
4. **Fuel Comparison**: Considers HFO, LNG, Methanol, Hydrogen, and Ammonia.
5. **Optimization**: A QPSO algorithm evaluates the best speed and fuel mix against baseline strategies.
6. **Fleet Allocation**: Determines the most efficient fleet makeup to transport the requested cargo.
7. **Dashboard Visualization**: Results are rendered via interactive heat maps, charts, and metrics.

## 5. Technology Stack
- **Frontend**: React, Vite, Leaflet (mapping), Recharts (data visualization), Tailwind CSS (styling)
- **Backend**: FastAPI, Python, Uvicorn
- **Machine Learning**: Scikit-Learn (Random Forest)
- **Optimization**: Quantum-Inspired Particle Swarm Optimization (QPSO), NumPy, SciPy
- **Data Integrations**: Open-Meteo Marine & Weather APIs

## 6. Project Folder Structure
```text
Green_Fleet/
├── greenfleet-backend/      # FastAPI + weather + environmental model + QPSO + fleet allocation
├── greenfleet-frontend/     # React + Leaflet + Recharts dashboard
├── greenfleet-ml/           # Dataset generation + training code + sample data
├── greenfleet-optimizer/    # Standalone optimization reference implementation
├── ports.csv                # Searchable port dataset
├── .gitignore               # Ignored files for Git
└── README.md                # Project documentation
```

## 7. How the System Works
GreenFleet-Q processes voyage inputs and fetches time-aware weather data for the generated route coordinates. This environmental data is fed alongside vessel specifications into the ML pipeline, which outputs the expected fuel consumption for all supported fuels. The optimizer then minimizes a cost function (balancing fuel cost, delay, and emissions) to recommend the most optimal voyage parameters.

## 8. ML Fuel-Consumption Prediction Details
The core of GreenFleet-Q is a Random Forest model that predicts voyage fuel consumption. It considers the following features:
- Vessel Type & Cargo
- Voyage Distance & Speed
- Wave Height, Wave Direction & Period
- Ocean Currents
- Wind Speed & Direction

## 9. Supported Fuel Types
The platform explicitly compares five fuels under the exact same voyage conditions:
- **HFO** (Heavy Fuel Oil) - Baseline
- **LNG** (Liquefied Natural Gas)
- **Methanol**
- **Hydrogen**
- **Ammonia**

## 10. Route/Environment Features
- **Port Selection**: Searchable port dataset with India-first coverage.
- **Two Candidate Routes**: For demonstration, port pairs receive two geographic prototype alternatives.
- **Time-Aware Environmental Mapping**: Each route waypoint is mapped to a forecast hour based on cumulative distance and assumed speed.
- **Segment Heat Maps**: Visualizes fuel-penalty intensity, delay intensity, and a proxy for traffic density.

## 11. QPSO Optimization Explanation
Quantum-inspired Particle Swarm Optimization (QPSO) is a classical metaheuristic algorithm used here to optimize the non-linear relationship between vessel speed and fuel choice. By assigning weights to environmental, emission, and economic factors, QPSO efficiently navigates the continuous (speed) and discrete (fuel) search spaces to find a globally optimal configuration, outperforming simple grid search baselines.

## 12. Fleet Allocation
The system automatically divides the total required cargo tonnage across prototype vessel capacities, calculating fleet utilization metrics, unused capacities, and the necessary number of ships.

## 13. Scenario Analysis
GreenFleet-Q supports dynamic scenario toggling to observe how optimization behaves under:
- Normal operations
- Bad-weather (storms/heavy waves)
- High-fuel-price shocks
- Emission-sensitive compliance (strict CO₂ limits)

## 14. Frontend Dashboard
A modern, responsive single-page application built with React. It includes route cards, dynamic heat-map layers over Leaflet maps, detailed popup analytics, fleet allocation tables, and comprehensive Recharts for comparing baseline vs. QPSO objectives.

## 15. Installation Instructions for Windows

### Backend Setup
```powershell
cd greenfleet-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Keep this terminal running. The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup
Open a second terminal:
```powershell
cd greenfleet-frontend
npm install
npm run dev
```
Open the Vite URL provided in the terminal, typically `http://localhost:5173`.

## 16. Optional ML Retraining
The backend is already equipped with a trained Random Forest model (`fuel_model.pkl`, ~40MB). Retraining is **not required** to run the demo. If you wish to reproduce the ML pipeline:
```powershell
cd greenfleet-ml
pip install -r requirements.txt
python generate_dataset.py
python train_model.py
copy fuel_model.pkl ..\greenfleet-backend\app\ml\fuel_model.pkl
```

## 17. Local Development Instructions
Ensure both the frontend and backend servers are running concurrently. The Vite development server proxy (`vite.config.js`) handles CORS by forwarding `/api` requests automatically to `http://127.0.0.1:8000`.

## 18. API/Backend Information
The FastAPI application serves endpoints for route evaluation, health checks, and port lookups. Swagger documentation can be accessed by navigating to `http://127.0.0.1:8000/docs` while the backend is running.

## 19. Demo Workflow
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

## 20. Model Information and Prototype Metrics
The included ML model was trained on 2,500 synthetic/physics-grounded demonstration rows.
- **R²**: 0.9723
- **MAE**: 1,870.61 L
- **RMSE**: 2,582.49 L
*(Note: These are prototype metrics for demonstration, not validated against real-world vessel telemetry.)*

## 21. Important Limitations & Disclaimers
- **Synthetic/physics-grounded ML dataset**: Not derived from proprietary vessel telemetry.
- **Prototype geographic routes**: Decision-support prototypes only, not certified sea lanes.
- **Forecast marine/weather data**: Provided by Open-Meteo; not a substitute for certified navigation information.
- **Traffic layer is a prototype proxy**: Do not present this as live AIS tracking.
- **QPSO is quantum-inspired classical optimization**: No actual quantum computer is required.
- **Not certified navigation software**: The prototype does not claim maritime routing certification or regulatory compliance.
- **Not live AIS tracking**: Live vessel positions are not utilized.

## 22. Future Improvements / Extension Points
The modular design allows for significant future enhancements:
- `route_engine.py` → Integration with commercial routing providers.
- `marine_api.py` → Additional ocean data providers (e.g., Copernicus).
- `environmental_model.py` → More complex fuel penalty models.
- `optimization/optimizer.py` → Expanding the QPSO search spaces.
- `fleet_optimizer.py` → Mixed-integer optimization for complex fleets.
- `greenfleet-ml/` → Integration of real telemetry data and advanced neural networks.

## 23. GitHub Project Structure
The repository is intentionally pushable as source code. Unnecessary caches, virtual environments, and `.env` files are ignored via `.gitignore`. The ML runtime model is kept under GitHub's 100 MB hard file-size limit. No API keys are required for the current prototype.

## 24. Credits / Contributors
Developed for SIH26138.
