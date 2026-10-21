import React from 'react';
import { LeadForm } from './lead-form';
import { HeadlineRotator } from './headline-rotator';
import { productConfig } from '../config/product';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';

export function HeroSection() {
  const { contact } = productConfig;
  const waUrl = `https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent(contact.whatsappPrefill)}`;
  const phoneUrl = `tel:${contact.phoneRaw}`;

  return (
    <section 
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden" 
      id="hero"
      aria-label="AURA Studio Overview and Inquiry Form"
    >
      {/* Ambient Pastel Studio Lighting Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#E9DFFF]/60 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#FFB8CB]/40 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-[#DDEBFF]/50 blur-3xl" />
        <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-[#E4FF83]/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: PITCH & DYNAMIC ROTATOR */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#7545F5]/15 backdrop-blur-md shadow-xs w-fit mb-5">
              <span className="w-2 h-2 rounded-full bg-[#7545F5] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wider text-[#7545F5] uppercase">
                MEET YOUR NEW FAVOURITE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1918] leading-[1.12] mb-5">
              <span className="block text-[#1A1918]">Pure Acoustic Clarity.</span>
              <HeadlineRotator />
            </h1>

            {/* Architectural Studio Accent Line */}
            <div className="h-[2px] w-28 bg-gradient-to-r from-[#7545F5] via-[#FFB8CB] to-transparent rounded-full mb-6" aria-hidden="true" />

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#1A1918]/80 leading-relaxed max-w-2xl font-light mb-8">
              A warm, architectural acoustic capsule that blends 360° studio clarity with tactile minimalist design. Engineered for creative focus, morning rituals, and mindful living.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a 
                href="#lead-form" 
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#7545F5] text-white font-medium text-base shadow-md hover:bg-[#6232e0] hover:shadow-lg transition-all duration-200 active:scale-95"
                id="hero-primary-cta"
              >
                <span>Request Details</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="#product-slider" 
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white/80 text-[#1A1918] font-medium text-base border border-[#1A1918]/15 backdrop-blur-sm shadow-xs hover:bg-white hover:border-[#7545F5]/40 transition-all duration-200 active:scale-95"
                id="hero-secondary-cta"
              >
                <span>See It in Action</span>
              </a>
            </div>

            {/* Direct Contact Pills: WhatsApp & Phone */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#25D366]/30 shadow-xs hover:border-[#25D366] hover:shadow-md transition-all duration-200"
                id="hero-whatsapp-btn"
                title="Chat with our studio team on WhatsApp"
              >
                <span className="w-8 h-8 rounded-xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform" aria-hidden="true">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </span>
                <span className="text-left">
                  <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Direct WhatsApp</span>
                  <strong className="block text-xs font-semibold text-[#1A1918]">{contact.whatsappDisplay}</strong>
                </span>
              </a>

              <a
                href={phoneUrl}
                className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white border border-[#7545F5]/25 shadow-xs hover:border-[#7545F5] hover:shadow-md transition-all duration-200"
                id="hero-phone-btn"
                title="Call our studio concierge"
              >
                <span className="w-8 h-8 rounded-xl bg-[#7545F5]/10 flex items-center justify-center text-[#7545F5] group-hover:scale-105 transition-transform" aria-hidden="true">
                  <Phone className="w-4 h-4" />
                </span>
                <span className="text-left">
                  <span className="block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">Studio Line</span>
                  <strong className="block text-xs font-semibold text-[#1A1918]">Call Direct</strong>
                </span>
              </a>
            </div>

            {/* Key Feature Specs Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/70 border border-[#7545F5]/10 backdrop-blur-md shadow-xs max-w-xl">
              <div className="text-left border-r border-slate-200/80 pr-2">
                <span className="block text-base font-bold text-[#1A1918]">18 Hours</span>
                <span className="block text-xs text-slate-500 font-medium">Continuous Playtime</span>
              </div>
              <div className="text-left border-r border-slate-200/80 px-2">
                <span className="block text-base font-bold text-[#1A1918]">360° Wave</span>
                <span className="block text-xs text-slate-500 font-medium">Omnidirectional Sound</span>
              </div>
              <div className="text-left pl-2">
                <span className="block text-base font-bold text-[#1A1918]">Cast Mineral</span>
                <span className="block text-xs text-slate-500 font-medium">Solid Brass Dials</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: LEAD FORM */}
          <div className="lg:col-span-5 flex flex-col gap-6" id="lead-form">
            {/* Inquiry Form */}
            <LeadForm />
          </div>

        </div>
      </div>
    </section>
  );
}
