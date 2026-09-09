import React from 'react';

const fmt=n=>Number(n||0).toLocaleString(undefined,{maximumFractionDigits:2});

export default function FuelComparison({result}){
  const rows=result?.fuel_comparison||[];
  if(!rows.length) return null;
  const best=rows.find(x=>x.recommended)||rows[0];
  const lowestFuel=[...rows].sort((a,b)=>a.predicted_fuel_litres-b.predicted_fuel_litres)[0];
  const lowestCO2=[...rows].sort((a,b)=>a.operational_co2_kg-b.operational_co2_kg)[0];
  const model=result?.fuel_model;
  return <section className="card fuel-card">
    <div className="section-heading">
      <div>
        <div className="eyebrow">CORE PROJECT MODULE · FUEL CONSUMPTION</div>
        <h2>Fuel consumption & fuel-type comparison</h2>
        <p className="section-copy">The ML model predicts fuel consumption separately for each fuel. Distance, cargo, vessel, speed and marine conditions are held constant so the effect of fuel choice is visible.</p>
      </div>
      <div className="fuel-best"><span>Best balanced option</span><b>{best.fuel_type}</b><small>Lowest current decision score</small></div>
    </div>

    <div className="fuel-highlight-grid">
      <div className="fuel-highlight"><span>Lowest predicted fuel</span><b>{lowestFuel.fuel_type}</b><small>{fmt(lowestFuel.predicted_fuel_litres)} L</small></div>
      <div className="fuel-highlight"><span>Lowest operational CO₂</span><b>{lowestCO2.fuel_type}</b><small>{fmt(lowestCO2.operational_co2_kg)} kg</small></div>
      <div className="fuel-highlight"><span>Recommended balanced fuel</span><b>{best.fuel_type}</b><small>Cost + emissions + schedule objective</small></div>
      <div className="fuel-highlight"><span>Selected QPSO consumption</span><b>{fmt(result.optimized?.fuel_litres)} L</b><small>{result.optimized?.fuel_type} at {result.optimized?.speed_knots} kn</small></div>
    </div>

    <div className="fuel-table-wrap">
      <table className="fuel-table">
        <thead><tr><th>Rank</th><th>Fuel</th><th>Predicted fuel</th><th>L / tonne</th><th>Fuel cost</th><th>CO₂</th><th>CO₂ vs HFO</th><th>Decision score</th></tr></thead>
        <tbody>{rows.map(r=><tr key={r.fuel_type} className={r.recommended?'fuel-row-best':''}>
          <td>#{r.rank}</td><td><strong>{r.fuel_type}</strong>{r.recommended&&<span className="best-tag"> BEST</span>}</td><td>{fmt(r.predicted_fuel_litres)} L</td><td>{fmt(r.fuel_litres_per_tonne)}</td><td>{fmt(r.fuel_cost_index)}</td><td>{fmt(r.operational_co2_kg)} kg</td><td>{r.co2_reduction_vs_hfo_percent}%</td><td>{fmt(r.decision_score)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    <div className="fuel-model-strip">
      <div><b>Fuel-aware Random Forest</b><span>{model?.features?.length||11} input features · {model?.training_rows||2500} synthetic/physics-grounded training rows</span></div>
      <div><b>Validation</b><span>R² 0.9723 · MAE 1,870.61 L · RMSE 2,582.49 L</span></div>
    </div>
    <div className="fuel-note"><b>Interpretation:</b> fuel litres are the ML prediction. Fuel cost is a prototype cost index, and CO₂ is an operational estimate using the project's emission factors. The dashboard shows lowest consumption, lowest emissions and the balanced decision separately because “best fuel” depends on the objective. Lifecycle/well-to-wake emissions need a validated external fuel-LCA dataset.</div>
  </section>
}
