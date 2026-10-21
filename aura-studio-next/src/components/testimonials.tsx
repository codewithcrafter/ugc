'use client';

import React, { useState } from 'react';
import { productConfig } from '../config/product';
import { TestimonialItem } from '../types';
import { Sparkles, Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export function Testimonials() {
  const { testimonials } = productConfig;
  const reviews: TestimonialItem[] = testimonials || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const activeReview = reviews[currentIndex];

  return (
    <section 
      className="py-20 md:py-28 relative overflow-hidden bg-[#FFFCF8]" 
      id="testimonials"
      aria-label="Patron Reflections and Verified Reviews"
    >
      {/* Background Lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E9DFFF]/40 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#FFB8CB]/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>[SCENE 07] PATRON REFLECTIONS // VERIFIED REVIEWS</span>
          </div>
          <span className="block text-xs font-bold tracking-widest text-[#7545F5] uppercase mb-2">
            VERIFIED EXPERIENCES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1918] mb-4">
            Reflections From Our Owners
          </h2>
          <p className="text-base sm:text-lg text-[#1A1918]/70 leading-relaxed font-light">
            Authentic observations from verified patrons who have brought AURA into their private spaces.
          </p>
        </div>

        {/* Featured Testimonial Spotlight Card */}
        {activeReview && (
          <div className="max-w-4xl mx-auto relative">
            
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#7545F5]/15 shadow-xl relative overflow-hidden">
              
              {/* Top Stars & Verified Pill */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-1.5" aria-label={`${activeReview.rating} out of 5 stars`}>
                  {[...Array(activeReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4FF83]/40 border border-[#E4FF83] text-[#1A1918] text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{activeReview.date || 'Verified Studio Order'}</span>
                </div>
              </div>

              {/* Testimonial Quote */}
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#1A1918] leading-snug mb-8 italic">
                {activeReview.quote}
              </blockquote>

              {/* Author Info & Nav Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#7545F5] to-[#FFB8CB] text-white flex items-center justify-center font-bold text-base shadow-xs">
                    {activeReview.initials || activeReview.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A1918]">
                      {activeReview.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {activeReview.role} • {activeReview.location} • <span className="text-[#7545F5]">{activeReview.edition}</span>
                    </p>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={prevTestimonial}
                    aria-label="Previous review"
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#7545F5] hover:bg-[#7545F5]/10 text-[#1A1918] flex items-center justify-center transition-all duration-200 active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    0{currentIndex + 1} / 0{reviews.length}
                  </span>
                  <button
                    type="button"
                    onClick={nextTestimonial}
                    aria-label="Next review"
                    className="w-10 h-10 rounded-full border border-slate-200 hover:border-[#7545F5] hover:bg-[#7545F5]/10 text-[#1A1918] flex items-center justify-center transition-all duration-200 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Quick Dots Selector */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {reviews.map((_: TestimonialItem, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-[#7545F5]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
