import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ClosingCTASection() {
  return (
    <section className="gfq-section gfq-closing-cta-section">
      <div className="gfq-cta-ambient-glow" aria-hidden="true" />
      <div className="gfq-shell gfq-closing-cta-content">
        <h2 className="gfq-cta-headline">
          Make every voyage a<br />
          smarter, greener decision.
        </h2>

        <p className="gfq-cta-subtext">
          Turn voyage data into actionable insights with AI-powered maritime planning.
        </p>

        <div className="gfq-cta-btn-wrap">
          <Link to="/dashboard" className="gfq-btn gfq-btn-primary gfq-btn-xl">
            <span>Launch GreenFleet-Q</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
