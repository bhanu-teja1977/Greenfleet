import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FuelComparison from '../components/FuelComparison';
import { ArrowRight } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, LineChart, Line,
} from 'recharts';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const CHART_STYLE = {
  contentStyle: { background: '#0d1f35', border: '1px solid #1e3448', borderRadius: 8, color: '#e0eaf0' },
};

function NoData({ navigate }) {
  return (
    <div className="page-empty">
      <div className="page-empty-inner">
        <h2>No Voyage Data</h2>
        <p>Run a voyage optimisation first to see fuel comparison data.</p>
        <button className="btn-primary" onClick={() => navigate('/voyage')}>
          <ArrowRight size={16} /> Go to Voyage Planning
        </button>
      </div>
    </div>
  );
}

export default function FuelComparisonPage() {
  const navigate = useNavigate();
  const { result, selected } = useApp();

  if (!result) return <NoData navigate={navigate} />;

  const fuelRows = result.fuel_comparison || [];
  const chartData = fuelRows.map(x => ({
    name: x.fuel_type,
    fuel: +x.predicted_fuel_litres?.toFixed(1),
    cost: +x.fuel_cost_index?.toFixed(2),
    co2:  +x.operational_co2_kg?.toFixed(1),
    reduction: +Math.abs(x.co2_reduction_vs_hfo_percent || 0).toFixed(1),
  }));

  const tickStyle = { fill: '#8ea7b3', fontSize: 11 };

  return (
    <div className="page-fuel">
      {/* Full comparison table – reuses existing component */}
      <FuelComparison result={{ ...(selected || result), fuel_model: result.fuel_model }} />

      {/* Extra charts section */}
      {fuelRows.length > 0 && (
        <div className="card">
          <div className="section-heading">
            <div>
              <div className="eyebrow">DETAILED ANALYSIS</div>
              <h2>Fuel Performance Charts</h2>
            </div>
          </div>
          <div className="fuel-charts-grid">
            {/* Chart 1 – Predicted Fuel */}
            <div className="fuel-chart-wrap">
              <h4>⛽ Predicted Fuel Consumption (L)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
                  <XAxis dataKey="name" tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip {...CHART_STYLE} />
                  <Bar dataKey="fuel" name="Fuel (L)" fill="#00c896" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 2 – Fuel Cost */}
            <div className="fuel-chart-wrap">
              <h4>💰 Fuel Cost Index</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
                  <XAxis dataKey="name" tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip {...CHART_STYLE} />
                  <Bar dataKey="cost" name="Cost Index" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 3 – CO₂ */}
            <div className="fuel-chart-wrap">
              <h4>🌿 CO₂ Emissions (kg)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
                  <XAxis dataKey="name" tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip {...CHART_STYLE} />
                  <Bar dataKey="co2" name="CO₂ (kg)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Chart 4 – CO₂ Reduction vs HFO */}
            <div className="fuel-chart-wrap">
              <h4>📉 CO₂ Reduction vs HFO (%)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3448" />
                  <XAxis dataKey="name" tick={tickStyle} />
                  <YAxis tick={tickStyle} />
                  <Tooltip {...CHART_STYLE} />
                  <Bar dataKey="reduction" name="Reduction %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
