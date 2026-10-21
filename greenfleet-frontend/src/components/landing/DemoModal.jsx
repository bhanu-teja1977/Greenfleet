import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function DemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="gfq-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="gfq-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="gfq-modal-close"
          onClick={onClose}
          aria-label="Close demo modal"
        >
          <X size={18} />
        </button>

        <div className="gfq-modal-header">
          <div className="gfq-eyebrow">
            <span className="gfq-eyebrow-line" />
            <span className="gfq-eyebrow-text">INTERACTIVE PLATFORM TOUR</span>
          </div>
          <h2 className="gfq-modal-title">GreenFleet-Q Decision Support</h2>
          <p className="gfq-modal-desc">
            See how GreenFleet-Q evaluates routes, weather exposure, alternative fuels, and fleet allocation for the Mumbai → Singapore maritime corridor.
          </p>
        </div>

        <div className="gfq-modal-video-card">
          <div className="gfq-modal-preview-inner">
            <div className="gfq-demo-points">
              <div className="gfq-demo-point">
                <CheckCircle2 size={16} className="emerald" />
                <span><strong>Physics-informed ML:</strong> Random Forest trained on hydrodynamic resistance & bunker fuel kinetics.</span>
              </div>
              <div className="gfq-demo-point">
                <CheckCircle2 size={16} className="emerald" />
                <span><strong>Marine Weather Mapping:</strong> Live Open-Meteo waves, currents, wind, and swell penalties along waypoints.</span>
              </div>
              <div className="gfq-demo-point">
                <CheckCircle2 size={16} className="emerald" />
                <span><strong>Quantum-Inspired Optimization:</strong> QPSO algorithm evaluates Pareto frontier for fuel consumption vs delay.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="gfq-modal-actions">
          <button type="button" className="gfq-btn gfq-btn-secondary" onClick={onClose}>
            Back to Overview
          </button>
          <Link to="/dashboard" className="gfq-btn gfq-btn-primary" onClick={onClose}>
            <span>Enter Live Dashboard</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
