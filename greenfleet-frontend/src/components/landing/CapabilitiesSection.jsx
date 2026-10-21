import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Route, Cpu, Ship, ArrowUpRight } from 'lucide-react';

const capabilitiesData = [
  {
    id: 'fuel',
    title: 'Fuel Intelligence',
    desc: 'Predict fuel consumption and compare HFO, LNG, methanol, hydrogen, and ammonia under consistent voyage conditions.',
    icon: Leaf,
    colorClass: 'emerald-theme',
    link: '/fuel',
  },
  {
    id: 'routes',
    title: 'Marine Routing',
    desc: 'Evaluate route alternatives using marine conditions, weather forecasts, and environmental penalties.',
    icon: Route,
    colorClass: 'cyan-theme',
    link: '/routes',
  },
  {
    id: 'optimization',
    title: 'AI Optimization',
    desc: 'Use quantum-inspired optimization to balance speed, fuel choice, cost, emissions, and schedule.',
    icon: Cpu,
    colorClass: 'emerald-theme',
    link: '/optimization',
  },
  {
    id: 'fleet',
    title: 'Fleet Allocation',
    desc: 'Allocate cargo across prototype vessel capacities to evaluate utilization and operational efficiency.',
    icon: Ship,
    colorClass: 'cyan-theme',
    link: '/fleet',
  },
];

export default function CapabilitiesSection() {
  return (
    <section className="gfq-section gfq-capabilities-section" id="capabilities">
      <div className="gfq-shell">
        {/* Section Header */}
        <div className="gfq-section-header-split">
          <div className="gfq-header-left">
            <div className="gfq-eyebrow">
              <span className="gfq-eyebrow-line" aria-hidden="true" />
              <span className="gfq-eyebrow-text">INTELLIGENCE THAT MOVES WITH YOUR FLEET</span>
            </div>
            <h2 className="gfq-section-headline">
              End-to-end capabilities for a greener tomorrow.
            </h2>
          </div>
          <div className="gfq-header-right">
            <p className="gfq-section-desc">
              From fuel prediction to fleet allocation, GreenFleet-Q brings everything you need to make data-driven, sustainable maritime decisions.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="gfq-capabilities-grid">
          {capabilitiesData.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="gfq-cap-card">
                <div className={`gfq-cap-icon-box ${item.colorClass}`}>
                  <Icon size={22} />
                </div>
                <h3 className="gfq-cap-title">{item.title}</h3>
                <p className="gfq-cap-desc">{item.desc}</p>
                <div className="gfq-cap-footer">
                  <Link
                    to={item.link}
                    className="gfq-cap-arrow-btn"
                    aria-label={`Explore ${item.title}`}
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
