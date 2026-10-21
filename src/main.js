/**
 * AURA Studio — Main Application Entry Point
 * -------------------------------------------
 * Initializes components, handles smooth navigation, and binds interactive handlers.
 */

import { productConfig } from './config.js';
import { MouseInteractionsController } from './components/mouseInteractions.js';
import { SmartphoneReelsFeed, ProductSlider } from './components/slider.js';
import { LeadFormController } from './components/leadForm.js';
import { ImageStackController } from './components/imageStack.js';
import { BrandLogoWall } from './components/brandWall.js';
import { FaqAccordion } from './components/faq.js';
import { UgcModalController } from './components/ugcModal.js';
import { GalleryController } from './components/gallery.js';
import { TestimonialsSlider } from './components/testimonialsSlider.js';
import { FloatingContactController } from './components/floatingContact.js';
import { HeadlineRotatorController } from './components/headlineRotator.js';
import { CinematicStoryEngine } from './components/cinematicStory.js';
import { ScrollRevealController } from './components/scrollReveal.js';
import { HeroParallaxController } from './components/heroParallax.js';
import { FooterAmbientParticlesController } from './components/footerParticles.js';

document.addEventListener('DOMContentLoaded', () => {
  // Ensure page-loaded is active immediately so all UI elements are visible
  document.body.classList.add('page-loaded');

  // Initialize ScrollReveal to ensure all content elements are immediately visible
  const scrollReveal = new ScrollRevealController();
  scrollReveal.revealAllImmediately();

  // 1. Initialize Dynamic Year in Footer & Continuous Ambient Particle Animation
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  new FooterAmbientParticlesController('footer-particle-canvas');

  // 1a. Initialize HD Photography Hero Background Parallax
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    new HeroParallaxController(heroSection, { scrollFactor: 0.18 });
  }

  // 1b. Initialize Cinematic Hero Rotating Headline
  new HeadlineRotatorController('hero-rotator-wrapper', {
    phrases: [
      'Crafted for Cult Brands.',
      'Macro Beauty & Skincare Shoots.',
      'Fashion & Lifestyle UGC.',
      'High-Converting 9:16 Video.',
    ],
    interval: 3500,
  });

  // 2. Initialize Lead Capture Form (Hero Right Column)
  const leadFormContainer = document.getElementById('lead-form-container');
  if (leadFormContainer) {
    new LeadFormController(leadFormContainer);
  }

  // 3. Initialize Interactive Smartphone UGC Reels Feed
  const sliderContainer = document.getElementById('product-slider-container');
  if (sliderContainer) {
    const reelsData =
      productConfig.ugcReels && productConfig.ugcReels.length
        ? productConfig.ugcReels
        : productConfig.slider;
    new SmartphoneReelsFeed(sliderContainer, reelsData);
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

  // 10. Master Cinematic Storytelling & Interactive Film Engine
  const cinematicEngine = new CinematicStoryEngine();
  cinematicEngine.refresh();

  // A. Initialize Master Mouse Interactions Suite (Custom Cursor, Spotlight, 3D Tilt, Magnetic, Parallax)
  new MouseInteractionsController();

  // B. Thin Page Scroll Progress Bar
  const progressBar = document.getElementById('page-scroll-progress-bar');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
      progressBar.style.transform = 'scaleX(' + progress + ')';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // C. Video Preview Hover Interactions
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const previewCards = document.querySelectorAll('.phone-reel-card');
    previewCards.forEach((card) => {
      const video = card.querySelector('video');
      if (!video) return;
      card.addEventListener('mouseenter', () => {
        if (video.paused) {
          video.play().catch(() => {});
        }
      });
      card.addEventListener('mouseleave', () => {
        if (!video.paused && !card.classList.contains('is-sticky-playing')) {
          video.pause();
        }
      });
    });
  }


  // 11. Initialize UGC Lightbox Modal
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

  // 6. Mobile Navigation Drawer Toggle & Accessible State Management
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navDrawer = document.getElementById('mobile-nav-drawer');

  if (menuToggle && navDrawer) {
    const setDrawerState = (isOpen) => {
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.classList.toggle('is-active', isOpen);
      navDrawer.hidden = !isOpen;
      document.body.classList.toggle('mobile-nav-open', isOpen);
    };

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setDrawerState(!isExpanded);
    });

    // Close mobile drawer when clicking a navigation link
    const mobileLinks = navDrawer.querySelectorAll('.mobile-nav-link, a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setDrawerState(false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navDrawer.contains(e.target) && !menuToggle.contains(e.target) && !navDrawer.hidden) {
        setDrawerState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !navDrawer.hidden) {
        setDrawerState(false);
        menuToggle.focus();
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
        const headerEl = document.getElementById('site-header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 76;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });

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

  // 9. Active Navigation Section Spy & Scrolled Header Effect
  const headerEl = document.getElementById('site-header');
  const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-drawer .mobile-nav-link');
  const sectionsToTrack = [
    document.querySelector('#product-slider'),
    document.querySelector('#about'),
    document.querySelector('#trust'),
    document.querySelector('#ugc-showcase'),
    document.querySelector('#gallery'),
    document.querySelector('#testimonials'),
    document.querySelector('#faq'),
  ].filter(Boolean);

  const handleScrollState = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header frosted glass state
    if (headerEl) {
      if (scrollY > 28) {
        headerEl.classList.add('is-scrolled');
      } else {
        headerEl.classList.remove('is-scrolled');
      }
    }

    // Active Section Spy
    const headerHeight = headerEl ? headerEl.offsetHeight : 76;
    const probeY = scrollY + headerHeight + 80;
    let activeSectionId = '';

    for (let i = sectionsToTrack.length - 1; i >= 0; i--) {
      const sec = sectionsToTrack[i];
      if (probeY >= sec.offsetTop) {
        activeSectionId = sec.getAttribute('id');
        break;
      }
    }

    const updateLinkGroup = (links) => {
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (activeSectionId && href === `#${activeSectionId}`) {
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    };

    updateLinkGroup(desktopNavLinks);
    updateLinkGroup(mobileNavLinks);
  };

  window.addEventListener('scroll', handleScrollState, { passive: true });
  handleScrollState();

  console.info(
    `[AURA Studio] Landing Page initialized successfully. Brand: ${productConfig.brand.name}.`
  );
});
