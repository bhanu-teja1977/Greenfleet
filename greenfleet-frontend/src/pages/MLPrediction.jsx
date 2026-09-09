import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, Brain, Cpu } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from 'recharts';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function MLPrediction() {
  const navigate = useNavigate();
  const { result, selected } = useApp();

  const fuelRows = result?.fuel_comparison || [];
  const model    = result?.fuel_model;
  const o        = selected?.optimized || result?.optimized;

  const chartData = fuelRows.map(x => ({
    name: x.fuel_type,
    fuel: +x.predicted_fuel_litres?.toFixed(1),
    co2:  +x.operational_co2_kg?.toFixed(1),
  }));

  return (
    <div className="page-ml">
      {/* Model Info Card */}
      <div className="card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">CORE PROJECT MODULE · ML</div>
            <h2><Brain size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />Fuel Consumption Prediction</h2>
            <p className="section-copy">
              A fuel-aware Random Forest Regressor trained on physics-grounded synthetic data.
              It predicts fuel consumption for each fuel type separately, holding vessel, cargo, speed,
              and marine conditions constant so the fuel-type effect is clearly visible.
            </p>
          </div>
        </div>

        <div className="ml-model-grid">
          <div className="ml-model-item">
            <span>Model</span>
            <b>Random Forest Regressor</b>
          </div>
          <div className="ml-model-item">
            <span>Input Features</span>
            <b>{model?.features?.length || 11}</b>
          </div>
          <div className="ml-model-item">
            <span>Training Rows</span>
            <b>{(model?.training_rows || 2500).toLocaleString()}</b>
          </div>
          <div className="ml-model-item">
            <span>R² Score</span>
            <b>0.9723</b>
          </div>
          <div className="ml-model-item">
            <span>MAE</span>
            <b>1,870.61 L</b>
          </div>
          <div className="ml-model-item">
            <span>RMSE</span>
            <b>2,582.49 L</b>
          </div>
        </div>

        {/* Feature list */}
        <div style={{ marginTop: 16 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>INPUT FEATURES</div>
          <div className="ml-features-wrap">
            {(model?.features || [
              'vessel_type', 'fuel_type', 'speed_knots', 'cargo_tonnes',
              'distance_km', 'wave_height_m', 'wave_period_s',
              'current_speed_kmh', 'current_direction',
              'vessel_heading', 'wind_speed_kmh',
            ]).map(f => (
              <span key={f} className="ml-feature-tag">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Current Voyage Prediction */}
      {result ? (
        <>
          <div className="card">
            <div className="section-heading">
              <div>
                <div className="eyebrow">CURRENT VOYAGE PREDICTION</div>
                <h2>ML Output for This Voyage</h2>
              </div>
            </div>
            <div className="opt-result-grid">
              <div className="opt-result-item">
                <span>Predicted Fuel</span>
                <b>{fmt(o?.fuel_litres)} L</b>
              </div>
              <div className="opt-result-item">
                <span>Fuel Type</span>
                <b>{o?.fuel_type}</b>
              </div>
              <div className="opt-result-item">
                <span>Speed</span>
                <b>{o?.speed_knots} kn</b>
              </div>
              <div className="opt-result-item">
                <span>L / Cargo Tonne</span>
                <b>{fmt(o?.fuel_litres / Math.max(result.route?.cargo_tonnes || 1, 1))}</b>
              </div>
              <div className="opt-result-item">
                <span>Operational CO₂</span>
                <b>{fmt(o?.co2_kg)} kg</b>
              </div>
              <div className="opt-result-item">
                <span>Fuel Cost Index</span>
                <b>{fmt(o?.fuel_cost)}</b>
              </div>
            </div>
          </div>

          {/* ML fuel comparison across all fuels */}
          {fuelRows.length > 0 && (
            <div className="card">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">ALL FUEL TYPES</div>
                  <h2>ML-Predicted Fuel Comparison</h2>
                  <p className="section-copy">
                    Same vessel, cargo, speed, and marine conditions — only the fuel type changes.
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="fuel-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Fuel</th>
                      <th>Predicted Fuel (L)</th>
                      <th>L / Tonne</th>
                      <th>CO₂ (kg)</th>
                      <th>CO₂ vs HFO</th>
                      <th>Decision Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fuelRows.map(r => (
                      <tr key={r.fuel_type} className={r.recommended ? 'fuel-row-best' : ''}>
                        <td>#{r.rank}</td>
                        <td>
                          <strong>{r.fuel_type}</strong>
                          {r.recommended && <span className="best-tag"> BEST</span>}
                        </td>
                        <td>{fmt(r.predicted_fuel_litres)}</td>
                        <td>{fmt(r.fuel_litres_per_tonne)}</td>
                        <td>{fmt(r.operational_co2_kg)}</td>
                        <td>{r.co2_reduction_vs_hfo_percent}%</td>
                        <td>{fmt(r.decision_score)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={260} style={{ marginTop: 20 }}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
                  <XAxis dataKey="name" tick={{ fill: '#8ea7b3', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#8ea7b3', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0d1f35', border: '1px solid #1e3448', borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="fuel" name="Predicted Fuel (L)" fill="#00c896" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="co2"  name="CO₂ (kg)"           fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="card">
            <div className="fuel-note">
              <Cpu size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              <strong>Interpretation:</strong> Fuel litres are ML predictions. Fuel cost is a prototype cost index,
              and CO₂ is an operational estimate using the project's emission factors. Lifecycle/well-to-wake
              emissions need a validated external fuel-LCA dataset. Model: Random Forest (n_estimators=220,
              max_depth=18, random_state=42).
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <Brain size={40} style={{ color: '#4a7c8e', marginBottom: 12 }} />
          <h3>No voyage data yet</h3>
          <p style={{ color: '#8ea7b3', marginBottom: 20 }}>
            Run a voyage optimisation to see ML predictions.
          </p>
          <button className="btn-primary" onClick={() => navigate('/voyage')}>
            <ArrowRight size={16} /> Go to Voyage Planning
          </button>
        </div>
      )}
    </div>
  );
}
