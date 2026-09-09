import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings2, Database, Cpu, Cloud, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function StatusRow({ label, ok }) {
  return (
    <div className="settings-status-row">
      <span>{label}</span>
      <span className={`status-chip ${ok ? 'ok' : 'err'}`}>
        {ok ? <><Check size={12} /> Online</> : <><X size={12} /> Offline</>}
      </span>
    </div>
  );
}

export default function Settings() {
  const { systemStatus } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page-settings">
      {/* General */}
      <div className="card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">PREFERENCES</div>
            <h2><Settings2 size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />General Settings</h2>
          </div>
        </div>
        <div className="settings-grid">
          <div className="settings-field">
            <label>Theme</label>
            <button type="button" className="settings-theme-button" onClick={toggleTheme}>
              {theme === 'dark' ? 'Dark (Maritime)' : 'Light (Maritime)'}
            </button>
            <small>Saved automatically for this browser</small>
          </div>
          <div className="settings-field">
            <label>Distance Units</label>
            <select disabled>
              <option>Kilometres (km)</option>
              <option>Nautical Miles (nm)</option>
            </select>
          </div>
          <div className="settings-field">
            <label>Speed Units</label>
            <select disabled>
              <option>Knots (kn)</option>
              <option>km/h</option>
            </select>
          </div>
          <div className="settings-field">
            <label>Currency</label>
            <select disabled>
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
            </select>
          </div>
        </div>
        <div className="settings-note">Theme preference is active. Other settings are currently read-only.</div>
      </div>

      {/* Optimisation */}
      <div className="card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">OPTIMISATION</div>
            <h2>Default Optimisation Parameters</h2>
          </div>
        </div>
        <div className="settings-grid">
          <div className="settings-field">
            <label>Default Method</label>
            <select disabled><option>QPSO (Quantum-inspired PSO)</option><option>Speed Grid Search</option></select>
          </div>
          <div className="settings-field">
            <label>Fuel Cost Weight</label>
            <input type="range" min={0} max={1} step={0.1} defaultValue={0.4} disabled />
            <small>0.40</small>
          </div>
          <div className="settings-field">
            <label>CO₂ Weight</label>
            <input type="range" min={0} max={1} step={0.1} defaultValue={0.3} disabled />
            <small>0.30</small>
          </div>
          <div className="settings-field">
            <label>Schedule Weight</label>
            <input type="range" min={0} max={1} step={0.1} defaultValue={0.2} disabled />
            <small>0.20</small>
          </div>
          <div className="settings-field">
            <label>Environmental Risk Weight</label>
            <input type="range" min={0} max={1} step={0.1} defaultValue={0.1} disabled />
            <small>0.10</small>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SYSTEM</div>
            <h2>System Status</h2>
          </div>
        </div>
        <div className="settings-status-grid">
          <div className="settings-status-section">
            <div className="settings-status-title"><Database size={14} /> Backend</div>
            <StatusRow label="API Server (port 8000)" ok={systemStatus.backend} />
            <StatusRow label="Port Database (332 ports)" ok={systemStatus.ml} />
          </div>
          <div className="settings-status-section">
            <div className="settings-status-title"><Cpu size={14} /> ML Model</div>
            <StatusRow label="Random Forest Regressor" ok={systemStatus.ml} />
            <StatusRow label="QPSO Optimiser" ok={systemStatus.backend} />
          </div>
          <div className="settings-status-section">
            <div className="settings-status-title"><Cloud size={14} /> Data Sources</div>
            <StatusRow label="Open-Meteo Marine API" ok={systemStatus.weather} />
            <StatusRow label="Open-Meteo Weather API" ok={systemStatus.weather} />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <div className="section-heading"><div><h2>About GreenFleet</h2></div></div>
        <div className="about-grid">
          <div><span>Version</span><b>3.0.0</b></div>
          <div><span>Project</span><b>SIH26138 · Clean &amp; Green Technology</b></div>
          <div><span>Frontend</span><b>React 19 + Vite 7 + React Router 6</b></div>
          <div><span>Backend</span><b>FastAPI + Python 3.12</b></div>
          <div><span>ML Model</span><b>scikit-learn Random Forest Regressor</b></div>
          <div><span>Optimiser</span><b>Quantum-inspired PSO (QPSO)</b></div>
          <div><span>Map</span><b>React-Leaflet + OpenStreetMap</b></div>
          <div><span>Charts</span><b>Recharts</b></div>
          <div><span>Weather</span><b>Open-Meteo (Marine + Weather API)</b></div>
          <div><span>Icons</span><b>Lucide React</b></div>
        </div>
        <div className="settings-note">
          Decision-support prototype. Not certified maritime routes or navigation guidance.
        </div>
      </div>
    </div>
  );
}
