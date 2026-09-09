# Optimizer workspace
Development copy of the QPSO and classical baseline. Runtime copies live under `greenfleet-backend/app/optimization/`.

## Fleet allocation
`fleet_optimizer.py` contains the cargo-capacity allocation logic used by the backend. It selects a small fleet that can carry the full cargo demand, assigns cargo ship-by-ship, reports capacity utilization and unused capacity, and includes fuel/emission/fleet-count terms in the prototype objective.
