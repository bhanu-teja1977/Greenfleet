import React from 'react';
import { FileText, BarChart3, Cpu, Route, Check } from 'lucide-react';

const workflowSteps = [
  {
    step: '01',
    title: 'Voyage Inputs',
    desc: 'Specify origin, destination, vessel type, and cargo load.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'AI Prediction',
    desc: 'Forecast baseline consumption across five cleaner marine fuels.',
    icon: BarChart3,
  },
  {
    step: '03',
    title: 'Optimization',
    desc: 'Run QPSO to balance speed, fuel choice, emissions, and cost.',
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Route Evaluation',
    desc: 'Assess ocean corridors with real marine weather penalties.',
    icon: Route,
  },
  {
    step: '05',
    title: 'Best Decision',
    desc: 'Review actionable route, fuel, speed, and fleet recommendations.',
    icon: Check,
    isFinal: true,
  },
];

export default function WorkflowSection() {
  return (
    <section className="gfq-section gfq-workflow-section" id="how-it-works">
      <div className="gfq-shell">
        {/* Section Header */}
        <div className="gfq-section-header-split">
          <div className="gfq-header-left">
            <div className="gfq-eyebrow">
              <span className="gfq-eyebrow-line" aria-hidden="true" />
              <span className="gfq-eyebrow-text">HOW IT WORKS</span>
            </div>
            <h2 className="gfq-section-headline">
              From voyage data to an optimized decision.
            </h2>
          </div>
          <div className="gfq-header-right">
            <p className="gfq-section-desc">
              A simple flow from your inputs to the best route, fuel choice, and fleet plan.
            </p>
          </div>
        </div>

        {/* 5-Step Stepper */}
        <div className="gfq-stepper-container">
          <div className="gfq-stepper-track" aria-hidden="true" />
          <div className="gfq-steps-row">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="gfq-step-item">
                  <div className={`gfq-step-node ${item.isFinal ? 'node-final' : ''}`}>
                    <Icon size={18} className="gfq-step-icon" />
                  </div>
                  <h3 className="gfq-step-title">{item.title}</h3>
                  <p className="gfq-step-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
