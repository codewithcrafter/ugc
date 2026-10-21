'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Layers, Sliders, ShieldCheck, BatteryCharging } from 'lucide-react';
import { productConfig } from '../config/product';

export function AboutSection() {
  const { about } = productConfig;
  const [activeCard, setActiveCard] = useState<number>(0);

  // Stack of 3 photographic visual cards with layered depth
  const stackImages = [
    {
      src: '/images/about_brand.jpg',
      alt: 'AURA Studio acoustic capsule speaker harmoniously placed on a timber shelf in a calm interior',
      title: 'Hand-Assembled',
      subtitle: 'Cast stone enclosure with zero resonance',
    },
    {
      src: '/images/hero_product.jpg',
      alt: 'Macro perspective of AURA Studio knurled solid brass volume dial',
      title: 'Tactile Control',
      subtitle: 'Calibrated analog friction dials',
    },
    {
      src: '/images/gallery_1.jpg',
      alt: 'Architectural room placement with 360 acoustic dispersion',
      title: '360° Soundstage',
      subtitle: 'Tuned passive mineral radiators',
    },
  ];

  const specs = [
    {
      num: '01',
      title: 'Dual Custom Drivers',
      desc: '48mm full-range neodymium transducers with tuned passive radiators.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Lossless Bluetooth 5.4',
      desc: 'Instant wireless sync and zero-latency USB-C studio connection.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Solid Brass Hardware',
      desc: 'Every volume dial is machined from solid brass with silky damped friction.',
      icon: ShieldCheck,
    },
    {
      num: '04',
      title: '18h All-Day Play',
      desc: 'High-density battery cell built for weekend getaways and focused study.',
      icon: BatteryCharging,
    },
  ];

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden bg-[#FFFCF8]" 
      id="about"
      aria-label="About the Craft and Philosophy"
    >
      {/* Ambient Lighting Orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#E9DFFF]/50 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-[#FFB8CB]/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: EDITORIAL VISUAL (INTERACTIVE OVERLAPPING IMAGE STACK) */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] sm:aspect-[6/5] max-w-lg mx-auto">
              
              {/* Stack Layers */}
              {stackImages.map((card, idx) => {
                const isSelected = activeCard === idx;
                const offset = (idx - activeCard);

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveCard(idx)}
                    onMouseEnter={() => setActiveCard(idx)}
                    className={`absolute inset-0 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 cursor-pointer border border-white/60 bg-white ${
                      isSelected 
                        ? 'z-20 scale-100 translate-y-0 rotate-0 ring-2 ring-[#7545F5]/30 shadow-2xl' 
                        : idx > activeCard 
                        ? 'z-10 scale-95 translate-y-5 rotate-2 opacity-80' 
                        : 'z-0 scale-90 -translate-y-4 -rotate-2 opacity-60'
                    }`}
                    style={{
                      transformOrigin: 'bottom center',
                      transform: isSelected 
                        ? 'translateY(0) rotate(0deg) scale(1)' 
                        : `translateY(${offset * 16}px) rotate(${offset * 2.5}deg) scale(${1 - Math.abs(offset) * 0.05})`
                    }}
                  >
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 500px"
                      className="object-cover"
                      priority={idx === 0}
                    />

                    {/* Gradient Overlay for Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Pill on Active Card */}
                    <div className="absolute bottom-5 left-5 right-5 z-10 text-white flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-bold tracking-tight text-white drop-shadow-sm">
                          {card.title}
                        </span>
                        <span className="block text-xs text-white/80 font-light">
                          {card.subtitle}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[#E4FF83]">
                        0{idx + 1} / 0{stackImages.length}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Decorative Corner Viewfinder Marks */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#7545F5]/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#7545F5]/40 rounded-br-lg pointer-events-none" />

            </div>

            {/* Hint text for interaction */}
            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
              Hover or click stack frames to inspect architectural details
            </p>
          </div>

          {/* RIGHT: NARRATIVE & CRAFT SPECIFICATIONS */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-xs font-semibold tracking-wider uppercase mb-3 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[SCENE 03] TACTILE ACOUSTICS // CAST MINERAL ARCHIVE</span>
            </div>

            <span className="text-xs font-bold tracking-widest text-[#7545F5] uppercase mb-2">
              THE CRAFT & PHILOSOPHY
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1918] mb-6 leading-[1.15]">
              Sound That Feels Like Part of Your Architecture
            </h2>

            <p className="text-lg text-[#1A1918]/80 leading-relaxed font-light mb-6">
              Most portable audio is loud, glossy, and visually jarring. We designed AURA Studio to be the opposite: an acoustic presence that calms the senses before you even press play.
            </p>

            <div className="space-y-4 mb-8 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                <strong className="text-[#1A1918] font-semibold">Who is it for?</strong> Created for architects, writers, and mindful homeowners who seek uncompressed hi-fi audio without synthetic plastic clutter on their surfaces.
              </p>
              <p>
                <strong className="text-[#1A1918] font-semibold">What problem does it address?</strong> Jarring digital notification fatigue and hollow, tinny sound. AURA delivers rich, omnidirectional 360° warmth with analog-feeling physical controls that invite quiet touch.
              </p>
            </div>

            {/* 4 Value Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {specs.map((item) => (
                <div 
                  key={item.num}
                  className="p-4 rounded-2xl bg-white border border-[#7545F5]/10 shadow-xs hover:border-[#7545F5]/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#7545F5]">
                      {item.num}
                    </span>
                    <item.icon className="w-4 h-4 text-[#7545F5]/60" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1A1918] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Inquire Action */}
            <div>
              <a
                href="#lead-form"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#7545F5] text-white font-medium text-sm shadow-md hover:bg-[#6232e0] hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <span>Inquire About Availability</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
