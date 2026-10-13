/**
 * AURA Studio — Premium Creative Portfolio Custom Cursor System
 * ---------------------------------------------------------------
 * Features:
 * - Desktop-only mouse follower with smooth requestAnimationFrame interpolation (lerp)
 * - Context-sensitive labels: "VIEW REEL", "DRAG", "EXPAND", "WATCH"
 * - Magnetic / expanded states over buttons, links, and cards
 * - Fades out seamlessly over inputs and when pointer exits window
 * - Zero interference with clicks, text selection, or focus (pointer-events: none)
 * - Automatically disabled on touch screens and under prefers-reduced-motion
 */

export class CustomCursorController {
  constructor() {
    this.cursorEl = null;
    this.dotEl = null;
    this.ringEl = null;
    this.labelEl = null;

    // Coordinate tracking
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.dotX = this.mouseX;
    this.dotY = this.mouseY;
    this.ringX = this.mouseX;
    this.ringY = this.mouseY;

    this.rafId = null;
    this.isVisible = false;
    this.currentContext = null;

    // Device capability checks
    this.isTouchOrCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    // Only initialize on desktop devices with fine pointer and no reduced motion
    if (this.isTouchOrCoarse || this.prefersReducedMotion) {
      return;
    }

    this.createDom();
    this.bindEvents();
    this.startLoop();
  }

  createDom() {
    // Check if cursor element already exists
    let existing = document.getElementById('aura-custom-cursor');
    if (existing) {
      this.cursorEl = existing;
      this.dotEl = existing.querySelector('.cursor-dot');
      this.ringEl = existing.querySelector('.cursor-ring');
      this.labelEl = existing.querySelector('.cursor-label');
      return;
    }

    this.cursorEl = document.createElement('div');
    this.cursorEl.id = 'aura-custom-cursor';
    this.cursorEl.className = 'aura-custom-cursor is-hidden';
    this.cursorEl.setAttribute('aria-hidden', 'true');

    this.cursorEl.innerHTML = `
      <div class="cursor-dot"></div>
      <div class="cursor-ring">
        <span class="cursor-label"></span>
      </div>
    `;

    document.body.appendChild(this.cursorEl);

    this.dotEl = this.cursorEl.querySelector('.cursor-dot');
    this.ringEl = this.cursorEl.querySelector('.cursor-ring');
    this.labelEl = this.cursorEl.querySelector('.cursor-label');
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.cursorEl.classList.remove('is-hidden');
      }
    };

    this.onMouseLeaveWindow = (e) => {
      // If mouse left the browser viewport
      if (!e.relatedTarget && !e.toElement) {
        this.isVisible = false;
        this.cursorEl.classList.add('is-hidden');
      }
    };

    this.onMouseEnterWindow = () => {
      this.isVisible = true;
      this.cursorEl.classList.remove('is-hidden');
    };

    this.onMouseOver = (e) => {
      this.updateContext(e.target);
    };

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.onMouseLeaveWindow, { passive: true });
    document.addEventListener('mouseenter', this.onMouseEnterWindow, { passive: true });
    document.addEventListener('mouseover', this.onMouseOver, { passive: true });

    // Listen to media query changes (e.g. tablet orientation change or dock)
    this.motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motionListener = (e) => {
      if (e.matches) {
        this.destroy();
      }
    };
    this.motionMediaQuery.addEventListener('change', this.motionListener);
  }

  updateContext(target) {
    if (!target || !this.cursorEl) return;

    // Reset modifier classes
    const classesToRemove = [
      'has-label',
      'is-hover-link',
      'is-hover-input',
      'is-hover-reel',
      'is-hover-stack',
      'is-hover-gallery',
      'is-hover-ugc',
    ];
    this.cursorEl.classList.remove(...classesToRemove);

    // 1. Text Inputs & Form Elements: hide follower so standard text cursor is clean
    if (target.closest('input, textarea, select, [contenteditable="true"]')) {
      this.cursorEl.classList.add('is-hover-input');
      this.setLabel('');
      return;
    }

    // 2. Centered Smartphone Reels feed & controls
    if (target.closest('.smartphone-chassis, .reels-feed-viewport, .reel-stage-nav')) {
      this.cursorEl.classList.add('has-label', 'is-hover-reel');
      this.setLabel('VIEW REEL');
      return;
    }

    // 3. About Section Interactive Image Stack
    if (target.closest('.image-stack-viewport, .image-stack-card, .stack-arrow')) {
      this.cursorEl.classList.add('has-label', 'is-hover-stack');
      this.setLabel('DRAG');
      return;
    }

    // 4. Curated Visual Masonry Gallery Cards
    if (target.closest('.gallery-card')) {
      this.cursorEl.classList.add('has-label', 'is-hover-gallery');
      this.setLabel('EXPLORE');
      return;
    }

    // 5. UGC Video / Moment Cards
    if (target.closest('.ugc-card')) {
      this.cursorEl.classList.add('has-label', 'is-hover-ugc');
      this.setLabel('WATCH');
      return;
    }

    // 6. Interactive buttons, links, pills, tabs
    if (target.closest('a, button, .btn, .contact-pill, .nav-link, .faq-header, .testimonial-dot, .reels-dot')) {
      this.cursorEl.classList.add('is-hover-link');
      this.setLabel('');
      return;
    }

    // Default neutral state
    this.setLabel('');
  }

  setLabel(text) {
    if (!this.labelEl) return;
    if (this.currentContext !== text) {
      this.currentContext = text;
      this.labelEl.textContent = text;
    }
  }

  startLoop() {
    const loop = () => {
      // Lerp calculations for gentle organic lag
      // Dot moves briskly, Ring follows with smooth damping
      const dotFactor = 0.42;
      const ringFactor = 0.16;

      this.dotX += (this.mouseX - this.dotX) * dotFactor;
      this.dotY += (this.mouseY - this.dotY) * dotFactor;

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

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeaveWindow);
    document.removeEventListener('mouseenter', this.onMouseEnterWindow);
    document.removeEventListener('mouseover', this.onMouseOver);

    if (this.motionMediaQuery && this.motionListener) {
      this.motionMediaQuery.removeEventListener('change', this.motionListener);
    }

    if (this.cursorEl && this.cursorEl.parentNode) {
      this.cursorEl.parentNode.removeChild(this.cursorEl);
    }
  }
}
