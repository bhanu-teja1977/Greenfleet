import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { optimize, scenario as runScenarioApi } from '../api';

const AppContext = createContext(null);
const STORAGE_KEY = 'greenfleet-session';

function apiErrorMessage(error) {
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (detail?.error) return detail.error;
  return error.message;
}

function loadSession() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function AppProvider({ children }) {
  const saved = loadSession();
  const [form, setForm]                   = useState(saved.form || null);
  const [result, setResult]               = useState(saved.result || null);
  const [optimizationResult, setOptimizationResult] = useState(saved.optimizationResult || saved.result || null);
  const [scenarioResults, setScenarioResults] = useState(saved.scenarioResults || {});
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(saved.error || '');
  const [scenarioName, setScenarioName]   = useState(saved.scenarioName || 'NORMAL');
  const [selectedRouteId, setSelectedRouteId] = useState(saved.selectedRouteId || null);
  const [systemStatus, setSystemStatus]   = useState({ backend: false, ml: false, weather: false });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        form, result, optimizationResult, scenarioResults,
        scenarioName, selectedRouteId, error,
      }));
    } catch {
      // Large result payloads should not prevent in-memory navigation state.
    }
  }, [form, result, optimizationResult, scenarioResults, scenarioName, selectedRouteId, error]);

  // Ping backend on mount
  React.useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setSystemStatus({ backend: true, ml: !!d.ports_loaded, weather: true }))
      .catch(() => setSystemStatus({ backend: false, ml: false, weather: false }));
  }, []);

  const runOptimize = useCallback(async (formData) => {
    setForm(formData);
    setLoading(true);
    setError('');
    try {
      const r = await optimize(formData);
      setResult(r);
      setOptimizationResult(r);
      setScenarioResults({});
      setSelectedRouteId(r.route_selection?.selected_route_id || r.route_options?.[0]?.route_id);
      setScenarioName('NORMAL');
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const runScenario = useCallback(async (name) => {
    if (!form) return;
    setLoading(true);
    setError('');
    try {
      const r = await runScenarioApi({ ...form, scenario_name: name });
      setResult(r.result);
      setScenarioResults(previous => ({ ...previous, [name]: r.result }));
      setSelectedRouteId(r.result.route_selection?.selected_route_id || r.result.route_options?.[0]?.route_id);
      setScenarioName(name);
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [form]);

  const resetSession = useCallback(() => {
    setForm(null);
    setResult(null);
    setOptimizationResult(null);
    setScenarioResults({});
    setSelectedRouteId(null);
    setScenarioName('NORMAL');
    setError('');
    setLoading(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const selected = result?.route_options?.find(x => x.route_id === selectedRouteId) || result?.route_options?.[0];
  const hasVoyage = !!form;
  const hasRoute = !!result?.route_options?.length;
  const hasOptimization = !!optimizationResult;
  const hasScenario = Object.keys(scenarioResults).length > 0;
  const hasFleetAllocation = !!result?.fleet_plan || !!optimizationResult?.fleet_plan;

  const value = {
    form, result, optimizationResult, scenarioResults, loading, error, scenarioName, selectedRouteId,
    hasVoyage, hasRoute, hasOptimization, hasScenario, hasFleetAllocation,
    selected, systemStatus,
    runOptimize, runScenario, resetSession, setSelectedRouteId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
