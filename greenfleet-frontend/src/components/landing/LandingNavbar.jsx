import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Ship } from 'lucide-react';

export default function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`gfq-nav-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="gfq-nav-container">
        {/* Brand */}
        <Link to="/" className="gfq-brand" aria-label="GreenFleet-Q Homepage">
          <div className="gfq-monogram-box">
            <span className="gfq-monogram-text">GF</span>
          </div>
          <div className="gfq-brand-col">
            <span className="gfq-brand-name">
              GreenFleet<span className="gfq-brand-suffix">-Q</span>
            </span>
            <span className="gfq-brand-tagline">Maritime Decision Support</span>
          </div>
        </Link>

        {/* Desktop Links (Centered, SaaS enterprise feel) */}
        <nav className="gfq-nav-links" aria-label="Main Navigation">
          <a href="#platform" onClick={(e) => handleNavClick(e, 'platform')}>Product</a>
          <a href="#capabilities" onClick={(e) => handleNavClick(e, 'capabilities')}>Capabilities</a>
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')}>How It Works</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        </nav>

        {/* Right CTA */}
        <div className="gfq-nav-actions">
          <Link to="/dashboard" className="gfq-nav-cta" aria-label="Launch GreenFleet-Q Dashboard">
            <span>Launch Dashboard</span>
            <ArrowUpRight size={15} className="gfq-cta-arrow" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="gfq-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
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
