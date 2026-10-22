import React from 'react';
import { ArrowRight, Play, BarChart3, GitFork, Waves } from 'lucide-react';
import HeroRouteVisual from './HeroRouteVisual';

export default function HeroSection({ onWatchDemo }) {
  const handleExploreClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('capabilities');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollCue = (e) => {
    e.preventDefault();
    const target = document.getElementById('platform');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="gfq-hero-section" id="hero">
      <div className="gfq-shell gfq-hero-grid">
        {/* Left Column: Copy & Actions */}
        <div className="gfq-hero-copy">
          {/* Eyebrow */}
          <div className="gfq-eyebrow">
            <span className="gfq-eyebrow-line" aria-hidden="true" />
            <span className="gfq-eyebrow-text">AI + QUANTUM-INSPIRED MARITIME DECISION SUPPORT</span>
          </div>

          {/* Headline matching reference: "Plan smarter voyages. Sail greener." */}
          <h1 className="gfq-hero-headline">
            Plan smarter<br />
            voyages.<br />
            <span className="gfq-emerald-text">Sail greener.</span>
          </h1>

          {/* Supporting Paragraph */}
          <p className="gfq-hero-lede">
            Predict fuel consumption, compare cleaner fuels, optimize routes and speed, and allocate your fleet with AI-powered intelligence.
          </p>

          {/* CTA Buttons */}
          <div className="gfq-hero-actions">
            <a
              href="#capabilities"
              onClick={handleExploreClick}
              className="gfq-btn gfq-btn-primary gfq-hero-btn-primary"
            >
              <span>Explore GreenFleet-Q</span>
              <ArrowRight size={16} />
            </a>

            <button
              type="button"
              onClick={onWatchDemo}
              className="gfq-btn gfq-btn-secondary gfq-hero-btn-demo"
            >
              <Play size={13} className="gfq-play-icon" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* 3 Platform Capability Indicators matching reference */}
          <div className="gfq-hero-pillars">
            <div className="gfq-pillar-item">
              <BarChart3 size={18} className="gfq-pillar-icon" />
              <div className="gfq-pillar-text">
                <span className="gfq-pillar-label">Fuel-aware</span>
                <span className="gfq-pillar-sub">ML predictions</span>
              </div>
            </div>

            <div className="gfq-pillar-divider" aria-hidden="true" />

            <div className="gfq-pillar-item">
              <GitFork size={18} className="gfq-pillar-icon" />
              <div className="gfq-pillar-text">
                <span className="gfq-pillar-label">QPSO speed +</span>
                <span className="gfq-pillar-sub">fuel optimization</span>
              </div>
            </div>

            <div className="gfq-pillar-divider" aria-hidden="true" />

            <div className="gfq-pillar-item">
              <Waves size={18} className="gfq-pillar-icon" />
              <div className="gfq-pillar-text">
                <span className="gfq-pillar-label">Marine &</span>
                <span className="gfq-pillar-sub">weather context</span>
              </div>
            </div>
          </div>

          {/* Scroll Cue matching reference */}
          <a href="#platform" onClick={handleScrollCue} className="gfq-scroll-cue">
            <div className="gfq-mouse-icon">
              <span className="gfq-mouse-wheel" />
            </div>
            <span>Scroll to explore</span>
          </a>
        </div>

        {/* Right Column: Integrated Maritime Visual Stage */}
        <div className="gfq-hero-visual-col">
          <HeroRouteVisual />
        </div>
      </div>
    </section>
  );
}
