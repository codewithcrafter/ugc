import React from 'react';
import { SiteHeader } from '../components/site-header';
import { HeroSection } from '../components/hero-section';
import { UgcReels } from '../components/ugc-reels';
import { AboutSection } from '../components/about-section';
import { BrandMarquee } from '../components/brand-marquee';
import { UgcShowcase } from '../components/ugc-showcase';
import { Gallery } from '../components/gallery';
import { Testimonials } from '../components/testimonials';
import { Faq } from '../components/faq';
import { SiteFooter } from '../components/site-footer';
import { ContactControls } from '../components/contact-controls';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFCF8] text-[#1A1918] selection:bg-[#7545F5] selection:text-white font-sans antialiased overflow-x-hidden relative">
      
      {/* Top Sticky Navigation */}
      <SiteHeader />

      {/* Main Content Flow */}
      <main id="main-content">
        
        {/* Scene 01: Hero + 3D Rangefinder Camera + Inquiry Form */}
        <HeroSection />

        {/* Film Scene Transition Bridge */}
        <div className="h-10 w-full bg-gradient-to-b from-[#FFFCF8] to-[#F8F5FF] pointer-events-none" aria-hidden="true" />

        {/* Scene 02: 9:16 Vertical Motion Reels in Realistic Smartphone Mockup */}
        <UgcReels />

        {/* Film Scene Transition Bridge */}
        <div className="h-10 w-full bg-gradient-to-b from-[#F8F5FF] to-[#FFFCF8] pointer-events-none" aria-hidden="true" />

        {/* Scene 03: Tactile Acoustics & Interactive Overlapping Image Stack Deck */}
        <AboutSection />

        {/* Scene 04: Editorial Brand Partner Continuous Marquee */}
        <BrandMarquee />

        {/* Scene 05: Real Patrons In Everyday Living Moments */}
        <UgcShowcase />

        {/* Scene 06: Curated Perspectives 50mm f/1.4 Visual Archive & Fullscreen Lightbox */}
        <Gallery />

        {/* Scene 07: Patron Reflections & Verified Reviews */}
        <Testimonials />

        {/* Scene 08: Technical Specifications & Concierge FAQ Accordion */}
        <Faq />

      </main>

      {/* Section 09: Architectural Light Footer */}
      <SiteFooter />

      {/* Floating Right-Side Controls: WhatsApp, Direct Phone, FAQ Chatbot Drawer & Welcome Popup */}
      <ContactControls />

    </div>
  );
}
