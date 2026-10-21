/**
 * AURA STUDIO — HERO HD PHOTOGRAPHY PARALLAX CONTROLLER
 * ------------------------------------------------------
 * Provides a cinematic, hardware-accelerated parallax effect on the
 * hero background image using requestAnimationFrame, a subtle scroll factor (0.18),
 * and subtle mouse drift.
 *
 * Performance & Architecture:
 * - IntersectionObserver: Only computes and updates when Hero section is visible;
 *   automatically pauses calculations when scrolled away, saving 100% idle GPU/CPU.
 * - Single passive scroll listener with requestAnimationFrame dampening.
 * - Hardware accelerated: uses `translate3d(x, y, 0)` with `will-change: transform`.
 * - Zero image clipping / gaps: wrapper extends with top/height buffer.
 * - Full reduced-motion safety: automatically disables transform if prefers-reduced-motion is active.
 * - Clean mobile behavior: disables mouse drift on touch devices, keeps subtle vertical scroll parallax.
 */

export class HeroParallaxController {
  constructor(heroElement, options = {}) {
    this.hero = heroElement;
    if (!this.hero) return;

    this.wrapper = this.hero.querySelector('#hero-bg-image-wrapper') ||
                   this.hero.querySelector('.hero-bg-image-wrapper');
    this.img = this.hero.querySelector('#hero-bg-img') ||
               this.hero.querySelector('.hero-bg-img');

    if (!this.wrapper) return;

    // Subtle scroll factor (0.15 - 0.25 as recommended)
    this.scrollFactor = typeof options.scrollFactor === 'number' ? options.scrollFactor : 0.18;

    // Subtle mouse offset bounds (±7px max)
    this.maxMouseOffsetX = options.maxMouseOffsetX || 8;
    this.maxMouseOffsetY = options.maxMouseOffsetY || 6;

    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    this.isVisible = true;
    this.isTicking = false;
    this.rafId = null;

    this.currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.targetY = 0;
    this.currentY = 0;
    this.targetX = 0;
    this.currentX = 0;
    this.mouseTargetX = 0;
    this.mouseTargetY = 0;

    this.boundScroll = this.onScroll.bind(this);
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundResize = this.onResize.bind(this);
    this.boundReducedMotion = this.onReducedMotionChange.bind(this);
    this.boundRender = this.render.bind(this);

    this.init();
  }

  init() {
    if (this.prefersReducedMotion) {
      this.resetTransform();
      return;
    }

    this.setupIntersectionObserver();
    this.bindEvents();

    // Initial positioning calculation
    this.onScroll();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) {
            this.requestUpdate();
          } else if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.isTicking = false;
          }
        });
      },
      {
        root: null,
        rootMargin: '120px 0px 120px 0px',
        threshold: 0,
      }
    );

    this.observer.observe(this.hero);
  }

  bindEvents() {
    window.addEventListener('scroll', this.boundScroll, { passive: true });
    window.addEventListener('resize', this.boundResize, { passive: true });

    if (!this.isTouch && !this.prefersReducedMotion) {
      window.addEventListener('mousemove', this.boundMouseMove, { passive: true });
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', this.boundReducedMotion);
    }
  }

  onReducedMotionChange(e) {
    this.prefersReducedMotion = e.matches;
    if (this.prefersReducedMotion) {
      this.resetTransform();
    } else {
      this.requestUpdate();
    }
  }

  onScroll() {
    if (!this.isVisible || this.prefersReducedMotion) return;

    const rect = this.hero.getBoundingClientRect();
    // Move the background vertically at a slower rate than the page content
    // rect.top is 0 when hero is at top of viewport, negative when scrolled down
    const scrollDelta = -rect.top;
    this.targetY = scrollDelta * this.scrollFactor;

    this.requestUpdate();
  }

  onMouseMove(e) {
    if (!this.isVisible || this.prefersReducedMotion || this.isTouch) return;

    const normX = (e.clientX / window.innerWidth) - 0.5;
    const normY = (e.clientY / window.innerHeight) - 0.5;

    this.mouseTargetX = normX * this.maxMouseOffsetX;
    this.mouseTargetY = normY * this.maxMouseOffsetY;

    this.requestUpdate();
  }

  onResize() {
    this.isTouch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.onScroll();
  }

  requestUpdate() {
    if (!this.isTicking && this.isVisible && !this.prefersReducedMotion) {
      this.isTicking = true;
      this.rafId = requestAnimationFrame(this.boundRender);
    }
  }

  render() {
    if (!this.isVisible || this.prefersReducedMotion) {
      this.isTicking = false;
      return;
    }

    // Smooth lerp easing for silky movement without jitter
    const ease = 0.14;
    const combinedTargetY = this.targetY + this.mouseTargetY;
    const combinedTargetX = this.mouseTargetX;

    const diffY = combinedTargetY - this.currentY;
    const diffX = combinedTargetX - this.currentX;

    this.currentY += diffY * ease;
    this.currentX += diffX * ease;

    if (this.wrapper) {
      this.wrapper.style.transform = `translate3d(${this.currentX.toFixed(2)}px, ${this.currentY.toFixed(2)}px, 0)`;
    }

    // Keep loop active while there is movement delta
    if (Math.abs(diffY) > 0.05 || Math.abs(diffX) > 0.05) {
      this.rafId = requestAnimationFrame(this.boundRender);
    } else {
      this.isTicking = false;
    }
  }

  resetTransform() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isTicking = false;
    if (this.wrapper) {
      this.wrapper.style.transform = 'translate3d(0, 0, 0)';
    }
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('scroll', this.boundScroll);
    window.removeEventListener('resize', this.boundResize);
    window.removeEventListener('mousemove', this.boundMouseMove);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.removeEventListener) {
      motionQuery.removeEventListener('change', this.boundReducedMotion);
    }
    this.resetTransform();
  }
}
