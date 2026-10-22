import React from 'react';
import { Leaf, Cloud, Gauge, MapPin } from 'lucide-react';
import ShipAnimation from './ShipAnimation';

export default function HeroRouteVisual() {
  return (
    <div className="gfq-hero-stage" aria-label="Maritime vessel and route intelligence visual">
      {/* Soft atmospheric ocean glow behind the vessel */}
      <div className="gfq-hero-ocean-aura" aria-hidden="true" />
      <div className="gfq-ship-hull-shadow" aria-hidden="true" />

      {/* SVG Arched Trajectory matching reference */}
      <svg
        className="gfq-hero-route-svg"
        viewBox="0 0 700 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="routeArchedGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08b887" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#15c7c4" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#08b887" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#08b887" stopOpacity="0.5" />
          </linearGradient>

          <filter id="routeGlowRestrained" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10212d" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Secondary subtle dashed line */}
        <path
          d="M 50 370 C 190 340, 290 200, 382 170 C 482 140, 572 210, 672 250"
          stroke="#15c7c4"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          strokeOpacity="0.4"
        />

        {/* Primary Recommended Trajectory (gracefully arching above the ship) */}
        <path
          d="M 50 360 C 190 320, 285 190, 382 160 C 482 130, 572 200, 672 240"
          stroke="url(#routeArchedGrad)"
          strokeWidth="2.8"
          strokeDasharray="6 7"
          filter="url(#routeGlowRestrained)"
          className="gfq-svg-route-path"
        />

        {/* Node 1: Origin (Mumbai) */}
        <g transform="translate(50, 360)" className="gfq-marker-origin">
          <circle r="12" fill="#08b887" opacity="0.18" />
          <circle r="4.5" fill="#08b887" stroke="#ffffff" strokeWidth="2.5" />
          <g transform="translate(0, -24)">
            <rect x="-30" y="0" width="60" height="20" rx="6" fill="#ffffff" stroke="#cddde4" strokeWidth="1" filter="url(#badgeShadow)" />
            <text x="0" y="13.5" textAnchor="middle" fill="#10212d" fontSize="10" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">Mumbai</text>
          </g>
        </g>

        {/* Node 2: Ascending */}
        <g transform="translate(190, 295)">
          <circle r="4" fill="#ffffff" stroke="#08b887" strokeWidth="2" />
        </g>

        {/* Node 3: Apex above vessel */}
        <g transform="translate(382, 160)">
          <circle r="14" stroke="#08b887" strokeWidth="1" opacity="0.3" className="gfq-vessel-ping" />
          <circle r="5" fill="#ffffff" stroke="#08b887" strokeWidth="2.5" />
        </g>

        {/* Node 4: Descending */}
        <g transform="translate(552, 195)">
          <circle r="4" fill="#ffffff" stroke="#08b887" strokeWidth="2" />
        </g>

        {/* Node 5: Destination (Singapore) */}
        <g transform="translate(672, 240)" className="gfq-marker-dest">
          <circle r="12" fill="#08b887" opacity="0.18" />
          <circle r="4.5" fill="#08b887" stroke="#ffffff" strokeWidth="2.5" />
          <g transform="translate(0, -24)">
            <rect x="-35" y="0" width="70" height="20" rx="6" fill="#ffffff" stroke="#cddde4" strokeWidth="1" filter="url(#badgeShadow)" />
            <text x="0" y="13.5" textAnchor="middle" fill="#10212d" fontSize="10" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif">Singapore</text>
          </g>
        </g>
      </svg>

      {/* Lottie Vector Ship Animation Centerpiece */}
      <div className="gfq-hero-ship-wrapper">
        <ShipAnimation className="gfq-hero-lottie-ship" />
      </div>

      {/* 4 Floating Metric Cards precisely framing the vessel */}
      <div className="gfq-metric-card card-fuel-efficiency" tabIndex="0">
        <div className="gfq-card-header">
          <div className="gfq-card-icon emerald-icon">
            <Leaf size={14} />
          </div>
          <span className="gfq-card-title">Fuel efficiency</span>
        </div>
        <div className="gfq-card-body">
          <span className="gfq-card-value">+18.4%</span>
          <div className="gfq-card-spark-bars" aria-hidden="true">
            <span style={{ height: '35%' }} />
            <span style={{ height: '55%' }} />
            <span style={{ height: '75%' }} />
            <span style={{ height: '100%' }} />
          </div>
        </div>
        <span className="gfq-card-sublabel">vs baseline (est.)</span>
      </div>

      <div className="gfq-metric-card card-co2-reduction" tabIndex="0">
        <div className="gfq-card-header">
          <div className="gfq-card-icon cyan-icon">
            <Cloud size={14} />
          </div>
          <span className="gfq-card-title">CO₂ reduction</span>
        </div>
        <div className="gfq-card-body">
          <span className="gfq-card-value">−12.8%</span>
          <div className="gfq-card-spark-line" aria-hidden="true">
            <svg viewBox="0 0 38 16" width="38" height="16">
              <path d="M 0 13 Q 10 2, 20 10 T 38 4" fill="none" stroke="#08b887" strokeWidth="2.2" />
            </svg>
          </div>
        </div>
        <span className="gfq-card-sublabel">operational estimate</span>
      </div>

      <div className="gfq-metric-card card-optimal-speed" tabIndex="0">
        <div className="gfq-card-header">
          <div className="gfq-card-icon emerald-icon">
            <Gauge size={14} />
          </div>
          <span className="gfq-card-title">Optimal speed</span>
        </div>
        <div className="gfq-card-body">
          <span className="gfq-card-value">
            14.2 <span className="gfq-unit">knots</span>
          </span>
          <div className="gfq-card-spark-curve" aria-hidden="true">
            <svg viewBox="0 0 35 14" width="35" height="14">
              <path d="M 0 12 C 12 12, 18 3, 35 2" fill="none" stroke="#08b887" strokeWidth="2.2" />
            </svg>
          </div>
        </div>
        <span className="gfq-card-sublabel">QPSO selected</span>
      </div>

      <div className="gfq-metric-card card-route-candidates" tabIndex="0">
        <div className="gfq-card-header">
          <div className="gfq-card-icon emerald-icon">
            <MapPin size={14} />
          </div>
          <span className="gfq-card-title">Route candidates</span>
        </div>
        <div className="gfq-card-body">
          <span className="gfq-card-value">2 evaluated</span>
          <div className="gfq-card-spark-bars" aria-hidden="true">
            <span style={{ height: '45%', background: '#08b887' }} />
            <span style={{ height: '75%', background: '#08b887' }} />
            <span style={{ height: '100%', background: '#08b887' }} />
          </div>
        </div>
        <span className="gfq-card-sublabel">cleaner + faster routes</span>
      </div>
    </div>
  );
}
