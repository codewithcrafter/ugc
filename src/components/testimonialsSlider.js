/**
 * UGC STUDIO — PREMIUM SINGLE-CARD INFINITE TESTIMONIALS SLIDER
 * ---------------------------------------------------------------
 * Art-directed, luxury dark-themed customer review showcase.
 * 
 * Features:
 * - One Testimonial at a Time: Refined, prominent editorial card with
 *   generous typography, understated quotation glyph, and balanced hierarchy.
 * - Subtle Entrance Animation: Combines vertical slide, opacity fade, and slight
 *   scale transition with micro-staggered typography entrance.
 * - Genuinely Seamless Infinite Loop:
 *   - NEXT on final testimonial (Client 3) wraps smoothly to the first (Client 1).
 *   - PREV on first testimonial (Client 1) wraps smoothly to the final (Client 3).
 *   - ZERO gaps, ZERO visible jumps, ZERO flickering, and ZERO abrupt resets.
 * - Subtle Autoplay (6.5s interval):
 *   - Pauses gracefully on hover or keyboard focus.
 *   - Pauses when the browser tab is hidden (document.visibilityState === 'hidden').
 *   - Resumes seamlessly when visible and unhovered.
 *   - Respects prefers-reduced-motion.
 * - Discreet Progress Counter (01 / 03), accessible Prev/Next arrows,
 *   and interactive pagination dots.
 * - Touch & keyboard accessible (ArrowLeft / ArrowRight).
 */

export class TestimonialsSlider {
  constructor(containerElement, testimonialsData = []) {
    this.container = containerElement;
    this.testimonials = Array.isArray(testimonialsData) && testimonialsData.length ? testimonialsData : [];
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.autoSlideTimer = null;
    this.autoSlideInterval = 6500; // 6.5 seconds comfortable reading interval
    this.isHoveredOrFocused = false;

    // Touch gesture tracking
    this.touchStartX = 0;
    this.touchStartY = 0;

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this._cleanupFns = [];

    this.init();
  }

  init() {
    if (!this.container || !this.testimonials.length) return;

    this.render();
    this.cacheElements();
    this.bindEvents();
    this.renderCardContent(0, 'init');

    if (!this.prefersReducedMotion) {
      this.startAutoSlide();
    }
  }

  render() {
    const totalCount = this.testimonials.length;
    const formattedTotal = String(totalCount).padStart(2, '0');

    // Build pagination dots
    const dotsHtml = this.testimonials
      .map(
        (_, i) => `
        <button 
          type="button" 
          class="testim-dot ${i === 0 ? 'is-active' : ''}" 
          data-dot-index="${i}"
          role="tab"
          aria-selected="${i === 0 ? 'true' : 'false'}"
          aria-label="Go to testimonial ${i + 1}"
        ></button>
      `
      )
      .join('');

    this.container.innerHTML = `
      <div class="testimonials-single-showcase" id="testimonials-single-showcase">
        <!-- Ambient Stage Aura Lighting -->
        <div class="testim-ambient-aura" aria-hidden="true"></div>

        <!-- Upper Controls Toolbar (Progress Counter & Navigation Arrows) -->
        <div class="testimonials-top-bar">
          <div class="testimonials-counter-pill" aria-live="polite">
            <span class="counter-num active-num" id="testim-active-num">01</span>
            <span class="counter-sep">/</span>
            <span class="counter-num total-num" id="testim-total-num">${formattedTotal}</span>
          </div>

          <div class="testimonials-nav-arrows" role="group" aria-label="Testimonial Navigation">
            <button 
              type="button" 
              class="testimonial-nav-arrow arrow-prev" 
              id="testim-prev-btn" 
              aria-label="Previous testimonial"
              title="Previous testimonial"
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
              title="Next testimonial"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Single Primary Testimonial Stage Viewport -->
        <div class="testimonial-single-viewport" id="testim-viewport">
          <div class="testimonial-single-card-wrap" id="testim-card-wrap">
            <!-- Dynamically populated by renderCardContent() -->
          </div>
        </div>

        <!-- Bottom Pagination Dots & Autoplay Bar -->
        <div class="testimonials-bottom-bar">
          <div class="testimonials-dots-wrap" id="testim-dots" role="tablist" aria-label="Testimonials pagination">
            ${dotsHtml}
          </div>
        </div>
      </div>
    `;
  }

  cacheElements() {
    this.cardWrap = this.container.querySelector('#testim-card-wrap');
    this.counterCurrent = this.container.querySelector('#testim-active-num');
    this.btnPrev = this.container.querySelector('#testim-prev-btn');
    this.btnNext = this.container.querySelector('#testim-next-btn');
    this.dots = Array.from(this.container.querySelectorAll('.testim-dot'));
    this.componentEl = this.container.querySelector('#testimonials-single-showcase');
  }

  getCardMarkup(item, index) {
    const initials = item.initials || 'C' + (index + 1);

    return `
      <article class="testimonial-single-card" data-index="${index}" role="group" aria-roledescription="slide" aria-label="Review ${index + 1} of ${this.testimonials.length} from ${item.name}">
        <!-- Top Card Row: Minimalist Quote Mark & Star Rating -->
        <div class="testimonial-card-header">
          <div class="testimonial-quote-glyph" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>

          <div class="testimonial-verified-badge">
            <span class="star-rating" aria-label="5 out of 5 stars">★★★★★</span>
            <span class="verified-label">Verified Client Review</span>
          </div>
        </div>

        <!-- Prominent Testimonial Text with micro-animation -->
        <blockquote class="testimonial-single-quote">
          “${item.quote}”
        </blockquote>

        <!-- Author Information Line with micro-animation -->
        <div class="testimonial-single-author">
          <div class="author-avatar-badge">${initials}</div>
          <div class="author-details-column">
            <strong class="author-name">— ${item.name}</strong>
            <span class="author-role-caption">UGC Production Partner</span>
          </div>
        </div>
      </article>
    `;
  }

  renderCardContent(targetIndex, direction = 'init') {
    if (targetIndex < 0 || targetIndex >= this.testimonials.length) return;

    const item = this.testimonials[targetIndex];
    this.currentIndex = targetIndex;

    // 1. Update counter pill
    if (this.counterCurrent) {
      this.counterCurrent.textContent = String(targetIndex + 1).padStart(2, '0');
    }

    // 2. Update pagination dots
    this.dots.forEach((dot, idx) => {
      const isSelected = idx === targetIndex;
      dot.classList.toggle('is-active', isSelected);
      dot.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    if (!this.cardWrap) return;

    if (direction === 'init') {
      this.cardWrap.innerHTML = this.getCardMarkup(item, targetIndex);
      return;
    }

    // Subtle entrance animation combining vertical slide, opacity fade, and slight scale transition
    const outgoingClass = direction === 'next' ? 'slide-out-next' : 'slide-out-prev';
    const incomingClass = direction === 'next' ? 'slide-in-next' : 'slide-in-prev';

    this.cardWrap.classList.remove('slide-in-next', 'slide-in-prev', 'slide-out-next', 'slide-out-prev');
    this.cardWrap.classList.add(outgoingClass);

    setTimeout(() => {
      this.cardWrap.innerHTML = this.getCardMarkup(item, targetIndex);
      this.cardWrap.classList.remove(outgoingClass);
      this.cardWrap.classList.add(incomingClass);

      setTimeout(() => {
        this.cardWrap.classList.remove(incomingClass);
      }, 340);
    }, 180);
  }

  goToSlide(targetIndex, direction = 'next') {
    if (this.isTransitioning) return;
    if (targetIndex === this.currentIndex) return;

    this.isTransitioning = true;
    this.renderCardContent(targetIndex, direction);

    setTimeout(() => {
      this.isTransitioning = false;
    }, 450);
  }

  next() {
    // Seamless infinite wrap-around: 0 -> 1 -> 2 -> 0 -> 1...
    const nextIdx = (this.currentIndex + 1) % this.testimonials.length;
    this.goToSlide(nextIdx, 'next');
  }

  prev() {
    // Seamless infinite wrap-around: 2 <- 1 <- 0 <- 2...
    const prevIdx = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.goToSlide(prevIdx, 'prev');
  }

  startAutoSlide() {
    this.stopAutoSlide();
    if (this.prefersReducedMotion) return;

    this.autoSlideTimer = setInterval(() => {
      this.next();
    }, this.autoSlideInterval);
  }

  stopAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  bindEvents() {
    // Navigation arrows
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
        this.startAutoSlide();
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
        this.startAutoSlide();
      });
    }

    // Pagination dots
    this.dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        if (idx === this.currentIndex) return;
        const direction = idx > this.currentIndex ? 'next' : 'prev';
        this.goToSlide(idx, direction);
        this.startAutoSlide();
      });
    });

    // Pause on hover
    if (this.componentEl) {
      const onMouseEnter = () => {
        this.isHoveredOrFocused = true;
        this.stopAutoSlide();
      };

      const onMouseLeave = () => {
        this.isHoveredOrFocused = false;
        if (!this.prefersReducedMotion && !document.hidden) {
          this.startAutoSlide();
        }
      };

      this.componentEl.addEventListener('mouseenter', onMouseEnter);
      this.componentEl.addEventListener('mouseleave', onMouseLeave);

      // Pause on keyboard focus
      const onFocusIn = () => {
        this.isHoveredOrFocused = true;
        this.stopAutoSlide();
      };

      const onFocusOut = () => {
        this.isHoveredOrFocused = false;
        if (!this.prefersReducedMotion && !document.hidden) {
          this.startAutoSlide();
        }
      };

      this.componentEl.addEventListener('focusin', onFocusIn);
      this.componentEl.addEventListener('focusout', onFocusOut);

      // Keyboard navigation (ArrowLeft / ArrowRight)
      const onKeyDown = (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
          this.startAutoSlide();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
          this.startAutoSlide();
        }
      };
      this.componentEl.addEventListener('keydown', onKeyDown);

      // Touch gesture support
      const onTouchStart = (e) => {
        if (e.touches.length === 1) {
          this.touchStartX = e.touches[0].clientX;
          this.touchStartY = e.touches[0].clientY;
        }
      };

      const onTouchEnd = (e) => {
        if (e.changedTouches.length === 1) {
          const diffX = this.touchStartX - e.changedTouches[0].clientX;
          const diffY = this.touchStartY - e.changedTouches[0].clientY;

          if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
            if (diffX > 0) {
              this.next();
            } else {
              this.prev();
            }
            this.startAutoSlide();
          }
        }
      };

      this.componentEl.addEventListener('touchstart', onTouchStart, { passive: true });
      this.componentEl.addEventListener('touchend', onTouchEnd, { passive: true });

      // Tab visibility change listener: pause autoplay when tab is hidden, resume when visible
      const onVisibilityChange = () => {
        if (document.hidden) {
          this.stopAutoSlide();
        } else if (!this.isHoveredOrFocused && !this.prefersReducedMotion) {
          this.startAutoSlide();
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      this._cleanupFns.push(() => {
        this.componentEl.removeEventListener('mouseenter', onMouseEnter);
        this.componentEl.removeEventListener('mouseleave', onMouseLeave);
        this.componentEl.removeEventListener('focusin', onFocusIn);
        this.componentEl.removeEventListener('focusout', onFocusOut);
        this.componentEl.removeEventListener('keydown', onKeyDown);
        this.componentEl.removeEventListener('touchstart', onTouchStart);
        this.componentEl.removeEventListener('touchend', onTouchEnd);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      });
    }
  }

  destroy() {
    this.stopAutoSlide();
    this._cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch (err) {}
    });
    this._cleanupFns = [];

    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
