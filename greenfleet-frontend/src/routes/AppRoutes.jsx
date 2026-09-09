import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Overview          from '../pages/Overview';
import VoyagePlanning    from '../pages/VoyagePlanning';
import FuelComparisonPage from '../pages/FuelComparisonPage';
import RouteAnalysis     from '../pages/RouteAnalysis';
import Optimization      from '../pages/Optimization';
import ScenarioSimulation from '../pages/ScenarioSimulation';
import FleetAllocation   from '../pages/FleetAllocation';
import MLPrediction      from '../pages/MLPrediction';
import Settings          from '../pages/Settings';
import LandingPage       from '../pages/LandingPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"    element={<Overview />} />
        <Route path="/voyage"       element={<VoyagePlanning />} />
        <Route path="/fuel"         element={<FuelComparisonPage />} />
        <Route path="/routes"       element={<RouteAnalysis />} />
        <Route path="/optimization" element={<Optimization />} />
        <Route path="/scenarios"    element={<ScenarioSimulation />} />
        <Route path="/fleet"        element={<FleetAllocation />} />
        <Route path="/ml"           element={<MLPrediction />} />
        <Route path="/settings"     element={<Settings />} />
        <Route path="*"             element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
