import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Loader2, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PAGE_META = {
  '/dashboard':    { title: 'Overview',            sub: 'Maritime fleet decision-support overview' },
  '/voyage':       { title: 'Voyage Planning',      sub: 'Configure origin, destination, cargo, vessel & schedule' },
  '/fuel':         { title: 'Fuel Comparison',      sub: 'ML-predicted consumption & cost across all fuel types' },
  '/routes':       { title: 'Route Analysis',       sub: 'Candidate route comparison, map & segment breakdown' },
  '/optimization': { title: 'Optimization',         sub: 'QPSO-based fuel + speed + route optimisation results' },
  '/scenarios':    { title: 'Scenario Simulation',  sub: 'Re-run under different operating conditions' },
  '/fleet':        { title: 'Fleet Allocation',     sub: 'Cargo distribution across the vessel fleet' },
  '/ml':           { title: 'ML Prediction',        sub: 'Random Forest fuel-consumption prediction model' },
  '/settings':     { title: 'Settings',             sub: 'System configuration and status' },
};

export default function Header() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { result, loading, form, resetSession } = useApp();
  const meta = PAGE_META[location.pathname] || { title: 'GreenFleet', sub: '' };

  const voyageLabel = result
    ? `${result.origin?.port_name} → ${result.destination?.port_name}`
    : form
    ? 'Voyage configured'
    : 'No voyage set';

  return (
    <header className="top-header">
      <div className="top-header-left">
        <h1 className="top-header-title">{meta.title}</h1>
        <p className="top-header-sub">{meta.sub}</p>
      </div>
      <div className="top-header-right">
        <div className="voyage-pill">
          <span className={`status-dot ${result ? 'green' : 'amber'}`} />
          <span className="voyage-pill-label">{voyageLabel}</span>
        </div>
        <button
          className="btn-run"
          onClick={() => navigate('/voyage')}
          disabled={loading}
        >
          {loading
            ? <><Loader2 size={15} className="spin" /> Running…</>
            : <><Play size={15} /> {result ? 'Re-run' : 'Plan Voyage'}</>
          }
        </button>
        {(result || form) && (
          <button
            className="btn-outline"
            onClick={() => { resetSession(); navigate('/voyage'); }}
            disabled={loading}
          >
            <Plus size={15} /> New Voyage
          </button>
        )}
      </div>
    </header>
  );
}
