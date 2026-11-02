/**
 * MyUGC Video — Centralized Lead Ingestion & Validation Service
 * -------------------------------------------------------------
 * Validates inquiries and securely delivers submissions to the
 * central Google Apps Script Web App endpoint.
 *
 * All website forms (Hero Form, Photoshoot Popup, Inquiry Modal,
 * Chatbot Action) submit through this unified service.
 *
 * Core Features:
 * - 4-field validation (Full Name, Email Address, Phone Number, Optional Message).
 * - Honeypot spam defense.
 * - Anti-duplicate submission protection.
 * - Simple POST CORS handling compatible with Google Apps Script 302 redirects.
 * - Verified JSON response parsing (no false positives via opaque no-cors).
 * - Clear error reporting if remote submission fails.
 * - Transparent local simulation fallback when GOOGLE_SHEETS_WEB_APP_URL is unconfigured.
 */

import { GOOGLE_SHEETS_WEB_APP_URL } from '../config.js';

// Central configuration endpoint reference
export const CONFIGURED_API_ENDPOINT = GOOGLE_SHEETS_WEB_APP_URL;

/**
 * Validates the standard 4 form fields
 * @param {Object} formData
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateLead(formData) {
  const errors = {};

  const fullName = (formData.fullName || '').trim();
  const email = (formData.email || '').trim();
  const phone = (formData.phone || '').trim();

  // 1. Validate Full Name (required, min 2 chars, letters and basic punctuation)
  if (!fullName) {
    errors.fullName = 'Please enter your full name.';
  } else if (fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  } else if (!/^[\p{L}\s.'-]+$/u.test(fullName)) {
    errors.fullName = 'Please enter a valid name using letters and standard punctuation.';
  }

  // 2. Validate Email Address (required, standard RFC email pattern)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!email) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Please enter a valid email address (e.g., name@brand.com).';
  }

  // 3. Validate Phone Number (required, 7 to 15 digits)
  const phoneDigitsOnly = phone.replace(/\D/g, '');
  const phonePattern = /^[+]?[\d\s().-]{7,25}$/;
  if (!phone) {
    errors.phone = 'Please enter your phone number.';
  } else if (!phonePattern.test(phone) || phoneDigitsOnly.length < 7 || phoneDigitsOnly.length > 15) {
    errors.phone = 'Please enter a valid phone number (7 to 15 digits).';
  }

  // 4. Message is Optional — an empty message never invalidates the form.

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Submit inquiry to the central Google Apps Script endpoint
 * @param {Object} leadData
 * @param {string} leadData.fullName - Full Name *
 * @param {string} leadData.email - Email Address *
 * @param {string} leadData.phone - Phone Number *
 * @param {string} [leadData.message] - Optional message
 * @param {string} [leadData.formSource] - Origin identifier ("Hero Form", "Photoshoot Popup", etc.)
 * @param {string} [leadData.honeypot] - Hidden anti-spam field
 * @returns {Promise<{ success: boolean, leadId?: string, error?: string, fieldErrors?: object, isSimulation?: boolean }>}
 */
export async function submitLead(leadData) {
  // 1. Client-side field validation
  const validation = validateLead(leadData);
  if (!validation.isValid) {
    const firstErrorMessage = Object.values(validation.errors)[0];
    return {
      success: false,
      error: firstErrorMessage || 'Please verify the highlighted fields.',
      fieldErrors: validation.errors,
    };
  }

  // 2. Anti-Spam Honeypot Check
  // If a bot filled out the hidden honeypot input, silently discard without hitting Google Sheets
  const honeypot = (leadData.honeypot || leadData._hp_website || '').trim();
  if (honeypot.length > 0) {
    console.warn('[LeadService] Honeypot triggered; discarding spam submission.');
    return {
      success: true,
      leadId: 'MYUGC-HP-' + Date.now().toString(36).toUpperCase(),
    };
  }

  // 3. Prepare payload mapped to central spreadsheet columns:
  // [Timestamp (backend), Full Name, Email Address, Phone Number, Message, Form Source, Page URL]
  const payload = {
    fullName: leadData.fullName.trim(),
    email: leadData.email.trim(),
    phone: leadData.phone.trim(),
    message: (leadData.message || leadData.details || '').trim(),
    formSource: (leadData.formSource || leadData.source || 'Website Form').trim(),
    pageUrl: (typeof window !== 'undefined' && window.location ? window.location.href : ''),
    honeypot: '',
  };

  const endpointUrl = (GOOGLE_SHEETS_WEB_APP_URL || CONFIGURED_API_ENDPOINT || '').trim();

  // 4. Remote Submission to Google Apps Script
  if (endpointUrl) {
    try {
      /**
       * Note on Google Apps Script CORS:
       * Sending 'text/plain;charset=utf-8' with redirect: 'follow' performs a standard Simple POST.
       * This avoids CORS preflight OPTIONS failures (which Google Apps Script does not support)
       * and allows the browser to transparently follow Google's 302 redirect to script.googleusercontent.com,
       * which returns Access-Control-Allow-Origin: * and the verified JSON response.
       */
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Google Apps Script returned 401 Unauthorized. Please verify the Web App deployment is configured with "Execute as: Me" and "Who has access: Anyone".');
        }
        throw new Error(`Google Apps Script responded with HTTP status ${response.status}`);
      }

      // Read real verified response from Google Apps Script
      const result = await response.json();

      if (result && result.status === 'success') {
        return {
          success: true,
          leadId: result.leadId || 'MYUGC-' + Date.now().toString(36).toUpperCase(),
          data: payload,
          timestamp: result.timestamp,
        };
      } else {
        throw new Error(result?.message || 'The Google Apps Script rejected the submission.');
      }
    } catch (err) {
      console.error('[LeadService] Google Sheets submission error:', err);
      let errorDetail = err.message || 'Unable to record your inquiry.';
      if (errorDetail === 'Failed to fetch' || errorDetail.includes('Failed to fetch')) {
        errorDetail = 'Failed to fetch. Request blocked by Google: please verify your Apps Script Web App is deployed with "Execute as: Me" and "Who has access: Anyone".';
      }
      return {
        success: false,
        error: `Submission failed: ${errorDetail}`,
      };
    }
  }

  // 5. Transparent Simulation Fallback (When endpoint URL is not configured yet)
  // Simulates realistic network round-trip and saves to sessionStorage for local developer auditing
  await new Promise((resolve) => setTimeout(resolve, 600));

  const leadId = 'MYUGC-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 899 + 100);

  try {
    const existing = JSON.parse(sessionStorage.getItem('myugcvideo_submitted_leads') || '[]');
    existing.push({ id: leadId, ...payload, submittedAt: new Date().toISOString() });
    sessionStorage.setItem('myugcvideo_submitted_leads', JSON.stringify(existing));
  } catch (e) {
    // Ignore storage quota limits
  }

  console.info('[LeadService] Lead processed in local simulation mode (VITE_GOOGLE_SHEETS_WEB_APP_URL is not set):', {
    leadId,
    payload,
    setupGuide: 'Deploy google-apps-script/Code.gs as a Web App and add its URL to .env as VITE_GOOGLE_SHEETS_WEB_APP_URL',
  });

  return {
    success: true,
    leadId,
    data: payload,
    isSimulation: true,
  };
}
