import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Ship, Droplets, Route, Zap,
  FlaskConical, Boxes, BarChart3, Settings, Menu, X,
  Activity, Cpu, Cloud,
  Moon, Sun,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

const NAV = [
  { to: '/dashboard',     label: 'Overview',           icon: LayoutDashboard },
  { to: '/voyage',        label: 'Voyage Planning',    icon: Ship            },
  { to: '/fuel',          label: 'Fuel Comparison',    icon: Droplets        },
  { to: '/routes',        label: 'Route Analysis',     icon: Route           },
  { to: '/optimization',  label: 'Optimization',       icon: Zap             },
  { to: '/scenarios',     label: 'Scenario Simulation',icon: FlaskConical    },
  { to: '/fleet',         label: 'Fleet Allocation',   icon: Boxes           },
  { to: '/ml',            label: 'ML Prediction',      icon: BarChart3       },
  { to: '/settings',      label: 'Settings',           icon: Settings        },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { systemStatus } = useApp();
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const content = (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span className="sidebar-logo-gf">GF</span>
        </div>
        <div>
          <div className="sidebar-brand-name">GreenFleet</div>
          <div className="sidebar-brand-sub">Maritime Decision Support</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(({ to, label, icon: Icon }) => (
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

      <div className="sidebar-appearance">
        <div className="sidebar-appearance-title">Appearance</div>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${nextTheme} mode`}
          title={`Switch to ${nextTheme} mode`}
        >
          <span className={theme === 'dark' ? 'theme-choice active' : 'theme-choice'}><Moon size={13} /> Dark</span>
          <span className={`theme-switch ${theme === 'light' ? 'light' : ''}`} aria-hidden="true"><i /></span>
          <span className={theme === 'light' ? 'theme-choice active' : 'theme-choice'}><Sun size={13} /> Light</span>
        </button>
      </div>

      {/* System status */}
      <div className="sidebar-status">
        <div className="sidebar-status-title">System Status</div>
        <div className={`sidebar-status-row ${systemStatus.backend ? 'ok' : 'err'}`}>
          <Activity size={12} /> Backend {systemStatus.backend ? 'Connected' : 'Offline'}
        </div>
        <div className={`sidebar-status-row ${systemStatus.ml ? 'ok' : 'err'}`}>
          <Cpu size={12} /> ML Model {systemStatus.ml ? 'Ready' : 'Offline'}
        </div>
        <div className={`sidebar-status-row ${systemStatus.weather ? 'ok' : 'err'}`}>
          <Cloud size={12} /> Weather Data {systemStatus.weather ? 'Available' : 'Unavailable'}
        </div>
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
