import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer, TileLayer, Polyline, Marker, Popup, useMap, CircleMarker, Tooltip,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Colour palettes ────────────────────────────────────────────────────── */
const ROUTE_PALETTES = {
  R1: { base: '#1565c0', dim: '#5e92f3', glow: 'rgba(21,101,192,0.18)' },
  R2: { base: '#e65100', dim: '#ffb74d', glow: 'rgba(230,81,0,0.18)' },
};

/** 5-stop heat colour ramp: blue → green → amber → orange → red */
function heatColor(v) {
  if (v >= 85) return '#c62828';
  if (v >= 65) return '#ef6c00';
  if (v >= 45) return '#f9a825';
  if (v >= 25) return '#558b2f';
  return '#1565c0';
}
function heatColorDelay(v) {
  if (v >= 80) return '#b71c1c';
  if (v >= 55) return '#e64a19';
  if (v >= 35) return '#ff8f00';
  if (v >= 15) return '#2e7d32';
  return '#0d47a1';
}
function heatColorTraffic(v) {
  if (v >= 80) return '#4a148c';
  if (v >= 60) return '#880e4f';
  if (v >= 40) return '#c62828';
  if (v >= 20) return '#e65100';
  return '#1565c0';
}

function segVal(seg, layer) {
  if (layer === 'fuel')  return seg.heat?.fuel_penalty_index ?? 0;
  if (layer === 'delay') return seg.heat?.delay_index ?? 0;
  return seg.heat?.traffic_proxy_index ?? 0;
}
function segColor(seg, layer) {
  const v = segVal(seg, layer);
  return layer === 'delay' ? heatColorDelay(v) : layer === 'traffic' ? heatColorTraffic(v) : heatColor(v);
}

/** Classify weather severity for a segment */
function weatherSeverity(seg) {
  const wh   = seg.marine?.wave_height ?? 0;
  const ws   = seg.marine?.wind_speed  ?? 0;
  const env  = seg.penalty?.environmental_score ?? 0;
  if (wh > 4 || ws > 60 || env > 70) return 'severe';
  if (wh > 2.5 || ws > 40 || env > 45) return 'moderate';
  if (wh > 1.5 || ws > 25 || env > 25) return 'light';
  return 'calm';
}

const SEVERITY_COLOR = {
  severe:   { fill: '#d32f2f', label: '⚠️ Severe Storm', border: '#ff1744' },
  moderate: { fill: '#f57c00', label: '🌊 Rough Seas',   border: '#ff9100' },
  light:    { fill: '#f9a825', label: '🌬 Light Weather', border: '#ffc107' },
  calm:     { fill: '#43a047', label: '✅ Calm',          border: '#66bb6a' },
};

/* ─── Map auto-fit ───────────────────────────────────────────────────────── */
function FitBounds({ routes }) {
  const map = useMap();
  useEffect(() => {
    const pts = routes.flatMap(r => (r.route.geometry?.coordinates || []).map(([lon, lat]) => [lat, lon]));
    if (pts.length > 1) map.fitBounds(pts, { padding: [50, 50] });
  }, [map, routes]);
  return null;
}

/* ─── Port icon ──────────────────────────────────────────────────────────── */
function portIcon(color, label) {
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div style="
      width:22px;height:22px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
      font-size:9px;font-weight:800;color:#fff;
    ">${label}</div>`,
  });
}

/* ─── Weather icon ───────────────────────────────────────────────────────── */
function weatherIcon(sev) {
  const { fill } = SEVERITY_COLOR[sev];
  return L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `<div style="
      width:20px;height:20px;border-radius:50%;
      background:${fill}dd;border:2px solid ${fill};
      display:flex;align-items:center;justify-content:center;
      font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">${sev === 'severe' ? '⚡' : sev === 'moderate' ? '🌊' : '💨'}</div>`,
  });
}

/* ─── Legend ─────────────────────────────────────────────────────────────── */
function HeatLegend({ layer }) {
  const stops = layer === 'traffic'
    ? [['#1565c0','Sparse'],['#e65100','Moderate'],['#c62828','Dense'],['#880e4f','Heavy'],['#4a148c','Congested']]
    : layer === 'delay'
    ? [['#0d47a1','None'],['#2e7d32','Low'],['#ff8f00','Moderate'],['#e64a19','High'],['#b71c1c','Severe']]
    : [['#1565c0','None'],['#558b2f','Low'],['#f9a825','Moderate'],['#ef6c00','High'],['#c62828','Severe']];
  return (
    <div className="heat-legend-v2">
      <span className="legend-title">
        {layer === 'fuel' ? '⛽ Fuel Penalty' : layer === 'delay' ? '⏱ Delay Risk' : '🚢 Traffic Density'}
      </span>
      <div className="legend-ramp">
        {stops.map(([c, lbl]) => (
          <div key={c} className="legend-stop">
            <i style={{ background: c }} />
            <span>{lbl}</span>
          </div>
        ))}
      </div>
      <div className="legend-ramp" style={{ marginLeft: 16, borderLeft: '1px solid #ddd', paddingLeft: 12 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#555', marginRight: 8 }}>Weather:</span>
        {Object.entries(SEVERITY_COLOR).map(([k, { fill, label }]) => (
          <div key={k} className="legend-stop">
            <i style={{ background: fill, borderRadius: '50%' }} />
            <span>{label.replace(/^[\S]+\s/, '')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Segment breakdown table ────────────────────────────────────────────── */
function SegmentTable({ route, layer }) {
  const segs = route?.segment_penalties || [];
  const pal  = ROUTE_PALETTES[route?.route_id] || ROUTE_PALETTES.R1;
  const [expanded, setExpanded] = useState(false);
  const display = expanded ? segs : segs.slice(0, 5);

  if (!segs.length) return null;

  return (
    <div className="seg-table-wrap">
      <div className="seg-table-header">
        <span style={{ color: pal.base, fontWeight: 700 }}>
          {route.route_id} — {route.label}
        </span>
        <span style={{ color: '#888', fontSize: 11 }}>{segs.length} segments</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="seg-table">
          <thead>
            <tr>
              <th>#</th>
              <th>From</th>
              <th>To</th>
              <th>Dist (km)</th>
              <th>Wave (m)</th>
              <th>Wind (km/h)</th>
              <th>Fuel+%</th>
              <th>Delay+h</th>
              <th>Weather</th>
            </tr>
          </thead>
          <tbody>
            {display.map((seg, i) => {
              const sev = weatherSeverity(seg);
              const { fill, label: wLabel } = SEVERITY_COLOR[sev];
              return (
                <tr key={i} className={sev === 'severe' ? 'seg-row-severe' : sev === 'moderate' ? 'seg-row-moderate' : ''}>
                  <td style={{ color: '#999' }}>{i + 1}</td>
                  <td>{seg.start?.lat?.toFixed(2)}°, {seg.start?.lon?.toFixed(2)}°</td>
                  <td>{seg.end?.lat?.toFixed(2)}°, {seg.end?.lon?.toFixed(2)}°</td>
                  <td>{seg.distance_km?.toFixed(1) ?? '—'}</td>
                  <td>{seg.marine?.wave_height ?? '—'}</td>
                  <td>{seg.marine?.wind_speed  ?? '—'}</td>
                  <td style={{ color: seg.penalty?.fuel_penalty_percent > 5 ? '#e65100' : '#388e3c', fontWeight: 600 }}>
                    +{seg.penalty?.fuel_penalty_percent?.toFixed(1) ?? 0}%
                  </td>
                  <td style={{ color: seg.penalty?.time_penalty_hours > 1 ? '#e65100' : '#555' }}>
                    +{seg.penalty?.time_penalty_hours?.toFixed(1) ?? 0}h
                  </td>
                  <td>
                    <span className="weather-badge" style={{ background: fill + '22', color: fill, border: `1px solid ${fill}66` }}>
                      {wLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {segs.length > 5 && (
        <button className="seg-expand-btn" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Show less' : `▼ Show all ${segs.length} segments`}
        </button>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function MapView({ routeOptions, selectedRouteId }) {
  const [layer, setLayer] = useState('fuel');
  const [hoverSeg, setHoverSeg] = useState(null); // { routeId, segIdx }
  const [showWeather, setShowWeather] = useState(true);

  const routes  = routeOptions || [];
  const selected = routes.find(r => r.route_id === selectedRouteId) || routes[0];
  const visibleRoutes = selected ? [selected] : routes;

  if (!routes.length) {
    return (
      <div className="map-wrap map-unavailable">
        <div className="map-unavailable-message">No valid marine route available for this port pair.</div>
      </div>
    );
  }

  const center = useMemo(() => {
    if (selected?.route?.geometry?.coordinates?.length) {
      const coordinates = selected.route.geometry.coordinates;
      const first = coordinates[0];
      const last = coordinates[coordinates.length - 1];
      return [(first[1] + last[1]) / 2, (first[0] + last[0]) / 2];
    }
    return [10, 85];
  }, [selected]);

  return (
    <div className="map-wrap">

      {/* Toolbar */}
      <div className="map-toolbar">
        <div className="map-title-block">
          <span className="map-icon">🗺</span>
          <div>
            <b>Marine Route Heat Map</b>
            <span className="map-subtitle">
              {routes.length} route{routes.length !== 1 ? 's' : ''} · {routes.reduce((s, r) => s + (r.segment_penalties?.length || 0), 0)} segments analysed
            </span>
          </div>
        </div>
        <div className="layer-buttons">
          {[
            { key: 'fuel',    icon: '⛽', label: 'Fuel Penalty' },
            { key: 'delay',   icon: '⏱', label: 'Delay Risk'   },
            { key: 'traffic', icon: '🚢', label: 'Traffic'      },
          ].map(({ key, icon, label }) => (
            <button key={key} type="button"
              className={layer === key ? 'active' : ''}
              onClick={() => setLayer(key)}
            >{icon} {label}</button>
          ))}
          <button
            type="button"
            className={showWeather ? 'active' : ''}
            onClick={() => setShowWeather(v => !v)}
          >🌩 Weather</button>
        </div>
      </div>

      {/* Route badges */}
      <div className="route-key-v2">
        {routes.map(r => {
          const pal   = ROUTE_PALETTES[r.route_id] || ROUTE_PALETTES.R2;
          const isSel = r.route_id === selected?.route_id;
          const dist  = r.route?.distance_km;
          const eta   = r.optimized?.eta_hours ?? r.route?.eta_hours;
          return (
            <div key={r.route_id} className={`route-badge ${isSel ? 'selected' : ''}`}
              style={{ borderColor: isSel ? pal.base : '#d0d8e0' }}>
              <i style={{ background: isSel ? pal.base : pal.dim }} />
              <div className="badge-info">
                <strong style={{ color: isSel ? pal.base : '#555' }}>{r.route_id} {isSel ? '★' : ''}</strong>
                <span>{r.label}</span>
                {dist && <small>{dist.toLocaleString()} km · {eta ? `${Math.round(eta)} h` : '—'}</small>}
              </div>
              {isSel && <span className="badge-rec">SELECTED</span>}
            </div>
          );
        })}
      </div>

      {/* Map */}
      <MapContainer center={center} zoom={4}
        style={{ height: '560px', width: '100%' }} preferCanvas>

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <FitBounds routes={visibleRoutes} />

        {/* Draw only the selected route so alternatives cannot overlap it. */}
        {visibleRoutes.map(r => {
          const isSel = r.route_id === selected?.route_id;
          const pal   = ROUTE_PALETTES[r.route_id] || ROUTE_PALETTES.R2;
          const segs  = r.segment_penalties || [];
          const routeCoordinates = (r.route?.geometry?.coordinates || []).map(([lon, lat]) => [lat, lon]);

          return (
            <React.Fragment key={r.route_id}>
              <Polyline
                positions={routeCoordinates}
                pathOptions={{ color: pal.base, weight: isSel ? 6 : 3, opacity: isSel ? 0.88 : 0.4, lineCap: 'round', lineJoin: 'round' }}
              />
              {segs.map((seg, i) => {
                const col     = segColor(seg, layer);
                const weight  = isSel ? 6 : 3;
                const opacity = isSel ? 0.88 : 0.40;
                const isHov   = hoverSeg?.routeId === r.route_id && hoverSeg?.segIdx === i;
                const sev     = weatherSeverity(seg);
                const { fill: wFill, label: wLabel } = SEVERITY_COLOR[sev];
                const positions = [[seg.start.lat, seg.start.lon], [seg.end.lat, seg.end.lon]];

                // Tooltip content (shows on hover, not click)
                const tooltipContent = `
Seg ${i+1} · ${r.label}
Wave: ${seg.marine?.wave_height ?? '—'} m | Wind: ${seg.marine?.wind_speed ?? '—'} km/h
Fuel+: ${seg.penalty?.fuel_penalty_percent?.toFixed(1) ?? 0}% | Delay+: ${seg.penalty?.time_penalty_hours?.toFixed(1) ?? 0}h
Weather: ${wLabel}
`;

                return (
                  <React.Fragment key={`${r.route_id}-${i}`}>
                    {/* Outline for non-selected (helps visibility) */}
                    {!isSel && (
                      <Polyline positions={positions}
                        pathOptions={{ color: '#fff', weight: weight + 2, opacity: 0.50 }} />
                    )}
                    {/* Main segment line */}
                    <Polyline
                      positions={positions}
                      pathOptions={{
                        color: isHov ? '#000' : col,
                        weight: isHov ? weight + 2 : weight,
                        opacity: isHov ? 1 : opacity,
                        lineCap: 'round', lineJoin: 'round',
                      }}
                      eventHandlers={{
                        mouseover: () => setHoverSeg({ routeId: r.route_id, segIdx: i }),
                        mouseout:  () => setHoverSeg(null),
                      }}
                    >
                      {/* Popup on click */}
                      <Popup>
                        <div style={{ minWidth: 200 }}>
                          <div style={{ fontWeight: 700, color: pal.base, marginBottom: 4, fontSize: 13 }}>
                            {r.route_id} · Segment {i + 1} of {segs.length}
                          </div>
                          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>{r.label}</div>
                          <div style={{
                            display: 'inline-block', padding: '2px 8px', borderRadius: 999,
                            background: wFill + '22', color: wFill,
                            border: `1px solid ${wFill}66`,
                            fontSize: 11, fontWeight: 700, marginBottom: 8,
                          }}>{wLabel}</div>
                          <table style={{ fontSize: 12, borderCollapse: 'collapse', width: '100%' }}>
                            <tbody>
                              {[
                                ['📍 Distance',    `${seg.distance_km?.toFixed(1) ?? '—'} km`],
                                ['🌊 Wave Height',  `${seg.marine?.wave_height ?? '—'} m`],
                                ['💨 Wind Speed',   `${seg.marine?.wind_speed ?? '—'} km/h`],
                                ['🌊 Current',      `${seg.marine?.current_velocity ?? '—'} km/h`],
                                ['🌡 Env Score',    `${seg.penalty?.environmental_score ?? '—'}/100`],
                                ['⛽ Fuel +',       `+${seg.penalty?.fuel_penalty_percent?.toFixed(1) ?? 0}%`],
                                ['⏱ Delay +',      `+${seg.penalty?.time_penalty_hours?.toFixed(1) ?? 0} h`],
                                ['🚢 Traffic Idx', `${seg.heat?.traffic_proxy_index ?? 0}/100`],
                              ].map(([k, v]) => (
                                <tr key={k}>
                                  <td style={{ color: '#666', paddingRight: 10, paddingBottom: 3, whiteSpace: 'nowrap' }}>{k}</td>
                                  <td style={{ color: '#1a2b38', fontWeight: 600 }}>{v}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {seg.penalty?.recommendation && (
                            <div style={{ marginTop: 8, fontSize: 11, color: '#e65100', fontStyle: 'italic', borderTop: '1px solid #eee', paddingTop: 6 }}>
                              💡 {seg.penalty.recommendation}
                            </div>
                          )}
                        </div>
                      </Popup>
                      {/* Hover tooltip (shows instantly on hover) */}
                      <Tooltip sticky direction="top" offset={[0, -5]}
                        className="seg-tooltip">
                        <div style={{ fontSize: 12, lineHeight: 1.5, minWidth: 160 }}>
                          <div style={{ fontWeight: 700, color: pal.base, marginBottom: 2 }}>
                            {r.route_id} · Seg {i + 1}
                          </div>
                          <div style={{ color: wFill, fontWeight: 600, marginBottom: 4 }}>{wLabel}</div>
                          <div>🌊 Wave: <b>{seg.marine?.wave_height ?? '—'} m</b></div>
                          <div>💨 Wind: <b>{seg.marine?.wind_speed ?? '—'} km/h</b></div>
                          <div>⛽ Fuel: <b>+{seg.penalty?.fuel_penalty_percent?.toFixed(1) ?? 0}%</b></div>
                          <div>⏱ Delay: <b>+{seg.penalty?.time_penalty_hours?.toFixed(1) ?? 0} h</b></div>
                          <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>Click for full details</div>
                        </div>
                      </Tooltip>
                    </Polyline>
                  </React.Fragment>
                );
              })}

              {/* Waypoint dots along selected route */}
              {isSel && (r.route?.waypoints || []).slice(1, -1).map((wp, i) => (
                <CircleMarker key={`wp-${i}`} center={[wp.lat, wp.lon]} radius={4}
                  pathOptions={{ color: pal.base, fillColor: '#fff', fillOpacity: 0.9, weight: 2 }} />
              ))}

              {/* Bad-weather alert markers (severe/moderate) on selected route */}
              {showWeather && isSel && segs.map((seg, i) => {
                const sev = weatherSeverity(seg);
                if (sev === 'calm' || sev === 'light') return null;
                const midLat = (seg.start.lat + seg.end.lat) / 2;
                const midLon = (seg.start.lon + seg.end.lon) / 2;
                return (
                  <Marker key={`wx-${i}`} position={[midLat, midLon]} icon={weatherIcon(sev)}>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <div style={{ fontWeight: 700, color: SEVERITY_COLOR[sev].fill, marginBottom: 4 }}>
                          {SEVERITY_COLOR[sev].label}
                        </div>
                        <div style={{ fontSize: 12 }}>Segment {i + 1} of {segs.length}</div>
                        <hr style={{ borderColor: '#eee', margin: '6px 0' }} />
                        <div style={{ fontSize: 12 }}>🌊 Wave: <b>{seg.marine?.wave_height ?? '—'} m</b></div>
                        <div style={{ fontSize: 12 }}>💨 Wind: <b>{seg.marine?.wind_speed ?? '—'} km/h</b></div>
                        <div style={{ fontSize: 12 }}>🌡 Env Score: <b>{seg.penalty?.environmental_score ?? '—'}/100</b></div>
                        {seg.penalty?.recommendation && (
                          <div style={{ fontSize: 11, color: '#e65100', marginTop: 6, fontStyle: 'italic' }}>
                            💡 {seg.penalty.recommendation}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </React.Fragment>
          );
        })}

        {/* Origin / Destination markers */}
        {selected && (() => {
          const wps  = selected.route?.waypoints || [];
          if (!wps.length) return null;
          const orig = wps[0];
          const dest = wps[wps.length - 1];
          return (
            <>
              <Marker position={[orig.lat, orig.lon]} icon={portIcon('#1565c0', 'O')} zIndexOffset={1000}>
                <Popup>
                  <b style={{ color: '#1565c0' }}>Origin Port</b><br />
                  {orig.lat.toFixed(4)}°N, {orig.lon.toFixed(4)}°E
                </Popup>
              </Marker>
              <Marker position={[dest.lat, dest.lon]} icon={portIcon('#e65100', 'D')} zIndexOffset={1000}>
                <Popup>
                  <b style={{ color: '#e65100' }}>Destination Port</b><br />
                  {dest.lat.toFixed(4)}°N, {dest.lon.toFixed(4)}°E
                </Popup>
              </Marker>
            </>
          );
        })()}
      </MapContainer>

      {/* Legend */}
      <HeatLegend layer={layer} />

      {/* Segment breakdown tables */}
      {routes.length > 0 && (
        <div className="seg-tables-section">
          <div className="seg-tables-title">📋 Route Segment Breakdown</div>
          <div className="seg-tables-grid">
            {routes.map(r => (
              <SegmentTable key={r.route_id} route={r} layer={layer} />
            ))}
          </div>
        </div>
      )}

      <p className="disclaimer">
        Prototype route alternatives for decision support only — not certified maritime routes or navigation guidance.
        Waypoints follow standard shipping lane chokepoints. Marine data: Open-Meteo live forecast.
        Weather markers (⚡🌊💨) show segments with elevated wave, wind or environmental score.
      </p>
    </div>
  );
}
