'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Sparkles, ArrowRight, X } from 'lucide-react';

interface UgcMoment {
  id: string;
  image: string;
  alt: string;
  category: string;
  duration: string;
  author: string;
  role: string;
  avatar: string;
  quote: string;
  extendedStory: string;
}

const UGC_MOMENTS: UgcMoment[] = [
  {
    id: 'ugc-1',
    image: '/images/ugc_morning.jpg',
    alt: 'Elena pouring pour-over coffee in morning light with AURA Studio capsule speaker',
    category: 'Morning Ritual',
    duration: '0:34',
    author: 'Elena Rostova',
    role: '@elena.design • Interior Stylist',
    avatar: 'E',
    quote: '“My morning pour-over ritual isn’t complete without this playing soft jazz. The travertine texture feels like sculpture on the island.”',
    extendedStory: 'Elena uses the Travertine Edition in her Scandinavian loft kitchen. The 360-degree wave fills the open space without needing directional aiming, creating a calm atmosphere for daily coffee preparation.',
  },
  {
    id: 'ugc-2',
    image: '/images/ugc_workspace.jpg',
    alt: 'Marcus sketching architectural drawings with AURA speaker on wooden drafting desk',
    category: 'Studio Setup',
    duration: '0:48',
    author: 'Marcus Vance',
    role: '@marcus_arch • Architect',
    avatar: 'M',
    quote: '“The tactile knurled brass dial is pure satisfaction. It feels like a calibrated instrument, not another disposable tech gadget.”',
    extendedStory: 'Marcus pairs AURA with his architectural workstation via lossless USB-C audio for distraction-free classical and ambient listening during late-night drafting sessions.',
  },
  {
    id: 'ugc-3',
    image: '/images/ugc_outdoor.jpg',
    alt: 'Sophia reading on terrace deck chair at sunset with AURA Studio speaker',
    category: 'Terrace Living',
    duration: '0:26',
    author: 'Sophia Lindqvist',
    role: '@sophia_reads • Curator',
    avatar: 'S',
    quote: '“Took it out to the terrace for golden hour reading. The acoustic dispersion outdoors is astonishingly clear, rich, and mellow.”',
    extendedStory: 'Sophia relies on the 18-hour battery to carry AURA from her sunroom library to the terrace without cords, maintaining warm acoustic clarity in open air.',
  },
];

export function UgcShowcase() {
  const [selectedMoment, setSelectedMoment] = useState<UgcMoment | null>(null);

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden bg-[#FFFCF8]" 
      id="ugc-showcase"
      aria-label="Everyday Moments from Real Patrons"
    >
      {/* Background Studio Lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-[#DDEBFF]/50 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-[#E4FF83]/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SCENE 05] REAL PATRONS // UNFILTERED SANCTUARY</span>
          </div>
          <span className="block text-xs font-bold tracking-widest text-[#7545F5] uppercase mb-2">
            COMMUNITY & MOMENTS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1918] mb-4">
            In Everyday Living
          </h2>
          <p className="text-base sm:text-lg text-[#1A1918]/70 leading-relaxed font-light">
            See how architects, ritualists, and creative professionals integrate AURA into their daily environments. Click any card to inspect.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {UGC_MOMENTS.map((moment) => (
            <article
              key={moment.id}
              onClick={() => setSelectedMoment(moment)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMoment(moment); }}
              tabIndex={0}
              role="button"
              aria-label={`View ${moment.author}'s ${moment.category} moment`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#7545F5]/10 shadow-xs hover:shadow-xl hover:border-[#7545F5]/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7545F5]"
            >
              {/* Media Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <Image
                  src={moment.image}
                  alt={moment.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-[#7545F5] shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-[#7545F5] group-hover:text-white transition-all duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-3 right-3 text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white">
                  {moment.duration}
                </span>

                {/* Category Pill */}
                <span className="absolute top-3 left-3 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#7545F5] text-white shadow-sm">
                  {moment.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7545F5] to-[#FFB8CB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {moment.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1A1918]">
                        {moment.author}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {moment.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[#1A1918]/80 leading-relaxed font-light italic mb-4">
                    {moment.quote}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#7545F5] group-hover:text-[#6232e0]">
                  <span>Click to inspect moment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* UGC Moment Inspection Modal */}
      {selectedMoment && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedMoment.author}'s Moment`}
          onClick={() => setSelectedMoment(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedMoment(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] w-full bg-black">
              <Image
                src={selectedMoment.image}
                alt={selectedMoment.alt}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
              <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#7545F5] text-white">
                {selectedMoment.category}
              </span>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7545F5] to-[#FFB8CB] text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {selectedMoment.avatar}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1A1918]">
                    {selectedMoment.author}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {selectedMoment.role}
                  </p>
                </div>
              </div>

              <blockquote className="text-base sm:text-lg text-[#1A1918] font-serif italic mb-4 leading-relaxed">
                {selectedMoment.quote}
              </blockquote>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                {selectedMoment.extendedStory}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-mono">
                  Runtime: {selectedMoment.duration} // 24FPS
                </span>
                <a
                  href="#lead-form"
                  onClick={() => setSelectedMoment(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7545F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors"
                >
                  <span>Inquire About This Edition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
