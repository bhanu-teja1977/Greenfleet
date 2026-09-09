import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Fuel, Wind, TrendingDown, Gauge, Map, Package,
  ArrowRight, Star, Clock, AlertCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function KPICard({ icon: Icon, label, value, unit, sub, accent }) {
  return (
    <div className="kpi-card" style={accent ? { borderTopColor: accent } : {}}>
      <div className="kpi-icon" style={accent ? { color: accent } : {}}><Icon size={20} /></div>
      <div className="kpi-body">
        <div className="kpi-value">{value} <span className="kpi-unit">{unit}</span></div>
        <div className="kpi-label">{label}</div>
        {sub && <div className="kpi-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function Overview() {
  const navigate = useNavigate();
  const { result, selected, scenarioName, loading, error } = useApp();

  if (!result) {
    return (
      <div className="page-empty">
        <div className="page-empty-inner">
          <Star size={48} strokeWidth={1} />
          <h2>Welcome to GreenFleet</h2>
          <p>AI fuel prediction + quantum-inspired fleet optimisation for lower-emission cargo voyages.</p>
          <button className="btn-primary" onClick={() => navigate('/voyage')}>
            <ArrowRight size={16} /> Start Voyage Planning
          </button>
          <div className="empty-eyebrow">SIH26138 · Clean &amp; Green Technology</div>
        </div>
      </div>
    );
  }

  const o = selected?.optimized || result.optimized;
  const b = selected?.baseline  || result.baseline;
  const fp = selected?.fleet_plan || result.fleet_plan;
  const fuelRows = result.fuel_comparison || [];
  const best = fuelRows.find(x => x.recommended) || fuelRows[0];

  const perfData = [
    { name: 'Baseline', fuel: b?.fuel_litres, co2: b?.co2_kg },
    { name: 'QPSO',     fuel: o?.fuel_litres, co2: o?.co2_kg },
    { name: 'Fleet',    fuel: fp?.fuel_litres, co2: fp?.co2_kg },
  ];

  const fuelChartData = fuelRows.map(x => ({
    name: x.fuel_type,
    fuel: x.predicted_fuel_litres,
    co2: x.operational_co2_kg,
  }));

  return (
    <div className="page-overview">
      {/* Voyage Summary Strip */}
      <div className="voyage-summary-strip">
        <div className="vs-item"><span>Origin</span><b>{result.origin?.port_name}, {result.origin?.country}</b></div>
        <div className="vs-sep">→</div>
        <div className="vs-item"><span>Destination</span><b>{result.destination?.port_name}, {result.destination?.country}</b></div>
        <div className="vs-divider" />
        <div className="vs-item"><span>Cargo</span><b>{result.route?.cargo_tonnes?.toLocaleString()} t</b></div>
        <div className="vs-item"><span>Vessel</span><b>{o?.vessel_type || '—'}</b></div>
        <div className="vs-item"><span>Fuel</span><b>{o?.fuel_type}</b></div>
        <div className="vs-item"><span>Scenario</span><b>{scenarioName}</b></div>
        {result.voyage_parameters && (
          <div className="vs-item"><span>Window</span><b>{result.voyage_parameters.duration_formatted}</b></div>
        )}
      </div>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Running optimisation…</div>}

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KPICard icon={Fuel}        label="Predicted Fuel"      value={fmt(o?.fuel_litres)}     unit="L"    accent="#00c896" />
        <KPICard icon={Wind}        label="CO₂ Emissions"       value={fmt(o?.co2_kg)}           unit="kg"   accent="#f59e0b" />
        <KPICard icon={Gauge}       label="Optimal Speed"       value={o?.speed_knots}            unit="kn"   accent="#3b82f6" />
        <KPICard icon={Map}         label="Route Distance"      value={result.route?.distance_km?.toLocaleString()} unit="km" accent="#8b5cf6" />
        <KPICard icon={TrendingDown} label="Fuel Saving vs HFO" value={result.savings?.fuel_percent} unit="%"  accent="#10b981" sub={result.savings?.label} />
        <KPICard icon={Package}     label="Fleet Utilization"   value={fp?.capacity_utilization_percent} unit="%" accent="#ef4444" sub={`${fp?.fleet_count} ships`} />
      </div>

      {/* Recommended Decision */}
      <div className="rec-card">
        <div className="rec-header">
          <Star size={18} className="rec-star" />
          <span>GreenFleet Recommendation</span>
        </div>
        <div className="rec-grid">
          <div className="rec-item"><span>Fuel</span><b>{o?.fuel_type}</b></div>
          <div className="rec-item"><span>Speed</span><b>{o?.speed_knots} kn</b></div>
          <div className="rec-item"><span>Route</span><b>{result.route_selection?.selected_route_id}</b></div>
          <div className="rec-item"><span>Fuel Consumption</span><b>{fmt(o?.fuel_litres)} L</b></div>
          <div className="rec-item"><span>CO₂ Emissions</span><b>{fmt(o?.co2_kg)} kg</b></div>
          <div className="rec-item"><span>Route Distance</span><b>{result.route?.distance_km?.toLocaleString()} km</b></div>
          <div className="rec-item"><span>ETA</span><b>{o?.eta_hours} h</b></div>
        </div>
        <p className="rec-note">
          GreenFleet recommends this operational configuration based on fuel cost, emissions,
          voyage time, and environmental exposure. Objective score: <strong>{fmt(selected?.route_score)}</strong>
        </p>
      </div>

      {/* Mini charts row */}
      <div className="overview-charts-row">
        <div className="card charts">
          <h3>Voyage Performance</h3>
          <p>Baseline vs QPSO vs Fleet plan</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={perfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
              <XAxis dataKey="name" tick={{ fill: '#8ea7b3', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8ea7b3', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1f35', border: '1px solid #1e3448', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="fuel" name="Fuel (L)" fill="#00c896" radius={[4, 4, 0, 0]} />
              <Bar dataKey="co2"  name="CO₂ (kg)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card charts">
          <h3>Fuel Type Comparison</h3>
          <p>ML-predicted fuel across all types</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fuelChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
              <XAxis dataKey="name" tick={{ fill: '#8ea7b3', fontSize: 11 }} />
              <YAxis tick={{ fill: '#8ea7b3', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1f35', border: '1px solid #1e3448', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="fuel" name="Predicted (L)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="co2"  name="CO₂ (kg)"      fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="overview-quicknav">
        {[
          { label: 'Full Fuel Analysis', to: '/fuel',         color: '#00c896' },
          { label: 'Route Map',          to: '/routes',        color: '#3b82f6' },
          { label: 'Optimization',       to: '/optimization',  color: '#f59e0b' },
          { label: 'Scenarios',          to: '/scenarios',     color: '#8b5cf6' },
          { label: 'Fleet Allocation',   to: '/fleet',         color: '#ef4444' },
          { label: 'ML Prediction',      to: '/ml',            color: '#10b981' },
        ].map(({ label, to, color }) => (
          <button key={to} className="quicknav-btn" style={{ borderColor: color, color }}
            onClick={() => navigate(to)}>
            {label} <ArrowRight size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}
