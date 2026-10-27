/**
 * AURA STUDIO — CINEMATIC SCROLL-DRIVEN VISUAL STORYTELLING ENGINE
 * ==============================================================
 * Transforms the existing landing page into an interactive creative-agency showreel.
 * Actual website elements behave like frames in a professionally edited film as the visitor scrolls.
 *
 * Core Systems:
 * 1. Coordinated GSAP ScrollTrigger timelines for every section:
 *    - Scene 01: Hero Scene (multiplane camera parallax, title glide, lead form depth)
 *    - Scene 02: Smartphone UGC Reels (dolly in/out camera motion, aperture unmasking)
 *    - Scene 03: Craft & Philosophy (interactive 3D image stack fanning & spec arrivals)
 *    - Scene 04: Brand Partner Wall (scroll-velocity linked marquee dynamics)
 *    - Scene 05: Everyday Living UGC Showcase (contact sheet multiplane column parallax)
 *    - Scene 06: Curated Masonry Gallery (differential multi-column glide & inner lens zoom)
 *    - Scene 07: Patron Reflections (3D perspective card arrivals)
 *    - Scene 08: Studio FAQ Accordion (cascading shutter stagger & concierge card tilt)
 *    - Finale: Studio Footer (luminous cinematic finale)
 * 2. Visual Transitions:
 *    - Clip-path apertures & shutters
 *    - Inner zoom and pan on scroll
 *    - Specular optical glare reflections on desktop hover
 *    - Photographic corner viewfinder reticles [  ]
 *    - Bottom-left discreet film scene indicator pill
 *    - Magnetic button micro-pull on primary action CTAs
 * 3. Reversibility: scrolling backwards naturally scrubs all animations in reverse.
 * 4. Accessibility: prefers-reduced-motion instantly disables all scrub transforms.
 * 5. Website Integrity: All forms, buttons, links, videos, and layouts are preserved.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class CinematicStoryEngine {
  constructor(options = {}) {
    // Prevent duplicate engine instances
    if (typeof window !== 'undefined' && window.__cinematicStoryEngineInstance) {
      try {
        window.__cinematicStoryEngineInstance.destroy();
      } catch (_) {}
    }
    if (typeof window !== 'undefined') {
      window.__cinematicStoryEngineInstance = this;
    }

    this.options = Object.assign(
      {
        enableIndicator: false,
        enableParallax: true,
        enableTilt: true,
        enableMagnetic: true,
      },
      options
    );

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isDesktopFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;

    this.timelines = [];
    this.scrollTriggers = [];
    this.boundListeners = [];
    this.indicatorEl = null;
    this.currentSceneLabel = '';
    this.isInitialized = false;

    this.scenes = [
      { id: 'hero', label: 'UGC STUDIO // MAKE YOUR BRAND ICONIC' },
      { id: 'product-slider', label: 'Authentic & Scroll-Stopping Content' },
      { id: 'about', label: 'luxury in every frame' },
      { id: 'trust', label: 'BRANDS' },
      { id: 'ugc-showcase', label: 'Life captured naturally' },
      { id: 'gallery', label: 'PHOTOSHOOT THAT LOOK LUXURIOUS' },
      { id: 'testimonials', label: 'We create impact more than content' },
      { id: 'faq', label: 'Got Questions ?, lets talk' },
    ];

    this.init();
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;
    // 0. Ensure all elements on the page are marked revealed and visible immediately
    this.revealAllContentSafely();

    if (this.prefersReducedMotion) {
      this.revealAllImmediately();
      return;
    }

    // Build non-intrusive film scene indicator in bottom-left corner
    if (this.options.enableIndicator && this.isDesktopFine) {
      this.buildFilmSceneIndicator();
    }

    // Play cinematic opening sequence on page entrance
    this.playCinematicOpeningSequence();

    // Initialize coordinated GSAP ScrollTrigger timelines for every section
    this.setupScene1HeroTimeline();
    this.setupScene2ReelsTimeline();
    this.setupScene3AboutTimeline();
    this.setupScene4TrustTimeline();
    this.setupScene5UgcShowcaseTimeline();
    this.setupScene6GalleryTimeline();
    this.setupScene7TestimonialsTimeline();
    this.setupScene8FaqTimeline();
    this.setupFooterTimeline();

    // Scene tracking for indicator
    this.setupSceneTracker();

    // Desktop interactive accents
    if (this.isDesktopFine && !this.prefersReducedMotion) {
      if (this.options.enableTilt) {
        this.initInteractive3DTilt();
      }
      if (this.options.enableMagnetic) {
        this.initMagneticButtons();
      }
      this.initViewfinderReticles();
    }

    // Global resize & orientation listeners
    this.bindGlobalEvents();

    // Refresh ScrollTrigger after fonts and assets load
    const onLoadRefresh = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', onLoadRefresh);
    this.boundListeners.push({ el: window, type: 'load', fn: onLoadRefresh });
  }

  /**
   * CINEMATIC OPENING SEQUENCE (~1.2s)
   * On initial page load, animates existing elements into original positions:
   * - Navigation enters smoothly
   * - Intro meta bar and headline reveal through refined upward glide
   * - Subtitle and prompt enter in coordinated stagger
   * - Floating frames receive subtle depth transition
   * - Cleans up all inline transforms/opacities on complete for perfect safety
   */
  /**
   * CINEMATIC OPENING SEQUENCE (~1.2s)
   * On initial page load, animates the Hero section with coordinated, elegant reveals:
   * - Navigation slides down smoothly
   * - Hero Eyebrow badge reveals with accent dot pulse
   * - Headline prefix & dynamic rotator items reveal with upward mask glide
   * - Studio architectural accent line draws out horizontally with luminous glow
   * - Hero description unfolds
   * - Action CTAs enter with magnetic aura and subtle scale
   * - Direct WhatsApp & Phone contact pills cascade
   * - Desktop inquiry form card arrives with 3D perspective depth
   * - Hero specs bar items stagger into place
   * - Ambient lighting orbs breathe in
   */
  playCinematicOpeningSequence() {
    if (this.prefersReducedMotion) return;

    const nav = document.getElementById('site-header');
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const eyebrow = heroSection.querySelector('.hero-eyebrow');
    const titlePrefix = heroSection.querySelector('.hero-title-prefix');
    const rotator = heroSection.querySelector('#hero-rotator-wrapper');
    const accentLine = heroSection.querySelector('.hero-studio-accent-line');
    const desc = heroSection.querySelector('.hero-description');
    const ctaPrimary = heroSection.querySelector('#hero-primary-cta');
    const ctaSecondary = heroSection.querySelector('#hero-secondary-cta');
    const contactRow = heroSection.querySelector('.hero-contact-row');
    const specs = heroSection.querySelector('.hero-specs-bar');
    const leadCard = heroSection.querySelector('.lead-card');
    const orbs = heroSection.querySelectorAll('.ambient-orb-3d');

    const openTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(
          [nav, eyebrow, titlePrefix, rotator, accentLine, desc, ctaPrimary, ctaSecondary, contactRow, specs, leadCard].filter(Boolean),
          { clearProps: 'transform,opacity,filter' }
        );
      },
    });
    this.timelines.push(openTl);

    // 1. Navigation slides down smoothly
    if (nav) {
      openTl.fromTo(
        nav,
        { y: -22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.0
      );
    }

    // 2. Eyebrow badge reveals with dot pulse
    if (eyebrow) {
      openTl.fromTo(
        eyebrow,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        0.1
      );
    }

    // 3. Staggered Hero Title Reveal
    if (titlePrefix) {
      openTl.fromTo(
        titlePrefix,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        0.18
      );
    }
    if (rotator) {
      openTl.fromTo(
        rotator,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
        0.28
      );
    }

    // 4. Studio architectural accent line draws out horizontally with glow
    if (accentLine) {
      openTl.fromTo(
        accentLine,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.85, transformOrigin: 'left center', ease: 'power2.inOut' },
        0.36
      );
    }

    // 5. Description text unfolds
    if (desc) {
      openTl.fromTo(
        desc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        0.44
      );
    }

    // 6. Action CTAs reveal with magnetic aura
    if (ctaPrimary) {
      openTl.fromTo(
        ctaPrimary,
        { y: 18, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out' },
        0.52
      );
    }
    if (ctaSecondary) {
      openTl.fromTo(
        ctaSecondary,
        { y: 18, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out' },
        0.58
      );
    }

    // 7. Contact pills
    if (contactRow) {
      openTl.fromTo(
        contactRow,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.64
      );
    }

    // 8. Lead card arrives with subtle fade-in and slight upward move (runs once, no persistent transforms)
    if (leadCard) {
      openTl.fromTo(
        leadCard,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power2.out' },
        0.3
      );
    }

    // 9. Specs items cascade
    if (specs) {
      openTl.fromTo(
        specs,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        0.72
      );
    }

    // 10. Ambient orbs breathe into position
    if (orbs.length) {
      openTl.fromTo(
        orbs,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 0.65, duration: 1.2, stagger: 0.1, ease: 'power2.out' },
        0.1
      );
    }
  }

  /**
   * 1. BOTTOM-LEFT FILM SCENE INDICATOR PILL
   * Discreet, elegant, non-intrusive indicator that reinforces the creative showreel feel
   */
  buildFilmSceneIndicator() {
    let indicator = document.getElementById('cinematic-scene-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'cinematic-scene-indicator';
      indicator.className = 'cinematic-scene-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.innerHTML = `
        <span class="scene-rec-dot"></span>
        <span class="scene-slate-text" id="scene-slate-text">AURA STUDIO // CREATIVE PRODUCTION</span>
      `;
      document.body.appendChild(indicator);
    }
    this.indicatorEl = indicator;
  }

  updateSceneIndicator(label) {
    if (!this.indicatorEl || this.currentSceneLabel === label) return;
    this.currentSceneLabel = label;
    const textSpan = this.indicatorEl.querySelector('#scene-slate-text');
    if (textSpan) {
      gsap.to(textSpan, {
        opacity: 0,
        y: -4,
        duration: 0.18,
        onComplete: () => {
          textSpan.textContent = label;
          gsap.to(textSpan, { opacity: 1, y: 0, duration: 0.22 });
        },
      });
    }
    if (!this.indicatorEl.classList.contains('is-visible')) {
      this.indicatorEl.classList.add('is-visible');
    }
  }

  setupSceneTracker() {
    this.scenes.forEach((scene) => {
      const sectionEl = document.getElementById(scene.id);
      if (!sectionEl) return;

      const st = ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => this.updateSceneIndicator(scene.label),
        onEnterBack: () => this.updateSceneIndicator(scene.label),
      });
      this.scrollTriggers.push(st);
    });
  }

  /**
   * 2. SCENE 01: HERO SCENE MULTIPLANE CAMERA PARALLAX & ENTRANCE
   * Coordinates pitch typography glide, lead card depth, and ambient orbs
   */
  setupScene1HeroTimeline() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const pitchCol = heroSection.querySelector('.hero-pitch');
    const leadCard = heroSection.querySelector('.lead-card');
    const orbs = heroSection.querySelectorAll('.ambient-orb-3d');
    const specsBar = heroSection.querySelector('.hero-specs-bar');

    // Create scrubbed multiplane camera timeline as user scrolls through Hero
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    if (pitchCol) {
      heroTl.to(
        pitchCol,
        {
          y: -55,
          ease: 'none',
        },
        0
      );
    }

    if (specsBar) {
      heroTl.to(
        specsBar,
        {
          y: -20,
          ease: 'none',
        },
        0
      );
    }

    if (orbs.length) {
      orbs.forEach((orb, i) => {
        const speed = ((i % 3) + 1) * 42;
        heroTl.to(
          orb,
          {
            y: -speed,
            ease: 'none',
          },
          0
        );
      });
    }

    this.timelines.push(heroTl);
  }

  /**
   * 3. SCENE 02: COMMERCIAL REELS SHOWCASE (LIGHTWEIGHT ENTRANCE)
   * Smooth, performant entrance reveal for 9:16 vertical video cards.
   * Zero scroll-scrubbing overhead, preserving buttery natural page scrolling.
   */
  setupScene2ReelsTimeline() {
    const sliderSection = document.getElementById('product-slider');
    if (!sliderSection) return;

    const cards = sliderSection.querySelectorAll('.reel-card');
    if (!cards.length) return;

    // Performant one-time stagger reveal (triggers once, zero continuous CPU scrub)
    gsap.fromTo(
      cards,
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sliderSection,
          start: 'top 85%',
          once: true,
        },
      }
    );
  }

  /**
   * 4. SCENE 03: THE STUDIO PHILOSOPHY & UGC PHOTOGRAPHY SHOWCASE
   * Smooth, gentle viewport entry reveal with opacity and vertical translation.
   * Avoids pinned sections or complicated scroll transforms for rock-solid stability.
   */
  setupScene3AboutTimeline() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    if (this.prefersReducedMotion) return;

    const visualCol = aboutSection.querySelector('.about-visual-col');
    const textCol = aboutSection.querySelector('.about-text-col');
    const specCards = aboutSection.querySelectorAll('.spec-card');

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 82%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    if (visualCol) {
      aboutTl.fromTo(
        visualCol,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0
      );
    }

    if (textCol) {
      aboutTl.fromTo(
        textCol,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.12
      );
    }

    if (specCards.length) {
      aboutTl.fromTo(
        specCards,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' },
        0.28
      );
    }

    this.timelines.push(aboutTl);
  }

  /**
   * 5. SCENE 04: BRAND PARTNER WALL SCROLL-VELOCITY LINKAGE
   * Modulates continuous marquee pace smoothly with user scroll speed
   */
  setupScene4TrustTimeline() {
    const trustSection = document.getElementById('trust');
    if (!trustSection) return;

    const track = trustSection.querySelector('.brand-wall-track');
    const header = trustSection.querySelector('.section-header-compact, .brand-wall-header');
    if (!track) return;

    if (header) {
      const stHeader = ScrollTrigger.create({
        trigger: trustSection,
        start: 'top 85%',
        end: 'top 55%',
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(header, { y: (1 - self.progress) * 16 });
        },
      });
      this.scrollTriggers.push(stHeader);
    }

    // Use ScrollTrigger to observe scroll velocity and subtly translate track
    const stTrack = ScrollTrigger.create({
      trigger: trustSection,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (this.prefersReducedMotion) return;
        const velocity = self.getVelocity();
        // Clamp additional velocity offset to maximum 24px
        const shiftX = Math.max(-28, Math.min(28, velocity * -0.012));
        gsap.to(track, {
          x: shiftX,
          duration: 0.4,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      },
    });
    this.scrollTriggers.push(stTrack);
  }

  /**
   * 6. SCENE 05: EVERYDAY LIVING UGC SHOWCASE CONTACT SHEET
   * Multiplane column parallax with aperture unmasking
   */
  setupScene5UgcShowcaseTimeline() {
    const ugcSection = document.getElementById('ugc-showcase');
    if (!ugcSection) return;

    const cards = ugcSection.querySelectorAll('.ugc-card');
    const header = ugcSection.querySelector('.section-header-compact, .ugc-showcase-header');
    if (!cards.length) return;

    const ugcTl = gsap.timeline({
      scrollTrigger: {
        trigger: ugcSection,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    if (header) {
      ugcTl.fromTo(
        header,
        { y: 20 },
        { y: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    if (!this.isMobile) {
      cards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        const yDist = isEven ? -35 : 25;
        ugcTl.to(
          card,
          {
            y: yDist,
            ease: 'none',
          },
          0
        );

        const img = card.querySelector('.ugc-card-img');
        if (img) {
          ugcTl.fromTo(
            img,
            { scale: 1.05 },
            { scale: 1.0, ease: 'none' },
            0
          );
        }
      });
    }

    this.timelines.push(ugcTl);
  }

  /**
   * 7. SCENE 06: CURATED MASONRY GALLERY MULTIPLANE CAMERA
   * Differential column parallax glide and inner macro texture zoom
   */
  setupScene6GalleryTimeline() {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;

    const galleryCards = gallerySection.querySelectorAll('.gallery-card');
    const header = gallerySection.querySelector('.section-header-compact, .gallery-header');
    if (!galleryCards.length) return;

    const galTl = gsap.timeline({
      scrollTrigger: {
        trigger: gallerySection,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    if (header) {
      galTl.fromTo(
        header,
        { y: 20 },
        { y: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    if (!this.isMobile) {
      galleryCards.forEach((card, i) => {
        const colMod = i % 3;
        const yOffset = colMod === 0 ? -48 : colMod === 1 ? 36 : -24;

        galTl.to(
          card,
          {
            y: yOffset,
            ease: 'none',
          },
          0
        );

        const img = card.querySelector('.gallery-img, img');
        if (img) {
          galTl.fromTo(
            img,
            { scale: 1.06 },
            { scale: 1.0, ease: 'none' },
            0
          );
        }

        ScrollTrigger.create({
          trigger: card,
          start: 'top 88%',
          once: true,
          onEnter: () => card.classList.add('is-revealed'),
        });
      });
    }

    this.timelines.push(galTl);
  }

  /**
   * 8. SCENE 07: PATRON REFLECTIONS TESTIMONIALS
   * Rotational 3D perspective arrivals on verified review cards
   */
  setupScene7TestimonialsTimeline() {
    const testSection = document.getElementById('testimonials');
    if (!testSection) return;

    const cards = testSection.querySelectorAll('.testimonial-card');
    const header = testSection.querySelector('.section-header-compact, .testimonials-header');
    if (!cards.length) return;

    const testTl = gsap.timeline({
      scrollTrigger: {
        trigger: testSection,
        start: 'top 85%',
        end: 'bottom 25%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    if (header) {
      testTl.fromTo(
        header,
        { y: 20 },
        { y: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    if (!this.isMobile) {
      testTl.fromTo(
        cards,
        {
          y: 24,
          rotationY: -2,
          transformPerspective: 1200,
        },
        {
          y: 0,
          rotationY: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
        },
        0
      );
    }

    this.timelines.push(testTl);
  }

  /**
   * 9. SCENE 08: STUDIO FAQ & BESPOKE CONCIERGE CARD
   * Cascading shutter stagger on accordion rows and floating concierge tilt
   */
  setupScene8FaqTimeline() {
    const faqSection = document.getElementById('faq');
    if (!faqSection) return;

    const faqItems = faqSection.querySelectorAll('.faq-item, .faq-accordion-item');
    const conciergeCard = faqSection.querySelector('.faq-concierge-card');
    const header = faqSection.querySelector('.section-header-compact, .faq-header');

    const faqTl = gsap.timeline({
      scrollTrigger: {
        trigger: faqSection,
        start: 'top 85%',
        end: 'bottom 25%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    if (header) {
      faqTl.fromTo(
        header,
        { y: 20 },
        { y: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    if (faqItems.length) {
      faqTl.fromTo(
        faqItems,
        {
          y: 16,
        },
        {
          y: 0,
          stagger: 0.06,
          duration: 0.45,
          ease: 'power2.out',
        },
        0
      );
    }

    if (conciergeCard && !this.isMobile) {
      faqTl.fromTo(
        conciergeCard,
        {
          y: 20,
          rotationX: 2,
          transformPerspective: 1000,
        },
        {
          y: 0,
          rotationX: 0,
          duration: 0.45,
          ease: 'power2.out',
        },
        0.15
      );
    }

    this.timelines.push(faqTl);
  }

  /**
   * 10. FINALE: STUDIO FOOTER LIGHTING SWEEP & UPWARD REVEAL
   */
  setupFooterTimeline() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const cols = footer.querySelectorAll('.footer-col, .footer-brand-col, .footer-nav-col');

    const footerTl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: 'top 95%',
        end: 'bottom bottom',
        scrub: 0.6,
      },
    });

    if (cols.length) {
      footerTl.fromTo(
        cols,
        { y: 16 },
        { y: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out' },
        0
      );
    }

    this.timelines.push(footerTl);
  }

  /**
   * 11. DESKTOP INTERACTIVE 3D PERSPECTIVE TILT WITH MOVING OPTICAL GLARE
   */
  initInteractive3DTilt() {
    const cardSelectors = [
      '.ugc-card',
      '.gallery-card',
      '.testimonial-card',
      '.image-stack-card',
      '.faq-concierge-card',
    ];

    const cards = document.querySelectorAll(cardSelectors.join(', '));

    cards.forEach((card) => {
      if (card.dataset.cinematicTiltBound) return;
      card.dataset.cinematicTiltBound = 'true';
      card.classList.add('cinematic-tilt-card');

      if (!card.querySelector('.tilt-glare-layer')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare-layer';
        glare.setAttribute('aria-hidden', 'true');
        card.appendChild(glare);
      }

      let rafActive = false;
      let targetX = 50;
      let targetY = 50;
      let targetTiltX = 0;
      let targetTiltY = 0;

      const maxAngle = card.classList.contains('testimonial-card')
        ? 3.0
        : 4.5;

      const updateCardTransform = () => {
        card.style.transform = `perspective(1100px) rotateX(${targetTiltX.toFixed(2)}deg) rotateY(${targetTiltY.toFixed(2)}deg) translateZ(4px)`;
        card.style.setProperty('--sheen-x', `${targetX.toFixed(1)}%`);
        card.style.setProperty('--sheen-y', `${targetY.toFixed(1)}%`);
        rafActive = false;
      };

      const onMouseMove = (e) => {
        // If hovering over interactive controls inside lead-card or an input is focused, keep stable and flat
        if (card.classList.contains('lead-card')) {
          const isInteractiveChild = e.target.closest('input, select, textarea, button, label, .checkbox-label, .form-group');
          if (isInteractiveChild || card.contains(document.activeElement)) {
            targetTiltX = 0;
            targetTiltY = 0;
            card.classList.remove('is-tilting');
            card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            return;
          }
        }

        const rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width;
        const normY = (e.clientY - rect.top) / rect.height;

        targetX = normX * 100;
        targetY = normY * 100;
        targetTiltX = (0.5 - normY) * maxAngle;
        targetTiltY = (normX - 0.5) * maxAngle;

        card.classList.add('is-tilting');

        if (!rafActive) {
          rafActive = true;
          requestAnimationFrame(updateCardTransform);
        }
      };

      const onMouseLeave = () => {
        targetTiltX = 0;
        targetTiltY = 0;
        card.classList.remove('is-tilting');
        card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      };

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
      this.boundListeners.push(
        { el: card, type: 'mousemove', fn: onMouseMove },
        { el: card, type: 'mouseleave', fn: onMouseLeave }
      );
    });
  }

  /**
   * 12. PHOTOGRAPHIC VIEWFINDER RETICLES [  ]
   * Injects chic corner brackets onto photography cards for agency showreel feel
   */
  initViewfinderReticles() {
    const targetCards = document.querySelectorAll('.gallery-card, .ugc-card');
    targetCards.forEach((card) => {
      if (card.querySelector('.viewfinder-overlay')) return;

      const overlay = document.createElement('div');
      overlay.className = 'viewfinder-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `
        <div class="vf-bracket vf-tl"></div>
        <div class="vf-bracket vf-tr"></div>
        <div class="vf-bracket vf-bl"></div>
        <div class="vf-bracket vf-br"></div>
      `;
      card.appendChild(overlay);
    });
  }

  /**
   * 13. MAGNETIC BUTTON MICRO-PULL
   * Gentle physical pull on primary action buttons on desktop
   */
  initMagneticButtons() {
    const magneticTargets = document.querySelectorAll(
      '#hero-primary-cta, #hero-secondary-cta, .btn-primary, .hero-contact-row .contact-pill'
    );

    magneticTargets.forEach((btn) => {
      if (btn.dataset.cinematicMagneticBound) return;
      btn.dataset.cinematicMagneticBound = 'true';

      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.18;
        const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.18;
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
        { el: btn, type: 'mousemove', fn: onMouseMove },
        { el: btn, type: 'mouseleave', fn: onMouseLeave }
      );
    });
  }

  /**
   * Safe Content Guarantee: Ensures all elements are instantly unhidden and visible
   */
  revealAllContentSafely() {
    document.body.classList.add('page-loaded');

    const allTargets = [
      '.reveal-left',
      '.reveal-right',
      '.reveal-up',
      '.reveal-down',
      '.reveal-scale',
      '.reveal-mask',
      '.reveal-3d',
      '.reveal-wave',
      '.reveal-wave-item',
      '.gallery-card',
      '.ugc-card',
      '.lead-card',
      '.spec-card',
      '.image-stack-deck',
      '.smartphone-device-frame',
      '.reels-phone-showcase-wrap',
      '.section-header-compact',
      '#brand-wall-container',
      '#faq-accordion-container',
      '#testimonials-slider-container',
      '.footer-top-row',
      '.footer-brand-col',
      '.footer-nav-col',
      '.footer-bottom-row',
    ].join(', ');

    document.querySelectorAll(allTargets).forEach((el) => {
      el.classList.add('is-revealed', 'is-cinematic-revealed', 'is-stack-revealed', 'has-entered');
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  /**
   * 14. REDUCED-MOTION AND ACCESSIBILITY FALLBACK
   */
  revealAllImmediately() {
    document.body.classList.add('page-loaded');

    const revealSelectors = [
      '.reveal-left',
      '.reveal-right',
      '.reveal-up',
      '.reveal-down',
      '.reveal-scale',
      '.reveal-mask',
      '.reveal-3d',
      '.reveal-wave',
      '.reveal-wave-item',
      '.gallery-card',
      '.ugc-card',
      '.lead-card',
    ].join(', ');

    document.querySelectorAll(revealSelectors).forEach((el) => {
      el.classList.add('is-revealed');
      gsap.set(el, {
        opacity: 1,
        transform: 'none',
        scale: 1,
        clipPath: 'none',
      });
    });

    if (this.indicatorEl) {
      this.indicatorEl.style.display = 'none';
    }
  }

  refresh() {
    ScrollTrigger.refresh();
  }

  bindGlobalEvents() {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onReducedMotionChange = (e) => {
        if (e.matches) {
          this.revealAllImmediately();
          this.destroy();
        }
      };
      mediaQuery.addEventListener('change', onReducedMotionChange);
      this.boundListeners.push({ el: mediaQuery, type: 'change', fn: onReducedMotionChange });
    } catch (_) {}
  }

  destroy() {
    this.timelines.forEach((tl) => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    });
    this.timelines = [];

    this.scrollTriggers.forEach((st) => {
      st.kill();
    });
    this.scrollTriggers = [];

    ScrollTrigger.getAll().forEach((st) => {
      st.kill();
    });

    this.boundListeners.forEach(({ el, type, fn }) => {
      if (el && typeof el.removeEventListener === 'function') {
        el.removeEventListener(type, fn);
      }
      if (el && el.dataset) {
        delete el.dataset.cinematicTiltBound;
        delete el.dataset.cinematicMagneticBound;
      }
    });
    this.boundListeners = [];

    if (this.indicatorEl && this.indicatorEl.parentNode) {
      this.indicatorEl.parentNode.removeChild(this.indicatorEl);
      this.indicatorEl = null;
    }

    if (typeof window !== 'undefined' && window.__cinematicStoryEngineInstance === this) {
      window.__cinematicStoryEngineInstance = null;
    }

    this.isInitialized = false;
  }
}
