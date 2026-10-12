/**
 * Premium Customer Testimonials Slider
 * --------------------------------------
 * Features:
 * - Fluid horizontal carousel with smooth GPU-accelerated translate
 * - Multi-card desktop view (3 cards), tablet (2 cards), and mobile (1 card)
 * - Auto-slide with graceful pause-on-hover and pause-on-touch
 * - Touch & swipe navigation on mobile/tablet
 * - Interactive pagination dots and numerical counter (e.g. 01 / 06)
 * - Accessible prev/next arrow controls and keyboard support (← / →)
 * - Respects prefers-reduced-motion
 */

export class TestimonialsSlider {
  constructor(containerElement, testimonialsData = []) {
    this.container = containerElement;
    this.testimonials = testimonialsData || [];
    this.currentIndex = 0;
    this.visibleCards = 3;
    this.maxIndex = 0;
    this.autoSlideTimer = null;
    this.isInteracting = false;

    // Touch gesture tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.isSwiping = false;

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (!this.container || !this.testimonials.length) return;

    this.render();
    this.cacheElements();
    this.calculateLayout();
    this.bindEvents();
    this.updateView(false);

    if (!this.prefersReducedMotion) {
      this.startAutoSlide();
    }
  }

  getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width <= 680) return 1;
    if (width <= 1024) return 2;
    return 3;
  }

  render() {
    const cardsHtml = this.testimonials
      .map((item, index) => this.renderCard(item, index))
      .join('');

    this.container.innerHTML = `
      <div class="testimonials-slider-component" id="testimonials-slider-box">
        <!-- Slider Header Navigation & Counter -->
        <div class="testimonials-slider-controls-bar">
          <div class="testimonials-counter-pill" aria-live="polite">
            <span class="counter-num active-num" id="testim-active-num">01</span>
            <span class="counter-sep">/</span>
            <span class="counter-num total-num" id="testim-total-num">${String(this.testimonials.length).padStart(2, '0')}</span>
          </div>

          <div class="testimonials-arrows-wrap">
            <button 
              type="button" 
              class="testimonial-nav-arrow arrow-prev" 
              id="testim-prev-btn" 
              aria-label="Previous testimonial"
              title="Previous review"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <button 
              type="button" 
              class="testimonial-nav-arrow arrow-next" 
              id="testim-next-btn" 
              aria-label="Next testimonial"
              title="Next review"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Carousel Viewport & Sliding Track -->
        <div class="testimonials-slider-viewport" id="testim-viewport">
          <div 
            class="testimonials-slider-track" 
            id="testim-track" 
            role="region" 
            aria-label="Customer Reviews Slider"
            tabindex="0"
          >
            ${cardsHtml}
          </div>
        </div>

        <!-- Bottom Pagination Dots -->
        <div class="testimonials-dots-wrap" id="testim-dots" role="tablist" aria-label="Testimonial slides pagination">
          <!-- Dynamically generated dots -->
        </div>
      </div>
    `;
  }

  renderCard(item, index) {
    const initials = item.initials || item.name.split(' ').map(n => n[0]).join('').slice(0, 2);

    return `
      <div 
        class="testimonial-slide-item" 
        data-slide-index="${index}" 
        role="group" 
        aria-roledescription="slide" 
        aria-label="Review ${index + 1} of ${this.testimonials.length} from ${item.name}"
      >
        <article class="testimonial-card">
          <!-- Decorative Watermark Quote Glyph -->
          <div class="testimonial-watermark" aria-hidden="true">“</div>

          <div class="stars-row">
            <div class="stars-group" aria-label="5 out of 5 stars">
              <span class="star-symbol">★★★★★</span>
            </div>
            <span class="verified-pill">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
                <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 8.685a1.473 1.473 0 0 1-2.126.02L1.442 8.017a1.473 1.473 0 0 1 2.083-2.083l3.14 3.14 6.82-7.643z"/>
              </svg>
              <span>Verified Order</span>
            </span>
          </div>

          <blockquote class="testimonial-quote">
            “${item.quote.replace(/^[“"]|[”"]$/g, '')}”
          </blockquote>

          <div class="testimonial-author">
            <div class="author-avatar-badge">${initials}</div>
            <div class="author-details">
              <div class="author-top-line">
                <strong class="author-name">${item.name}</strong>
                ${item.location ? `<span class="author-city">• ${item.location}</span>` : ''}
              </div>
              <div class="author-sub-line">
                <span class="author-role">${item.role || 'Patron'}</span>
                ${item.edition ? `<span class="author-edition">${item.edition}</span>` : ''}
              </div>
              ${item.date ? `<span class="author-date">${item.date}</span>` : ''}
            </div>
          </div>
        </article>
      </div>
    `;
  }

  cacheElements() {
    this.viewportEl = this.container.querySelector('#testim-viewport');
    this.trackEl = this.container.querySelector('#testim-track');
    this.activeNumEl = this.container.querySelector('#testim-active-num');
    this.totalNumEl = this.container.querySelector('#testim-total-num');
    this.prevBtn = this.container.querySelector('#testim-prev-btn');
    this.nextBtn = this.container.querySelector('#testim-next-btn');
    this.dotsContainer = this.container.querySelector('#testim-dots');
    this.slides = Array.from(this.container.querySelectorAll('.testimonial-slide-item'));
  }

  calculateLayout() {
    this.visibleCards = this.getVisibleCardsCount();
    this.maxIndex = Math.max(0, this.testimonials.length - this.visibleCards);

    // Keep currentIndex within bounds
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }

    this.renderDots();
  }

  renderDots() {
    if (!this.dotsContainer) return;

    // Number of steps
    const totalDots = this.maxIndex + 1;
    let dotsHtml = '';

    for (let i = 0; i < totalDots; i++) {
      dotsHtml += `
        <button 
          type="button" 
          class="testim-dot ${i === this.currentIndex ? 'is-active' : ''}" 
          data-dot-index="${i}" 
          role="tab" 
          aria-selected="${i === this.currentIndex}" 
          aria-label="Go to slide group ${i + 1}"
        ></button>
      `;
    }

    this.dotsContainer.innerHTML = dotsHtml;

    // Bind dot clicks
    const dots = this.dotsContainer.querySelectorAll('.testim-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-dot-index'), 10);
        if (!isNaN(idx)) {
          this.goTo(idx);
        }
      });
    });
  }

  bindEvents() {
    // Next / Prev button clicks
    this.prevBtn?.addEventListener('click', () => {
      this.prev();
      this.pauseAutoSlideTemporary();
    });

    this.nextBtn?.addEventListener('click', () => {
      this.next();
      this.pauseAutoSlideTemporary();
    });

    // Keyboard navigation when track is focused
    this.trackEl?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
        this.pauseAutoSlideTemporary();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
        this.pauseAutoSlideTemporary();
      }
    });

    // Hover listeners to pause/resume auto-slide
    const sliderBox = this.container.querySelector('#testimonials-slider-box');
    if (sliderBox) {
      sliderBox.addEventListener('mouseenter', () => this.stopAutoSlide());
      sliderBox.addEventListener('mouseleave', () => {
        if (!this.prefersReducedMotion) this.startAutoSlide();
      });
      sliderBox.addEventListener('focusin', () => this.stopAutoSlide());
      sliderBox.addEventListener('focusout', () => {
        if (!this.prefersReducedMotion) this.startAutoSlide();
      });
    }

    // Touch / Swipe on Viewport
    if (this.viewportEl) {
      this.viewportEl.addEventListener(
        'touchstart',
        (e) => {
          this.isSwiping = true;
          this.stopAutoSlide();
          this.touchStartX = e.touches[0].clientX;
          this.touchStartY = e.touches[0].clientY;
        },
        { passive: true }
      );

      this.viewportEl.addEventListener(
        'touchend',
        (e) => {
          if (!this.isSwiping) return;
          this.isSwiping = false;

          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const diffX = this.touchStartX - touchEndX;
          const diffY = this.touchStartY - touchEndY;

          // Horizontal swipe > 40px
          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
              this.next();
            } else {
              this.prev();
            }
          }

          if (!this.prefersReducedMotion) {
            this.pauseAutoSlideTemporary();
          }
        },
        { passive: true }
      );
    }

    // Window resize debounced recalculation
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.calculateLayout();
        this.updateView(false);
      }, 150);
    });
  }

  updateView(animated = true) {
    if (!this.trackEl || !this.slides.length) return;

    if (animated) {
      this.trackEl.style.transition = 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      this.trackEl.style.transition = 'none';
    }

    // Calculate item width and gap
    const firstSlide = this.slides[0];
    const trackStyles = window.getComputedStyle(this.trackEl);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '24') || 24;
    const slideWidth = firstSlide.offsetWidth;
    const offset = this.currentIndex * (slideWidth + gap);

    this.trackEl.style.transform = `translate3d(-${offset}px, 0, 0)`;

    // Update Counter
    if (this.activeNumEl) {
      this.activeNumEl.textContent = String(this.currentIndex + 1).padStart(2, '0');
    }

    // Update Dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.testim-dot');
      dots.forEach((dot, idx) => {
        const isActive = idx === this.currentIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    }

    // Update slide focus states
    this.slides.forEach((slide, idx) => {
      const isVisible = idx >= this.currentIndex && idx < this.currentIndex + this.visibleCards;
      slide.setAttribute('aria-hidden', String(!isVisible));
    });
  }

  next() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0; // Seamless loop to first
    }
    this.updateView(true);
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.maxIndex; // Seamless loop to last
    }
    this.updateView(true);
  }

  goTo(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateView(true);
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      this.next();
    }, 5500);
  }

  stopAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  pauseAutoSlideTemporary() {
    this.stopAutoSlide();
    clearTimeout(this._resumeTimeout);
    this._resumeTimeout = setTimeout(() => {
      if (!this.prefersReducedMotion) {
        this.startAutoSlide();
      }
    }, 4000);
  }

  destroy() {
    this.stopAutoSlide();
    clearTimeout(this._resumeTimeout);
  }
}
