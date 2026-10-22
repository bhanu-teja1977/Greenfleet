import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Ship, Droplets, Route, Zap,
  FlaskConical, Boxes, BarChart3, Settings, Menu, X,
  Activity, Cpu, Cloud, LogOut, Sparkles, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_MAIN = [
  { to: '/dashboard',     label: 'Overview',           icon: LayoutDashboard },
  { to: '/voyage',        label: 'Voyage Planning',    icon: Ship            },
  { to: '/fuel',          label: 'Fuel Comparison',    icon: Droplets        },
  { to: '/routes',        label: 'Route Analysis',     icon: Route           },
];

const NAV_ANALYTICS = [
  { to: '/optimization',  label: 'QPSO Optimization',  icon: Zap             },
  { to: '/scenarios',     label: 'Scenario Simulation',icon: FlaskConical    },
  { to: '/fleet',         label: 'Fleet Allocation',   icon: Boxes           },
  { to: '/ml',            label: 'ML Model Insights',  icon: BarChart3       },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { systemStatus, resetSession } = useApp();

  const handleLogout = () => {
    resetSession();
    navigate('/');
  };

  const content = (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="sidebar-logo-gf">GF</span>
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">
            GreenFleet<span className="sidebar-brand-q">-Q</span>
          </div>
          <div className="sidebar-brand-sub">Maritime Decision Support</div>
        </div>
      </div>

      {/* Main Nav Section */}
      <div className="sidebar-scroll-body">
        <div className="sidebar-group-title">MAIN</div>
        <nav className="sidebar-nav">
          {NAV_MAIN.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} className="sidebar-link-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-group-title" style={{ marginTop: '16px' }}>INTELLIGENCE &amp; OPTIMIZATION</div>
        <nav className="sidebar-nav">
          {NAV_ANALYTICS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} className="sidebar-link-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Skillset/AETHER Pro Tier Card */}
        <div className="sidebar-pro-widget">
          <div className="spw-badge">
            <Sparkles size={11} />
            <span>QUANTUM ENGINE</span>
          </div>
          <div className="spw-title">GreenFleet Pro</div>
          <div className="spw-desc">AI route optimization &amp; CII emission tracking active.</div>
          <button className="spw-action" onClick={() => { setOpen(false); navigate('/optimization'); }}>
            <span>Active Tier</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Footer Controls & Logout matching reference images */}
      <div className="sidebar-footer">
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          onClick={() => setOpen(false)}
        >
          <Settings size={17} className="sidebar-link-icon" />
          <span>Settings</span>
        </NavLink>

        {/* System status chips */}
        <div className="sidebar-status-pill-row">
          <span className={`status-micro-dot ${systemStatus.backend ? 'ok' : 'err'}`} title="Backend Status" />
          <span className={`status-micro-dot ${systemStatus.ml ? 'ok' : 'err'}`} title="ML Model" />
          <span className={`status-micro-dot ${systemStatus.weather ? 'ok' : 'err'}`} title="Weather Data" />
          <span className="sidebar-status-label">
            {systemStatus.backend && systemStatus.ml ? 'All Engines Online' : 'Check Diagnostics'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={handleLogout}
          title="Sign out and return to landing page"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Hamburger – mobile only */}
      <button className="sidebar-hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {/* Overlay on mobile */}
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      {content}
    </>
  );
}
