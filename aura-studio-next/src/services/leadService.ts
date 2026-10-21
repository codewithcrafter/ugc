import { LeadFormData, ValidationResult, SubmissionResult } from '../types';

export const CONFIGURED_API_ENDPOINT: string | null = null;

export function validateLead(formData: Partial<LeadFormData>): ValidationResult {
  const errors: Partial<Record<keyof LeadFormData, string>> = {};

  const fullName = (formData.fullName || '').trim();
  const email = (formData.email || '').trim();
  const phone = (formData.phone || '').trim();
  const consent = Boolean(formData.consent);

  // Validate Name
  if (!fullName) {
    errors.fullName = 'Please enter your full name.';
  } else if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (!/^[\p{L}\s.'-]+$/u.test(fullName)) {
    errors.fullName = 'Please enter a valid name using letters and standard punctuation.';
  }

  // Validate Email
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address (e.g., name@example.com).';
  }

  // Validate Phone
  const phoneDigitsOnly = phone.replace(/\D/g, '');
  const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  if (!phone) {
    errors.phone = 'Please enter your phone number.';
  } else if (!phonePattern.test(phone) || phoneDigitsOnly.length < 7 || phoneDigitsOnly.length > 15) {
    errors.phone = 'Please enter a valid phone number (at least 7 to 15 digits).';
  }

  // Validate Consent
  if (!consent) {
    errors.consent = 'Please confirm your consent to receive product details.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export async function submitLead(leadData: LeadFormData): Promise<SubmissionResult> {
  const validation = validateLead(leadData);
  if (!validation.isValid) {
    const firstErrorMessage = Object.values(validation.errors)[0];
    return {
      success: false,
      error: firstErrorMessage || 'Please verify the highlighted fields.',
      fieldErrors: validation.errors,
    };
  }

  const payload: LeadFormData & { submittedAt: string; sourceUrl: string; userAgent: string } = {
    fullName: leadData.fullName.trim(),
    email: leadData.email.trim(),
    phone: leadData.phone.trim(),
    editionPreference: leadData.editionPreference || 'Flagship Travertine Edition',
    consent: Boolean(leadData.consent),
    submittedAt: new Date().toISOString(),
    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };

  if (CONFIGURED_API_ENDPOINT) {
    try {
      const response = await fetch(CONFIGURED_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned status ${response.status}: ${errorText || 'Unknown error'}`);
      }

      const result = await response.json().catch(() => ({}));
      return {
        success: true,
        leadId: (result as { id?: string }).id || 'LEAD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        data: payload,
      };
    } catch (err) {
      console.error('[LeadService] Remote submission failed:', err);
      return {
        success: false,
        error: 'Unable to reach the server. Please check your connection or contact us directly on WhatsApp.',
      };
    }
  }

  // Simulation mode
  await new Promise((resolve) => setTimeout(resolve, 800));

  const leadId = 'AURA-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);

  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(sessionStorage.getItem('aura_submitted_leads') || '[]');
      existing.push({ id: leadId, ...payload });
      sessionStorage.setItem('aura_submitted_leads', JSON.stringify(existing));
    } catch {
      // Ignore storage quota
    }
  }

  console.info('[LeadService] Lead successfully processed in local integration mode:', {
    leadId,
    payload,
  });

  return {
    success: true,
    leadId,
    data: payload,
    isLocalSimulation: true,
  };
}
