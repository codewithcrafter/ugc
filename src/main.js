/**
 * AURA Studio — Main Application Entry Point
 * -------------------------------------------
 * Initializes components, handles smooth navigation, and binds interactive handlers.
 */

import { productConfig } from './config.js';
import { ProductSlider } from './components/slider.js';
import { LeadFormController } from './components/leadForm.js';
import { ImageStackController } from './components/imageStack.js';
import { BrandLogoWall } from './components/brandWall.js';
import { FaqAccordion } from './components/faq.js';
import { UgcModalController } from './components/ugcModal.js';
import { GalleryController } from './components/gallery.js';
import { TestimonialsSlider } from './components/testimonialsSlider.js';
import { FloatingContactController } from './components/floatingContact.js';
import { CustomCursorController } from './components/cursor.js';
import { PhotographyMotionController } from './components/motion.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize Premium Photography Agency Custom Cursor & Motion Design System
  new CustomCursorController();
  new PhotographyMotionController();

  // 1. Initialize Dynamic Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Initialize Lead Capture Form (Hero Right Column)
  const leadFormContainer = document.getElementById('lead-form-container');
  if (leadFormContainer) {
    new LeadFormController(leadFormContainer);
  }

  // 3. Initialize Centered Animated Smartphone Reels Experience
  const sliderContainer = document.getElementById('product-slider-container');
  if (sliderContainer) {
    const reelsData =
      productConfig.ugcReels && productConfig.ugcReels.length
        ? productConfig.ugcReels
        : productConfig.slider;
    new ProductSlider(sliderContainer, reelsData);
  }

  // 4. Initialize Interactive Overlapping Image Stack ("The Craft & Philosophy")
  const stackContainer = document.getElementById('about-image-stack-container');
  if (stackContainer && productConfig.about && productConfig.about.images) {
    new ImageStackController(stackContainer, productConfig.about.images);
  }

  // 5. Initialize Moving Brand Logo Wall ("TRUSTED BY LEADING BRANDS")
  const brandWallContainer = document.getElementById('brand-wall-container');
  if (brandWallContainer && productConfig.brandWall) {
    new BrandLogoWall(brandWallContainer, productConfig.brandWall);
  }

  // 6. Initialize Curated Masonry Gallery & Fullscreen Viewer
  const galleryContainer = document.getElementById('gallery-masonry-container');
  if (galleryContainer && productConfig.gallery) {
    new GalleryController(galleryContainer, productConfig.gallery);
  }

  // 7. Initialize Premium Customer Testimonials Slider
  const testimonialsContainer = document.getElementById('testimonials-slider-container');
  if (testimonialsContainer && productConfig.testimonials) {
    new TestimonialsSlider(testimonialsContainer, productConfig.testimonials);
  }

  // 8. Initialize FAQ Accordion
  const faqContainer = document.getElementById('faq-accordion-container');
  if (faqContainer) {
    new FaqAccordion(faqContainer, productConfig.faqs);
  }

  // 9. Initialize Floating Contact Toolbar, WhatsApp, Direct Call & Guided FAQ Chatbot
  new FloatingContactController(productConfig);

  // 5. Initialize UGC Lightbox Modal
  const ugcModalEl = document.getElementById('ugc-modal');
  let ugcModalController = null;
  if (ugcModalEl) {
    ugcModalController = new UgcModalController(ugcModalEl);
  }

  // Listen to reel click events from the carousel
  document.addEventListener('ugc-reel-clicked', (e) => {
    const reel = e.detail;
    if (reel && ugcModalController) {
      ugcModalController.open({
        id: reel.id,
        creator: reel.creator,
        handle: reel.handle,
        role: reel.role,
        caption: reel.caption,
        image: reel.poster,
        alt: reel.alt,
        type: reel.productTag,
      });
    }
  });

  // Bind click & keydown on UGC Cards in the showcase grid
  const ugcCards = document.querySelectorAll('.ugc-card');
  ugcCards.forEach((card) => {
    const cardId = card.getAttribute('data-ugc-id');
    const ugcItem = productConfig.ugcShowcase.find((item) => item.id === cardId);

    const handleCardOpen = () => {
      if (ugcItem && ugcModalController) {
        ugcModalController.open(ugcItem);
      }
    };

    card.addEventListener('click', handleCardOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardOpen();
      }
    });
  });

  // 6. Mobile Navigation Drawer Toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');

  if (menuToggle && navDrawer) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      navDrawer.hidden = isExpanded;
    });

    // Close mobile drawer when clicking a navigation link
    const mobileLinks = navDrawer.querySelectorAll('.mobile-nav-link, a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navDrawer.hidden = true;
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navDrawer.contains(e.target) && !menuToggle.contains(e.target) && !navDrawer.hidden) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navDrawer.hidden = true;
      }
    });
  }

  // 7. Legal (Privacy & Terms) Modal Handlers
  const legalModal = document.getElementById('legal-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const openTermsBtn = document.getElementById('open-terms-btn');
  const closeLegalBtn = document.getElementById('legal-close-btn');

  const openLegalModal = () => {
    if (legalModal) {
      legalModal.removeAttribute('hidden');
      legalModal.classList.add('is-active');
      document.body.classList.add('modal-is-open');
      closeLegalBtn?.focus();
    }
  };

  const closeLegalModal = () => {
    if (legalModal) {
      legalModal.classList.remove('is-active');
      legalModal.setAttribute('hidden', '');
      document.body.classList.remove('modal-is-open');
    }
  };

  openPrivacyBtn?.addEventListener('click', openLegalModal);
  openTermsBtn?.addEventListener('click', openLegalModal);
  closeLegalBtn?.addEventListener('click', closeLegalModal);

  legalModal?.addEventListener('click', (e) => {
    if (e.target === legalModal) {
      closeLegalModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && !legalModal.hidden) {
      closeLegalModal();
    }
  });

  // 8. Enhanced Smooth Scroll for Anchor Links with Target Focus
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });

        // If target is lead form, focus the first input after scrolling
        if (targetId === '#lead-form') {
          setTimeout(() => {
            const firstInput = document.getElementById('lead-fullname');
            firstInput?.focus();
          }, 450);
        }
      }
    });
  });

  // 9. Coordinated Scroll Reveal Motion System
  const initScrollReveals = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealTargets = document.querySelectorAll(
      '.hero-pitch, .lead-card, .section-header-compact, .ugc-card, .gallery-card, .testimonial-card, .spec-card, .faq-item, .faq-concierge-card, .brand-logo-card, .about-text-content, .image-stack-deck'
    );

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    revealTargets.forEach((el) => el.classList.add('reveal-init'));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    );

    revealTargets.forEach((el) => observer.observe(el));
  };

  initScrollReveals();

  console.info(
    `[AURA Studio] Landing Page initialized successfully. Brand: ${productConfig.brand.name}.`
  );
});
