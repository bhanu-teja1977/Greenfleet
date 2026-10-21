import React from 'react';
import { Leaf, Cloud, Gauge, MapPin } from 'lucide-react';

export default function HeroRouteVisual() {
  return (
    <div className="gfq-hero-stage" aria-label="Maritime vessel and route intelligence visual">
      {/* Container Ship Image & Ocean Backdrop */}
      <div className="gfq-hero-stage-bg" aria-hidden="true">
        <img
          src="/assets/hero-vessel-light.jpg"
          alt=""
          className="gfq-stage-ship-img"
          loading="eager"
        />
        {/* Soft edge gradient masks that seamlessly blend into the white page */}
        <div className="gfq-stage-mask-left" />
        <div className="gfq-stage-mask-top" />
        <div className="gfq-stage-mask-bottom" />
        <div className="gfq-stage-world-map" />
      </div>

      {/* Glowing SVG Route Overlay spanning the visual stage */}
      <svg
        className="gfq-hero-route-svg"
        viewBox="0 0 720 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="routeGradientLight" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#08b887" stopOpacity="0.3" />
            <stop offset="25%" stopColor="#15c7c4" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#08b887" stopOpacity="1" />
            <stop offset="100%" stopColor="#08b887" stopOpacity="0.9" />
          </linearGradient>

          <filter id="routeGlowLight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Secondary Evaluated Trajectory (subtle dashed cyan curve) */}
        <path
          d="M 65 445 C 160 430, 270 375, 380 295 C 480 220, 580 135, 650 55"
          stroke="#15c7c4"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          strokeOpacity="0.45"
        />

        {/* Primary Recommended Route (glowing emerald/cyan curve) */}
        <path
          d="M 65 435 C 160 415, 280 355, 385 275 C 480 200, 580 120, 655 45"
          stroke="url(#routeGradientLight)"
          strokeWidth="3.2"
          filter="url(#routeGlowLight)"
          className="gfq-svg-route-path"
        />

        {/* Node 1: Mumbai Port Origin Node */}
        <g transform="translate(65, 435)">
          <circle r="4.5" fill="#08b887" stroke="#ffffff" strokeWidth="2" />
          <circle r="9" stroke="#08b887" strokeWidth="1.2" opacity="0.6" className="gfq-radar-pulse" />
        </g>

        {/* Node 2: Waypoint before vessel */}
        <g transform="translate(195, 400)">
          <circle r="4" fill="#ffffff" stroke="#08b887" strokeWidth="2.5" />
        </g>

        {/* Node 3: Active waypoint near vessel hull/wake */}
        <g transform="translate(330, 320)">
          <circle r="16" stroke="#08b887" strokeWidth="1" opacity="0.35" className="gfq-vessel-ping" />
          <circle r="5" fill="#ffffff" stroke="#08b887" strokeWidth="2.5" />
        </g>

        {/* Node 4: Wake traverse waypoint */}
        <g transform="translate(450, 220)">
          <circle r="4" fill="#ffffff" stroke="#08b887" strokeWidth="2" />
        </g>

        {/* Node 5: Open ocean waypoint */}
        <g transform="translate(555, 130)">
          <circle r="4" fill="#ffffff" stroke="#08b887" strokeWidth="2" />
        </g>

        {/* Node 6: Singapore Destination Node */}
        <g transform="translate(655, 45)">
          <circle r="5" fill="#08b887" stroke="#ffffff" strokeWidth="2" />
          <circle r="10" stroke="#08b887" strokeWidth="1.2" opacity="0.7" className="gfq-radar-pulse" />
        </g>
      </svg>

      {/* Origin Marker Badge: MUMBAI */}
      <div className="gfq-map-port-badge port-mumbai">
        <MapPin size={12} className="gfq-port-pin" />
        <span>MUMBAI</span>
      </div>

      {/* Destination Marker Badge: SINGAPORE */}
      <div className="gfq-map-port-badge port-singapore">
        <MapPin size={12} className="gfq-port-pin" />
        <span>SINGAPORE</span>
      </div>

      {/* 4 Floating Glassmorphic White Metric Cards */}
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
