'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export function LegalModal({ isOpen, onClose, initialTab = 'privacy' }: LegalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h2 id="legal-modal-title" className="text-xl font-bold text-[#1A1918]">
            Privacy &amp; Studio Terms
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-[#1A1918] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-light">
          <div>
            <h3 className="text-base font-bold text-[#1A1918] mb-2">
              Privacy Policy
            </h3>
            <p className="mb-2">
              At AURA Studio, we believe privacy is fundamental. We collect only the contact details you voluntarily provide in the inquiry form (Name, Email, Phone, Edition Preference) solely to facilitate private allocation and customer concierge inquiries.
            </p>
            <p>
              We do not sell, rent, or trade your personal information with third-party advertising networks. All transmissions are encrypted using standard TLS protocols.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#1A1918] mb-2">
              Craftsmanship &amp; Terms
            </h3>
            <p className="mb-2">
              All AURA Studio audio capsules are manufactured with high-density mineral composites and solid brass hardware. Each unit is individually calibrated before dispatch and covered by our 2-Year Craftsmanship Guarantee against manufacturing defects.
            </p>
            <p>
              Quiet Trial: If AURA does not harmonize with your living space, you may arrange a return within 30 days of receipt in its original packaging for a full refund.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#7545F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
