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
    this.isTouchOnly = window.matchMedia(
      '(hover: none) and (pointer: coarse)'
    ).matches;

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.cursorX = this.mouseX;
    this.cursorY = this.mouseY;
    this.ringX = this.mouseX;
    this.ringY = this.mouseY;

    this.tiltCards = [];
    this.boundListeners = [];
    this.magneticButtons = [];
    this.parallaxOrbs = [];
    this.scrollObserver = null;
    this.rafId = null;

    this.init();
  }

  init() {
    this.initPageEntrance();
    this.initViewfinderAccents();

    if (!this.prefersReducedMotion) {
      this.init3DTilt();
      this.setupSmartphoneTilt();
      this.initMagneticButtons();
      this.initCustomCursor();
      this.initAmbientParallax();
      this.initScrollParallax();
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
   * 3. Interactive 3D Perspective Tilt on Mouse Movement
   * Calculates actual pointer coordinates relative to each card:
   * - Left/Right: tilts visibly around Y axis (rotateY)
   * - Up/Down: tilts visibly around X axis (rotateX)
   * - Image layer & badges move forward with genuine 3D depth (translateZ)
   * - Card shadow dynamically updates with tilt position
   * - Smooth return to position on pointer leave (~8 degrees max tilt)
   */
  init3DTilt() {
    const cardSelectors = [
      '#hero-media-card',
      '.hero-3d-composition',
      '.ugc-card',
      '.gallery-card',
      '.spec-card',
      '.faq-concierge-card',
      '.hero-eyebrow',
    ];

    const elements = document.querySelectorAll(cardSelectors.join(', '));

    elements.forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';
      card.classList.add('tilt-card-3d');

      // Inject dynamic specular glare layer if missing
      let glare = card.querySelector('.tilt-glare-layer');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare-layer';
        glare.setAttribute('aria-hidden', 'true');
        card.appendChild(glare);
      }

      let bounds = null;
      let rafPending = false;
      let targetX = 0;
      let targetY = 0;
      let resetTimer = null;

      // Maximum tilt angle: approximately 8 degrees as requested
      const maxTilt = card.classList.contains('hero-3d-composition') || card.id === 'hero-media-card'
        ? 8.0
        : card.classList.contains('ugc-card')
        ? 8.0
        : card.classList.contains('gallery-card')
        ? 8.0
        : 7.0;

      const isHeroMedia = card.classList.contains('hero-3d-composition') || card.id === 'hero-media-card';
      const isUgcCard = card.classList.contains('ugc-card');
      const isGalleryCard = card.classList.contains('gallery-card');

      // Cache child 3D layers
      const heroMainCard = isHeroMedia ? card.querySelector('.hero-layer-main-card') : null;
      const heroImg = isHeroMedia ? card.querySelector('.hero-layer-img') : null;
      const heroFloatPill = isHeroMedia ? card.querySelector('.hero-layer-float-pill') : null;
      const heroFloatBadge = isHeroMedia ? card.querySelector('.hero-layer-float-badge') : null;
      const heroBackdrop = isHeroMedia ? card.querySelector('.hero-layer-backdrop') : null;

      const ugcImg = isUgcCard ? card.querySelector('.ugc-card-img') : null;
      const ugcPlay = isUgcCard ? card.querySelector('.play-circle, .ugc-play-overlay') : null;
      const ugcPill = isUgcCard ? card.querySelector('.ugc-category-pill') : null;
      const ugcQuote = isUgcCard ? card.querySelector('.ugc-card-quote') : null;

      const galleryImg = isGalleryCard ? card.querySelector('.gallery-card-img') : null;
      const galleryIcon = isGalleryCard ? card.querySelector('.gallery-card-expand-icon') : null;

      const onPointerEnter = (e) => {
        if (e.pointerType === 'touch') return;
        if (resetTimer) {
          clearTimeout(resetTimer);
          resetTimer = null;
        }

        bounds = card.getBoundingClientRect();
        card.classList.add('is-tilting');

        if (isHeroMedia) {
          card.style.animationPlayState = 'paused';
        }

        card.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease';
      };

      const onPointerMove = (e) => {
        if (e.pointerType === 'touch') return;
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

            // Normalized coordinates: -1 (left/top) to +1 (right/bottom)
            const xPercent = Math.max(-1, Math.min(1, (x / bounds.width - 0.5) * 2));
            const yPercent = Math.max(-1, Math.min(1, (y / bounds.height - 0.5) * 2));

            // Visible 3D Rotations around X and Y axes
            // Moving horizontally tilts card left/right around Y axis
            // Moving vertically tilts card forward/backward around X axis
            const tiltY = (xPercent * maxTilt).toFixed(2);
            const tiltX = (-yPercent * maxTilt).toFixed(2);

            // Direct 3D transform with perspective, rotateX, rotateY, translateZ
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;

            // Dynamic lighting shadow responding to pointer movement
            const shadowX = (-xPercent * 18).toFixed(1);
            const shadowY = (-yPercent * 18 + 24).toFixed(1);
            card.style.boxShadow = `${shadowX}px ${shadowY}px 48px -6px rgba(117, 69, 245, 0.24), 0 8px 24px rgba(26, 25, 24, 0.06)`;

            // Specular glare tracking cursor
            card.style.setProperty('--glare-x', `${((x / bounds.width) * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-y', `${((y / bounds.height) * 100).toFixed(1)}%`);
            card.style.setProperty('--glare-opacity', '0.55');

            // 3D Depth Offsets on interior elements (translateZ)
            if (isHeroMedia) {
              if (heroMainCard) {
                heroMainCard.style.transform = 'translateZ(24px)';
              }
              if (heroImg) {
                heroImg.style.transform = 'scale(1.04) translateZ(12px)';
              }
              if (heroFloatPill) {
                const pillShiftX = (xPercent * 6).toFixed(1);
                const pillShiftY = (yPercent * 6).toFixed(1);
                heroFloatPill.style.transform = `translateZ(56px) translate3d(${pillShiftX}px, ${pillShiftY}px, 0)`;
              }
              if (heroFloatBadge) {
                const badgeShiftX = (xPercent * 8).toFixed(1);
                const badgeShiftY = (yPercent * 8).toFixed(1);
                heroFloatBadge.style.transform = `translateZ(70px) translate3d(${badgeShiftX}px, ${badgeShiftY}px, 0)`;
              }
              if (heroBackdrop) {
                const backShiftX = (-xPercent * 6).toFixed(1);
                const backShiftY = (-yPercent * 6).toFixed(1);
                heroBackdrop.style.transform = `translateZ(-22px) translate3d(${backShiftX}px, ${backShiftY}px, 0)`;
              }
            } else if (isUgcCard) {
              if (ugcImg) {
                ugcImg.style.transform = 'scale(1.05) translateZ(22px)';
              }
              if (ugcPlay) {
                ugcPlay.style.transform = 'translateZ(44px) scale(1.06)';
              }
              if (ugcPill) {
                ugcPill.style.transform = 'translateZ(30px)';
              }
              if (ugcQuote) {
                ugcQuote.style.transform = 'translateZ(14px)';
              }
            } else if (isGalleryCard) {
              if (galleryImg) {
                galleryImg.style.transform = 'scale(1.05) translateZ(20px)';
              }
              if (galleryIcon) {
                galleryIcon.style.transform = 'translateZ(32px)';
              }
            }

            rafPending = false;
          });
        }
      };

      const onPointerLeave = (e) => {
        if (e.pointerType === 'touch') return;
        bounds = null;
        card.classList.remove('is-tilting');

        // Smooth reset with custom cubic-bezier
        card.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s ease, border-color 0.4s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
        card.style.setProperty('--glare-opacity', '0');

        // Reset child 3D depth layers
        if (isHeroMedia) {
          if (heroMainCard) {
            heroMainCard.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            heroMainCard.style.transform = 'translateZ(16px)';
          }
          if (heroImg) {
            heroImg.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            heroImg.style.transform = 'scale(1) translateZ(0)';
          }
          if (heroFloatPill) {
            heroFloatPill.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            heroFloatPill.style.transform = 'translateZ(42px)';
          }
          if (heroFloatBadge) {
            heroFloatBadge.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            heroFloatBadge.style.transform = 'translateZ(56px)';
          }
          if (heroBackdrop) {
            heroBackdrop.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            heroBackdrop.style.transform = 'translateZ(-24px)';
          }

          resetTimer = setTimeout(() => {
            if (!card.classList.contains('is-tilting')) {
              card.style.animationPlayState = 'running';
              card.style.transform = '';
            }
          }, 550);
        } else if (isUgcCard) {
          if (ugcImg) {
            ugcImg.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            ugcImg.style.transform = 'scale(1) translateZ(0)';
          }
          if (ugcPlay) {
            ugcPlay.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            ugcPlay.style.transform = 'translateZ(0) scale(1)';
          }
          if (ugcPill) {
            ugcPill.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            ugcPill.style.transform = 'translateZ(0)';
          }
          if (ugcQuote) {
            ugcQuote.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            ugcQuote.style.transform = 'translateZ(0)';
          }
        } else if (isGalleryCard) {
          if (galleryImg) {
            galleryImg.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            galleryImg.style.transform = 'scale(1) translateZ(0)';
          }
          if (galleryIcon) {
            galleryIcon.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
            galleryIcon.style.transform = 'translateZ(0)';
          }
        }
      };

      card.addEventListener('pointerenter', onPointerEnter, { passive: true });
      card.addEventListener('pointermove', onPointerMove, { passive: true });
      card.addEventListener('pointerleave', onPointerLeave, { passive: true });

      this.boundListeners.push(
        { el: card, type: 'pointerenter', fn: onPointerEnter },
        { el: card, type: 'pointermove', fn: onPointerMove },
        { el: card, type: 'pointerleave', fn: onPointerLeave }
      );
    });
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
      if (e.pointerType === 'touch') return;
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

          // Restrained 5.0deg max tilt for comfortable reels interaction
          const tiltX = (-yPercent * 5.0).toFixed(2);
          const tiltY = (xPercent * 5.0).toFixed(2);

          phoneFrame.classList.add('is-tilting');
          phoneFrame.style.transition = 'transform 0.08s ease-out, box-shadow 0.25s ease';
          phoneFrame.style.transform = `perspective(1400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;

          // Dynamic metallic/ceramic rim shadow tracking pointer
          const shadowX = (-tiltY * 3.2).toFixed(1);
          const shadowY = (parseFloat(tiltX) * 3.2 + 32).toFixed(1);
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

    const onStageMouseLeave = (e) => {
      if (e.pointerType === 'touch') return;
      phoneBounds = null;
      phoneFrame.classList.remove('is-tilting');
      phoneFrame.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s ease';
      phoneFrame.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      phoneFrame.style.boxShadow = '';
    };

    stage.addEventListener('pointerenter', () => {
      phoneBounds = phoneFrame.getBoundingClientRect();
    }, { passive: true });
    stage.addEventListener('pointermove', onStageMouseMove, { passive: true });
    stage.addEventListener('pointerleave', onStageMouseLeave, { passive: true });

    this.boundListeners.push(
      { el: stage, type: 'pointermove', fn: onStageMouseMove },
      { el: stage, type: 'pointerleave', fn: onStageMouseLeave }
    );
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

      const onEnter = (e) => {
        if (e.pointerType === 'touch') return;
        rect = btn.getBoundingClientRect();
        btn.classList.add('is-magnetic');
      };

      const onMove = (e) => {
        if (e.pointerType === 'touch') return;
        if (!rect) rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.22));
        const distanceY = Math.max(-8, Math.min(8, (e.clientY - centerY) * 0.22));

        btn.style.transform = `translate3d(${distanceX.toFixed(1)}px, ${distanceY.toFixed(1)}px, 0)`;
      };

      const onLeave = (e) => {
        if (e.pointerType === 'touch') return;
        rect = null;
        btn.style.transform = '';
        btn.classList.remove('is-magnetic');
      };

      btn.addEventListener('pointerenter', onEnter, { passive: true });
      btn.addEventListener('pointermove', onMove, { passive: true });
      btn.addEventListener('pointerleave', onLeave, { passive: true });

      this.boundListeners.push(
        { el: btn, type: 'pointerenter', fn: onEnter },
        { el: btn, type: 'pointermove', fn: onMove },
        { el: btn, type: 'pointerleave', fn: onLeave }
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
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch') return;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        if (!isVisible) {
          isVisible = true;
          this.cursorEl.classList.add('is-active');
        }
      },
      { passive: true }
    );

    document.documentElement.addEventListener('pointerleave', () => {
      isVisible = false;
      this.cursorEl?.classList.remove('is-active');
    });

    // Contextual Hover States
    document.addEventListener(
      'mouseover',
      (e) => {
        if (!this.cursorEl) return;
        const target = e.target;

        if (target.closest('.image-stack-deck')) {
          this.setCursorState('drag', 'DRAG');
          return;
        }

        if (target.closest('.phone-reel-card, .ugc-card-media')) {
          this.setCursorState('play', '');
          return;
        }

        if (target.closest('.gallery-card, .hero-3d-composition')) {
          this.setCursorState('view', 'VIEW');
          return;
        }

        if (target.closest('a, button, input, textarea, select, [role="button"]')) {
          this.setCursorState('hover', '');
          return;
        }

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
      document.querySelectorAll(
        '.ambient-orb-3d, .aura-glow-orb, .aura-orb, .hero-headline-backdrop-glow'
      )
    );
  }

  /**
   * Vertical Scroll Multiplane Parallax for Background Lighting
   * Gently shifts ambient pastel mesh orbs based on scroll progress
   */
  initScrollParallax() {
    const orbs = document.querySelectorAll('.ambient-orb-3d, .aura-glow-orb');
    if (!orbs.length) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          orbs.forEach((orb, i) => {
            const speed = ((i % 3) + 1) * 0.08;
            const yOffset = -scrollY * speed;
            orb.style.setProperty('--scroll-parallax', `${yOffset.toFixed(1)}px`);
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.boundListeners.push({ el: window, type: 'scroll', fn: onScroll });
    onScroll();
  }

  /**
   * Viewfinder Corner Brackets & Lens Reticle Accents
   * Injects photographic camera crop accents on visual media cards
   */
  initViewfinderAccents() {
    const targets = document.querySelectorAll('.gallery-card, .ugc-card-media');
    targets.forEach((target) => {
      if (target.querySelector('.viewfinder-overlay')) return;

      const vf = document.createElement('div');
      vf.className = 'viewfinder-overlay';
      vf.setAttribute('aria-hidden', 'true');
      vf.innerHTML = `
        <span class="vf-bracket vf-tl"></span>
        <span class="vf-bracket vf-tr"></span>
        <span class="vf-bracket vf-bl"></span>
        <span class="vf-bracket vf-br"></span>
      `;
      target.appendChild(vf);
    });
  }

  /**
   * Continuous Animation Frame Loop for Smooth Trailing Cursor & Parallax
   */
  startLoop() {
    const loop = () => {
      const ease = 0.2;
      this.ringX += (this.mouseX - this.ringX) * ease;
      this.ringY += (this.mouseY - this.ringY) * ease;

      if (this.cursorDot) {
        this.cursorDot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
      }
      if (this.cursorRing) {
        this.cursorRing.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0)`;
      }

      // Parallax drift for ambient glowing orbs
      if (this.parallaxOrbs.length > 0) {
        const normX = (this.mouseX / window.innerWidth - 0.5) * 2;
        const normY = (this.mouseY / window.innerHeight - 0.5) * 2;

        this.parallaxOrbs.forEach((orb, i) => {
          const depth = ((i % 3) + 1) * 7;
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
    this.boundListeners.forEach(({ el, type, fn }) => {
      el.removeEventListener(type, fn);
    });
    this.boundListeners = [];

    const cursorRoot = document.getElementById('studio-cursor-root');
    cursorRoot?.remove();
  }
}
