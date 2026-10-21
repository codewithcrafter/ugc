import React from 'react';
import { productConfig } from '../config/product';

export function BrandMarquee() {
  const { brandWall } = productConfig;
  const logos = brandWall.logos || [];

  // Duplicate list to achieve seamless infinite loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section 
      className="py-12 relative overflow-hidden bg-white/70 border-y border-[#7545F5]/10 backdrop-blur-md" 
      id="trust"
      aria-label="Brand Partners and Features"
    >
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <span className="text-[11px] font-bold tracking-widest text-[#7545F5] uppercase">
          {brandWall.eyebrow || 'FEATURED IN ARCHITECTURAL & DESIGN EDITORIALS'}
        </span>
      </div>

      {/* Infinite Horizontal Marquee Track */}
      <div className="relative w-full overflow-hidden flex items-center group">
        
        {/* Left & Right Gradient Fade Masks */}
        <div className="absolute left-0 inset-y-0 w-24 bg-gradient-to-r from-[#FFFCF8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-24 bg-gradient-to-l from-[#FFFCF8] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-12 sm:gap-16 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]">
          {duplicatedLogos.map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`}
              className="inline-flex flex-col items-center justify-center shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#1A1918]">
                {item.name.toUpperCase()}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
                Editorial Partner
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
