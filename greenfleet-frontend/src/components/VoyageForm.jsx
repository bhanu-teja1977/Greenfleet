import React, { useEffect, useState, useMemo } from 'react';
import { searchPorts, getPort } from '../api';

function PortPicker({ label, value, onChange, onSelectPort, exclude }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const t = setTimeout(() => searchPorts(query).then(setOptions).catch(() => setOptions([])), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (value) {
      getPort(value).then(p => {
        setSelected(p);
        if (onSelectPort) onSelectPort(p);
      }).catch(() => setSelected(null));
    }
  }, [value]);

  return (
    <div className="field port-picker">
      <label>{label}</label>
      <input
        value={selected ? `${selected.port_name} — ${selected.country}` : query}
        onChange={e => {
          setSelected(null);
          setQuery(e.target.value);
        }}
        placeholder="Search port name / country / UNLOCODE"
      />
      {!selected && options.length > 0 && (
        <div className="suggestions">
          {options.filter(p => p.port_id !== exclude).slice(0, 8).map(p => (
            <button
              type="button"
              key={p.port_id}
              onClick={() => {
                setSelected(p);
                setQuery('');
                onChange(p.port_id);
                if (onSelectPort) onSelectPort(p);
              }}
            >
              {p.port_name}, {p.country} <span>{p.unlocode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Operational maritime vessel configurations
const VESSEL_SPECS = {
  'Container': { min: 11.0, max: 21.0, nominal: 25000, design: 17.0, label: 'Fast container liner' },
  'Bulk Carrier': { min: 8.5, max: 14.5, nominal: 50000, design: 11.5, label: 'Displacement bulk carrier' },
  'Tanker': { min: 9.0, max: 15.5, nominal: 60000, design: 12.5, label: 'Hydrodynamic crude/product tanker' },
};

const FUEL_SPECS = {
  'HFO': { deltaMin: 0.0, deltaMax: 0.0, desc: 'Heavy Fuel Oil baseline' },
  'LNG': { deltaMin: -0.5, deltaMax: 0.5, desc: 'High energy density, broad throttle dynamic range' },
  'Methanol': { deltaMin: 0.0, deltaMax: -0.8, desc: 'Lower volumetric density, optimized for moderate cruise' },
  'Hydrogen': { deltaMin: 0.5, deltaMax: -1.5, desc: 'Thermal/fuel-cell efficiency curve capped at high rating' },
  'Ammonia': { deltaMin: 0.5, deltaMax: -1.2, desc: 'Conservative combustion envelope' },
};

// Formats a Date object to YYYY-MM-DDTHH:mm for datetime-local input
function toLocalDatetimeString(date) {
  const pad = n => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

// Initialize default dates: tomorrow at 08:00, arrival 9 days 4 hours later (220h standard corridor)
function getDefaultDates() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(8, 0, 0, 0);

  const end = new Date(start.getTime() + 220 * 3600 * 1000);
  return {
    start_date: toLocalDatetimeString(start),
    end_date: toLocalDatetimeString(end),
  };
}

export default function VoyageForm({ onSubmit, loading, initialValues }) {
  const defaults = useMemo(() => getDefaultDates(), []);
  const [f, setF] = useState({
    origin_port_id: 1,
    destination_port_id: 282,
    cargo_tonnes: 20000,
    vessel_type: 'Container',
    fuel_type: 'LNG',
    start_date: defaults.start_date,
    end_date: defaults.end_date,
    ...initialValues,
  });

  const [originPort, setOriginPort] = useState(null);
  const [destPort, setDestPort] = useState(null);

  useEffect(() => {
    if (!initialValues) {
      setF({
        origin_port_id: 1,
        destination_port_id: 282,
        cargo_tonnes: 20000,
        vessel_type: 'Container',
        fuel_type: 'LNG',
        start_date: defaults.start_date,
        end_date: defaults.end_date,
      });
      setOriginPort(null);
      setDestPort(null);
    }
  }, [initialValues, defaults]);

  const upd = e => setF({ ...f, [e.target.name]: e.target.value });

  // Calculate approximate sea distance between selected ports
  const estimatedDistanceKm = useMemo(() => {
    if (!originPort || !destPort) return 4870;
    // Special Mumbai to Singapore demo corridor
    if (
      Math.abs(originPort.latitude - 18.94) < 0.5 &&
      Math.abs(originPort.longitude - 72.84) < 0.5 &&
      Math.abs(destPort.latitude - 1.28) < 0.5 &&
      Math.abs(destPort.longitude - 103.84) < 0.5
    ) {
      return 4870;
    }
    const R = 6371;
    const dLat = ((destPort.latitude - originPort.latitude) * Math.PI) / 180;
    const dLon = ((destPort.longitude - originPort.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((originPort.latitude * Math.PI) / 180) *
        Math.cos((destPort.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const direct = 2 * R * Math.asin(Math.sqrt(a));
    return Math.round(Math.max(direct * 1.25, direct + 150));
  }, [originPort, destPort]);

  // Dynamically compute speed range, transit speed, and schedule duration from all factors
  const specs = useMemo(() => {
    const d1 = new Date(f.start_date);
    const d2 = new Date(f.end_date);
    const diffHours = (d2.getTime() - d1.getTime()) / (1000 * 3600);

    if (isNaN(diffHours) || diffHours <= 0) {
      return {
        error: 'Arrival date & time must be strictly later than departure date & time.',
        diffHours: 0,
      };
    }

    const vSpec = VESSEL_SPECS[f.vessel_type] || VESSEL_SPECS['Container'];
    const fSpec = FUEL_SPECS[f.fuel_type] || FUEL_SPECS['LNG'];
    const distNm = estimatedDistanceKm / 1.852;
    const requiredTransitSpeed = (distNm / Math.max(diffHours, 1)) * 1.10; // includes 10% sea-weather allowance

    // Cargo load displacement adjustment
    const loadFactor = Math.min(1.3, (Number(f.cargo_tonnes) || 20000) / vSpec.nominal);
    const cargoPenalty = loadFactor > 0.7 ? (loadFactor - 0.7) * 1.2 : 0;

    const baseMin = vSpec.min + fSpec.deltaMin;
    const baseMax = vSpec.max + fSpec.deltaMax - cargoPenalty;

    let sMin = baseMin;
    if (requiredTransitSpeed > baseMin) {
      sMin = Math.min(requiredTransitSpeed * 0.95, baseMax - 2.0);
      sMin = Math.max(baseMin, sMin);
    }
    let sMax = Math.max(sMin + 3.0, Math.min(baseMax, requiredTransitSpeed * 1.25 + 1.0));
    sMax = Math.min(sMax, vSpec.max + 1.5);

    sMin = Math.round(sMin * 10) / 10;
    sMax = Math.round(sMax * 10) / 10;
    if (sMax <= sMin + 1.0) sMax = Math.round((sMin + 2.5) * 10) / 10;

    const days = Math.floor(diffHours / 24);
    const remHours = Math.round((diffHours % 24) * 10) / 10;
    const durationFormatted =
      days > 0
        ? `${days}d ${remHours}h (${Math.round(diffHours * 10) / 10} hrs)`
        : `${Math.round(diffHours * 10) / 10} hrs`;

    return {
      diffHours: Math.round(diffHours * 10) / 10,
      durationFormatted,
      distKm: estimatedDistanceKm,
      distNm: Math.round(distNm),
      sMin,
      sMax,
      recommended: Math.round(((sMin + sMax) / 2) * 10) / 10,
      requiredTransitSpeed: Math.round(requiredTransitSpeed * 10) / 10,
      vesselLabel: vSpec.label,
      fuelDesc: fSpec.desc,
      loadPercent: Math.round(loadFactor * 100),
      isTight: requiredTransitSpeed > vSpec.max,
    };
  }, [f.start_date, f.end_date, f.vessel_type, f.fuel_type, f.cargo_tonnes, estimatedDistanceKm]);

  const handleSubmit = e => {
    e.preventDefault();
    if (specs?.error) return;

    onSubmit({
      origin_port_id: +f.origin_port_id,
      destination_port_id: +f.destination_port_id,
      cargo_tonnes: +f.cargo_tonnes,
      vessel_type: f.vessel_type,
      fuel_type: f.fuel_type,
      start_date: f.start_date,
      end_date: f.end_date,
      deadline_hours: specs.diffHours,
      speed_min_knots: specs.sMin,
      speed_max_knots: specs.sMax,
    });
  };

  return (
    <form className="voyage-form" onSubmit={handleSubmit}>
      <PortPicker
        label="Origin"
        value={f.origin_port_id}
        exclude={f.destination_port_id}
        onChange={v => setF({ ...f, origin_port_id: v })}
        onSelectPort={setOriginPort}
      />
      <PortPicker
        label="Destination"
        value={f.destination_port_id}
        exclude={f.origin_port_id}
        onChange={v => setF({ ...f, destination_port_id: v })}
        onSelectPort={setDestPort}
      />
      <div className="field">
        <label>Cargo demand (tonnes)</label>
        <input
          name="cargo_tonnes"
          type="number"
          min="1"
          value={f.cargo_tonnes}
          onChange={upd}
          placeholder="e.g. 20000"
        />
      </div>
      <div className="field">
        <label>Vessel class</label>
        <select name="vessel_type" value={f.vessel_type} onChange={upd}>
          <option>Container</option>
          <option>Bulk Carrier</option>
          <option>Tanker</option>
        </select>
      </div>

      <div className="field">
        <label>Preferred fuel</label>
        <select name="fuel_type" value={f.fuel_type} onChange={upd}>
          {['HFO', 'LNG', 'Methanol', 'Hydrogen', 'Ammonia'].map(x => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Departure Date & Time</label>
        <input
          name="start_date"
          type="datetime-local"
          value={f.start_date}
          onChange={upd}
          required
        />
      </div>
      <div className="field">
        <label>Arrival Deadline Date & Time</label>
        <input
          name="end_date"
          type="datetime-local"
          value={f.end_date}
          onChange={upd}
          required
        />
      </div>
      <div className="field">
        <label>Schedule Window</label>
        <input
          type="text"
          readOnly
          disabled
          value={specs?.error ? 'Invalid schedule' : specs?.durationFormatted || 'Calculating…'}
          style={{ background: '#0a1e28', color: specs?.error ? '#e67373' : '#77d6a3', fontWeight: 600 }}
        />
      </div>

      {/* Dynamic parameters and auto-computed speed range card */}
      <div className="voyage-specs-card">
        <div className="specs-header">
          <div className="specs-tag">⚡ Dynamic Speed & Navigation Parameters (Auto-Computed)</div>
          <span style={{ fontSize: 12, color: '#8ea7b3' }}>
            Estimated Route: <strong>{specs?.distKm?.toLocaleString()} km</strong> ({specs?.distNm?.toLocaleString()} nm)
          </span>
        </div>

        {specs?.error ? (
          <div style={{ color: '#ff7b7b', fontSize: 12, padding: '4px 0' }}>⚠️ {specs.error}</div>
        ) : (
          <>
            <div className="specs-grid">
              <div className="spec-item highlight">
                <label>Dynamic Speed Range</label>
                <b>{specs.sMin} – {specs.sMax} kn</b>
                <small>Recommended Cruise: {specs.recommended} kn</small>
              </div>
              <div className="spec-item">
                <label>Voyage Duration</label>
                <b>{specs.durationFormatted}</b>
                <small>Available transit window</small>
              </div>
              <div className="spec-item">
                <label>Required Transit Speed</label>
                <b>{specs.requiredTransitSpeed} kn</b>
                <small>Includes 10% sea-weather allowance</small>
              </div>
              <div className="spec-item">
                <label>Cargo Load Capacity</label>
                <b>{Number(f.cargo_tonnes).toLocaleString()} t</b>
                <small>{specs.loadPercent}% nominal displacement</small>
              </div>
            </div>

            <div className="specs-factors">
              <div>
                <strong>Speed Range Derived From:</strong>
              </div>
              <span>• <strong>Vessel:</strong> {f.vessel_type} ({specs.vesselLabel})</span>
              <span>• <strong>Fuel:</strong> {f.fuel_type} ({specs.fuelDesc})</span>
              <span>• <strong>Cargo:</strong> {Number(f.cargo_tonnes).toLocaleString()} tonnes ({specs.loadPercent}% capacity)</span>
              <span>• <strong>Corridor:</strong> ~{specs.distKm.toLocaleString()} km distance within {specs.durationFormatted} window</span>
              {specs.isTight && (
                <div style={{ color: '#f2b134', marginTop: 4 }}>
                  ⚠️ Tight schedule: speed range has been elevated to avoid delivery delay penalties.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <button className="primary full" disabled={loading || !!specs?.error}>
        {loading ? 'Optimizing…' : 'Run GreenFleet Optimization'}
      </button>
    </form>
  );
}
