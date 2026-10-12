/**
 * UGC Showcase Modal / Lightbox Controller
 * ----------------------------------------
 * Accessible dialog modal with keyboard support (Escape to close),
 * focus management, and quick lead-inquiry redirection.
 */

export class UgcModalController {
  constructor(modalElement) {
    this.modal = modalElement;
    this.isOpen = false;
    this.lastFocusedElement = null;
    this.init();
  }

  init() {
    if (!this.modal) return;
    this.bindEvents();
  }

  bindEvents() {
    // Close button
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => this.close());

    // Backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open(ugcItem) {
    if (!this.modal || !ugcItem) return;

    this.lastFocusedElement = document.activeElement;
    this.isOpen = true;

    const modalBody = this.modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="ugc-modal-card">
          <div class="ugc-modal-media">
            <img 
              src="${ugcItem.image}" 
              alt="${ugcItem.alt}" 
              class="ugc-modal-img" 
              loading="eager"
            />
            <div class="ugc-modal-badge">
              <span class="live-dot" aria-hidden="true"></span>
              <span>${ugcItem.type}</span>
            </div>
          </div>

          <div class="ugc-modal-content">
            <div class="ugc-creator-profile">
              <div class="creator-avatar-badge">${ugcItem.creator.charAt(0)}</div>
              <div>
                <h4 class="ugc-creator-name">${ugcItem.creator}</h4>
                <p class="ugc-creator-handle">${ugcItem.handle} • ${ugcItem.role}</p>
              </div>
            </div>

            <blockquote class="ugc-modal-quote">
              ${ugcItem.caption}
            </blockquote>

            <div class="ugc-modal-features">
              <span class="feature-tag">Organic Acoustic Vibe</span>
              <span class="feature-tag">18h Battery</span>
              <span class="feature-tag">Cast Stone Composite</span>
            </div>

            <div class="ugc-modal-actions">
              <a 
                href="#lead-form" 
                class="btn btn-primary btn-block modal-cta-btn" 
                id="modal-inquire-btn"
              >
                Inquire About This Edition
              </a>
            </div>
          </div>
        </div>
      `;

      // Hook up inquire button to scroll to lead form and close modal
      const ctaBtn = modalBody.querySelector('#modal-inquire-btn');
      ctaBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
        const leadFormEl = document.querySelector('#lead-form');
        if (leadFormEl) {
          leadFormEl.scrollIntoView({ behavior: 'smooth' });
          const firstInput = leadFormEl.querySelector('#lead-fullname');
          setTimeout(() => firstInput?.focus(), 400);
        }
      });
    }

    this.modal.removeAttribute('hidden');
    this.modal.classList.add('is-active');
    document.body.classList.add('modal-is-open');

    // Focus close button
    const closeBtn = this.modal.querySelector('.modal-close-btn');
    closeBtn?.focus();
  }

  close() {
    if (!this.modal || !this.isOpen) return;

    this.isOpen = false;
    this.modal.classList.remove('is-active');
    this.modal.setAttribute('hidden', '');
    document.body.classList.remove('modal-is-open');

    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
      this.lastFocusedElement.focus();
    }
  }
}
