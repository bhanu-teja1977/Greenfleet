import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function MetricCompare({ label, baseline, optimized, unit, lowerBetter = true }) {
  const diff = ((optimized - baseline) / Math.max(Math.abs(baseline), 1)) * 100;
  const improved = lowerBetter ? diff < 0 : diff > 0;
  return (
    <div className="opt-metric">
      <div className="opt-metric-label">{label}</div>
      <div className="opt-row">
        <div className="opt-val-wrap">
          <span className="opt-tag">Baseline</span>
          <span className="opt-val">{fmt(baseline)} <small>{unit}</small></span>
        </div>
        <div className={`opt-delta ${improved ? 'improved' : 'worse'}`}>
          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
        </div>
        <div className="opt-val-wrap">
          <span className="opt-tag opt-tag-qpso">QPSO</span>
          <span className="opt-val">{fmt(optimized)} <small>{unit}</small></span>
        </div>
      </div>
    </div>
  );
}

export default function Optimization() {
  const navigate = useNavigate();
  const { result, selected } = useApp();

  if (!result) {
    return (
      <div className="page-empty">
        <div className="page-empty-inner">
          <h2>No Optimisation Data</h2>
          <p>Run a voyage optimisation to see QPSO results.</p>
          <button className="btn-primary" onClick={() => navigate('/voyage')}>
            <ArrowRight size={16} /> Go to Voyage Planning
          </button>
        </div>
      </div>
    );
  }

  const o = selected?.optimized || result.optimized;
  const b = selected?.baseline  || result.baseline;
  const vp = result.voyage_parameters;
  const bm = result.benchmark;

  const compData = [
    { name: 'Fuel (L)',    baseline: b?.fuel_litres,  qpso: o?.fuel_litres  },
    { name: 'CO₂ (kg)',   baseline: b?.co2_kg,        qpso: o?.co2_kg       },
    { name: 'Cost Index', baseline: b?.fuel_cost,     qpso: o?.fuel_cost    },
    { name: 'ETA (h)',    baseline: b?.eta_hours,     qpso: o?.eta_hours    },
  ];

  return (
    <div className="page-opt">
      {/* QPSO Header Card */}
      <div className="card opt-header-card">
        <div className="opt-method-badge">
          <Zap size={16} />
          Quantum-inspired Particle Swarm Optimisation (QPSO)
        </div>
        <div className="opt-result-grid">
          <div className="opt-result-item">
            <span>Recommended Fuel</span>
            <b>{o?.fuel_type}</b>
          </div>
          <div className="opt-result-item">
            <span>Optimal Speed</span>
            <b>{o?.speed_knots} kn</b>
            {vp && <small>Range: {vp.speed_min_knots}–{vp.speed_max_knots} kn</small>}
          </div>
          <div className="opt-result-item">
            <span>Recommended Route</span>
            <b>{result.route_selection?.selected_route_id}</b>
          </div>
          <div className="opt-result-item">
            <span>ETA</span>
            <b>{o?.eta_hours} h</b>
            {vp?.schedule_window_hours && <small>Window: ±{vp.schedule_window_hours} h</small>}
          </div>
          <div className="opt-result-item">
            <span>Objective Score</span>
            <b>{fmt(selected?.route_score)}</b>
          </div>
          <div className="opt-result-item">
            <span>Env Score</span>
            <b>{selected?.avg_environmental_score}/100</b>
          </div>
        </div>
        {bm && (
          <div className="benchmark" style={{ marginTop: 12 }}>
            ⚡ QPSO achieved <strong>{bm.improvement_percent}%</strong> objective improvement over speed-grid search.
          </div>
        )}
      </div>

      {/* Baseline vs QPSO comparison */}
      <div className="card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">BASELINE VS OPTIMIZED</div>
            <h2>Performance Comparison</h2>
          </div>
        </div>
        <div className="opt-metrics-grid">
          <MetricCompare label="Fuel Consumption" baseline={b?.fuel_litres} optimized={o?.fuel_litres} unit="L" />
          <MetricCompare label="CO₂ Emissions"    baseline={b?.co2_kg}     optimized={o?.co2_kg}     unit="kg" />
          <MetricCompare label="Fuel Cost"         baseline={b?.fuel_cost}  optimized={o?.fuel_cost}  unit="idx" />
          <MetricCompare label="Voyage Time"       baseline={b?.eta_hours}  optimized={o?.eta_hours}  unit="h" />
        </div>

        {/* Comparison chart */}
        <ResponsiveContainer width="100%" height={240} style={{ marginTop: 20 }}>
          <BarChart data={compData} margin={{ top: 4, right: 20, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
            <XAxis dataKey="name" tick={{ fill: '#8ea7b3', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8ea7b3', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0d1f35', border: '1px solid #1e3448', borderRadius: 8 }} />
            <Legend />
            <Bar dataKey="baseline" name="Baseline" fill="#4a7c8e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="qpso"     name="QPSO"     fill="#00c896" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings */}
      <div className="card">
        <div className="section-heading"><div><h2>Savings &amp; Benefits</h2></div></div>
        <div className="savings-grid">
          <div className="savings-item">
            <span>{result.savings?.label || 'Fuel vs baseline'}</span>
            <b className="savings-val">{result.savings?.fuel_percent}%</b>
          </div>
          <div className="savings-item">
            <span>Fuel Type</span>
            <b className="savings-val">{o?.fuel_type}</b>
          </div>
          <div className="savings-item">
            <span>Optimised CO₂</span>
            <b className="savings-val">{fmt(o?.co2_kg)} kg</b>
          </div>
          <div className="savings-item">
            <span>Schedule Status</span>
            <b className="savings-val" style={{ color: '#00c896' }}>On Time</b>
          </div>
        </div>
      </div>
    </div>
  );
}
