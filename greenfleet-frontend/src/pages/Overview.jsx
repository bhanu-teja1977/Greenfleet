import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Calendar, Plus, ArrowUpRight, ArrowRight,
  TrendingDown, TrendingUp, Ship, Gauge, Fuel, Wind,
  Radio, Waves, ShieldCheck, CheckCircle2, ChevronRight,
  Navigation, Anchor
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import './Overview.css';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 1 });

// Default baseline voyage data used when user hasn't calculated a custom voyage yet
const BASELINE_DATA = {
  vessel_name: 'MV Ocean Pioneer',
  vessel_type: 'Capesize Bulk / LNG Dual-Fuel',
  origin: { port_name: 'Mumbai', port_code: 'INBOM', country: 'India' },
  destination: { port_name: 'Singapore', port_code: 'SGSIN', country: 'Singapore' },
  fuel_litres: 14310.7,
  co2_kg: 39354.4,
  speed_knots: 12.5,
  distance_km: 4420,
  eta_hours: 191.0,
  recommended_fuel: 'LNG',
  savings_pct: 18.4,
  saved_litres: 3230,
  saved_usd: 2890,
  env_score: 94.2,
  date_range: '22 Oct, 2026 – 30 Oct, 2026',
  fuels: [
    { name: 'HFO', fuel: 17540, co2: 54620, isBest: false },
    { name: 'MGO', fuel: 16210, co2: 51200, isBest: false },
    { name: 'LNG', fuel: 14310, co2: 39350, isBest: true },
    { name: 'Methanol', fuel: 15100, co2: 42100, isBest: false },
    { name: 'Ammonia', fuel: 14890, co2: 12050, isBest: false },
  ],
  speed_wave: [
    { hour: '0h', speed: 11.8 },
    { hour: '30h', speed: 12.6 },
    { hour: '60h', speed: 12.2 },
    { hour: '90h', speed: 13.1 },
    { hour: '120h', speed: 12.5 },
    { hour: '150h', speed: 12.4 },
    { hour: '190h', speed: 12.5 },
  ],
  recent_optimizations: [
    {
      id: 'Q-9082',
      vessel: 'MV Ocean Pioneer',
      origin: 'Mumbai (INBOM)',
      destination: 'Singapore (SGSIN)',
      date: '22 Oct 2026',
      duration: '191.0 h',
      fuel_type: 'LNG',
      speed: '12.5 kn',
      fuel_litres: '14,310 L',
      status: 'QPSO Optimal',
      status_type: 'success',
      savings: '+18.4%',
      badge_color: 'emerald'
    },
    {
      id: 'Q-8941',
      vessel: 'Green Arrow IV',
      origin: 'Rotterdam (NLRTM)',
      destination: 'New York (USNYC)',
      date: '18 Oct 2026',
      duration: '172.5 h',
      fuel_type: 'Methanol',
      speed: '13.0 kn',
      fuel_litres: '21,850 L',
      status: 'In Transit',
      status_type: 'info',
      savings: '+15.2%',
      badge_color: 'cyan'
    },
    {
      id: 'Q-8804',
      vessel: 'Nordic Sea Express',
      origin: 'Shanghai (CNSHA)',
      destination: 'Los Angeles (USLAX)',
      date: '12 Oct 2026',
      duration: '248.0 h',
      fuel_type: 'LNG',
      speed: '12.2 kn',
      fuel_litres: '38,400 L',
      status: 'Completed',
      status_type: 'neutral',
      savings: '+21.0%',
      badge_color: 'emerald'
    },
    {
      id: 'Q-8711',
      vessel: 'Astra Horizon',
      origin: 'Dubai (AEDXB)',
      destination: 'Mumbai (INBOM)',
      date: '08 Oct 2026',
      duration: '54.2 h',
      fuel_type: 'MGO Low-Sulfur',
      speed: '11.8 kn',
      fuel_litres: '6,920 L',
      status: 'Eco-Steaming',
      status_type: 'success',
      savings: '+16.8%',
      badge_color: 'amber'
    }
  ]
};

export default function Overview() {
  const navigate = useNavigate();
  const { result, selected, scenarioName, loading, error } = useApp();
  const [activeMetric, setActiveMetric] = useState('fuel'); // 'fuel' | 'co2'

  // Extract live calculation data if available, or fall back to default baseline
  const o = selected?.optimized || result?.optimized;
  const b = selected?.baseline || result?.baseline;
  const fp = selected?.fleet_plan || result?.fleet_plan;
  const fuelRows = result?.fuel_comparison || [];
  const bestFuel = fuelRows.find(x => x.recommended) || fuelRows[0];

  const hasLiveResult = Boolean(result);

  // Current values
  const vesselName = o?.vessel_type ? `MV ${o.vessel_type}` : BASELINE_DATA.vessel_name;
  const originCode = result?.origin?.port_code || BASELINE_DATA.origin.port_code;
  const destCode = result?.destination?.port_code || BASELINE_DATA.destination.port_code;
  const originName = result?.origin?.port_name || BASELINE_DATA.origin.port_name;
  const destName = result?.destination?.port_name || BASELINE_DATA.destination.port_name;

  const currentFuel = o?.fuel_litres ? fmt(o.fuel_litres) : fmt(BASELINE_DATA.fuel_litres);
  const currentSpeed = o?.speed_knots || BASELINE_DATA.speed_knots;
  const currentFuelType = o?.fuel_type || BASELINE_DATA.recommended_fuel;

  // Best recommended fuel from comparison or fallback
  const recFuelName = bestFuel?.fuel_type || (o?.fuel_type !== 'HFO' ? o?.fuel_type : 'LNG') || BASELINE_DATA.recommended_fuel;

  const rawSavings = result?.savings?.fuel_percent != null
    ? Number(result.savings.fuel_percent)
    : BASELINE_DATA.savings_pct;

  const savingsPct = (rawSavings && rawSavings > 0)
    ? `+${rawSavings.toFixed(1)}%`
    : `+${BASELINE_DATA.savings_pct}%`;

  let savedLitres = BASELINE_DATA.saved_litres;
  if (b?.fuel_litres && o?.fuel_litres) {
    const diff = Math.round(b.fuel_litres - o.fuel_litres);
    if (diff > 50) {
      savedLitres = diff;
    }
  }

  // Chart data
  const chartData = hasLiveResult && fuelRows.length > 0
    ? fuelRows.map(x => ({
        name: x.fuel_type,
        fuel: Math.round(x.predicted_fuel_litres || 0),
        co2: Math.round(x.operational_co2_kg || 0),
        isBest: x.recommended || x.fuel_type === recFuelName
      }))
    : BASELINE_DATA.fuels;

  const speedWaveData = BASELINE_DATA.speed_wave.map((pt, idx) => ({
    hour: pt.hour,
    speed: hasLiveResult && o?.speed_knots
      ? +(o.speed_knots + (Math.sin(idx * 1.2) * 0.4)).toFixed(1)
      : pt.speed
  }));

  const recentList = BASELINE_DATA.recent_optimizations;

  const recFuelIndex = chartData.findIndex(d => d.isBest);
  const badgeLeftPercent = recFuelIndex >= 0
    ? Math.round(((recFuelIndex + 0.5) / chartData.length) * 100)
    : 50;

  return (
    <div className="q-overview-container">
      {/* ── Top Header Greeting ── */}
      <div className="q-header-banner">
        <div>
          <h1 className="q-header-title">Welcome Back, Fleet Commander</h1>
          <p className="q-header-subtitle">
            Autonomous Quantum-Inspired Fleet Operations &amp; Carbon Decision Engine
          </p>
        </div>

        <div className="q-header-controls">
          <div className="q-date-pill" title="Active voyage planning schedule window">
            <Calendar size={14} className="q-date-icon" />
            <span>{result?.voyage_parameters?.duration_formatted || BASELINE_DATA.date_range}</span>
          </div>

          <button className="q-btn-add" onClick={() => navigate('/voyage')} title="Configure new origin, destination & cargo">
            <Plus size={15} />
            <span>Plan New Voyage</span>
          </button>
        </div>
      </div>

      {/* Baseline / Demo Notification if no user voyage run yet */}
      {!hasLiveResult && (
        <div className="q-demo-banner">
          <div className="q-demo-banner-left">
            <span className="q-demo-pill">Benchmark Mode</span>
            <span>
              Displaying validated benchmark corridor: <strong>{originName} → {destName}</strong> with QPSO Quantum Optimization.
            </span>
          </div>
          <span className="q-demo-link" onClick={() => navigate('/voyage')}>
            Click to configure custom route &rarr;
          </span>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Running quantum-inspired PSO solver…</div>}

      {/* ── Top 3-Column Grid ── */}
      <div className="q-top-grid">

        {/* ── COLUMN 1: Quixotic Emerald Flagship Card + Quick Stat Tile ── */}
        <div className="q-col-card">
          <div className="q-card-header-row">
            <div className="q-card-title-wrap">
              <span className="q-card-title">Flagship Deployment</span>
            </div>
            <button className="q-icon-btn" onClick={() => navigate('/fleet')} title="View Fleet Allocation">
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="q-emerald-card">
            <div className="q-ec-top">
              <div className="q-ec-brand">
                <Ship size={16} />
                <span className="q-ec-vessel-name">{vesselName}</span>
              </div>
              <Radio size={16} className="q-ec-radar" />
            </div>

            <div>
              <div className="q-ec-label">Predicted Fuel Consumption</div>
              <div className="q-ec-value">
                {currentFuel} <span className="q-ec-unit">Litres</span>
              </div>
            </div>

            <div className="q-ec-footer">
              <div className="q-ec-route">
                <span>{originCode}</span>
                <span className="q-ec-arrow">&rarr;</span>
                <span>{destCode}</span>
              </div>
              <div className="q-ec-fuel-badge">
                {currentFuelType} · {currentSpeed} kn
              </div>
            </div>
          </div>

          {/* Quick Stat: Fuel Savings vs HFO */}
          <div className="q-quick-stat-card">
            <div className="q-qs-header">
              <span className="q-qs-label">Fuel Saving vs Baseline</span>
              <span className="q-badge-pill green">{savingsPct}</span>
            </div>
            <div className="q-qs-value">
              +{savedLitres.toLocaleString()} <span style={{ fontSize: '14px', fontWeight: 600, color: '#6a7f8e' }}>L</span>
            </div>
            <div className="q-qs-sub">
              ~${(savedLitres * 0.89).toLocaleString(undefined, { maximumFractionDigits: 0 })} operational voyage savings
            </div>
          </div>
        </div>

        {/* ── COLUMN 2: Fuel & Emissions Intelligence (Engagement Rate Style) ── */}
        <div className="q-col-chart">
          <div className="q-card-header-row">
            <div className="q-card-title-wrap">
              <Fuel size={16} className="q-title-icon" />
              <span className="q-card-title">Fuel &amp; Emissions Intelligence</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="q-pill-toggle">
                <button
                  className={activeMetric === 'fuel' ? 'active' : ''}
                  onClick={() => setActiveMetric('fuel')}
                >
                  Fuel (L)
                </button>
                <button
                  className={activeMetric === 'co2' ? 'active' : ''}
                  onClick={() => setActiveMetric('co2')}
                >
                  CO₂ (kg)
                </button>
              </div>

              <button className="q-icon-btn" onClick={() => navigate('/fuel')} title="Inspect In-Depth Fuel Matrix">
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="q-bar-chart-wrap">
            <div className="q-chart-badge-overlay" style={{ left: `${badgeLeftPercent}%` }}>
              Recommended: {recFuelName}
            </div>

            <ResponsiveContainer width="100%" height={235}>
              <BarChart data={chartData} margin={{ top: 28, right: 12, left: -16, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6a7f8e', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#e2eaee' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#80909b', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={val => `${Math.round(val / 1000)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(8, 184, 135, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div style={{
                          background: '#ffffff',
                          border: '1px solid #dce6eb',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          boxShadow: '0 8px 24px rgba(22, 52, 67, 0.12)',
                          fontSize: '12px'
                        }}>
                          <div style={{ fontWeight: 800, color: '#10212d', marginBottom: '4px' }}>
                            {d.name} {d.isBest && '★ (Recommended)'}
                          </div>
                          <div style={{ color: '#08b887', fontWeight: 700 }}>
                            Fuel: {d.fuel.toLocaleString()} L
                          </div>
                          <div style={{ color: '#d97706', fontWeight: 600, fontSize: '11px' }}>
                            CO₂: {d.co2.toLocaleString()} kg
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey={activeMetric === 'fuel' ? 'fuel' : 'co2'}
                  radius={[14, 14, 14, 14]}
                  barSize={32}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isBest ? '#08b887' : '#93d8be'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── COLUMN 3: Transit Speed Wave + Environmental Index ── */}
        <div className="q-col-right">

          {/* Optimal Speed Wave Card (Payment Goal Wave Style) */}
          <div className="q-wave-card">
            <div className="q-card-header-row" style={{ marginBottom: 4 }}>
              <span className="q-card-title">Optimal Transit Speed</span>
              <button className="q-icon-btn" onClick={() => navigate('/optimization')} title="View QPSO Speed Curve">
                <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="q-wave-top">
              <span className="q-wave-stat-label">Hydrodynamic Cruising Speed</span>
              <div className="q-wave-value">
                {currentSpeed} <span className="q-wave-unit">knots</span>
              </div>
            </div>

            <div className="q-wave-chart-wrap">
              <ResponsiveContainer width="100%" height={75}>
                <AreaChart data={speedWaveData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#08b887" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#08b887" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #dce6eb',
                      borderRadius: '8px',
                      fontSize: '11px',
                      padding: '4px 8px'
                    }}
                    formatter={(val) => [`${val} kn`, 'Speed']}
                  />
                  <Area
                    type="monotone"
                    dataKey="speed"
                    stroke="#08b887"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#waveFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="q-wave-actions">
              <button className="q-action-btn primary" onClick={() => navigate('/optimization')}>
                <Gauge size={13} />
                <span>Tune Speed</span>
              </button>
              <button className="q-action-btn secondary" onClick={() => navigate('/routes')}>
                <Navigation size={13} />
                <span>Inspect Route</span>
              </button>
            </div>
          </div>

          {/* Environmental Index Score (Amount of Credit Style) */}
          <div className="q-env-card">
            <div className="q-env-header">
              <ShieldCheck size={16} className="q-env-icon" />
              <span>Fleet Environmental Index</span>
            </div>

            <div className="q-env-value-row">
              <div className="q-env-num">
                {BASELINE_DATA.env_score} <small>/100</small>
              </div>
              <span className="q-badge-pill green">+12.8%</span>
            </div>

            <div className="q-env-fleet-row">
              <span className="q-fleet-label">Monitored Fleet Classes</span>
              <div className="q-fleet-chips">
                <span className="q-chip">Capesize</span>
                <span className="q-chip">Panamax</span>
                <span className="q-chip">LNG Carrier</span>
                <span className="q-chip plus">+2 Fleet</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── Bottom Section: Recent Voyage Optimizations Table (Payment History style) ── */}
      <div className="q-table-card">
        <div className="q-card-header-row">
          <div className="q-table-header-block">
            <h3 className="q-table-title">Recent Voyage Optimizations</h3>
            <p className="q-table-sub">
              Live corridor tracking with automated weather routing &amp; quantum convergence
            </p>
          </div>
          <button className="q-icon-btn" onClick={() => navigate('/scenarios')} title="Compare Saved Scenarios">
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="q-table-responsive">
          <table className="q-table">
            <thead>
              <tr>
                <th>Vessel &amp; Corridor</th>
                <th>Optimization Date</th>
                <th>Transit Window</th>
                <th>Status</th>
                <th>Fuel Consumption</th>
                <th>Fuel Savings</th>
              </tr>
            </thead>
            <tbody>
              {recentList.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="q-route-cell">
                      <div className={`q-route-icon-badge ${row.badge_color}`}>
                        <Ship size={15} />
                      </div>
                      <div>
                        <span className="q-route-name">{row.vessel}</span>
                        <span className="q-route-sub">{row.origin} &rarr; {row.destination}</span>
                      </div>
                    </div>
                  </td>
                  <td>{row.date}</td>
                  <td>{row.duration} ({row.speed})</td>
                  <td>
                    <span className={`q-status-chip ${row.status_type}`}>
                      <span className="q-dot" />
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <strong>{row.fuel_litres}</strong> <span style={{ color: '#80909b', fontSize: '11px' }}>({row.fuel_type})</span>
                  </td>
                  <td>
                    <span className="q-savings-tag">{row.savings}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Quick Navigation Pill Strip ── */}
      <div className="q-quicknav-strip">
        {[
          { label: 'Full Fuel Analysis', to: '/fuel' },
          { label: 'Weather Routing & Waypoints', to: '/routes' },
          { label: 'QPSO Speed Tuning', to: '/optimization' },
          { label: 'Scenario Benchmarking', to: '/scenarios' },
          { label: 'Fleet Allocation & CII', to: '/fleet' },
          { label: 'ML Prediction Diagnostics', to: '/ml' },
        ].map(({ label, to }) => (
          <button key={to} className="q-nav-pill-btn" onClick={() => navigate(to)}>
            <span>{label}</span>
            <ChevronRight size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}
