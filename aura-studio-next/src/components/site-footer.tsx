'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { productConfig } from '../config/product';
import { LegalModal } from './legal-modal';
import { ArrowUp } from 'lucide-react';

export function SiteFooter() {
  const { contact } = productConfig;
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  const openLegal = (tab: 'privacy' | 'terms') => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const waUrl = `https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent(contact.whatsappPrefill)}`;

  return (
    <>
      <footer 
        className="pt-16 pb-12 bg-white/90 border-t border-[#7545F5]/10 text-[#1A1918] relative" 
        aria-label="AURA Studio Footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-200/80">
            
            {/* Col 1 & 2: Brand & Manifesto */}
            <div className="lg:col-span-2">
              <a href="#hero" className="inline-flex items-baseline gap-1.5 mb-4 group" aria-label="AURA Studio Home">
                <span className="font-extrabold text-2xl tracking-tighter text-[#1A1918] group-hover:text-[#7545F5] transition-colors">
                  AURA
                </span>
                <span className="text-[10px] font-bold tracking-widest text-[#7545F5] uppercase px-1.5 py-0.5 rounded-sm bg-[#E9DFFF]/80">
                  STUDIO
                </span>
              </a>

              <p className="text-sm text-slate-600 leading-relaxed font-light max-w-sm mb-6">
                Quiet luxury acoustics crafted for intentional spaces. Hand-finished cast stone, solid brass, and 360° omnidirectional sound.
              </p>

              <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                <p>
                  Direct: <a href={`tel:${contact.phoneRaw}`} className="text-[#1A1918] hover:text-[#7545F5] transition-colors">{contact.phoneDisplay}</a>
                </p>
                <p>
                  Email: <a href={`mailto:${contact.email}`} className="text-[#1A1918] hover:text-[#7545F5] transition-colors">{contact.email}</a>
                </p>
                <p>
                  WhatsApp: <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-semibold">Message Concierge</a>
                </p>
              </div>
            </div>

            {/* Col 3: Navigation */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] mb-4">
                Navigation
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><a href="#hero" className="hover:text-[#7545F5] transition-colors">Overview</a></li>
                <li><a href="#product-slider" className="hover:text-[#7545F5] transition-colors">Product Views</a></li>
                <li><a href="#about" className="hover:text-[#7545F5] transition-colors">The Philosophy</a></li>
                <li><a href="#trust" className="hover:text-[#7545F5] transition-colors">Brand Partners</a></li>
                <li><a href="#ugc-showcase" className="hover:text-[#7545F5] transition-colors">Everyday Moments</a></li>
                <li><a href="#gallery" className="hover:text-[#7545F5] transition-colors">Visual Gallery</a></li>
                <li><a href="#testimonials" className="hover:text-[#7545F5] transition-colors">Client Reviews</a></li>
                <li><a href="#faq" className="hover:text-[#7545F5] transition-colors">Questions &amp; Answers</a></li>
              </ul>
            </div>

            {/* Col 4: Editions & Inquiries */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] mb-4">
                Editions
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><a href="#lead-form" className="hover:text-[#7545F5] transition-colors">Travertine Stone Edition</a></li>
                <li><a href="#lead-form" className="hover:text-[#7545F5] transition-colors">Matte Charcoal Edition</a></li>
                <li><a href="#lead-form" className="hover:text-[#7545F5] transition-colors">Brushed Brass Limited Run</a></li>
                <li><a href="#lead-form" className="hover:text-[#7545F5] transition-colors">Dual-Sync Stereo Pair</a></li>
                <li><a href="#lead-form" className="hover:text-[#7545F5] transition-colors">Corporate &amp; Interior Gifting</a></li>
              </ul>
            </div>

            {/* Col 5: Assurance & Policies */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1918] mb-4">
                Assurance
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li><a href="#about" className="hover:text-[#7545F5] transition-colors">2-Year Craft Guarantee</a></li>
                <li><a href="#faq" className="hover:text-[#7545F5] transition-colors">Plastic-Free Packaging</a></li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegal('privacy')}
                    className="text-left hover:text-[#7545F5] transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => openLegal('terms')}
                    className="text-left hover:text-[#7545F5] transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light">
            <p>© 2026 AURA Studio Design Labs. All rights reserved.</p>

            <div className="flex items-center gap-4">
              <span>Next.js App Router • TypeScript • Tailwind CSS • Three.js</span>
              <span className="text-slate-300">•</span>
              <a 
                href="#hero" 
                className="inline-flex items-center gap-1 font-medium text-[#7545F5] hover:underline"
                aria-label="Scroll back to top"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Accessible Privacy / Terms Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </>
  );
}
