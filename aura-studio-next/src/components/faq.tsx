'use client';

import React, { useState } from 'react';
import { productConfig } from '../config/product';
import { Sparkles, Plus, Minus, MessageCircle, Phone } from 'lucide-react';

export function Faq() {
  const { faqs, contact } = productConfig;
  const items = faqs || [];
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const waUrl = `https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent('Hello AURA Studio! I have a question before ordering.')}`;

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#FFFCF8] via-[#F8F5FF] to-[#FFFCF8]" 
      id="faq"
      aria-label="Frequently Asked Questions and Concierge Support"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SCENE 08] STUDIO CONCIERGE // CLEAR SPECIFICATIONS</span>
          </div>
          <span className="block text-xs font-bold tracking-widest text-[#7545F5] uppercase mb-2">
            CLEAR ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1918] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-[#1A1918]/70 leading-relaxed font-light">
            Common inquiries regarding technical specifications, batch availability, and worldwide delivery.
          </p>
        </div>

        {/* WAI-ARIA Accessible Accordion List */}
        <div className="space-y-4 mb-14">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const headingId = `faq-heading-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-[#7545F5]/10 overflow-hidden shadow-xs hover:border-[#7545F5]/30 transition-all duration-200"
              >
                <h3>
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 font-bold text-base sm:text-lg text-[#1A1918] hover:text-[#7545F5] transition-colors"
                  >
                    <span>{item.question}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#7545F5] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed font-light border-t border-slate-50 animate-fade-in"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Concierge Callout Box */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#7545F5]/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E9DFFF]/40 rounded-full blur-2xl -z-10 pointer-events-none" />
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-[#1A1918] mb-2">
              Have a specific or bespoke inquiry?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-lg font-light">
              Our studio concierge is available Monday to Friday to assist with custom finishes, corporate allocations, and acoustic pairing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white font-medium text-sm shadow-md hover:bg-[#20ba5a] transition-all duration-200 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`tel:${contact.phoneRaw}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 text-[#1A1918] font-medium text-sm shadow-xs hover:border-[#7545F5] hover:bg-[#7545F5]/5 transition-all duration-200 active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#7545F5]" />
              <span>Call Direct Line</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
