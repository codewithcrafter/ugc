'use client';

import React, { useState } from 'react';
import { submitLead, validateLead } from '../services/leadService';
import { LeadFormData } from '../types';
import { CheckCircle2, ArrowRight, Loader2, MessageSquare } from 'lucide-react';

interface LeadFormProps {
  className?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    editionPreference: 'Flagship Travertine Edition',
    consent: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    leadId?: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof LeadFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLead(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitLead(formData);
      if (res.success) {
        setSubmissionResult({ success: true, leadId: res.leadId });
      } else {
        setErrors(res.fieldErrors || { fullName: res.error });
      }
    } catch {
      setErrors({ fullName: 'Unable to submit your inquiry. Please try again or chat via WhatsApp.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div
        className={`w-full max-w-[520px] mx-auto bg-white border border-[#7545F5]/20 rounded-3xl p-7 sm:p-8 shadow-[0_20px_50px_-12px_rgba(117,69,245,0.15)] text-center animate-in fade-in zoom-in-95 duration-500 ${className}`}
        id="lead-form-container"
      >
        <div className="w-14 h-14 rounded-full bg-[#E4FF83] border border-[#7545F5]/20 flex items-center justify-center mx-auto mb-4 text-[#7545F5] shadow-[0_4px_16px_rgba(228,255,131,0.5)]">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <span className="inline-block text-xs font-heading font-extrabold tracking-widest text-[#7545F5] uppercase mb-2">
          ALLOCATION RESERVED
        </span>

        <h3 className="font-heading text-2xl font-bold text-[#1A1918] mb-2 tracking-tight">
          Thank you, {formData.fullName.split(' ')[0]}
        </h3>

        <p className="text-sm text-[#555260] leading-relaxed mb-4">
          Your private allocation request for the <strong className="text-[#1A1918] font-semibold">{formData.editionPreference}</strong> has been logged. Our studio concierge will contact you within 2 business hours.
        </p>

        {submissionResult.leadId && (
          <div className="bg-[#FFFCF8] border border-[#7545F5]/15 rounded-xl px-4 py-2.5 mb-5 inline-block text-xs font-mono text-[#555260]">
            Reference ID: <strong className="text-[#7545F5]">{submissionResult.leadId}</strong>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <a
            href={`https://wa.me/15557294820?text=Hello%20AURA%20Studio!%20My%20inquiry%20reference%20is%20${encodeURIComponent(submissionResult.leadId || '')}.%20I'd%20like%20to%20confirm%20my%20allocation.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white font-heading text-sm font-semibold hover:bg-[#20ba59] transition-all shadow-md hover:shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Fast-Track on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmissionResult(null);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                editionPreference: 'Flagship Travertine Edition',
                consent: true,
              });
            }}
            className="text-xs text-[#555260] hover:text-[#7545F5] underline underline-offset-4 py-1"
          >
            Submit another allocation inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-[520px] mx-auto bg-white border border-[#7545F5]/16 rounded-3xl p-6 sm:p-7 shadow-[0_20px_52px_-12px_rgba(117,69,245,0.14),0_4px_16px_rgba(35,21,60,0.04)] relative z-2 ${className}`}
      id="lead-form-container"
    >
      <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9DFFF]/40 border border-[#7545F5]/20 text-[11px] font-heading font-extrabold uppercase tracking-wider text-[#7545F5] mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7545F5] animate-pulse" />
          <span>LIMITED BATCH • 250 UNITS</span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1A1918] tracking-tight">
          Request Private Allocation
        </h3>
        <p className="text-xs sm:text-sm text-[#555260] mt-1">
          Receive direct studio pricing, dispatch availability, and craftsmanship specs.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        {/* Full Name */}
        <div>
          <label htmlFor="lead-fullName" className="block font-heading text-xs font-semibold text-[#1A1918] mb-1">
            Full Name <span className="text-[#7545F5]">*</span>
          </label>
          <input
            type="text"
            id="lead-fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Elena Rostova"
            autoComplete="name"
            required
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none bg-[#FFFCF8] text-[#1A1918] placeholder:text-[#827D90]/70 ${
              errors.fullName
                ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                : 'border-[#7545F5]/20 focus:border-[#7545F5] focus:ring-2 focus:ring-[#7545F5]/15'
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="lead-email" className="block font-heading text-xs font-semibold text-[#1A1918] mb-1">
            Email Address <span className="text-[#7545F5]">*</span>
          </label>
          <input
            type="email"
            id="lead-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@studio.com"
            autoComplete="email"
            required
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none bg-[#FFFCF8] text-[#1A1918] placeholder:text-[#827D90]/70 ${
              errors.email
                ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                : 'border-[#7545F5]/20 focus:border-[#7545F5] focus:ring-2 focus:ring-[#7545F5]/15'
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="lead-phone" className="block font-heading text-xs font-semibold text-[#1A1918] mb-1">
            Direct Phone / WhatsApp <span className="text-[#7545F5]">*</span>
          </label>
          <input
            type="tel"
            id="lead-phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            required
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none bg-[#FFFCF8] text-[#1A1918] placeholder:text-[#827D90]/70 ${
              errors.phone
                ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                : 'border-[#7545F5]/20 focus:border-[#7545F5] focus:ring-2 focus:ring-[#7545F5]/15'
            }`}
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Edition Preference */}
        <div>
          <label htmlFor="lead-edition" className="block font-heading text-xs font-semibold text-[#1A1918] mb-1">
            Preferred Acoustic Edition
          </label>
          <select
            id="lead-edition"
            name="editionPreference"
            value={formData.editionPreference}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#7545F5]/20 text-sm bg-[#FFFCF8] text-[#1A1918] outline-none focus:border-[#7545F5] focus:ring-2 focus:ring-[#7545F5]/15"
          >
            <option value="Flagship Travertine Edition">Flagship Travertine Edition ($389)</option>
            <option value="Matte Charcoal & Brass">Matte Charcoal & Solid Brass ($419)</option>
            <option value="Dual-Sync Stereo Pair">Dual-Sync Stereo Pair (Numbered Batch)</option>
            <option value="Architectural Custom Inquiry">Architectural / Trade Inquiry</option>
          </select>
        </div>

        {/* Consent */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5 rounded border-[#7545F5]/30 text-[#7545F5] focus:ring-[#7545F5]/20 accent-[#7545F5]"
            />
            <span className="text-[11px] sm:text-xs text-[#555260] leading-snug">
              I agree to receive allocation details and craftsmanship updates. We never share your details.
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs text-red-500 mt-1" role="alert">
              {errors.consent}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#7545F5] text-white font-heading font-semibold text-sm hover:bg-[#6333ea] active:scale-[0.99] transition-all shadow-[0_8px_24px_rgba(117,69,245,0.32)] disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Allocation...</span>
            </>
          ) : (
            <>
              <span>Request Private Allocation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-[#827D90]">
          🔒 SSL Encrypted • 2-Year Craftsmanship Guarantee • Express Dispatch
        </p>
      </form>
    </div>
  );
};
