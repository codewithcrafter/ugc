'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { productConfig } from '../config/product';
import { GalleryItem } from '../types';
import { Sparkles, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export function Gallery() {
  const { gallery } = productConfig;
  const items: GalleryItem[] = gallery.images || [];
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setActiveLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const nextImage = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! + 1) % items.length);
  }, [activeLightboxIndex, items.length]);

  const prevImage = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! - 1 + items.length) % items.length);
  }, [activeLightboxIndex, items.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, closeLightbox, nextImage, prevImage]);

  const activeItem = activeLightboxIndex !== null ? items[activeLightboxIndex] : null;

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#FFFCF8] via-[#F8F5FF] to-[#FFFCF8]" 
      id="gallery"
      aria-label="Curated Perspectives Visual Gallery"
    >
      {/* Background Studio Lights */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/4 -right-24 w-80 h-80 rounded-full bg-[#E9DFFF]/40 blur-3xl" />
        <div className="absolute bottom-1/3 -left-24 w-96 h-96 rounded-full bg-[#FFB8CB]/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SCENE 06] 50MM F/1.4 // CURATED ARCHIVE</span>
          </div>
          <span className="block text-xs font-bold tracking-widest text-[#7545F5] uppercase mb-2">
            {gallery.eyebrow || 'CURATED PERSPECTIVES'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1918] mb-4">
            {gallery.headline || 'Form, Texture & Spatial Harmony'}
          </h2>
          <p className="text-base sm:text-lg text-[#1A1918]/70 leading-relaxed font-light">
            {gallery.lead || 'An editorial visual archive exploring the architectural lines, cast-stone materiality, and tactile acoustics of AURA Studio.'}
          </p>
        </div>

        {/* Masonry-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item: GalleryItem, index: number) => {
            // Give specific cards different heights for masonry rhythm
            const isTall = index === 1 || index === 4;

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(index); }}
                tabIndex={0}
                role="button"
                aria-label={`Open photo ${index + 1}: ${item.title}`}
                className={`group relative rounded-3xl overflow-hidden bg-white border border-[#7545F5]/10 shadow-xs hover:shadow-2xl hover:border-[#7545F5]/40 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7545F5] ${
                  isTall ? 'aspect-[3/4]' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle vignette scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

                {/* Corner Viewfinder Reticles */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40 rounded-tl pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40 rounded-br pointer-events-none" />

                {/* Fullscreen Expand Icon Button */}
                <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Tag & Title */}
                <div className="absolute inset-x-4 bottom-4 z-10 text-white">
                  <span className="inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#7545F5]/90 text-[#E4FF83] mb-1.5 backdrop-blur-xs">
                    {item.tag}
                  </span>
                  <p className="text-sm font-semibold tracking-tight text-white drop-shadow-sm line-clamp-1">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-lg animate-fade-in select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen Photo View"
          onClick={closeLightbox}
        >
          {/* Top Controls */}
          <div className="absolute top-6 inset-x-6 z-20 flex items-center justify-between text-white pointer-events-none">
            <span className="font-mono text-xs tracking-wider text-white/70">
              FRAME 0{activeLightboxIndex! + 1} / 0{items.length} • 50MM F/1.4
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close fullscreen view"
              className="pointer-events-auto w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Arrow */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Centered Main Image Frame */}
          <div 
            className="relative max-w-5xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Bottom Caption */}
            <div className="text-center mt-4">
              <span className="inline-block text-xs font-bold text-[#E4FF83] tracking-widest uppercase mb-1">
                {activeItem.tag}
              </span>
              <p className="text-sm sm:text-base text-white/90 font-medium">
                {activeItem.title} — {activeItem.description}
              </p>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>
      )}

    </section>
  );
}
