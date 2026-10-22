import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function LandingFooter() {
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="gfq-footer">
      <div className="gfq-shell gfq-footer-container">
        {/* Left Column */}
        <div className="gfq-footer-left">
          <Link to="/" className="gfq-brand" aria-label="GreenFleet-Q Home">
            <span className="gfq-monogram">GF</span>
            <span className="gfq-brand-name">
              GreenFleet<span className="gfq-brand-suffix">-Q</span>
            </span>
          </Link>
          <p className="gfq-footer-tagline">
            AI + Quantum-Inspired Maritime Decision Support
          </p>
        </div>

        {/* Center / Right Column: Nav Links */}
        <div className="gfq-footer-right">
          <nav className="gfq-footer-nav" aria-label="Footer Navigation">
            <a href="#platform" onClick={(e) => handleNavClick(e, 'platform')}>Product</a>
            <a href="#capabilities" onClick={(e) => handleNavClick(e, 'capabilities')}>Capabilities</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <div className="gfq-footer-socials">
            <a
              href="https://github.com/siddharthg-7/Green_Fleet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="gfq-social-icon"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open-Meteo Weather API"
              className="gfq-social-icon"
            >
              <Globe size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="gfq-shell gfq-footer-bottom">
        <p>© 2026 GreenFleet-Q. All rights reserved. Maritime decision-support prototype.</p>
      </div>
    </footer>
  );
}
