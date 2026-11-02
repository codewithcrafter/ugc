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
import { FooterAmbientParticlesController } from './components/footerParticles.js';
import { submitLead } from './services/leadService.js';

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


  // 1b. Initialize Cinematic Hero Rotating Headline
  new HeadlineRotatorController('hero-rotator-wrapper', {
    phrases: [
      ' MyUGC Video Where Your Brand Becomes Iconic.',
      'CREATIVE UGC  CONTENT CREATION  ',
      'PRODUCT PHOTOSHOOT  AND CREATOR CASTING',
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

  // 4. Studio Philosophy: UGC Photography Showcase is rendered statically in semantic HTML for optimal performance

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

  // C. Video Preview Hover Interactions are handled directly by the ReelShowcaseController


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

  // 7a. Inquiry Popup Modal Controller
  const inquiryModal = document.getElementById('inquiry-modal');
  const closeInquiryBtn = document.getElementById('inquiry-close-btn');
  const inquiryForm = document.getElementById('inquiry-modal-form');
  const inquirySubmitBtn = document.getElementById('inquiry-submit-btn');
  const inquiryStatusFeedback = document.getElementById('inquiry-status-feedback');

  const openInquiryModal = (sourceName = 'Inquiry Modal') => {
    if (inquiryModal) {
      inquiryModal.dataset.source = sourceName;
      inquiryModal.removeAttribute('hidden');
      inquiryModal.classList.add('is-active');
      document.body.classList.add('modal-is-open');
      const firstInput = document.getElementById('inquiry-fullname');
      setTimeout(() => firstInput?.focus(), 100);
    }
  };

  const closeInquiryModal = () => {
    if (inquiryModal) {
      inquiryModal.classList.remove('is-active');
      inquiryModal.setAttribute('hidden', '');
      document.body.classList.remove('modal-is-open');
      if (inquiryStatusFeedback) {
        inquiryStatusFeedback.className = 'inquiry-status-feedback';
        inquiryStatusFeedback.textContent = '';
      }
    }
  };

  // Wire all Inquire buttons to open the modal
  const headerInquireBtn = document.getElementById('header-inquire-btn');
  headerInquireBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openInquiryModal('Header Inquire Button');
  });

  // Also wire any CTA with class .btn-open-inquiry
  document.querySelectorAll('.btn-open-inquiry, [data-action="open-inquiry"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openInquiryModal(btn.getAttribute('data-source') || 'Inquiry Modal CTA');
    });
  });

  // Global delegation: Every "Book a Photoshoot" CTA opens the inquiry modal
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, a');
    if (!target || target.closest('.inquiry-modal-dialog')) return;

    const text = (target.textContent || '').trim().toLowerCase();
    if (text.includes('book a photoshoot')) {
      e.preventDefault();
      openInquiryModal('Photoshoot Popup');
    }
  });

  // Also listen for the custom event dispatched by the chatbot "Book a Photoshoot" button
  document.addEventListener('open-inquiry-modal', (e) => {
    openInquiryModal(e.detail?.source || 'Chatbot Photoshoot Action');
  });

  closeInquiryBtn?.addEventListener('click', closeInquiryModal);

  // Close when clicking overlay backdrop (outside dialog)
  inquiryModal?.addEventListener('click', (e) => {
    if (e.target === inquiryModal) {
      closeInquiryModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inquiryModal && !inquiryModal.hidden) {
      closeInquiryModal();
    }
  });

  // Form submission & validation
  if (inquiryForm) {
    let isSubmitting = false;

    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      // Clear previous error states
      inquiryForm.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
      inquiryForm.querySelectorAll('.inquiry-error-msg').forEach((el) => (el.textContent = ''));
      if (inquiryStatusFeedback) {
        inquiryStatusFeedback.className = 'inquiry-status-feedback';
        inquiryStatusFeedback.textContent = '';
      }

      const nameInput = document.getElementById('inquiry-fullname');
      const emailInput = document.getElementById('inquiry-email');
      const phoneInput = document.getElementById('inquiry-phone');
      const messageInput = document.getElementById('inquiry-message');
      const honeypotInput = document.getElementById('inquiry-hp');

      const fullName = (nameInput?.value || '').trim();
      const email = (emailInput?.value || '').trim();
      const phone = (phoneInput?.value || '').trim();
      const message = (messageInput?.value || '').trim();
      const honeypot = (honeypotInput?.value || '').trim();
      const formSource = (inquiryModal && inquiryModal.dataset.source) || 'Photoshoot Popup';

      let hasErrors = false;

      // Validate Name
      if (!fullName || fullName.length < 2) {
        nameInput?.classList.add('has-error');
        const err = document.getElementById('error-inquiry-fullname');
        if (err) err.textContent = 'Please enter your full name (minimum 2 letters).';
        hasErrors = true;
      }

      // Validate Email
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!email || !emailRegex.test(email)) {
        emailInput?.classList.add('has-error');
        const err = document.getElementById('error-inquiry-email');
        if (err) err.textContent = 'Please enter a valid email address (e.g. name@brand.com).';
        hasErrors = true;
      }

      // Validate Phone (7 to 15 digits)
      const digitsOnly = phone.replace(/\D/g, '');
      if (!phone || digitsOnly.length < 7 || digitsOnly.length > 15) {
        phoneInput?.classList.add('has-error');
        const err = document.getElementById('error-inquiry-phone');
        if (err) err.textContent = 'Please enter a valid contact phone number (7–15 digits).';
        hasErrors = true;
      }

      // Message is optional — never causes error

      if (hasErrors) {
        return;
      }

      // Submit state & duplicate submission prevention
      isSubmitting = true;
      const inquiryBtnText = inquirySubmitBtn ? inquirySubmitBtn.querySelector('.btn-text') : null;
      if (inquirySubmitBtn) {
        inquirySubmitBtn.disabled = true;
      }
      if (inquiryBtnText) {
        inquiryBtnText.textContent = 'Submitting...';
      }

      try {
        // Send to central Google Sheets submission service
        const result = await submitLead({
          fullName,
          email,
          phone,
          message,
          formSource,
          honeypot,
        });

        if (result && result.success) {
          if (inquiryStatusFeedback) {
            inquiryStatusFeedback.className = 'inquiry-status-feedback is-success';
            const refText = result.leadId || 'MYUGC-INQ';
            inquiryStatusFeedback.innerHTML = `
              <strong>Inquiry Received ✔ (Ref: ${refText})</strong><br>
              Thank you, ${fullName}! Our team will review your photoshoot requirements.<br>
              <span style="font-size:0.8rem;opacity:0.9;display:block;margin-top:6px;">
                Need an immediate response? 
                <a href="https://wa.me/919205499604?text=Hi%20MyUGC%20Video!%20I%20just%20submitted%20inquiry%20${encodeURIComponent(refText)}." target="_blank" rel="noopener noreferrer" style="color:#C4A5FF;font-weight:600;text-decoration:underline;">
                  Message us on WhatsApp →
                </a>
              </span>
            `;
          }
          // Only reset the form on confirmed success
          inquiryForm.reset();
        } else {
          // Honest failure reporting - never display false success
          if (inquiryStatusFeedback) {
            inquiryStatusFeedback.className = 'inquiry-status-feedback is-error';
            inquiryStatusFeedback.textContent = result?.error || 'Submission failed. Please check your connection or try again.';
          }
        }
      } catch (err) {
        console.error('[InquiryModal] Error during inquiry submission:', err);
        if (inquiryStatusFeedback) {
          inquiryStatusFeedback.className = 'inquiry-status-feedback is-error';
          inquiryStatusFeedback.textContent = 'Submission error: ' + (err.message || 'Please check your connection or contact us on WhatsApp.');
        }
      } finally {
        isSubmitting = false;
        if (inquirySubmitBtn) {
          inquirySubmitBtn.disabled = false;
        }
        if (inquiryBtnText) {
          inquiryBtnText.textContent = 'Submit Inquiry';
        }
      }
    });

    // Real-time inline feedback to clear errors as user types
    ['inquiry-fullname', 'inquiry-email', 'inquiry-phone'].forEach((id) => {
      const input = document.getElementById(id);
      input?.addEventListener('input', () => {
        input.classList.remove('has-error');
        const err = document.getElementById('error-' + id);
        if (err) err.textContent = '';
      });
    });
  }

  // 7b. Back to Top Smooth Scroll Handler
  const backToTopBtn = document.getElementById('footer-back-to-top');
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    `[MyUGC Video] Landing Page initialized successfully. Brand: ${productConfig.brand.name}.`
  );
});
