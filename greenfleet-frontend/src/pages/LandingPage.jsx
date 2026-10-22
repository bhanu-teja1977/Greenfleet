import React, { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import PlatformIntroSection from '../components/landing/PlatformIntroSection';
import CapabilitiesSection from '../components/landing/CapabilitiesSection';
import WorkflowSection from '../components/landing/WorkflowSection';
import DashboardPreviewSection from '../components/landing/DashboardPreviewSection';
import ImpactSection from '../components/landing/ImpactSection';
import ClosingCTASection from '../components/landing/ClosingCTASection';
import LandingFooter from '../components/landing/LandingFooter';
import DemoModal from '../components/landing/DemoModal';
import './LandingPage.css';

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="gfq-landing-page">
      {/* Top Navbar */}
      <LandingNavbar />

      <main className="gfq-main-stream">
        {/* Hero Section */}
        <HeroSection onWatchDemo={() => setDemoOpen(true)} />

        <div className="gfq-section-divider" aria-hidden="true" />

        {/* Section 2: Platform Intro */}
        <PlatformIntroSection />

        <div className="gfq-section-divider" aria-hidden="true" />

        {/* Section 3: Capabilities */}
        <CapabilitiesSection />

        <div className="gfq-section-divider" aria-hidden="true" />

        {/* Section 4: Workflow Stepper */}
        <WorkflowSection />

        <div className="gfq-section-divider" aria-hidden="true" />

        {/* Section 5: Dashboard Preview */}
        <DashboardPreviewSection />

        <div className="gfq-section-divider" aria-hidden="true" />

        {/* Section 6: Impact & Metrics */}
        <ImpactSection />

        <div className="gfq-section-divider" aria-hidden="true" />

        {/* Section 7: Closing CTA */}
        <ClosingCTASection />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Interactive Demo Tour Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
