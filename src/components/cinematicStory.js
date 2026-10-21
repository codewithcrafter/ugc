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
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export class CinematicStoryEngine {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        enableIndicator: true,
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
    this.boundListeners = [];
    this.indicatorEl = null;
    this.currentSceneLabel = '';

    this.scenes = [
      { id: 'ugc-intro', label: 'SCENE 00 // SHOWREEL PROLOGUE' },
      { id: 'hero', label: 'SCENE 01 // PROLOGUE & ALLOCATION' },
      { id: 'product-slider', label: 'SCENE 02 // REELS IN MOTION' },
      { id: 'about', label: 'SCENE 03 // CRAFT & PHILOSOPHY' },
      { id: 'trust', label: 'SCENE 04 // BRAND PARTNERS' },
      { id: 'ugc-showcase', label: 'SCENE 05 // EVERYDAY MOMENTS' },
      { id: 'gallery', label: 'SCENE 06 // VISUAL ARCHIVE' },
      { id: 'testimonials', label: 'SCENE 07 // PATRON REFLECTIONS' },
      { id: 'faq', label: 'SCENE 08 // STUDIO CONCIERGE' },
    ];

    this.init();
  }

  init() {
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
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
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
  playCinematicOpeningSequence() {
    if (this.prefersReducedMotion) return;

    const nav = document.getElementById('site-nav') || document.querySelector('.site-nav');
    const introMeta = document.getElementById('intro-meta-bar');
    const introHeadline = document.getElementById('intro-main-headline');
    const introSubtitle = document.getElementById('intro-main-subtitle');
    const introPrompt = document.getElementById('intro-scroll-prompt-wrap');
    const introFrames = document.querySelectorAll('#intro-frame-left, #intro-frame-right');

    const openTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Guarantee all styles are cleanly cleared/reset so no lingering inline constraints
        const resetEls = [nav, introMeta, introHeadline, introSubtitle, introPrompt, ...introFrames].filter(Boolean);
        gsap.set(resetEls, {
          clearProps: 'transform,opacity,filter',
        });
      },
    });

    // 1. Navigation slides down smoothly (0.0 -> 0.8s)
    if (nav) {
      openTl.from(nav, {
        y: -24,
        opacity: 0.85,
        duration: 0.8,
        ease: 'power2.out',
      }, 0.0);
    }

    // 2. Intro meta bar (0.1 -> 0.7s)
    if (introMeta) {
      openTl.from(introMeta, {
        y: -14,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, 0.1);
    }

    // 3. Intro heading reveals through a refined mask / upward glide (0.15 -> 1.05s)
    if (introHeadline) {
      openTl.from(introHeadline, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      }, 0.15);
    }

    // 4. Intro subtitle (0.25 -> 1.05s)
    if (introSubtitle) {
      openTl.from(introSubtitle, {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.25);
    }

    // 5. Ambient floating creator frames (0.3 -> 1.2s)
    if (introFrames && introFrames.length) {
      openTl.from(introFrames, {
        scale: 0.92,
        opacity: 0,
        y: 16,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power2.out',
      }, 0.3);
    }

    // 6. Scroll prompt appears (0.45 -> 1.15s)
    if (introPrompt) {
      openTl.from(introPrompt, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, 0.45);
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
        <span class="scene-slate-text" id="scene-slate-text">SCENE 01 // PROLOGUE</span>
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

      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => this.updateSceneIndicator(scene.label),
        onEnterBack: () => this.updateSceneIndicator(scene.label),
      });
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

    // One-shot cinematic entrance for Hero elements when Hero enters view
    ScrollTrigger.create({
      trigger: heroSection,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (this.prefersReducedMotion) return;

        const eyebrow = heroSection.querySelector('.hero-eyebrow');
        const titlePrefix = heroSection.querySelector('.hero-title-prefix');
        const rotator = heroSection.querySelector('#hero-rotator-wrapper');
        const accentLine = heroSection.querySelector('.hero-studio-accent-line');
        const desc = heroSection.querySelector('.hero-description');
        const ctaGroup = heroSection.querySelector('.hero-cta-group');
        const contactRow = heroSection.querySelector('.hero-contact-row');
        const leadFormWrap = heroSection.querySelector('.hero-form-column, #lead-form-container');
        const specs = heroSection.querySelector('.hero-specs-bar');

        const entranceTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          onComplete: () => {
            gsap.set(
              [eyebrow, titlePrefix, rotator, accentLine, desc, ctaGroup, contactRow, leadFormWrap, specs].filter(Boolean),
              { clearProps: 'transform,opacity' }
            );
          },
        });

        if (eyebrow) entranceTl.from(eyebrow, { y: 16, opacity: 0, duration: 0.6 }, 0.0);
        if (titlePrefix) entranceTl.from(titlePrefix, { y: 22, opacity: 0, duration: 0.7 }, 0.08);
        if (rotator) entranceTl.from(rotator, { y: 22, opacity: 0, duration: 0.7 }, 0.16);
        if (accentLine) entranceTl.from(accentLine, { scaleX: 0, opacity: 0, transformOrigin: 'left center', duration: 0.75 }, 0.22);
        if (desc) entranceTl.from(desc, { y: 18, opacity: 0, duration: 0.7 }, 0.28);
        if (ctaGroup) entranceTl.from(ctaGroup, { y: 16, opacity: 0, duration: 0.65 }, 0.36);
        if (contactRow) entranceTl.from(contactRow, { y: 14, opacity: 0, duration: 0.6 }, 0.44);
        if (leadFormWrap && !this.isMobile) {
          entranceTl.from(leadFormWrap, {
            x: 36,
            opacity: 0.85,
            duration: 0.85,
            ease: 'power2.out',
          }, 0.22);
        }
        if (specs) entranceTl.from(specs, { y: 16, opacity: 0, duration: 0.65 }, 0.52);
      },
    });

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
          y: -45,
          ease: 'none',
        },
        0
      );
    }

    if (leadCard && !this.isMobile) {
      heroTl.to(
        leadCard,
        {
          y: -25,
          rotationX: 1.8,
          rotationY: -1.8,
          transformPerspective: 1100,
          ease: 'none',
        },
        0
      );
    }

    if (specsBar) {
      heroTl.to(
        specsBar,
        {
          y: -15,
          ease: 'none',
        },
        0
      );
    }

    if (orbs.length) {
      orbs.forEach((orb, i) => {
        const speed = ((i % 3) + 1) * 35;
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
   * 3. SCENE 02: SMARTPHONE UGC REELS FEED CAMERA DOLLY
   * The phone frame dollies in from perspective depth into crisp focus, then recedes
   */
  setupScene2ReelsTimeline() {
    const sliderSection = document.getElementById('product-slider');
    if (!sliderSection) return;

    const phoneWrap = sliderSection.querySelector('.reels-phone-showcase-wrap') ||
      sliderSection.querySelector('#product-slider-container');
    const header = sliderSection.querySelector('.section-header-compact');

    if (!phoneWrap) return;

    const reelsTl = gsap.timeline({
      scrollTrigger: {
        trigger: sliderSection,
        start: 'top 85%',
        end: 'bottom 15%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    // Header subtle upward mask glide
    if (header) {
      reelsTl.fromTo(
        header,
        { y: 20 },
        { y: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    // Inner reel media settle
    const reelImages = sliderSection.querySelectorAll('.reels-media-wrap img, .reel-slide-media img, .phone-screen-viewport img');
    if (reelImages.length) {
      reelsTl.fromTo(
        reelImages,
        { scale: 1.05 },
        { scale: 1.0, ease: 'none', duration: 0.5 },
        0.05
      );
    }

    // Phone frame dolly-in to full center focus, then gentle cut
    if (!this.isMobile) {
      reelsTl.fromTo(
        phoneWrap,
        {
          scale: 0.95,
          rotationX: 3,
          y: 40,
          transformPerspective: 1400,
        },
        {
          scale: 1.0,
          rotationX: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.05
      );

      // Recede into next scene as user continues scroll
      reelsTl.to(
        phoneWrap,
        {
          scale: 0.98,
          y: -15,
          duration: 0.45,
          ease: 'power1.in',
        },
        0.55
      );
    }

    this.timelines.push(reelsTl);
  }

  /**
   * 4. SCENE 03: CRAFT & PHILOSOPHY WITH 3D IMAGE STACK DECK
   * Interactive cards fan out through physical perspective depth
   */
  setupScene3AboutTimeline() {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const stackDeck = aboutSection.querySelector('#image-stack-deck');
    const cards = aboutSection.querySelectorAll('.image-stack-card');
    const specItems = aboutSection.querySelectorAll('.about-spec-item, .spec-card');
    const header = aboutSection.querySelector('.section-header-compact, .about-header');

    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    if (header) {
      aboutTl.fromTo(
        header,
        { y: 20 },
        { y: 0, duration: 0.4, ease: 'power2.out' },
        0
      );
    }

    // 3D Physical Fanning of Deck Cards on Scroll
    if (cards.length >= 3 && !this.isMobile) {
      aboutTl.to(
        cards[0],
        {
          x: -18,
          y: -14,
          rotationZ: -2.8,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.1
      );
      aboutTl.to(
        cards[1],
        {
          x: 18,
          y: 10,
          rotationZ: 3.2,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.1
      );
      aboutTl.to(
        cards[2],
        {
          x: -8,
          y: 22,
          rotationZ: 0.8,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.1
      );

      const stackImgs = aboutSection.querySelectorAll('.image-stack-card img');
      if (stackImgs.length) {
        aboutTl.fromTo(
          stackImgs,
          { scale: 1.05 },
          { scale: 1.0, ease: 'none', duration: 0.5 },
          0.1
        );
      }
    }

    // Staggered perspective arrival of specification features
    if (specItems.length) {
      aboutTl.fromTo(
        specItems,
        {
          y: 20,
        },
        {
          y: 0,
          stagger: 0.08,
          duration: 0.5,
          ease: 'power2.out',
        },
        0.15
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
      ScrollTrigger.create({
        trigger: trustSection,
        start: 'top 85%',
        end: 'top 55%',
        scrub: 0.6,
        onUpdate: (self) => {
          gsap.set(header, { y: (1 - self.progress) * 16 });
        },
      });
    }

    // Use ScrollTrigger to observe scroll velocity and subtly translate track
    ScrollTrigger.create({
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
      '.lead-card',
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

      const maxAngle = card.classList.contains('lead-card')
        ? 3.5
        : card.classList.contains('testimonial-card')
        ? 3.0
        : 4.5;

      const updateCardTransform = () => {
        card.style.transform = `perspective(1100px) rotateX(${targetTiltX.toFixed(2)}deg) rotateY(${targetTiltY.toFixed(2)}deg) translateZ(4px)`;
        card.style.setProperty('--sheen-x', `${targetX.toFixed(1)}%`);
        card.style.setProperty('--sheen-y', `${targetY.toFixed(1)}%`);
        rafActive = false;
      };

      const onMouseMove = (e) => {
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
      mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
          this.revealAllImmediately();
          this.destroy();
        }
      });
    } catch (_) {}
  }

  destroy() {
    this.timelines.forEach((tl) => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    });
    this.timelines = [];

    ScrollTrigger.getAll().forEach((st) => {
      // Don't kill ugc-intro trigger, only our own
      if (st.vars.trigger !== document.getElementById('ugc-intro')) {
        st.kill();
      }
    });

    this.boundListeners.forEach(({ el, type, fn }) => {
      el.removeEventListener(type, fn);
    });
    this.boundListeners = [];

    if (this.indicatorEl && this.indicatorEl.parentNode) {
      this.indicatorEl.parentNode.removeChild(this.indicatorEl);
    }
  }
}
