/**
 * AURA Studio — Dynamic Rotating Headline Controller
 * ----------------------------------------------------
 * Smoothly cycles the highlighted headline phrase through brand messages:
 * 1. Crafted for Everyday Serenity.
 * 2. Designed for Deeper Focus.
 * 3. Made for Modern Living.
 * 4. Sound Meets Stillness.
 *
 * Capabilities:
 * - Fluid vertical slide + optical blur-to-sharp transition
 * - Animated multi-stop gradient (violet, lavender, coral pink, sky blue)
 * - Zero cumulative layout shift (CLS)
 * - Tab visibility detection (pauses timer when tab is hidden)
 * - Full compliance with prefers-reduced-motion (stops rotation, preserves static text)
 * - Safe fallback: renders initial phrase statically if JS fails
 */

export class HeadlineRotatorController {
  constructor(wrapperId = 'hero-rotator-wrapper', options = {}) {
    this.wrapper = document.getElementById(wrapperId);
    this.phrases = options.phrases || [
      'Crafted for Everyday Serenity.',
      'Designed for Deeper Focus.',
      'Made for Modern Living.',
      'Sound Meets Stillness.',
    ];
    this.currentIndex = 0;
    this.intervalMs = options.interval || 3500;
    this.timer = null;
    this.isTransitioning = false;

    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.init();
  }

  init() {
    if (!this.wrapper || !this.phrases.length) return;

    this.stabilizeHeight();
    this.onResize = this.stabilizeHeight.bind(this);
    window.addEventListener('resize', this.onResize, { passive: true });

    // Stop dynamic cycling if user prefers reduced motion
    if (this.prefersReducedMotion) {
      return;
    }

    this.startInterval();
    this.bindVisibility();
  }

  stabilizeHeight() {
    if (!this.wrapper) return;
    const activeItem = this.wrapper.querySelector('.hero-rotator-item');
    if (activeItem) {
      const height = activeItem.offsetHeight;
      if (height > 0) {
        this.wrapper.style.minHeight = `${height}px`;
      }
    }
  }

  startInterval() {
    this.clearInterval();
    this.timer = setInterval(() => {
      this.rotateNext();
    }, this.intervalMs);
  }

  clearInterval() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  bindVisibility() {
    this.onVisibilityChange = () => {
      if (document.hidden) {
        this.clearInterval();
      } else {
        this.startInterval();
      }
    };
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  rotateNext() {
    if (this.isTransitioning || !this.wrapper) return;
    this.isTransitioning = true;

    const nextIndex = (this.currentIndex + 1) % this.phrases.length;
    const currentItem = this.wrapper.querySelector('.hero-rotator-item.is-active');

    // Create incoming phrase element
    const nextItem = document.createElement('span');
    nextItem.className = 'hero-rotator-item title-serif is-entering';
    nextItem.textContent = this.phrases[nextIndex];
    nextItem.setAttribute('data-index', String(nextIndex));

    this.wrapper.appendChild(nextItem);

    // Force style recalculation for smooth CSS transition
    void nextItem.offsetWidth;

    // Slide outgoing item up and out with optical blur
    if (currentItem) {
      currentItem.classList.remove('is-active');
      currentItem.classList.add('is-exiting');
    }

    // Slide incoming item up from below to tack-sharp focus
    nextItem.classList.remove('is-entering');
    nextItem.classList.add('is-active');

    this.currentIndex = nextIndex;

    // Clean up outgoing item after transition
    setTimeout(() => {
      if (currentItem && currentItem.parentNode === this.wrapper) {
        currentItem.remove();
      }
      this.isTransitioning = false;
      this.stabilizeHeight();
    }, 700);
  }

  destroy() {
    this.clearInterval();
    window.removeEventListener('resize', this.onResize);
    if (this.onVisibilityChange) {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }
}
