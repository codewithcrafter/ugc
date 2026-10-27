/**
 * AURA Studio — Photography Agency Motion System
 * ------------------------------------------------
 * Coordinates cinematic camera-inspired motion:
 * - Magnetic pull on desktop CTA buttons
 * - Subtle 3D perspective tilt & moving specular sheen on image cards
 * - Photographic viewfinder corner brackets on curated gallery items
 * - Cinematic clip-path / shutter reveal animations for entering viewports
 * - Accessible and performance-minded (checks prefers-reduced-motion and pointer type)
 */

export class PhotographyMotionController {
  constructor() {
    this.isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.boundElements = [];
    this.intersectionObserver = null;

    this.init();
  }

  init() {
    if (this.isDesktop && !this.prefersReducedMotion) {
      this.initMagneticButtons();
      this.initViewfinderAccents();
    }
  }

  /**
   * Magnetic Button Pull
   * Gentle physical attraction toward cursor on hover
   */
  initMagneticButtons() {
    const magneticTargets = document.querySelectorAll(
      '#hero-primary-cta, #hero-secondary-cta, .btn-primary, .hero-contact-row .contact-pill, .btn-arrow-glass'
    );

    magneticTargets.forEach((btn) => {
      let isHovered = false;

      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        // Clamp to maximum 8px translation
        const clampedX = Math.max(-8, Math.min(8, deltaX));
        const clampedY = Math.max(-8, Math.min(8, deltaY));

        btn.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0)`;
      };

      const onMouseEnter = () => {
        isHovered = true;
        btn.style.transition = 'transform 120ms cubic-bezier(0.2, 0.8, 0.25, 1), box-shadow 260ms ease, background-color 200ms ease';
      };

      const onMouseLeave = () => {
        isHovered = false;
        btn.style.transition = 'transform 380ms cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 260ms ease, background-color 200ms ease';
        btn.style.transform = 'translate3d(0, 0, 0)';
      };

      btn.addEventListener('mouseenter', onMouseEnter, { passive: true });
      btn.addEventListener('mousemove', onMouseMove, { passive: true });
      btn.addEventListener('mouseleave', onMouseLeave, { passive: true });

      this.boundElements.push({
        el: btn,
        listeners: [
          { type: 'mouseenter', fn: onMouseEnter },
          { type: 'mousemove', fn: onMouseMove },
          { type: 'mouseleave', fn: onMouseLeave },
        ],
      });
    });
  }

  /**
   * Mouse-Reactive 3D Tilt & Moving Specular Optical Sheen
   * Subtle cursor-following rotation and optical light reflection
   */
  initMouseReactiveCards() {
    const cardSelectors = [
      '.gallery-card',
      '.ugc-card',
      '.spec-card',
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));

    cards.forEach((card) => {
      // Add specular reflection layer if not present
      if (!card.querySelector('.specular-sheen-layer')) {
        const sheen = document.createElement('div');
        sheen.className = 'specular-sheen-layer';
        sheen.setAttribute('aria-hidden', 'true');
        card.appendChild(sheen);
      }

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;

        // Subtle tilt angle: max 4.5 degrees
        const tiltX = ((y / rect.height) - 0.5) * -7.5;
        const tiltY = ((x / rect.width) - 0.5) * 7.5;

        card.style.setProperty('--sheen-x', `${xPct.toFixed(1)}%`);
        card.style.setProperty('--sheen-y', `${yPct.toFixed(1)}%`);
        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(6px)`;
      };

      const onMouseEnter = () => {
        card.style.transition = 'transform 100ms cubic-bezier(0.2, 0.8, 0.25, 1), box-shadow 300ms ease';
      };

      const onMouseLeave = () => {
        card.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        card.style.removeProperty('--sheen-x');
        card.style.removeProperty('--sheen-y');
      };

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });

      this.boundElements.push({
        el: card,
        listeners: [
          { type: 'mouseenter', fn: onMouseEnter },
          { type: 'mousemove', fn: onMouseMove },
          { type: 'mouseleave', fn: onMouseLeave },
        ],
      });
    });
  }

  /**
   * Viewfinder Corner Brackets
   * Injects photographic camera crop accents on visual frames
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
   * Cinematic Shutter & Staggered Viewport Reveals
   */
  initCinematicReveals() {
    const revealTargets = document.querySelectorAll(
      '.section-hero, .hero-pitch, .section-header-compact, .ugc-card, .gallery-card, .testimonial-card, .spec-card, .faq-item, .brand-logo-card, .about-text-col, .image-stack-wrapper'
    );

    if (this.prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => {
        el.classList.add('is-cinematic-revealed');
      });
      return;
    }

    revealTargets.forEach((el, index) => {
      el.classList.add('cinematic-reveal-init');
      // Add subtle staggered delays for grids
      if (el.classList.contains('ugc-card') || el.classList.contains('gallery-card') || el.classList.contains('spec-card')) {
        const staggerIndex = index % 4;
        el.style.transitionDelay = `${staggerIndex * 90}ms`;
      }
    });

    this.intersectionObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-cinematic-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    revealTargets.forEach((el) => this.intersectionObserver.observe(el));
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.boundElements.forEach(({ el, listeners }) => {
      listeners.forEach(({ type, fn }) => el.removeEventListener(type, fn));
    });
    this.boundElements = [];
  }
}
