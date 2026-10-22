import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Waves, Wind } from 'lucide-react';

export default function DashboardPreviewSection() {
  const [activeFuel, setActiveFuel] = useState('LNG');

  const fuelStats = {
    HFO: { fuel: '1,420 kL', co2: '4,450 t', cost: '$1.85M', penalty: 'High' },
    LNG: { fuel: '1,248 kL', co2: '3,420 t', cost: '$2.10M', penalty: 'Low' },
    Methanol: { fuel: '1,310 kL', co2: '2,980 t', cost: '$2.45M', penalty: 'Low' },
    Hydrogen: { fuel: '980 kL', co2: '410 t', cost: '$3.80M', penalty: 'Minimal' },
    Ammonia: { fuel: '1,050 kL', co2: '180 t', cost: '$3.20M', penalty: 'Zero CO₂' },
  };

  const current = fuelStats[activeFuel] || fuelStats['LNG'];

  return (
    <section className="gfq-section gfq-dashboard-section" id="preview">
      <div className="gfq-shell gfq-dashboard-grid">
        {/* Left Column: Copy & Action */}
        <div className="gfq-dashboard-copy">
          <div className="gfq-eyebrow">
            <span className="gfq-eyebrow-line" aria-hidden="true" />
            <span className="gfq-eyebrow-text">SEE THE DECISION BEFORE YOU SAIL</span>
          </div>

          <h2 className="gfq-section-headline">
            Interactive dashboard for real-world insights.
          </h2>

          <p className="gfq-section-desc">
            Explore routes, visualize marine conditions, compare fuels, and see optimized recommendations in one intuitive workspace.
          </p>
          <Link to="/dashboard" className="gfq-btn gfq-btn-primary gfq-btn-large">
            <span>Launch Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right Column: 3D Perspective Dashboard Preview */}
        <div className="gfq-dashboard-preview-col">
          <div className="gfq-preview-monitor-card">
            {/* Top Workspace Bar */}
            <div className="gfq-preview-window-bar">
              <div className="gfq-window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="gfq-window-breadcrumb">
                <Compass size={13} className="gfq-window-icon" />
                <span>GreenFleet-Q / Mumbai → Singapore (Voyage Decision)</span>
              </div>
              <div className="gfq-window-status">
                <span className="gfq-status-dot" />
                <span>Model Active</span>
              </div>
            </div>

            {/* Top 3 KPI Badges */}
            <div className="gfq-preview-kpi-row">
              <div className="gfq-kpi-tile">
                <span className="gfq-kpi-label">Total Fuel</span>
                <div className="gfq-kpi-values">
                  <span className="gfq-kpi-main">{current.fuel}</span>
                  <span className="gfq-kpi-delta green">−18.4%</span>
                </div>
                <span className="gfq-kpi-note">vs baseline</span>
              </div>

              <div className="gfq-kpi-tile">
                <span className="gfq-kpi-label">Operational CO₂</span>
                <div className="gfq-kpi-values">
                  <span className="gfq-kpi-main">{current.co2}</span>
                  <span className="gfq-kpi-delta green">−12.8%</span>
                </div>
                <span className="gfq-kpi-note">operational estimate</span>
              </div>

              <div className="gfq-kpi-tile">
                <span className="gfq-kpi-label">Estimated Cost</span>
                <div className="gfq-kpi-values">
                  <span className="gfq-kpi-main">{current.cost}</span>
                  <span className="gfq-kpi-delta cyan">Optimized</span>
                </div>
                <span className="gfq-kpi-note">bunker index</span>
              </div>
            </div>

            {/* Dashboard Workspace Inner Split */}
            <div className="gfq-preview-inner-workspace">
              {/* Left: SVG Marine Route Map Simulation */}
              <div className="gfq-preview-map-box">
                <div className="gfq-map-header-overlay">
                  <span className="gfq-map-corridor-tag">📍 Mumbai → Singapore</span>
                  <div className="gfq-map-weather-tags">
                    <span><Waves size={11} /> 1.9m wave</span>
                    <span><Wind size={11} /> 14 kt wind</span>
                  </div>
                </div>

                <svg viewBox="0 0 360 210" className="gfq-preview-map-svg" fill="none">
                  <defs>
                    <linearGradient id="mapRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#08b887" />
                      <stop offset="50%" stopColor="#15c7c4" />
                      <stop offset="100%" stopColor="#08b887" />
                    </linearGradient>
                  </defs>

                  {/* Daylight Ocean Background */}
                  <rect width="360" height="210" fill="#eaf4f7" rx="8" />

                  {/* Simplified India Coastline silhouette */}
                  <path
                    d="M 20 0 L 80 0 L 95 30 L 115 80 L 130 130 L 145 155 L 140 170 L 130 180 L 125 150 L 105 105 L 80 50 L 40 25 Z"
                    fill="#d7e8ee"
                    stroke="#bad7e3"
                    strokeWidth="1"
                  />
                  {/* Sri Lanka */}
                  <path d="M 148 165 C 153 162, 158 170, 152 178 C 146 178, 144 170, 148 165 Z" fill="#d7e8ee" stroke="#bad7e3" strokeWidth="1" />
                  {/* Southeast Asia / Malacca */}
                  <path
                    d="M 270 20 L 290 50 L 310 110 L 320 160 L 330 190 L 350 200 L 360 210 L 360 0 Z"
                    fill="#d7e8ee"
                    stroke="#bad7e3"
                    strokeWidth="1"
                  />
                  {/* Sumatra */}
                  <path
                    d="M 220 175 L 250 150 L 290 190 L 320 210 L 260 210 Z"
                    fill="#d7e8ee"
                    stroke="#bad7e3"
                    strokeWidth="1"
                  />

                  {/* Ocean label */}
                  <text x="140" y="105" fill="#6a8e9e" fontSize="9.5" letterSpacing="2" fontWeight="700">ARABIAN SEA</text>
                  <text x="180" y="145" fill="#6a8e9e" fontSize="9.5" letterSpacing="2" fontWeight="700">BAY OF BENGAL</text>

                  {/* Candidate Route B (Alternative - cyan dashed) */}
                  <path
                    d="M 95 35 C 80 80, 100 160, 148 190 C 190 205, 260 185, 325 185"
                    stroke="#15c7c4"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />

                  {/* Candidate Route A (Recommended - glowing emerald) */}
                  <path
                    d="M 95 35 C 105 90, 125 145, 140 172 C 165 185, 230 170, 325 185"
                    stroke="url(#mapRouteGrad)"
                    strokeWidth="2.8"
                  />

                  {/* Mumbai Port */}
                  <circle cx="95" cy="35" r="4.5" fill="#08b887" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="103" y="38" fill="#10212d" fontSize="9.5" fontWeight="700">Mumbai</text>

                  {/* Mid Waypoint */}
                  <circle cx="140" cy="172" r="3" fill="#15c7c4" stroke="#ffffff" strokeWidth="1" />

                  {/* Singapore Port */}
                  <circle cx="325" cy="185" r="4.5" fill="#08b887" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="274" y="198" fill="#10212d" fontSize="9.5" fontWeight="700">Singapore</text>
                </svg>
              </div>

              {/* Right: Route Comparison & Fuel Selector */}
              <div className="gfq-preview-sidebar-box">
                {/* Route A Card */}
                <div className="gfq-preview-route-card active">
                  <div className="gfq-rc-top">
                    <span className="gfq-rc-badge green">Route A • Recommended</span>
                    <ShieldCheck size={14} className="gfq-rc-check" />
                  </div>
                  <div className="gfq-rc-numbers">
                    <strong>9,240 km</strong>
                    <span>14.2 knots</span>
                  </div>
                  <small className="gfq-rc-note">Lower environmental penalty · QPSO pick</small>
                </div>

                {/* Route B Card */}
                <div className="gfq-preview-route-card">
                  <div className="gfq-rc-top">
                    <span className="gfq-rc-badge muted">Route B • Alternative</span>
                  </div>
                  <div className="gfq-rc-numbers">
                    <strong>8,980 km</strong>
                    <span>14.8 knots</span>
                  </div>
                  <small className="gfq-rc-note">Slightly shorter · +6.2% wave exposure</small>
                </div>

                {/* Fuel Selector Pills */}
                <div className="gfq-preview-fuel-toggles">
                  <span className="gfq-fuel-toggle-label">Compare Fuel:</span>
                  <div className="gfq-fuel-pills-row">
                    {['HFO', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'].map((fuel) => (
                      <button
                        key={fuel}
                        type="button"
                        className={`gfq-fuel-pill-btn ${activeFuel === fuel ? 'active' : ''}`}
                        onClick={() => setActiveFuel(fuel)}
                      >
                        {fuel === 'Hydrogen' ? 'H₂' : fuel === 'Ammonia' ? 'NH₃' : fuel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
