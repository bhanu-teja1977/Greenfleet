import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const SCENARIOS = [
  {
    key:   'NORMAL',
    label: 'Normal Conditions',
    icon:  '🌤',
    desc:  'Standard operational parameters — moderate weather, normal fuel prices, balanced optimisation.',
    assumptions: {
      'Fuel Price':      'Standard market rates',
      'Weather':         'Moderate (Bft 3–4)',
      'Emission Weight': 'Balanced',
      'Schedule Weight': 'Standard',
    },
  },
  {
    key:   'BAD_WEATHER',
    label: 'Bad Weather',
    icon:  '⛈',
    desc:  'Severe sea state — high wave heights, strong winds, elevated fuel penalties on route segments.',
    assumptions: {
      'Fuel Price':      'Standard',
      'Weather':         'Severe (Bft 7–8)',
      'Emission Weight': 'Reduced priority',
      'Schedule Weight': 'Safety first',
    },
  },
  {
    key:   'HIGH_FUEL_PRICE',
    label: 'High Fuel Price',
    icon:  '💰',
    desc:  'Fuel prices elevated 40–60% above baseline — optimiser skews heavily toward fuel economy.',
    assumptions: {
      'Fuel Price':      '+50% above standard',
      'Weather':         'Moderate',
      'Emission Weight': 'Standard',
      'Schedule Weight': 'Relaxed',
    },
  },
  {
    key:   'STRICT_EMISSION_LIMIT',
    label: 'Emission Sensitive',
    icon:  '🌿',
    desc:  'Strict CO₂ constraints — optimiser maximises emission reduction, may sacrifice cost efficiency.',
    assumptions: {
      'Fuel Price':      'Standard',
      'Weather':         'Moderate',
      'Emission Weight': 'Maximum',
      'Schedule Weight': 'Standard',
    },
  },
];

export default function ScenarioSimulation() {
  const navigate = useNavigate();
  const { result, selected, scenarioName, runScenario, loading, form } = useApp();
  const [activeScenario, setActiveScenario] = useState(null);

  const handleRun = async (key) => {
    setActiveScenario(key);
    await runScenario(key);
  };

  const o  = selected?.optimized || result?.optimized;
  const b  = selected?.baseline  || result?.baseline;

  const compData = result ? [
    { name: 'Fuel (L)',  baseline: b?.fuel_litres, scenario: o?.fuel_litres },
    { name: 'CO₂ (kg)', baseline: b?.co2_kg,       scenario: o?.co2_kg     },
    { name: 'Cost',     baseline: b?.fuel_cost,    scenario: o?.fuel_cost  },
    { name: 'ETA (h)',  baseline: b?.eta_hours,    scenario: o?.eta_hours  },
  ] : [];

  if (!form && !result) {
    return (
      <div className="page-empty">
        <div className="page-empty-inner">
          <h2>No Voyage Configured</h2>
          <p>Plan a voyage first, then run scenarios to compare results.</p>
          <button className="btn-primary" onClick={() => navigate('/voyage')}>
            <ArrowRight size={16} /> Go to Voyage Planning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-scenarios">
      {/* Scenario selector */}
      <div className="card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SCENARIO SIMULATION</div>
            <h2>Select Scenario</h2>
            <p className="section-copy">
              Re-run the QPSO optimiser under different operating conditions.
              The currently active scenario is <strong>{scenarioName}</strong>.
            </p>
          </div>
        </div>
        <div className="scenario-cards-grid">
          {SCENARIOS.map(sc => {
            const isCurrent = scenarioName === sc.key;
            return (
              <div
                key={sc.key}
                className={`scenario-card ${isCurrent ? 'active' : ''}`}
                onClick={() => !loading && handleRun(sc.key)}
              >
                <div className="sc-icon">{sc.icon}</div>
                <div className="sc-label">{sc.label}</div>
                <div className="sc-desc">{sc.desc}</div>
                {isCurrent && <div className="sc-active-badge">ACTIVE</div>}
                {loading && activeScenario === sc.key && (
                  <div className="sc-loading"><RefreshCw size={14} className="spin" /> Running…</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenario assumptions */}
      {scenarioName && (
        <div className="card">
          <div className="section-heading">
            <div>
              <h2>{SCENARIOS.find(s => s.key === scenarioName)?.icon} {SCENARIOS.find(s => s.key === scenarioName)?.label} — Assumptions</h2>
            </div>
          </div>
          <div className="sc-assumptions-grid">
            {Object.entries(SCENARIOS.find(s => s.key === scenarioName)?.assumptions || {}).map(([k, v]) => (
              <div key={k} className="sc-assumption">
                <span>{k}</span>
                <b>{v}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <>
          <div className="card">
            <div className="section-heading">
              <div>
                <div className="eyebrow">SCENARIO RESULTS</div>
                <h2>Optimisation Result under {scenarioName}</h2>
              </div>
            </div>
            <div className="opt-result-grid">
              <div className="opt-result-item"><span>Recommended Fuel</span><b>{o?.fuel_type}</b></div>
              <div className="opt-result-item"><span>Optimal Speed</span><b>{o?.speed_knots} kn</b></div>
              <div className="opt-result-item"><span>Recommended Route</span><b>{result.route_selection?.selected_route_id}</b></div>
              <div className="opt-result-item"><span>Fuel Consumption</span><b>{fmt(o?.fuel_litres)} L</b></div>
              <div className="opt-result-item"><span>CO₂ Emissions</span><b>{fmt(o?.co2_kg)} kg</b></div>
              <div className="opt-result-item"><span>ETA</span><b>{o?.eta_hours} h</b></div>
              <div className="opt-result-item"><span>Fuel Cost</span><b>{fmt(o?.fuel_cost)}</b></div>
              <div className="opt-result-item"><span>Schedule</span><b style={{ color: '#00c896' }}>On Time</b></div>
            </div>
          </div>

          {/* Baseline vs Scenario chart */}
          <div className="card">
            <div className="section-heading"><div><h2>Baseline vs Scenario Comparison</h2></div></div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={compData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
                <XAxis dataKey="name" tick={{ fill: '#8ea7b3', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8ea7b3', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#0d1f35', border: '1px solid #1e3448', borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="baseline" name="Baseline" fill="#4a7c8e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scenario" name={scenarioName} fill="#00c896" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
