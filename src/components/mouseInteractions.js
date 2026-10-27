/**
 * AURA Studio — Premium Mouse Movement & Interactive Microinteraction Suite
 * --------------------------------------------------------------------------
 * Pure Vanilla JavaScript & CSS Custom Properties:
 * 1. Custom Cursor (Dot & Smooth Follower Ring, Context Labels, Input Suppression)
 * 2. Mouse-Following Ambient Spotlight (Hero & Section Canvas)
 * 3. 3D Perspective Card Tilt & Optical Depth
 * 4. Magnetic CTA Buttons (Gentle Bounded Spring Attraction)
 * 5. Multiplane Image Parallax (Restrained Cinematic Depth)
 * 6. Gallery Hover Zoom & Polished Reveal
 * 7. Interactive Full-Screen Mouse Particle Trail (Physics-Based Circular Fluid Stream)
 * 8. Mobile / Touch / Reduced-Motion Safety Guards
 */

import { MouseParticleTrailController } from './mouseParticleTrail.js';

export class MouseInteractionsController {
  constructor() {
    this.isDesktopFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.cursorEl = null;
    this.dotEl = null;
    this.ringEl = null;
    this.labelEl = null;
    this.particleTrail = null;

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.dotX = this.mouseX;
    this.dotY = this.mouseY;
    this.ringX = this.mouseX;
    this.ringY = this.mouseY;

    this.rafId = null;
    this.isCursorVisible = false;
    this.currentLabel = '';

    this.boundListeners = [];

    this.init();
  }

  init() {
    if (!this.isDesktopFine || this.prefersReducedMotion) {
      return;
    }

    this.initCustomCursor();
    // Note: Particle trail disabled per specifications to maintain a refined, professional aesthetic
    this.initGlobalSpotlight();
    this.initCard3DTilt();
    this.initMagneticButtons();
    this.initImageParallax();
    this.initGalleryHoverEffects();
  }

  initParticleTrail() {
    // Particle trail disabled
  }

  /**
   * 1. REFINED PREMIUM CUSTOM CURSOR
   * Elegant center dot with 0ms lag + fluid follower ring with restrained easing.
   */
  initCustomCursor() {
    // Check if cursor already exists in DOM
    let existing = document.getElementById('aura-custom-cursor');
    if (existing) {
      this.cursorEl = existing;
    } else {
      this.cursorEl = document.createElement('div');
      this.cursorEl.id = 'aura-custom-cursor';
      this.cursorEl.className = 'aura-custom-cursor is-hidden';
      this.cursorEl.setAttribute('aria-hidden', 'true');
      this.cursorEl.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
      `;
      document.body.appendChild(this.cursorEl);
    }

    this.dotEl = this.cursorEl.querySelector('.cursor-dot');
    this.ringEl = this.cursorEl.querySelector('.cursor-ring');

    const onMouseMove = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isCursorVisible) {
        this.isCursorVisible = true;
        this.cursorEl.classList.remove('is-hidden');
      }
    };

    const onMouseLeaveDoc = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        this.isCursorVisible = false;
        this.cursorEl.classList.add('is-hidden');
      }
    };

    const onMouseEnterDoc = () => {
      this.isCursorVisible = true;
      this.cursorEl.classList.remove('is-hidden');
    };

    const onMouseOver = (e) => {
      this.updateCursorContext(e.target);
    };

    const onMouseDown = () => {
      this.cursorEl.classList.add('is-clicking');
    };

    const onMouseUp = () => {
      this.cursorEl.classList.remove('is-clicking');
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveDoc, { passive: true });
    document.addEventListener('mouseenter', onMouseEnterDoc, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    this.boundListeners.push(
      { target: window, type: 'mousemove', fn: onMouseMove },
      { target: document, type: 'mouseleave', fn: onMouseLeaveDoc },
      { target: document, type: 'mouseenter', fn: onMouseEnterDoc },
      { target: document, type: 'mouseover', fn: onMouseOver },
      { target: window, type: 'mousedown', fn: onMouseDown },
      { target: window, type: 'mouseup', fn: onMouseUp }
    );

    // Start RAF loop for silky smooth cursor tracking
    this.startCursorLoop();
  }

  updateCursorContext(target) {
    if (!target || !this.cursorEl) return;

    this.cursorEl.classList.remove('is-hover-interactive', 'is-hover-input');

    // 1. Text Inputs: hide custom ring so native text caret is clean and unobstructed
    if (target.closest('input, textarea, select, [contenteditable="true"]')) {
      this.cursorEl.classList.add('is-hover-input');
      return;
    }

    // 2. Interactive Elements: subtle enlargement and accent border
    if (
      target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], .btn, .nav-link, .reel-thumb-card, .brand-logo-card, .testimonial-nav-arrow, .testim-dot, .faq-header, .ugc-card, .gallery-item, .contact-pill, .active-audio-btn, .active-play-overlay, .tab-btn, .chip-filter, .mobile-menu-toggle, .active-reel-stage, .reel-nav-arrow'
      )
    ) {
      this.cursorEl.classList.add('is-hover-interactive');
      return;
    }
  }

  startCursorLoop() {
    const loop = () => {
      // Dot aligns directly with pointer (zero lag, extreme precision)
      this.dotX = this.mouseX;
      this.dotY = this.mouseY;

      // Outer ring follows with restrained, smooth easing (lerp factor 0.22)
      const ringFactor = 0.22;
      this.ringX += (this.mouseX - this.ringX) * ringFactor;
      this.ringY += (this.mouseY - this.ringY) * ringFactor;

      if (this.dotEl) {
        this.dotEl.style.transform = `translate3d(${this.dotX.toFixed(2)}px, ${this.dotY.toFixed(2)}px, 0)`;
      }

      if (this.ringEl) {
        this.ringEl.style.transform = `translate3d(${this.ringX.toFixed(2)}px, ${this.ringY.toFixed(2)}px, 0)`;
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  /**
   * 2. MOUSE-FOLLOWING SPOTLIGHT
   */
  initGlobalSpotlight() {
    let ticking = false;

    const onPointerMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--global-spotlight-x', `${e.clientX}px`);
          document.documentElement.style.setProperty('--global-spotlight-y', `${e.clientY}px`);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    this.boundListeners.push({ target: window, type: 'pointermove', fn: onPointerMove });

    // Scoped spotlight on individual cards
    const cards = document.querySelectorAll(
      '.ugc-card, .gallery-card, .testimonial-card, .lead-card, .image-stack-card, .spec-card'
    );

    cards.forEach((card) => {
      const onCardPointerMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', `${x}px`);
        card.style.setProperty('--spotlight-y', `${y}px`);
      };

      card.addEventListener('pointermove', onCardPointerMove, { passive: true });
      this.boundListeners.push({ target: card, type: 'pointermove', fn: onCardPointerMove });
    });
  }

  /**
   * 3. 3D PERSPECTIVE CARD TILT
   */
  initCard3DTilt() {
    const tiltTargets = document.querySelectorAll(
      '.ugc-card, .gallery-card, .testimonial-card, .image-stack-card, .spec-card'
    );

    tiltTargets.forEach((card) => {
      card.classList.add('tilt-card-3d');

      let targetTiltX = 0;
      let targetTiltY = 0;
      let isTilting = false;
      let rafActive = false;

      const maxAngle = card.classList.contains('testimonial-card') ? 3.0 : 4.5;

      const updateTransform = () => {
        if (!isTilting) {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        } else {
          card.style.transform = `perspective(1000px) rotateX(${targetTiltX.toFixed(2)}deg) rotateY(${targetTiltY.toFixed(2)}deg) translateZ(5px)`;
        }
        rafActive = false;
      };

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width;
        const normY = (e.clientY - rect.top) / rect.height;

        targetTiltX = (0.5 - normY) * maxAngle;
        targetTiltY = (normX - 0.5) * maxAngle;
        isTilting = true;

        if (!rafActive) {
          rafActive = true;
          requestAnimationFrame(updateTransform);
        }
      };

      const onMouseLeave = () => {
        isTilting = false;
        if (!rafActive) {
          rafActive = true;
          requestAnimationFrame(updateTransform);
        }
      };

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });

      this.boundListeners.push(
        { target: card, type: 'mousemove', fn: onMouseMove },
        { target: card, type: 'mouseleave', fn: onMouseLeave }
      );
    });
  }

  /**
   * 4. MAGNETIC BUTTONS
   */
  initMagneticButtons() {
    const magneticBtns = document.querySelectorAll(
      '#hero-primary-cta, #hero-secondary-cta, #header-inquire-btn, .btn-primary, .btn-magnetic'
    );

    magneticBtns.forEach((btn) => {
      btn.classList.add('btn-magnetic');

      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
        const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
        const clampedX = Math.max(-6, Math.min(6, deltaX));
        const clampedY = Math.max(-6, Math.min(6, deltaY));
        btn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0)`;
      };

      const onMouseLeave = () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      };

      btn.addEventListener('mousemove', onMouseMove, { passive: true });
      btn.addEventListener('mouseleave', onMouseLeave, { passive: true });

      this.boundListeners.push(
        { target: btn, type: 'mousemove', fn: onMouseMove },
        { target: btn, type: 'mouseleave', fn: onMouseLeave }
      );
    });
  }

  /**
   * 5. IMAGE PARALLAX
   */
  initImageParallax() {
    const parallaxImages = document.querySelectorAll(
      '.about-visual-col, .image-stack-wrapper, .hero-stage-column'
    );

    if (!parallaxImages.length) return;

    let ticking = false;

    const onPointerMove = (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;

        parallaxImages.forEach((el) => {
          const depth = 6;
          const px = -(normX * depth).toFixed(1);
          const py = -(normY * depth).toFixed(1);
          el.style.setProperty('--parallax-offset-x', `${px}px`);
          el.style.setProperty('--parallax-offset-y', `${py}px`);
        });

        ticking = false;
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    this.boundListeners.push({ target: window, type: 'pointermove', fn: onPointerMove });
  }

  /**
   * 6. GALLERY HOVER ZOOM & OVERLAY
   */
  initGalleryHoverEffects() {
    const galleryCards = document.querySelectorAll('.gallery-card');

    galleryCards.forEach((card) => {
      const img = card.querySelector('.gallery-img');
      const overlay = card.querySelector('.gallery-caption-overlay');

      if (!img) return;

      card.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.04)';
        if (overlay) {
          overlay.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.boundListeners.forEach(({ target, type, fn }) => {
      target.removeEventListener(type, fn);
    });
    this.boundListeners = [];

    if (this.particleTrail) {
      this.particleTrail.destroy();
      this.particleTrail = null;
    }

    if (this.cursorEl && this.cursorEl.parentNode) {
      this.cursorEl.parentNode.removeChild(this.cursorEl);
    }
  }
}

export { MouseParticleTrailController } from './mouseParticleTrail.js';
