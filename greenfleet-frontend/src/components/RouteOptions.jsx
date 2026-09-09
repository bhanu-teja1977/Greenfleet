import React from 'react';

export default function RouteOptions({routes,selectedId,onSelect}){
  if(!routes?.length) return null;
  return <section className="card route-options-card">
    <div className="section-heading"><div><h3>Top 2 route candidates</h3><p>Ranked by the GreenFleet route objective using fuel, emissions, environment and schedule effects.</p></div><span className="pill">2 routes evaluated</span></div>
    <div className="route-options-grid">
      {routes.slice(0,2).map(r=><button type="button" key={r.route_id} className={`route-option ${selectedId===r.route_id?'selected':''}`} onClick={()=>onSelect(r.route_id)}>
        <div className="route-option-head"><strong>#{r.rank} {r.recommendation}</strong><span>{r.route_id}</span></div>
        <h4>{r.label}</h4>
        <div className="route-stats"><span><b>{r.route.distance_km.toLocaleString()} km</b>distance</span><span><b>{r.optimized.eta_hours} h</b>ETA</span><span><b>{r.optimized.fuel_litres.toLocaleString()} L</b>fuel</span><span><b>{r.optimized.co2_kg.toLocaleString()} kg</b>CO₂</span></div>
        <div className="route-score">Objective score <b>{r.route_score.toLocaleString()}</b> · Env score <b>{r.avg_environmental_score}</b></div>
      </button>)}
    </div>
  </section>
}
