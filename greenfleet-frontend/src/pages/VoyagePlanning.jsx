import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VoyageForm from '../components/VoyageForm';
import {
  MapPin, Package, Clock, Ship, CheckCircle2, ArrowRight,
} from 'lucide-react';

const fmt = n => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function VoyagePlanning() {
  const navigate = useNavigate();
  const { runOptimize, loading, error, result, selected, form } = useApp();

  const handleSubmit = async (formData) => {
    await runOptimize(formData);
  };

  const o  = selected?.optimized || result?.optimized;
  const vp = result?.voyage_parameters;

  return (
    <div className="page-voyage">
      {/* Form card */}
      <div className="card voyage-form-card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">VOYAGE CONFIGURATION</div>
            <h2>Plan Your Voyage</h2>
            <p className="section-copy">
              Set origin, destination, cargo, vessel type, and schedule.
              GreenFleet will run ML fuel prediction + QPSO optimisation.
            </p>
          </div>
        </div>
        <VoyageForm onSubmit={handleSubmit} loading={loading} initialValues={form} />
        {error && <div className="error" style={{ marginTop: 12 }}>{error}</div>}
      </div>

      {/* Voyage summary after run */}
      {result && (
        <div className="card voyage-summary-card">
          <div className="section-heading">
            <div>
              <div className="eyebrow">VOYAGE ANALYSIS COMPLETE</div>
              <h2>
                <CheckCircle2 size={20} style={{ color: '#00c896', marginRight: 8 }} />
                {result.origin?.port_name} → {result.destination?.port_name}
              </h2>
            </div>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>
              View Overview <ArrowRight size={14} />
            </button>
          </div>

          <div className="voyage-summary-grid">
            <div className="vs-block">
              <MapPin size={16} />
              <span>Distance</span>
              <b>{result.route?.distance_km?.toLocaleString()} km</b>
            </div>
            <div className="vs-block">
              <Clock size={16} />
              <span>ETA</span>
              <b>{o?.eta_hours} h</b>
            </div>
            <div className="vs-block">
              <Ship size={16} />
              <span>Vessel</span>
              <b>{o?.vessel_type}</b>
            </div>
            <div className="vs-block">
              <Package size={16} />
              <span>Cargo</span>
              <b>{result.route?.cargo_tonnes?.toLocaleString()} t</b>
            </div>
            {vp && (
              <div className="vs-block">
                <Clock size={16} />
                <span>Window</span>
                <b>{vp.duration_formatted}</b>
              </div>
            )}
            <div className="vs-block">
              <span>Marine data</span>
              <b>{result.marine_source}</b>
            </div>
            <div className="vs-block">
              <span>Weather data</span>
              <b>{result.weather_source}</b>
            </div>
            <div className="vs-block">
              <span>Env Score</span>
              <b>{result.avg_environmental_score}/100</b>
            </div>
          </div>

          <div className="voyage-page-nav">
            {[
              { label: '⛽ Fuel Comparison', to: '/fuel' },
              { label: '🗺 Route Analysis',  to: '/routes' },
              { label: '⚡ Optimization',    to: '/optimization' },
            ].map(({ label, to }) => (
              <button key={to} className="btn-outline" onClick={() => navigate(to)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
