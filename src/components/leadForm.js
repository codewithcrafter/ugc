/**
 * Lead Capture Form Controller
 * ----------------------------
 * Handles validation, accessible error announcements, loading states,
 * duplicate submission protection, and success rendering.
 */

import { submitLead, validateLead } from '../services/leadService.js';
import { productConfig } from '../config.js';

export class LeadFormController {
  constructor(formContainer) {
    this.container = formContainer;
    this.isSubmitting = false;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.renderForm();
    this.cacheElements();
    this.bindEvents();
  }

  renderForm() {
    const { contact } = productConfig;

    this.container.innerHTML = `
      <div class="lead-card" id="lead-form-card">
        <div class="lead-card-header">
          <div class="lead-card-pill">
            <span class="pulse-dot" aria-hidden="true"></span>
            <span>Private Allocation</span>
          </div>
          <h3 class="lead-card-title">Request Product Details</h3>
          <p class="lead-card-subtitle">Inquire for current batch availability, bespoke finishes, and dispatch timelines.</p>
        </div>

        <form class="lead-form" id="lead-capture-form" novalidate>
          <!-- Global Alert Banner -->
          <div class="form-alert" id="form-alert" role="alert" aria-live="assertive" style="display: none;"></div>

          <!-- Full Name -->
          <div class="form-group" id="group-fullName">
            <label for="lead-fullname" class="form-label">
              Full Name <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input 
                type="text" 
                id="lead-fullname" 
                name="fullName" 
                class="form-input" 
                placeholder="e.g. Alex Morgan" 
                autocomplete="name" 
                required 
                aria-required="true"
              />
            </div>
            <div class="field-error" id="error-fullName" aria-live="polite"></div>
          </div>

          <!-- Email Address -->
          <div class="form-group" id="group-email">
            <label for="lead-email" class="form-label">
              Email Address <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input 
                type="email" 
                id="lead-email" 
                name="email" 
                class="form-input" 
                placeholder="name@example.com" 
                autocomplete="email" 
                required 
                aria-required="true"
              />
            </div>
            <div class="field-error" id="error-email" aria-live="polite"></div>
          </div>

          <!-- Phone Number -->
          <div class="form-group" id="group-phone">
            <label for="lead-phone" class="form-label">
              Phone Number <span class="required-mark" aria-hidden="true">*</span>
            </label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input 
                type="tel" 
                id="lead-phone" 
                name="phone" 
                class="form-input" 
                placeholder="+1 (555) 000-0000" 
                autocomplete="tel" 
                required 
                aria-required="true"
              />
            </div>
            <div class="field-error" id="error-phone" aria-live="polite"></div>
          </div>

          <!-- Edition Preference (Optional) -->
          <div class="form-group" id="group-edition">
            <label for="lead-edition" class="form-label">Edition Preference</label>
            <div class="select-wrapper">
              <select id="lead-edition" name="editionPreference" class="form-select">
                <option value="Studio Travertine Edition (Flagship)">Studio Travertine Edition (Flagship)</option>
                <option value="Matte Charcoal Edition">Matte Charcoal Edition</option>
                <option value="Brushed Brass Limited Run">Brushed Brass Limited Run</option>
                <option value="Dual-Stereo Pair (Set of 2)">Dual-Stereo Pair (Set of 2)</option>
              </select>
            </div>
          </div>

          <!-- Privacy Consent Checkbox -->
          <div class="form-group checkbox-group" id="group-consent">
            <label class="checkbox-label" for="lead-consent">
              <input 
                type="checkbox" 
                id="lead-consent" 
                name="consent" 
                class="form-checkbox" 
                required 
                aria-required="true"
              />
              <span class="checkbox-custom" aria-hidden="true"></span>
              <span class="checkbox-text">
                I agree to be contacted with product availability and pricing. We never share your data.
              </span>
            </label>
            <div class="field-error" id="error-consent" aria-live="polite"></div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn btn-primary btn-block btn-submit" 
            id="lead-submit-btn"
          >
            <span class="btn-text">Request Details</span>
            <span class="btn-spinner" aria-hidden="true" style="display: none;">
              <svg class="spinner-svg" viewBox="0 0 24 24">
                <circle class="spinner-path" cx="12" cy="12" r="10" fill="none" stroke-width="3"></circle>
              </svg>
            </span>
          </button>

          <!-- Direct WhatsApp Note -->
          <div class="lead-direct-support">
            <span class="support-divider">or contact directly</span>
            <a 
              href="https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent(contact.whatsappPrefill)}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="direct-whatsapp-link"
              id="lead-form-whatsapp-link"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.06c-1.49 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.136 8.136 0 0 1-1.25-4.29c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.106 8.106 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16z"></path>
                <path d="M16.81 14.15c-.26-.13-1.54-.76-1.78-.85-.24-.09-.42-.13-.59.13-.18.26-.68.85-.83 1.03-.15.18-.31.2-.57.07-.26-.13-1.09-.4-2.08-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.18-.26.26-.44.09-.18.04-.33-.02-.46-.07-.13-.59-1.43-.81-1.96-.21-.51-.43-.44-.59-.45h-.51c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.2s.94 2.55 1.07 2.73c.13.18 1.85 2.82 4.48 3.96.63.27 1.12.44 1.5.56.63.2 1.21.17 1.66.11.51-.08 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.18-.5-.31z"></path>
              </svg>
              <span>Instant Chat: ${contact.whatsappDisplay}</span>
            </a>
          </div>
        </form>
      </div>
    `;
  }

  cacheElements() {
    this.form = this.container.querySelector('#lead-capture-form');
    this.submitBtn = this.container.querySelector('#lead-submit-btn');
    this.btnText = this.container.querySelector('.btn-text');
    this.btnSpinner = this.container.querySelector('.btn-spinner');
    this.alertBox = this.container.querySelector('#form-alert');
    this.inputs = {
      fullName: this.container.querySelector('#lead-fullname'),
      email: this.container.querySelector('#lead-email'),
      phone: this.container.querySelector('#lead-phone'),
      editionPreference: this.container.querySelector('#lead-edition'),
      consent: this.container.querySelector('#lead-consent'),
    };
    this.errorContainers = {
      fullName: this.container.querySelector('#error-fullName'),
      email: this.container.querySelector('#error-email'),
      phone: this.container.querySelector('#error-phone'),
      consent: this.container.querySelector('#error-consent'),
    };
  }

  bindEvents() {
    // Real-time validation on input / change
    Object.keys(this.inputs).forEach((key) => {
      const input = this.inputs[key];
      if (!input) return;

      input.addEventListener('input', () => {
        this.clearFieldError(key);
      });

      input.addEventListener('blur', () => {
        this.validateSingleField(key);
      });
    });

    // Form submission
    this.form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSubmit();
    });
  }

  getFormData() {
    return {
      fullName: this.inputs.fullName?.value || '',
      email: this.inputs.email?.value || '',
      phone: this.inputs.phone?.value || '',
      editionPreference: this.inputs.editionPreference?.value || '',
      consent: this.inputs.consent?.checked || false,
    };
  }

  validateSingleField(fieldName) {
    const data = this.getFormData();
    const { errors } = validateLead(data);

    if (errors[fieldName]) {
      this.showFieldError(fieldName, errors[fieldName]);
      return false;
    } else {
      this.clearFieldError(fieldName);
      return true;
    }
  }

  showFieldError(fieldName, message) {
    const errorEl = this.errorContainers[fieldName];
    const inputEl = this.inputs[fieldName];
    const groupEl = this.container.querySelector(`#group-${fieldName}`);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
    if (inputEl) {
      inputEl.classList.add('has-error');
      inputEl.setAttribute('aria-invalid', 'true');
    }
    if (groupEl) {
      groupEl.classList.add('has-error');
    }
  }

  clearFieldError(fieldName) {
    const errorEl = this.errorContainers[fieldName];
    const inputEl = this.inputs[fieldName];
    const groupEl = this.container.querySelector(`#group-${fieldName}`);

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
    if (inputEl) {
      inputEl.classList.remove('has-error');
      inputEl.removeAttribute('aria-invalid');
    }
    if (groupEl) {
      groupEl.classList.remove('has-error');
    }
  }

  clearAllErrors() {
    Object.keys(this.inputs).forEach((key) => this.clearFieldError(key));
    if (this.alertBox) {
      this.alertBox.style.display = 'none';
      this.alertBox.textContent = '';
    }
  }

  setSubmittingState(isSubmitting) {
    this.isSubmitting = isSubmitting;
    if (this.submitBtn) {
      this.submitBtn.disabled = isSubmitting;
    }

    Object.values(this.inputs).forEach((input) => {
      if (input) input.disabled = isSubmitting;
    });

    if (this.btnText && this.btnSpinner) {
      if (isSubmitting) {
        this.btnText.textContent = 'Securing Allocation...';
        this.btnSpinner.style.display = 'inline-flex';
      } else {
        this.btnText.textContent = 'Request Details';
        this.btnSpinner.style.display = 'none';
      }
    }
  }

  async handleSubmit() {
    if (this.isSubmitting) return;

    this.clearAllErrors();
    const formData = this.getFormData();
    const validation = validateLead(formData);

    if (!validation.isValid) {
      // Show errors on each failing field
      Object.entries(validation.errors).forEach(([field, msg]) => {
        this.showFieldError(field, msg);
      });

      // Focus first error field for accessibility
      const firstErrorKey = Object.keys(validation.errors)[0];
      this.inputs[firstErrorKey]?.focus();
      return;
    }

    this.setSubmittingState(true);

    try {
      const response = await submitLead(formData);

      if (response.success) {
        this.renderSuccess(response);
      } else {
        this.setSubmittingState(false);
        if (this.alertBox) {
          this.alertBox.className = 'form-alert alert-error';
          this.alertBox.textContent = response.error || 'Failed to submit inquiry. Please try again.';
          this.alertBox.style.display = 'block';
        }
      }
    } catch (err) {
      this.setSubmittingState(false);
      if (this.alertBox) {
        this.alertBox.className = 'form-alert alert-error';
        this.alertBox.textContent = 'An unexpected error occurred. Please contact us on WhatsApp directly.';
        this.alertBox.style.display = 'block';
      }
    }
  }

  renderSuccess(response) {
    const { data, leadId } = response;
    const { contact } = productConfig;

    this.container.innerHTML = `
      <div class="lead-card lead-card-success" role="status" aria-live="polite">
        <div class="success-icon-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h3 class="success-title">Inquiry Received</h3>
        <p class="success-subtitle">Thank you, <strong>${this.escapeHtml(data.fullName)}</strong>. Our studio concierge has reserved your allocation request.</p>

        <div class="success-summary-box">
          <div class="summary-row">
            <span class="summary-label">Reference ID</span>
            <span class="summary-value ref-id">${this.escapeHtml(leadId)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Preferred Edition</span>
            <span class="summary-value">${this.escapeHtml(data.editionPreference)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Confirmation To</span>
            <span class="summary-value">${this.escapeHtml(data.email)}</span>
          </div>
        </div>

        <p class="success-note">
          We will contact you via email and phone shortly with production lead-times and private ordering links.
        </p>

        <div class="success-actions">
          <a 
            href="https://wa.me/${contact.whatsappRaw}?text=${encodeURIComponent('Hello! My inquiry reference is ' + leadId + '. I would like to confirm my allocation.')}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="btn btn-whatsapp btn-block"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.06c-1.49 0-2.94-.4-4.21-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.136 8.136 0 0 1-1.25-4.29c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.23.85 5.77 2.39a8.106 8.106 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16z"></path>
            </svg>
            <span>Priority WhatsApp Concierge</span>
          </a>

          <button type="button" class="btn-text-link" id="reset-lead-form-btn">
            Submit another inquiry
          </button>
        </div>
      </div>
    `;

    const resetBtn = this.container.querySelector('#reset-lead-form-btn');
    resetBtn?.addEventListener('click', () => {
      this.init();
    });
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
