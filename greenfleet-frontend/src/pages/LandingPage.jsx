import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, BrainCircuit, ChevronDown, CloudSun,
  Gauge, Leaf, Menu, Route, Ship, Sparkles, Boxes, X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './LandingPage.css';

const capabilities = [
  { number: '01', icon: Gauge, title: 'Fuel Intelligence', text: 'Predict fuel consumption across vessel type, cargo, speed, fuel type, and environmental conditions.' },
  { number: '02', icon: Route, title: 'Marine Routing', text: 'Compare realistic marine routes while considering weather, waves, currents, and environmental exposure.' },
  { number: '03', icon: BrainCircuit, title: 'AI Optimization', text: 'Optimize fuel, speed, cost, emissions, and schedule reliability to find better operational decisions.' },
  { number: '04', icon: Boxes, title: 'Fleet Allocation', text: 'Distribute cargo across vessels while considering capacity, utilization, and fleet-level performance.' },
];

const technologies = [
  ['Machine Learning', 'Random Forest fuel-consumption prediction.'],
  ['Marine Intelligence', 'Weather, wave, wind, current, and sea-condition analysis.'],
  ['Route Optimization', 'Comparison of alternative marine routes.'],
  ['Fuel Strategy', 'HFO, LNG, Methanol, Hydrogen, and Ammonia comparison.'],
  ['QPSO Optimization', 'Quantum-inspired optimization for speed and fuel decisions.'],
  ['Fleet Planning', 'Cargo allocation and fleet utilization analysis.'],
  ['Scenario Simulation', 'Normal, bad-weather, high-fuel-price, and emissions-sensitive scenarios.'],
  ['Decision Dashboard', 'Interactive operational visualization.'],
];

const processSteps = [
  ['01', 'Select Voyage', 'Origin · Destination · Vessel · Cargo'],
  ['02', 'Analyze Conditions', 'Weather · Wind · Waves · Currents'],
  ['03', 'Predict', 'Fuel · CO₂ · Cost · ETA'],
  ['04', 'Optimize', 'Fuel · Speed · Route · Fleet'],
  ['05', 'Decide', 'Best operational scenario'],
];

const questions = [
  'Which fuel is most efficient?',
  'Which route reduces environmental exposure?',
  'How should speed change?',
  'How can emissions be reduced?',
  'How should cargo be distributed?',
  'Which scenario provides the best balance?',
];

function Brand() {
  return <Link to="/" className="landing-brand" aria-label="GreenFleet home"><span className="landing-mark">GF</span><span>GreenFleet</span></Link>;
}

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button className="landing-theme" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
    <span>{theme === 'dark' ? '◐' : '◑'}</span> {theme === 'dark' ? 'Light' : 'Dark'}
  </button>;
}

function LandingNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="landing-nav-wrap">
    <nav className="landing-nav" aria-label="Main navigation">
      <Brand />
      <button className="landing-menu" type="button" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close menu' : 'Open menu'}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`landing-nav-links ${open ? 'open' : ''}`}>
        <a href="#capabilities" onClick={close}>Product</a>
        <a href="#capabilities" onClick={close}>Capabilities</a>
        <a href="#how-it-works" onClick={close}>How It Works</a>
        <a href="#about" onClick={close}>About</a>
        <div className="landing-nav-actions"><ThemeButton /><Link className="landing-nav-cta" to="/dashboard" onClick={close}>Launch Dashboard <ArrowRight size={15} /></Link></div>
      </div>
    </nav>
  </header>;
}

function FleetVisual() {
  return <div className="fleet-visual" aria-label="Cargo fleet route intelligence visual">
    <img src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=85" alt="Container ship carrying cargo at sea" />
    <div className="fleet-vignette" />
    <div className="route-track track-one"><span /><i /><b /></div>
    <div className="route-track track-two"><span /><i /><b /></div>
    <div className="fleet-node node-one">●</div><div className="fleet-node node-two">●</div>
    <div className="fleet-overlay-label"><Ship size={14} /> Fleet route intelligence <span>LIVE MODEL</span></div>
    <div className="fleet-card card-fuel"><span>Fuel efficiency</span><strong>+18.4%</strong><small><Leaf size={11} /> vs baseline</small></div>
    <div className="fleet-card card-co2"><span>CO₂ reduction</span><strong>−12.8%</strong><small>operational estimate</small></div>
    <div className="fleet-card card-speed"><span>Optimal speed</span><strong>14.2 <em>knots</em></strong><small><Gauge size={11} /> QPSO selected</small></div>
    <div className="fleet-card card-route"><span>Marine route</span><strong>Validated</strong><small><CloudSun size={11} /> 14 segments analysed</small></div>
  </div>;
}

function LandingPage() {
  return <div className="landing-page">
    <LandingNav />
    <main>
      <section className="landing-hero">
        <div className="landing-shell hero-grid">
          <div className="hero-copy">
            <div className="landing-eyebrow"><span /> AI-powered maritime decision support</div>
            <h1>Plan smarter voyages.<br /><span>Sail greener.</span></h1>
            <p className="hero-lede">Optimize fuel, speed, routes, emissions, and fleet allocation with one intelligent maritime planning platform.</p>
            <div className="hero-actions"><a className="landing-button primary" href="#platform">Explore GreenFleet <ArrowDown size={16} /></a><Link className="landing-button secondary" to="/dashboard">Launch Dashboard <ArrowRight size={16} /></Link></div>
            <div className="hero-proof"><span><Sparkles size={14} /> Fuel-aware intelligence</span><span><Ship size={14} /> Water-constrained routes</span></div>
          </div>
          <FleetVisual />
        </div>
        <a className="scroll-cue" href="#platform"><span>Scroll to explore</span><ArrowDown size={15} /></a>
      </section>

      <section className="landing-section intro-section" id="platform">
        <div className="landing-shell intro-grid"><div><div className="landing-eyebrow">The GreenFleet platform</div><h2>One platform for smarter maritime decisions.</h2></div><p>GreenFleet brings voyage planning, fuel intelligence, marine routing, weather conditions, emissions analysis, optimization, and fleet allocation together in one operational platform.</p><div className="platform-vessel-visual"><img src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80" alt="Cargo ship and containers at a maritime terminal" /><div className="platform-vessel-shade" /><span className="platform-vessel-line line-a" /><span className="platform-vessel-line line-b" /><div className="platform-vessel-caption"><Ship size={13} /> Cargo intelligence in motion</div></div></div>
      </section>

      <section className="landing-section" id="capabilities"><div className="landing-shell"><div className="section-heading-landing"><div><div className="landing-eyebrow">Built for the decisions behind every voyage</div><h2>Intelligence that moves with your fleet.</h2></div><p>From a single voyage to a fleet-wide operating plan, each capability works together to make the next decision clearer.</p></div><div className="capability-grid">{capabilities.map(({ number, icon: Icon, title, text }) => <article className="capability-card" key={title}><span className="card-number">{number}</span><Icon size={23} /><h3>{title}</h3><p>{text}</p><ArrowRight className="card-arrow" size={17} /></article>)}</div></div></section>

      <section className="landing-section process-section" id="how-it-works"><div className="landing-shell"><div className="landing-eyebrow">The operating loop</div><h2>From voyage data to an optimized decision.</h2><div className="process-grid">{processSteps.map(([number, title, text], index) => <div className="process-step" key={number}><div className="process-top"><span>{number}</span>{index < processSteps.length - 1 && <i />}</div><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section className="landing-section about-section" id="about"><div className="landing-shell about-grid"><div><div className="landing-eyebrow">About GreenFleet</div><h2>Built to make maritime planning smarter and greener.</h2><p>GreenFleet is an end-to-end maritime decision-support prototype designed to help fleet planners decide which fuel to use, how fast to sail, and which route to take while balancing fuel cost, emissions, and schedule reliability.</p><p>At its core, GreenFleet combines machine learning, marine and weather intelligence, route analysis, optimization, scenario simulation, and fleet allocation into one decision-support platform.</p></div><div className="metric-stack"><div><strong>5</strong><span>fuel strategies compared</span></div><div><strong>2</strong><span>marine route candidates</span></div><div><strong>8</strong><span>decision-support scenarios</span></div><div><strong>1</strong><span>operational view</span></div></div></div></section>

      <section className="landing-section technology-section"><div className="landing-shell"><div className="landing-eyebrow">GreenFleet capabilities</div><h2>Every signal, in one operational picture.</h2><div className="technology-grid">{technologies.map(([title, text]) => <div className="technology-item" key={title}><span /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

      <section className="landing-section why-section"><div className="landing-shell"><div className="landing-eyebrow">Why GreenFleet</div><h2>Not just a route map.</h2><p className="why-lede">GreenFleet helps answer the decisions behind every voyage.</p><div className="question-grid">{questions.map((question, index) => <div key={question}><span>0{index + 1}</span><strong>{question}</strong><ArrowRight size={16} /></div>)}</div></div></section>

      <section className="landing-section preview-section"><div className="landing-shell preview-grid"><div><div className="landing-eyebrow">Your operational view</div><h2>See the decision before you sail.</h2><p>Move from fuel comparison to route analysis, CO₂ performance, optimization, fleet allocation, and weather exposure without losing the voyage context.</p><Link className="landing-button secondary" to="/dashboard">Explore Dashboard <ArrowRight size={16} /></Link></div><div className="dashboard-preview"><div className="preview-bar"><span /><span /><span /><b>GreenFleet / voyage overview</b></div><div className="preview-content"><div className="preview-chart"><span /><span /><span /><span /><span /></div><div className="preview-kpis"><div><b>14.2</b><small>Optimal speed</small></div><div><b>−12.8%</b><small>CO₂ reduction</small></div><div><b>86%</b><small>Fleet utilization</small></div></div><div className="preview-route"><i /><i /><i /><i /><i /></div></div></div></div></section>

      <section className="landing-cta"><div className="landing-shell"><div className="landing-eyebrow">Start with the next voyage</div><h2>Make every voyage a smarter decision.</h2><p>Explore fuel, route, speed, emissions, and fleet scenarios with GreenFleet.</p><Link className="landing-button primary" to="/dashboard">Launch GreenFleet <ArrowRight size={16} /></Link></div></section>
    </main>
    <footer className="landing-footer"><div className="landing-shell footer-grid"><div><Brand /><p>AI-powered decision support for greener maritime operations.</p></div><div className="footer-links"><a href="#capabilities">Product</a><a href="#capabilities">Capabilities</a><a href="#how-it-works">How It Works</a><a href="#about">About</a><Link to="/dashboard">Dashboard</Link></div><div className="footer-note">GreenFleet<br />Maritime decision-support prototype</div></div></footer>
  </div>;
}

export default LandingPage;
