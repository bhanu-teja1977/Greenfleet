import React from 'react';
import { Route, Gauge, TrendingUp, Cloud } from 'lucide-react';

export default function ImpactSection() {
  return (
    <section className="gfq-section gfq-impact-section" id="about">
      <div className="gfq-shell">
        {/* Eyebrow */}
        <div className="gfq-eyebrow">
          <span className="gfq-eyebrow-line" aria-hidden="true" />
          <span className="gfq-eyebrow-text">BUILT FOR A CLEANER OCEAN</span>
        </div>

        <div className="gfq-impact-grid">
          {/* Left Feature Card with Ocean Texture */}
          <div className="gfq-impact-hero-card">
            <img
              src="/assets/ocean-texture.jpg"
              alt="Deep ocean water texture"
              className="gfq-impact-bg-img"
              loading="lazy"
            />
            <div className="gfq-impact-hero-overlay" />
            <div className="gfq-impact-hero-content">
              <span className="gfq-impact-huge-num">5</span>
              <h3 className="gfq-impact-hero-title">cleaner fuel options</h3>
              <p className="gfq-impact-hero-fuels">
                HFO • LNG • Methanol • Hydrogen • Ammonia
              </p>
            </div>
          </div>

          {/* Right 2x2 Metric Grid */}
          <div className="gfq-impact-tiles-grid">
            {/* Tile 1: Route Alternatives */}
            <div className="gfq-impact-tile">
              <div className="gfq-impact-tile-top">
                <span className="gfq-impact-tile-num">2</span>
                <Route size={20} className="gfq-tile-icon cyan" />
              </div>
              <span className="gfq-impact-tile-label">route alternatives</span>
              <small className="gfq-impact-tile-sub">evaluated per voyage corridor</small>
            </div>

            {/* Tile 2: Optimal Speed */}
            <div className="gfq-impact-tile">
              <div className="gfq-impact-tile-top">
                <span className="gfq-impact-tile-num">14.2</span>
                <Gauge size={20} className="gfq-tile-icon emerald" />
              </div>
              <span className="gfq-impact-tile-label">knots: optimal speed (example)</span>
              <small className="gfq-impact-tile-sub">QPSO algorithmic selection</small>
            </div>

            {/* Tile 3: Fuel Efficiency */}
            <div className="gfq-impact-tile">
              <div className="gfq-impact-tile-top">
                <span className="gfq-impact-tile-num">18.4%</span>
                <TrendingUp size={20} className="gfq-tile-icon emerald" />
              </div>
              <span className="gfq-impact-tile-label">fuel efficiency improvement</span>
              <small className="gfq-impact-tile-sub">vs baseline speed/fuel profile</small>
            </div>

            {/* Tile 4: CO2 Reduction */}
            <div className="gfq-impact-tile">
              <div className="gfq-impact-tile-top">
                <span className="gfq-impact-tile-num">12.8%</span>
                <Cloud size={20} className="gfq-tile-icon cyan" />
              </div>
              <span className="gfq-impact-tile-label">operational CO₂ reduction</span>
              <small className="gfq-impact-tile-sub">cleaner alternative comparison</small>
            </div>
          </div>
        </div>

        {/* Prototype & Validation Transparency Notice */}
        <p className="gfq-impact-footnote">
          *Performance values and percentages shown are illustrative model estimates based on simulated baseline comparisons. The machine-learning fuel model was trained on synthetic, physics-grounded maritime data.
        </p>
      </div>
    </section>
  );
}
