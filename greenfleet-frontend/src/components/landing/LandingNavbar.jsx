import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="gfq-nav-wrapper">
      <div className="gfq-nav-container">
        {/* Brand */}
        <Link to="/" className="gfq-brand" aria-label="GreenFleet-Q Home">
          <span className="gfq-monogram">GF</span>
          <span className="gfq-brand-name">
            GreenFleet<span className="gfq-brand-suffix">-Q</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="gfq-nav-links" aria-label="Main Navigation">
          <a href="#platform" onClick={(e) => handleNavClick(e, 'platform')}>Product</a>
          <a href="#capabilities" onClick={(e) => handleNavClick(e, 'capabilities')}>Capabilities</a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        </nav>

        {/* Right Actions */}
        <div className="gfq-nav-actions">
          <Link to="/dashboard" className="gfq-nav-cta">
            <span>Launch Dashboard</span>
            <ArrowUpRight size={15} className="gfq-cta-arrow" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="gfq-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="gfq-mobile-menu">
          <div className="gfq-mobile-links">
            <a href="#platform" onClick={(e) => handleNavClick(e, 'platform')}>Product</a>
            <a href="#capabilities" onClick={(e) => handleNavClick(e, 'capabilities')}>Capabilities</a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
          </div>
          <div className="gfq-mobile-actions">
            <Link to="/dashboard" className="gfq-mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              <span>Launch Dashboard</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
