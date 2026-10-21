/**
 * Premium Masonry Gallery & Fullscreen Image Viewer
 * ---------------------------------------------------
 * Features:
 * - Masonry / staggered editorial visual grid with portrait, landscape & square frames
 * - Hover overlays with smooth scale, title & expand icon
 * - Fullscreen obsidian lightbox with image prominently on the left and details on the right
 * - Previous / next navigation, keyboard shortcuts (← / → / Esc)
 * - Touch swipe navigation on mobile
 * - Fullscreen toggle mode
 * - Background scroll lock and accessible focus restoration
 */

export class GalleryController {
  constructor(containerElement, galleryData = {}) {
    this.container = containerElement;
    this.data = galleryData;
    this.images = galleryData.images || [];
    this.lightbox = null;
    this.init();
  }

  init() {
    if (!this.container || !this.images.length) return;

    this.render();
    this.initLightbox();
    this.bindEvents();
  }

  render() {
    const cardsHtml = this.images
      .map((item, index) => this.renderCard(item, index))
      .join('');

    this.container.innerHTML = `
      <div class="gallery-masonry-wrapper" id="gallery-masonry-grid" role="region" aria-label="Curated Perspectives Image Gallery">
        ${cardsHtml}
      </div>
    `;
  }

  renderCard(item, index) {
    const ratioClass = item.ratio ? `ratio-${item.ratio}` : '';
    const tag = item.tag || 'Perspective';
    const variantClass = index % 2 === 0 ? 'reveal-mask' : 'reveal-3d';

    return `
      <article 
        class="gallery-card ${ratioClass} ${variantClass} reveal-wave-item" 
        data-gallery-index="${index}" 
        tabindex="0" 
        role="button" 
        aria-label="View ${item.title} in fullscreen"
      >
        <div class="gallery-card-inner">
          <img 
            src="${item.src}" 
            alt="${item.alt || item.title}" 
            class="gallery-card-img" 
            loading="lazy" 
            decoding="async"
            width="600" 
            height="450" 
          />
          <div class="gallery-card-overlay">
            <div class="gallery-overlay-badge">
              <span class="gallery-aspect-tag">${tag}</span>
            </div>

            <div class="gallery-card-footer">
              <div class="gallery-card-details">
                <h3 class="gallery-card-title">${item.title}</h3>
                ${item.description ? `<p class="gallery-card-desc">${item.description}</p>` : ''}
              </div>
              <div class="gallery-card-expand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  initLightbox() {
    let lightboxEl = document.getElementById('gallery-lightbox');
    if (!lightboxEl) {
      lightboxEl = document.createElement('div');
      lightboxEl.id = 'gallery-lightbox';
      lightboxEl.className = 'gallery-lightbox';
      lightboxEl.setAttribute('role', 'dialog');
      lightboxEl.setAttribute('aria-modal', 'true');
      lightboxEl.setAttribute('aria-label', 'Fullscreen Image Lightbox');
      lightboxEl.setAttribute('hidden', '');
      document.body.appendChild(lightboxEl);
    }

    this.lightbox = new GalleryLightboxController(lightboxEl, this.images);
  }

  bindEvents() {
    const cards = this.container.querySelectorAll('.gallery-card');
    cards.forEach((card) => {
      const index = parseInt(card.getAttribute('data-gallery-index'), 10);

      const handleOpen = () => {
        if (this.lightbox && !isNaN(index)) {
          this.lightbox.open(index, card);
        }
      };

      card.addEventListener('click', handleOpen);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      });
    });
  }

  destroy() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  }
}

/**
 * Fullscreen Lightbox Controller
 * -------------------------------
 * Pure vanilla JS, keyboard accessible, touch swipe support, fullscreen mode toggle.
 */
export class GalleryLightboxController {
  constructor(modalElement, images = []) {
    this.modal = modalElement;
    this.images = images;
    this.currentIndex = 0;
    this.isOpen = false;
    this.lastFocusedCard = null;

    // Touch tracking
    this.touchStartX = 0;
    this.touchStartY = 0;

    this.init();
  }

  init() {
    if (!this.modal) return;
    this.renderSkeleton();
    this.cacheElements();
    this.bindEvents();
  }

  renderSkeleton() {
    this.modal.innerHTML = `
      <div class="lightbox-backdrop" aria-hidden="true"></div>
      
      <div class="lightbox-container" role="document">
        <!-- Top Control Bar -->
        <header class="lightbox-header">
          <div class="lightbox-counter-pill" aria-live="polite">
            <span id="lb-current-idx">01</span>
            <span class="lb-counter-sep">/</span>
            <span id="lb-total-idx">${String(this.images.length).padStart(2, '0')}</span>
          </div>

          <div class="lightbox-actions">
            <button 
              type="button" 
              class="lightbox-btn-icon" 
              id="lb-fullscreen-btn" 
              aria-label="Toggle Fullscreen" 
              title="Toggle Fullscreen"
            >
              <svg class="icon-expand" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
              <svg class="icon-compress" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display: none;">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
              </svg>
            </button>

            <button 
              type="button" 
              class="lightbox-btn-icon lightbox-btn-close lightbox-close" 
              id="lb-close-btn" 
              aria-label="Close fullscreen gallery" 
              title="Close (Esc)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <!-- Main Lightbox Stage (Left Image, Right Information) -->
        <div class="lightbox-stage" id="lb-stage">
          <!-- Left Column: Large Image Stage -->
          <div class="lightbox-media-col" id="lb-media-col">
            <button 
              type="button" 
              class="lightbox-nav-arrow arrow-prev" 
              id="lb-arrow-prev" 
              aria-label="Previous image" 
              title="Previous (Left Arrow)"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <div class="lightbox-img-wrapper" id="lb-img-wrapper">
              <img 
                id="lb-img" 
                src="" 
                alt="" 
                class="lightbox-img" 
              />
            </div>

            <button 
              type="button" 
              class="lightbox-nav-arrow arrow-next" 
              id="lb-arrow-next" 
              aria-label="Next image" 
              title="Next (Right Arrow)"
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <!-- Right Column: Information Panel -->
          <aside class="lightbox-info-col" id="lb-info-col" aria-label="Selected Image Details">
            <div class="lightbox-info-body">
              <span class="lightbox-eyebrow">AURA ARCHIVE • PERSPECTIVE</span>
              <h2 class="lightbox-title" id="lb-title"></h2>
              
              <div class="lightbox-divider" aria-hidden="true"></div>

              <div class="lightbox-desc-wrap">
                <p class="lightbox-desc" id="lb-desc"></p>
              </div>

              <!-- Curated Craft Meta Grid -->
              <div class="lightbox-meta-grid">
                <div class="meta-pill">
                  <span class="meta-pill-label">Category</span>
                  <span class="meta-pill-value" id="lb-tag-value">Editorial Production</span>
                </div>
                <div class="meta-pill">
                  <span class="meta-pill-label">Format</span>
                  <span class="meta-pill-value">4K & 9:16 Vertical</span>
                </div>
                <div class="meta-pill">
                  <span class="meta-pill-label">Lighting</span>
                  <span class="meta-pill-value">Studio Softbox Rig</span>
                </div>
                <div class="meta-pill">
                  <span class="meta-pill-label">Talent</span>
                  <span class="meta-pill-value">Vetted UGC Creator</span>
                </div>
              </div>
            </div>

            <!-- Lightbox Bottom Navigation & Keyboard Hint -->
            <div class="lightbox-info-footer">
              <div class="lightbox-footer-nav-row">
                <button 
                  type="button" 
                  class="lightbox-nav-button btn-prev" 
                  id="lb-btn-prev" 
                  aria-label="Previous image"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span>Previous</span>
                </button>

                <button 
                  type="button" 
                  class="lightbox-nav-button btn-next" 
                  id="lb-btn-next" 
                  aria-label="Next image"
                >
                  <span>Next</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              <div class="lightbox-keyboard-hint" aria-hidden="true">
                <span>Navigate with <kbd>←</kbd> <kbd>→</kbd> • Close with <kbd>Esc</kbd></span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  cacheElements() {
    this.currentIdxEl = this.modal.querySelector('#lb-current-idx');
    this.totalIdxEl = this.modal.querySelector('#lb-total-idx');
    this.imgEl = this.modal.querySelector('#lb-img');
    this.titleEl = this.modal.querySelector('#lb-title');
    this.descEl = this.modal.querySelector('#lb-desc');
    this.tagValueEl = this.modal.querySelector('#lb-tag-value');
    this.mediaColEl = this.modal.querySelector('#lb-media-col');
    this.closeBtn = this.modal.querySelector('#lb-close-btn');
    this.fullscreenBtn = this.modal.querySelector('#lb-fullscreen-btn');
    this.arrowPrevBtn = this.modal.querySelector('#lb-arrow-prev');
    this.arrowNextBtn = this.modal.querySelector('#lb-arrow-next');
    this.btnPrev = this.modal.querySelector('#lb-btn-prev');
    this.btnNext = this.modal.querySelector('#lb-btn-next');
    this.backdropEl = this.modal.querySelector('.lightbox-backdrop');
    this.stageEl = this.modal.querySelector('#lb-stage');
  }

  bindEvents() {
    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());

    // Backdrop click
    this.backdropEl?.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      // If clicked outside stage or container background
      if (e.target === this.modal || e.target === this.backdropEl) {
        this.close();
      }
    });

    // Next / Prev buttons
    this.arrowNextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });
    this.btnNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    this.arrowPrevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });
    this.btnPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    // Fullscreen toggle
    this.fullscreenBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFullscreen();
    });

    // Global keyboard listener
    this._keydownHandler = (e) => {
      if (!this.isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      }
    };
    document.addEventListener('keydown', this._keydownHandler);

    // Touch swipe gestures on media column
    if (this.mediaColEl) {
      this.mediaColEl.addEventListener(
        'touchstart',
        (e) => {
          this.touchStartX = e.changedTouches[0].screenX;
          this.touchStartY = e.changedTouches[0].screenY;
        },
        { passive: true }
      );

      this.mediaColEl.addEventListener(
        'touchend',
        (e) => {
          const touchEndX = e.changedTouches[0].screenX;
          const touchEndY = e.changedTouches[0].screenY;
          this.handleSwipe(touchEndX, touchEndY);
        },
        { passive: true }
      );
    }

    // Fullscreen change listener to sync icon
    document.addEventListener('fullscreenchange', () => this.syncFullscreenState());
    document.addEventListener('webkitfullscreenchange', () => this.syncFullscreenState());
  }

  handleSwipe(endX, endY) {
    const diffX = endX - this.touchStartX;
    const diffY = endY - this.touchStartY;

    // Must be predominantly horizontal swipe > 45px
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        // Swiped left -> next
        this.next();
      } else {
        // Swiped right -> prev
        this.prev();
      }
    }
  }

  open(index = 0, triggerCard = null) {
    if (!this.images.length) return;

    this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
    this.lastFocusedCard = triggerCard || document.activeElement;
    this.isOpen = true;

    this.modal.removeAttribute('hidden');
    // Force reflow for smooth transition
    void this.modal.offsetWidth;
    this.modal.classList.add('is-active');

    document.body.classList.add('lightbox-is-open');

    this.updateView();

    // Focus close button for accessibility
    setTimeout(() => {
      this.closeBtn?.focus();
    }, 50);
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.modal.classList.remove('is-active');
    document.body.classList.remove('lightbox-is-open');

    // Exit browser fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    setTimeout(() => {
      this.modal.setAttribute('hidden', '');
    }, 300);

    // Restore focus to card
    if (this.lastFocusedCard && typeof this.lastFocusedCard.focus === 'function') {
      this.lastFocusedCard.focus();
    }
  }

  next() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateView();
  }

  prev() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateView();
  }

  updateView() {
    const item = this.images[this.currentIndex];
    if (!item) return;

    // Counter
    if (this.currentIdxEl) {
      this.currentIdxEl.textContent = String(this.currentIndex + 1).padStart(2, '0');
    }
    if (this.totalIdxEl) {
      this.totalIdxEl.textContent = String(this.images.length).padStart(2, '0');
    }

    // Image with quick fade transition
    if (this.imgEl) {
      this.imgEl.style.opacity = '0';
      this.imgEl.style.transform = 'scale(0.985)';

      const preload = new Image();
      preload.src = item.src;
      preload.onload = () => {
        this.imgEl.src = item.src;
        this.imgEl.alt = item.alt || item.title || 'AURA Studio perspective';
        requestAnimationFrame(() => {
          this.imgEl.style.opacity = '1';
          this.imgEl.style.transform = 'scale(1)';
        });
      };
      // Fallback if cached immediately
      if (preload.complete) {
        this.imgEl.src = item.src;
        this.imgEl.alt = item.alt || item.title || 'AURA Studio perspective';
        requestAnimationFrame(() => {
          this.imgEl.style.opacity = '1';
          this.imgEl.style.transform = 'scale(1)';
        });
      }
    }

    // Text content
    if (this.titleEl) {
      this.titleEl.textContent = item.title || 'AURA Studio Perspective';
    }

    if (this.descEl) {
      if (item.description) {
        this.descEl.textContent = item.description;
        this.descEl.style.display = 'block';
      } else {
        this.descEl.textContent = '';
        this.descEl.style.display = 'none';
      }
    }

    if (this.tagValueEl) {
      this.tagValueEl.textContent = item.tag || 'Architectural Still';
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.modal.requestFullscreen) {
        this.modal.requestFullscreen().catch(() => {});
      } else if (this.modal.webkitRequestFullscreen) {
        this.modal.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  syncFullscreenState() {
    const isFullscreen = Boolean(document.fullscreenElement);
    const expandIcon = this.fullscreenBtn?.querySelector('.icon-expand');
    const compressIcon = this.fullscreenBtn?.querySelector('.icon-compress');

    if (expandIcon && compressIcon) {
      expandIcon.style.display = isFullscreen ? 'none' : 'block';
      compressIcon.style.display = isFullscreen ? 'block' : 'none';
    }
  }

  destroy() {
    if (this._keydownHandler) {
      document.removeEventListener('keydown', this._keydownHandler);
    }
    if (this.isOpen) {
      this.close();
    }
    this.modal?.remove();
  }
}
