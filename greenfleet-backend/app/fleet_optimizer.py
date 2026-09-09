from math import ceil
from itertools import product
from .optimization.objective import FUEL_PRICE, EMISSION_FACTOR

# Prototype fleet catalogue. Capacities are decision-support assumptions, not class certificates.
FLEET_CATALOG = [
    {"id": "feeder", "name": "Feeder Container", "capacity_tonnes": 3000, "size_factor": 0.72, "max_speed": 18},
    {"id": "panamax", "name": "Panamax Container", "capacity_tonnes": 15000, "size_factor": 1.00, "max_speed": 18},
    {"id": "post_panamax", "name": "Post-Panamax Container", "capacity_tonnes": 30000, "size_factor": 1.22, "max_speed": 18},
    {"id": "mega", "name": "Large Container Ship", "capacity_tonnes": 50000, "size_factor": 1.48, "max_speed": 18},
]


def _compositions(max_ships: int, cargo_tonnes: float):
    # Keep the search deliberately small and explainable for the demo.
    # Candidate fleets are all mixes up to 3 ships plus a capacity-covering fallback.
    caps=[x["capacity_tonnes"] for x in FLEET_CATALOG]
    eval_limit=min(max_ships, 3)
    candidates=[]
    for a in range(eval_limit+1):
        for b in range(eval_limit-a+1):
            for c in range(eval_limit-a-b+1):
                for d in range(eval_limit-a-b-c+1):
                    counts=(a,b,c,d)
                    if sum(counts)==0: continue
                    if sum(x*y for x,y in zip(counts,caps))>=cargo_tonnes:
                        candidates.append(counts)
    if candidates:
        yield from candidates
        return
    # Large-demand fallback: fill with the largest ship, then one smaller adjustment.
    needed=(int(cargo_tonnes/caps[-1])+1)
    needed=min(max_ships,max(1,needed))
    yield (0,0,0,needed)


def _allocate_cargo(cargo_tonnes: float, counts):
    remaining = float(cargo_tonnes)
    ships = []
    # Use the larger ships first so the final allocation is compact.
    selected = []
    for i, count in enumerate(counts):
        selected.extend([i] * count)
    selected.sort(key=lambda i: FLEET_CATALOG[i]["capacity_tonnes"], reverse=True)
    for seq, i in enumerate(selected, 1):
        spec = FLEET_CATALOG[i]
        assigned = min(remaining, spec["capacity_tonnes"])
        remaining -= assigned
        ships.append({
            "ship_no": seq,
            "fleet_type": spec["name"],
            "capacity_tonnes": spec["capacity_tonnes"],
            "cargo_tonnes": round(assigned, 2),
            "utilization_percent": round(assigned / spec["capacity_tonnes"] * 100, 2) if spec["capacity_tonnes"] else 0,
            "size_factor": spec["size_factor"],
        })
    return ships, max(0.0, remaining)


def optimize_fleet(cargo_tonnes: float, distance_km: float, deadline_hours: float,
                   speed_knots: float, fuel_type: str, estimate, env_penalty: float = 0.0):
    """Choose a small fleet that carries all cargo and maximizes useful capacity.

    The search minimizes a transparent prototype objective:
      fuel cost + emissions + delay + fleet-count penalty + unused-capacity penalty.
    """
    min_cap = min(x["capacity_tonnes"] for x in FLEET_CATALOG)
    max_ships = min(12, max(1, ceil(cargo_tonnes / min_cap) + 2))
    best = None
    for counts in _compositions(max_ships, cargo_tonnes):
        ships, unmet = _allocate_cargo(cargo_tonnes, counts)
        if unmet > 1e-6:
            continue
        total_capacity = sum(s["capacity_tonnes"] for s in ships)
        total_unused = total_capacity - cargo_tonnes
        utilization = cargo_tonnes / total_capacity if total_capacity else 0
        total_fuel = 0.0
        ship_results = []
        for s in ships:
            # The ML model is trained on broad vessel classes; size_factor adjusts
            # the catalogue-specific capacity effect without pretending the model
            # has seen every named vessel class.
            base = estimate(speed_knots, fuel_type, s["cargo_tonnes"], s["size_factor"])
            total_fuel += base
            eta = distance_km / (speed_knots * 1.852)
            ship_results.append({**s, "fuel_litres": round(base, 2), "eta_hours": round(eta, 2)})
        emissions = total_fuel * EMISSION_FACTOR.get(fuel_type, 3.114)
        cost = total_fuel * FUEL_PRICE.get(fuel_type, 1.0)
        delay = max(0.0, (distance_km / (speed_knots * 1.852)) - deadline_hours)
        objective = cost + emissions * 0.05 + delay * 500 + len(ships) * 800 + total_unused * 0.015 + env_penalty * 10
        # Prefer higher utilization when economic scores are close.
        tie_break = -utilization * 100
        rank = objective + tie_break
        if best is None or rank < best["_rank"]:
            best = {
                "_rank": rank,
                "ships": ship_results,
                "fleet_count": len(ships),
                "cargo_tonnes": round(cargo_tonnes, 2),
                "total_capacity_tonnes": round(total_capacity, 2),
                "unused_capacity_tonnes": round(total_unused, 2),
                "capacity_utilization_percent": round(utilization * 100, 2),
                "fuel_litres": round(total_fuel, 2),
                "co2_kg": round(emissions, 2),
                "fuel_cost": round(cost, 2),
                "eta_hours": round(distance_km / (speed_knots * 1.852), 2),
                "speed_knots": round(speed_knots, 2),
                "fuel_type": fuel_type,
                "objective": round(objective, 2),
            }
    if best is None:
        raise ValueError("Cargo demand cannot be allocated with the available fleet catalogue")
    best.pop("_rank", None)
    return best
