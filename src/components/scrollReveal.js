/**
 * AURA Studio — Reusable Scroll-Reveal Motion System
 * ---------------------------------------------------
 * High-performance, lightweight Vanilla JavaScript scroll-reveal engine
 * utilizing a single IntersectionObserver instance.
 *
 * Supported Variants:
 * - reveal-left: Enters with horizontal offset from left
 * - reveal-right: Enters with horizontal offset from right
 * - reveal-up: Rises upward into position
 * - reveal-down: Descends downward into position
 * - reveal-scale: Enters with a controlled scale transition
 * - reveal-mask: Photography darkroom-inspired clip-path / shutter reveal
 * - reveal-3d: Enters with subtle 3D perspective and restrained rotation
 * - reveal-wave: Staggers child elements with coordinated wave-like delays
 *
 * Performance & Accessibility:
 * - Full prefers-reduced-motion support (instantly reveals all content)
 * - Immediate reveal for elements already inside viewport on load (prevents blank page)
 * - Automatic unobserve after reveal (zero ongoing overhead)
 * - Handles dynamically rendered components via refresh()
 */

export class ScrollRevealController {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
        waveStagger: 0.12, // seconds between staggered wave children
      },
      options
    );

    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.observer = null;
    this.observedElements = new Set();

    this.init();
  }

  init() {
    if (this.prefersReducedMotion || !('IntersectionObserver' in window)) {
      this.revealAllImmediately();
      return;
    }

    this.createObserver();
    this.refresh();

    // Listen to prefers-reduced-motion change dynamically
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
          this.revealAllImmediately();
          this.destroy();
        }
      });
    } catch (_) {
      // Fallback for older browsers
    }
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.revealElement(entry.target);
        }
      });
    }, this.options);
  }

  /**
   * Discovers and binds all reveal elements and wave groups across the page.
   * Can be called after dynamic content mounts (e.g. gallery, testimonials).
   */
  refresh() {
    if (this.prefersReducedMotion || !this.observer) {
      this.revealAllImmediately();
      return;
    }

    // 1. Process wave containers first to assign staggered indices to children
    this.setupWaveContainers();

    // 2. Query all reveal targets
    const selector = [
      '.reveal-left',
      '.reveal-right',
      '.reveal-up',
      '.reveal-down',
      '.reveal-scale',
      '.reveal-mask',
      '.reveal-3d',
      '.reveal-wave',
    ].join(', ');

    const elements = document.querySelectorAll(selector);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    elements.forEach((el) => {
      if (this.observedElements.has(el)) return;

      // Check if already in viewport on initial load
      const rect = el.getBoundingClientRect();
      const isAlreadyVisible =
        rect.top < windowHeight - 30 && rect.bottom > 20 && rect.height > 0;

      if (isAlreadyVisible) {
        // Stagger slightly for elements visible at top of viewport
        requestAnimationFrame(() => {
          this.revealElement(el);
        });
      } else {
        this.observer.observe(el);
        this.observedElements.add(el);
      }
    });
  }

  /**
   * Sets up wave staggering on children of [data-reveal-wave] or .reveal-wave
   */
  setupWaveContainers() {
    const waveContainers = document.querySelectorAll('.reveal-wave, [data-reveal-wave]');

    waveContainers.forEach((container) => {
      const children = Array.from(
        container.querySelectorAll(':scope > .reveal-wave-item, :scope > *')
      );

      children.forEach((child, index) => {
        const delay = (index * this.options.waveStagger).toFixed(2);
        child.style.setProperty('--wave-delay', `${delay}s`);
        child.style.setProperty('--reveal-stagger', `${delay}s`);
      });
    });
  }

  /**
   * Triggers the animated entrance of a specific element
   */
  revealElement(el) {
    el.classList.add('is-revealed');

    // If container is a wave group, also trigger children
    if (el.classList.contains('reveal-wave') || el.hasAttribute('data-reveal-wave')) {
      const children = el.querySelectorAll(':scope > .reveal-wave-item, :scope > *');
      children.forEach((child) => child.classList.add('is-revealed'));
    }

    // Trigger about image deck entrance cascade if about section enters
    if (el.classList.contains('about-grid') || el.closest('#about') || el.id === 'about') {
      const deck = document.getElementById('image-stack-deck');
      if (deck) deck.classList.add('is-stack-revealed');
    }

    // Trigger smartphone entrance
    if (el.classList.contains('smartphone-showcase-stage') || el.closest('#product-slider') || el.id === 'product-slider') {
      const phone = document.getElementById('smartphone-frame');
      if (phone) phone.classList.add('has-entered');
    }

    if (this.observer) {
      this.observer.unobserve(el);
      this.observedElements.delete(el);
    }
  }

  /**
   * Immediately reveals all animated elements without motion
   * for accessibility (prefers-reduced-motion) or fallback
   */
  revealAllImmediately() {
    const selector = [
      '.reveal-left',
      '.reveal-right',
      '.reveal-up',
      '.reveal-down',
      '.reveal-scale',
      '.reveal-mask',
      '.reveal-3d',
      '.reveal-wave',
      '.reveal-wave-item',
    ].join(', ');

    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add('is-revealed');
      el.style.removeProperty('--wave-delay');
      el.style.removeProperty('--reveal-stagger');
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.observedElements.clear();
  }
}
