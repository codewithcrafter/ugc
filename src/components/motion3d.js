/**
 * AURA STUDIO — 3D MOTION & INTERACTIVE DEPTH ENGINE
 * ---------------------------------------------------
 * Provides a genuine, visible, high-performance 3D creative-studio experience:
 * 1. Cinematic 3D Page-Load Sequence (staggered perspective entrances)
 * 2. Mouse-Responsive 3D Image Cards with genuine rotateX/rotateY, translateZ, and dynamic shadow
 * 3. 3D Layered Hero Product Media Composition with multi-layer depth & floating movement
 * 4. Genuine 3D Smartphone Reels Presentation with perspective wrapper, initial entrance, and interactive tilt
 * 5. Scroll-Triggered Staggered 3D Perspective Reveals (IntersectionObserver)
 * 6. Tactile Magnetic Buttons with elastic pull & tactile press feedback
 * 7. Contextual Studio Micro-Cursor (Dot + Ring with smart hover states)
 * 8. Mouse Parallax for Background Ambient Lighting Meshes
 *
 * Performance & Accessibility:
 * - Uses requestAnimationFrame for 60fps/120fps GPU-accelerated transforms
 * - Zero layout thrashing (cached bounds on enter, throttled via RAF)
 * - Automatically disabled on touch screens & pointer:coarse devices
 * - Full compliance with prefers-reduced-motion: reduce
 * - Non-blocking: content and forms are immediately interactive from first paint
 */

export class Motion3DController {
  constructor() {
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    this.isTouchDevice = window.matchMedia(
      '(hover: none) or (pointer: coarse)'
    ).matches;

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.cursorX = this.mouseX;
    this.cursorY = this.mouseY;
    this.ringX = this.mouseX;
    this.ringY = this.mouseY;

    this.tiltCards = [];
    this.magneticButtons = [];
    this.parallaxOrbs = [];
    this.scrollObserver = null;
    this.rafId = null;

    this.init();
  }

  init() {
    this.initPageEntrance();
    this.initScrollReveals();

    if (!this.prefersReducedMotion && !this.isTouchDevice) {
      this.initCustomCursor();
      this.init3DTilt();
      this.initMagneticButtons();
      this.initAmbientParallax();
      this.startLoop();
    }
  }

  /**
   * 1. Cinematic 3D Page-Load Sequence
   * Non-blocking, staggered perspective reveal for header, hero pitch & 3D stage
   */
  initPageEntrance() {
    requestAnimationFrame(() => {
      document.body.classList.add('page-loaded');
    });

    const header = document.getElementById('site-header');
    if (header) {
      const updateHeaderDepth = () => {
        const scrolled = window.scrollY > 20;
        header.classList.toggle('header-has-depth', scrolled);
      };

      window.addEventListener('scroll', updateHeaderDepth, { passive: true });
      updateHeaderDepth();
    }
  }

  /**
   * 2. Scroll-Triggered Staggered 3D Perspective Reveals
   * Uses IntersectionObserver with actual translateZ and rotateX transforms
   */
  initScrollReveals() {
    const revealTargets = [
      '.section-header-compact',
      '.hero-3d-composition',
      '.about-grid',
      '.smartphone-showcase-stage',
      '.ugc-card',
      '.gallery-card',
      '.testimonials-slider-component',
      '.faq-item',
      '.faq-concierge-card',
      '.footer-top-row',
    ];

    const elementsToReveal = document.querySelectorAll(revealTargets.join(', '));
    elementsToReveal.forEach((el, index) => {
      el.classList.add('reveal-3d');
      // Stagger child cards if in a grid
      if (el.classList.contains('ugc-card') || el.classList.contains('gallery-card')) {
        const stagger = (index % 4) * 0.09;
        el.style.setProperty('--reveal-stagger', `${stagger}s`);
      }
    });

    const observerOptions = {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12,
    };

    this.scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elementsToReveal.forEach((el) => this.scrollObserver.observe(el));
  }

  /**
   * 3. Interactive 3D Perspective Tilt on Mouse Movement
   * Calculates actual pointer coordinates relative to each card:
   * - Left/Right: tilts around Y axis (rotateY)
   * - Up/Down: tilts around X axis (rotateX)
   * - Image layer moves forward in 3D (translateZ)
   * - Card shadow dynamically updates with tilt position
   * - Smooth return to position on mouseleave
   */
  init3DTilt() {
    const cardSelectors = [
      '.hero-3d-composition',
      '.lead-card',
      '.ugc-card',
      '.gallery-card',
      '.spec-card',
      '.faq-concierge-card',
      '.hero-eyebrow',
      '.about-floating-badge',
    ];

    const elements = document.querySelectorAll(cardSelectors.join(', '));

    elements.forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';
      card.classList.add('tilt-card-3d');

      // Inject dynamic glare layer if missing
      if (!card.querySelector('.tilt-glare-layer')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare-layer';
        glare.setAttribute('aria-hidden', 'true');
        card.appendChild(glare);
      }

      let bounds = null;
      let rafPending = false;
      let targetX = 0;
      let targetY = 0;

      // Restrained max tilt (6deg to 9deg)
      const maxTilt = card.classList.contains('hero-3d-composition')
        ? 8.5
        : card.classList.contains('lead-card')
        ? 6.5
        : card.classList.contains('ugc-card')
        ? 9
        : 7.5;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
        card.classList.add('is-tilting');
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        targetX = e.clientX;
        targetY = e.clientY;

        if (!rafPending) {
          rafPending = true;
          requestAnimationFrame(() => {
            if (!bounds) {
              rafPending = false;
              return;
            }

            const x = targetX - bounds.left;
            const y = targetY - bounds.top;

            // Normalized coordinates: -1 to +1
            const xPercent = Math.max(-1, Math.min(1, (x / bounds.width - 0.5) * 2));
            const yPercent = Math.max(-1, Math.min(1, (y / bounds.height - 0.5) * 2));

            // Rotations
            const tiltX = -yPercent * maxTilt;
            const tiltY = xPercent * maxTilt;

            card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
            card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
            card.style.setProperty('--glare-x', `${((x / bounds.width) * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-y', `${((y / bounds.height) * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-opacity', '0.52');

            // Dynamic 3D lighting shadow based on tilt position
            const shadowX = (-tiltY * 2.8).toFixed(1);
            const shadowY = (tiltX * 2.8 + 22).toFixed(1);
            card.style.boxShadow = `${shadowX}px ${shadowY}px 48px rgba(117, 69, 245, 0.17), 0 8px 24px rgba(26, 25, 24, 0.06)`;

            rafPending = false;
          });
        }
      };

      const onMouseLeave = () => {
        bounds = null;
        card.classList.remove('is-tilting');
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--glare-opacity', '0');
        card.style.boxShadow = '';
      };

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });

    // 4. Smartphone 3D Perspective Tilt on Desktop
    this.setupSmartphoneTilt();
  }

  /**
   * 4. Smartphone 3D Presentation & Tilt
   * Desktop mouse tracking tilting the device chassis, display, and floating buttons in 3D
   */
  setupSmartphoneTilt() {
    const phoneFrame = document.getElementById('smartphone-frame');
    const stage = document.getElementById('smartphone-stage') || phoneFrame;
    if (!phoneFrame || !stage || phoneFrame.dataset.tiltBound) return;

    phoneFrame.dataset.tiltBound = 'true';
    phoneFrame.classList.add('tilt-card-3d');

    let phoneBounds = null;
    let rafPhone = false;
    let targetX = 0;
    let targetY = 0;

    const onStageMouseMove = (e) => {
      if (!phoneBounds) phoneBounds = phoneFrame.getBoundingClientRect();
      targetX = e.clientX;
      targetY = e.clientY;

      if (!rafPhone) {
        rafPhone = true;
        requestAnimationFrame(() => {
          if (!phoneBounds) {
            rafPhone = false;
            return;
          }

          const x = targetX - phoneBounds.left;
          const y = targetY - phoneBounds.top;

          const xPercent = Math.max(-1, Math.min(1, (x / phoneBounds.width - 0.5) * 2));
          const yPercent = Math.max(-1, Math.min(1, (y / phoneBounds.height - 0.5) * 2));

          // Restrained 5.5deg max tilt for comfortable reels interaction
          const tiltX = -yPercent * 5.5;
          const tiltY = xPercent * 5.5;

          phoneFrame.classList.add('is-tilting');
          phoneFrame.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
          phoneFrame.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);

          // Dynamic metallic/ceramic rim shadow tracking pointer
          const shadowX = (-tiltY * 3.2).toFixed(1);
          const shadowY = (tiltX * 3.2 + 32).toFixed(1);
          phoneFrame.style.boxShadow = `
            0 0 0 1px rgba(255, 255, 255, 1) inset,
            0 0 0 3px rgba(233, 223, 255, 0.85) inset,
            ${shadowX}px ${shadowY}px 72px rgba(117, 69, 245, 0.22),
            0 14px 34px rgba(26, 25, 24, 0.08)
          `;

          rafPhone = false;
        });
      }
    };

    const onStageMouseLeave = () => {
      phoneBounds = null;
      phoneFrame.classList.remove('is-tilting');
      phoneFrame.style.setProperty('--tilt-x', '0deg');
      phoneFrame.style.setProperty('--tilt-y', '0deg');
      phoneFrame.style.boxShadow = '';
    };

    stage.addEventListener('mouseenter', () => {
      phoneBounds = phoneFrame.getBoundingClientRect();
    }, { passive: true });
    stage.addEventListener('mousemove', onStageMouseMove, { passive: true });
    stage.addEventListener('mouseleave', onStageMouseLeave, { passive: true });
  }

  /**
   * 5. Tactile Magnetic Buttons
   * Smoothly pulls key call-to-actions toward the cursor within hover threshold
   */
  initMagneticButtons() {
    const buttonSelectors = [
      '.hero-btn-primary',
      '.hero-btn-secondary',
      '.header-whatsapp-btn',
      '.header-inquire-btn',
      '.flank-nav-btn',
      '.stack-arrow-btn',
      '.testimonial-nav-arrow',
    ];

    const buttons = document.querySelectorAll(buttonSelectors.join(', '));

    buttons.forEach((btn) => {
      let rect = null;

      btn.addEventListener(
        'mouseenter',
        () => {
          rect = btn.getBoundingClientRect();
          btn.classList.add('is-magnetic');
        },
        { passive: true }
      );

      btn.addEventListener(
        'mousemove',
        (e) => {
          if (!rect) rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const distanceX = (e.clientX - centerX) * 0.22;
          const distanceY = (e.clientY - centerY) * 0.22;

          btn.style.transform = `translate3d(${distanceX.toFixed(1)}px, ${distanceY.toFixed(1)}px, 0)`;
        },
        { passive: true }
      );

      btn.addEventListener(
        'mouseleave',
        () => {
          rect = null;
          btn.style.transform = '';
          btn.classList.remove('is-magnetic');
        },
        { passive: true }
      );
    });
  }

  /**
   * 6. Interactive Studio Custom Micro-Cursor
   * Refined dot and trailing ring that responds to interactive states
   * Strictly pointer-events: none; does not hijack or block clicks/keyboard.
   */
  initCustomCursor() {
    if (document.getElementById('aura-custom-cursor')) {
      return;
    }
    let cursorRoot = document.getElementById('studio-cursor-root');
    if (!cursorRoot) {
      cursorRoot = document.createElement('div');
      cursorRoot.id = 'studio-cursor-root';
      cursorRoot.className = 'studio-cursor-root';
      cursorRoot.setAttribute('aria-hidden', 'true');
      cursorRoot.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-ring">
          <span class="cursor-badge-text"></span>
        </div>
      `;
      document.body.appendChild(cursorRoot);
    }

    this.cursorEl = cursorRoot;
    this.cursorDot = cursorRoot.querySelector('.cursor-dot');
    this.cursorRing = cursorRoot.querySelector('.cursor-ring');
    this.cursorBadge = cursorRoot.querySelector('.cursor-badge-text');

    let isVisible = false;

    window.addEventListener(
      'mousemove',
      (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        if (!isVisible) {
          isVisible = true;
          this.cursorEl.classList.add('is-active');
        }
      },
      { passive: true }
    );

    document.documentElement.addEventListener('mouseleave', () => {
      isVisible = false;
      this.cursorEl?.classList.remove('is-active');
    });

    // Contextual Hover States
    document.addEventListener(
      'mouseover',
      (e) => {
        if (!this.cursorEl) return;

        const target = e.target;

        // 1. Drag / Swipe on Image Deck
        if (target.closest('.image-stack-deck')) {
          this.setCursorState('drag', 'DRAG');
          return;
        }

        // 2. Play / Video in Phone Reels or UGC Video
        if (target.closest('.phone-reel-card, .ugc-card-media')) {
          this.setCursorState('play', '');
          return;
        }

        // 3. Inspect / View in Gallery or 3D Product Media
        if (target.closest('.gallery-card, .hero-3d-composition')) {
          this.setCursorState('view', 'VIEW');
          return;
        }

        // 4. Interactive Links & Buttons
        if (
          target.closest('a, button, input, textarea, select, [role="button"]')
        ) {
          this.setCursorState('hover', '');
          return;
        }

        // Default neutral state
        this.setCursorState('default', '');
      },
      { passive: true }
    );
  }

  setCursorState(type, text = '') {
    if (!this.cursorEl) return;

    this.cursorEl.classList.remove(
      'state-hover',
      'state-drag',
      'state-play',
      'state-view'
    );

    if (type !== 'default') {
      this.cursorEl.classList.add(`state-${type}`);
    }

    if (this.cursorBadge) {
      this.cursorBadge.textContent = text;
    }
  }

  /**
   * 7. Background Ambient 3D Parallax Orbs
   */
  initAmbientParallax() {
    this.parallaxOrbs = Array.from(
      document.querySelectorAll('.ambient-orb-3d, .aura-glow-orb, .aura-orb')
    );
  }

  /**
   * Continuous Animation Frame Loop for Smooth Trailing Cursor & Parallax
   */
  startLoop() {
    const loop = () => {
      // 1. Smooth interpolation for cursor ring
      const ease = 0.2;
      this.ringX += (this.mouseX - this.ringX) * ease;
      this.ringY += (this.mouseY - this.ringY) * ease;

      if (this.cursorDot) {
        this.cursorDot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
      }
      if (this.cursorRing) {
        this.cursorRing.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
      }

      // 2. Parallax drift for ambient glowing orbs
      if (this.parallaxOrbs.length > 0) {
        const normX = (this.mouseX / window.innerWidth - 0.5) * 2;
        const normY = (this.mouseY / window.innerHeight - 0.5) * 2;

        this.parallaxOrbs.forEach((orb, i) => {
          const depth = (i % 3 + 1) * 7; // 7px to 21px subtle shift
          const shiftX = -normX * depth;
          const shiftY = -normY * depth;
          orb.style.setProperty('--parallax-x', `${shiftX.toFixed(1)}px`);
          orb.style.setProperty('--parallax-y', `${shiftY.toFixed(1)}px`);
        });
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    const cursorRoot = document.getElementById('studio-cursor-root');
    cursorRoot?.remove();
  }
}
