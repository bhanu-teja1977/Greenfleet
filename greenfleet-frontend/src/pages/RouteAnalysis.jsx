import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RouteOptions from '../components/RouteOptions';
import MapView from '../components/MapView';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function NoData({ navigate }) {
  return (
    <div className="page-empty">
      <div className="page-empty-inner">
        <h2>No Route Data</h2>
        <p>Run a voyage optimisation first to see route analysis.</p>
        <button className="btn-primary" onClick={() => navigate('/voyage')}>
          <ArrowRight size={16} /> Go to Voyage Planning
        </button>
      </div>
    </div>
  );
}

function RouteMetricCard({ label, r1, r2, unit, lowerIsBetter = true }) {
  const v1 = parseFloat(r1) || 0;
  const v2 = parseFloat(r2) || 0;
  const r1Better = lowerIsBetter ? v1 <= v2 : v1 >= v2;
  return (
    <div className="rm-card">
      <div className="rm-label">{label}</div>
      <div className="rm-row">
        <div className={`rm-val ${r1Better ? 'rm-best' : ''}`}>
          {fmt(v1)} <span>{unit}</span>
          {r1Better && <span className="rm-badge">✓</span>}
        </div>
        <div className="rm-vs">vs</div>
        <div className={`rm-val ${!r1Better ? 'rm-best' : ''}`}>
          {fmt(v2)} <span>{unit}</span>
          {!r1Better && <span className="rm-badge">✓</span>}
        </div>
      </div>
    </div>
  );
}

export default function RouteAnalysis() {
  const navigate = useNavigate();
  const { result, selected, setSelectedRouteId } = useApp();

  if (!result) return <NoData navigate={navigate} />;

  const routes = result.route_options || [];
  const r1 = routes[0];
  const r2 = routes[1];

  return (
    <div className="page-routes">
      {/* Route selector */}
      <RouteOptions routes={routes} selectedId={selected?.route_id} onSelect={setSelectedRouteId} />

      {/* Side-by-side metrics */}
      {r1 && r2 && (
        <div className="card">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ROUTE COMPARISON</div>
              <h2>Route 1 vs Route 2 — Key Metrics</h2>
            </div>
          </div>
          <div className="route-label-row">
            <span style={{ color: '#1565c0', fontWeight: 700 }}>● R1: {r1.label}</span>
            <span style={{ color: '#e65100', fontWeight: 700 }}>● R2: {r2.label}</span>
          </div>
          <div className="rm-grid">
            <RouteMetricCard label="Distance"       r1={r1.route?.distance_km}        r2={r2.route?.distance_km}        unit="km"  />
            <RouteMetricCard label="Travel Time"    r1={r1.optimized?.eta_hours}       r2={r2.optimized?.eta_hours}       unit="h"   />
            <RouteMetricCard label="Fuel"           r1={r1.optimized?.fuel_litres}     r2={r2.optimized?.fuel_litres}     unit="L"   />
            <RouteMetricCard label="CO₂"            r1={r1.optimized?.co2_kg}          r2={r2.optimized?.co2_kg}          unit="kg"  />
            <RouteMetricCard label="Env Score"      r1={r1.avg_environmental_score}    r2={r2.avg_environmental_score}    unit="/100" />
            <RouteMetricCard label="Objective Score" r1={r1.route_score}               r2={r2.route_score}               unit="" lowerIsBetter />
          </div>
        </div>
      )}

      {/* Full interactive map */}
      <div className="card" style={{ padding: 0 }}>
        <MapView routeOptions={routes} selectedRouteId={selected?.route_id} />
      </div>

      {/* Note if viewing non-recommended route */}
      {selected && selected.route_id !== result.route_selection?.selected_route_id && (
        <div className="info">
          Viewing {selected.route?.label}. The recommended route is {result.route_selection?.selected_route_id}.
        </div>
      )}
    </div>
  );
}
