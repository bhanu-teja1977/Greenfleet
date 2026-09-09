import React from 'react';
import {BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,Legend} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function ChartsPanel({result}){
 const { theme } = useTheme();
 if(!result)return null;
 const chartTheme = theme === 'light'
    ? { grid: '#d9e3e8', text: '#334e5c', tooltipBg: '#ffffff', tooltipBorder: '#cbd9df' }
    : { grid: '#294653', text: '#c8d9df', tooltipBg: '#102732', tooltipBorder: '#34515e' };
 const f=result.fleet_plan;
 const performance=[
  {name:'Baseline',fuel:result.baseline.fuel_litres,co2:result.baseline.co2_kg},
  {name:'QPSO',fuel:result.optimized.fuel_litres,co2:result.optimized.co2_kg},
  {name:'Fleet',fuel:f.fuel_litres,co2:f.co2_kg}
 ];
 const fuelData=(result.fuel_comparison||[]).map(x=>({name:x.fuel_type,fuel:x.predicted_fuel_litres,co2:x.operational_co2_kg}));
 return <>
  <section className="card charts">
   <div><h3>Voyage performance</h3><p>Baseline vs QPSO vs the final cargo fleet plan. Lower fuel and CO₂ are better.</p></div>
    <ResponsiveContainer width="100%" height={260}><BarChart data={performance}><CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fill: chartTheme.text}}/><YAxis tick={{fill: chartTheme.text}}/><Tooltip contentStyle={{background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.text}}/><Legend wrapperStyle={{color: chartTheme.text}}/><Bar dataKey="fuel" name="Fuel (L)" fill="#00bfa5"/><Bar dataKey="co2" name="CO₂ (kg)" fill="#3b82f6"/></BarChart></ResponsiveContainer>
   {result.benchmark&&<div className="benchmark"><b>Optimization benchmark:</b> {result.benchmark.improvement_percent}% objective improvement with QPSO.</div>}
  </section>
  {fuelData.length>0&&<section className="card charts">
   <div><h3>ML-predicted fuel comparison</h3><p>All fuel types evaluated at the selected route's optimized speed and the same vessel/cargo/environment.</p></div>
    <ResponsiveContainer width="100%" height={280}><BarChart data={fuelData}><CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fill: chartTheme.text}}/><YAxis tick={{fill: chartTheme.text}}/><Tooltip contentStyle={{background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.text}}/><Legend wrapperStyle={{color: chartTheme.text}}/><Bar dataKey="fuel" name="Predicted fuel (L)" fill="#00bfa5"/><Bar dataKey="co2" name="Operational CO₂ (kg)" fill="#3b82f6"/></BarChart></ResponsiveContainer>
  </section>}
 </>;
}
