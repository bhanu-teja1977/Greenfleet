import React from 'react';
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react';

export default function PlatformIntroSection() {
  const handleScrollToCapabilities = (e) => {
    e.preventDefault();
    const el = document.getElementById('capabilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="gfq-section gfq-platform-section" id="platform">
      <div className="gfq-shell gfq-platform-grid">
        {/* Left Column */}
        <div className="gfq-platform-copy">
          <div className="gfq-eyebrow">
            <span className="gfq-eyebrow-line" aria-hidden="true" />
            <span className="gfq-eyebrow-text">THE GREENFLEET-Q PLATFORM</span>
          </div>

          <h2 className="gfq-section-headline">
            One platform for smarter maritime decisions.
          </h2>

          <p className="gfq-section-desc">
            Combine AI, optimization, and real-world marine data to plan safer, cleaner, and more cost-efficient voyages across your entire fleet.
          </p>

          <a
            href="#capabilities"
            onClick={handleScrollToCapabilities}
            className="gfq-inline-link"
          >
            <span>Explore Capabilities</span>
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Right Column: Visual Frame */}
        <div className="gfq-platform-visual-col">
          <div className="gfq-platform-visual-frame">
            <img
              src="/assets/intro-vessel.jpg"
              alt="Vertical aerial view of cargo ship cruising in ocean waters"
              className="gfq-platform-img"
              loading="lazy"
            />
            <div className="gfq-platform-overlay" />

            {/* Overlaid Route Summary Card */}
            <div className="gfq-platform-badge-card">
              <div className="gfq-route-chip">
                <MapPin size={13} className="gfq-chip-pin" />
                <span>Mumbai → Singapore</span>
              </div>

              <ul className="gfq-platform-checklist">
                <li>
                  <CheckCircle2 size={15} className="gfq-check-icon" />
                  <span>2 route alternatives</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="gfq-check-icon" />
                  <span>Live marine & weather data</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="gfq-check-icon" />
                  <span>Fuel comparison (5 fuels)</span>
                </li>
                <li>
                  <CheckCircle2 size={15} className="gfq-check-icon" />
                  <span>AI + QPSO optimization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
