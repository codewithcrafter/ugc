/**
 * AURA STUDIO — SCROLL-TO-START CINEMATIC UGC VIDEO INTRO (SCENE 00)
 * =================================================================
 * Features a striking opening screen that invites the visitor to scroll:
 * - Opening Screen: "REAL STORIES. REAL CREATORS.", subtitle, floating frames,
 *   "SCROLL TO EXPLORE" prompt with animated arrow and thin progress indicator.
 * - Wait for Scroll: Video reveal emerges smoothly with document scroll.
 * - Autoplay & Safe Playback: Video autoplays muted in-view, pauses offscreen.
 * - Coordinated ScrollTrigger timeline:
 *     1. Headline & subtitle move upward and fade gracefully.
 *     2. Scroll prompt animates away.
 *     3. Video frame emerges from center with scale and clip-path reveal.
 *     4. Caption reveals: "MADE TO FEEL REAL."
 *     5. Seamless handoff directly into the hero section without blank voids.
 * - Scrolling backwards smoothly reverses all transitions.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class UgcIntroController {
  constructor(options = {}) {
    this.section = document.getElementById(options.sectionId || 'ugc-intro');
    if (!this.section) {
      console.warn('[UgcIntroController] #ugc-intro section not found in DOM.');
      return;
    }

    this.config = options.config || {};
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Cache elements
    this.pinTrack = this.section.querySelector('#ugc-intro-track');
    this.metaBar = this.section.querySelector('#intro-meta-bar');
    this.openingHero = this.section.querySelector('#intro-opening-hero');
    this.headline = this.section.querySelector('#intro-main-headline');
    this.subtitle = this.section.querySelector('#intro-main-subtitle');
    this.frameLeft = this.section.querySelector('#intro-frame-left');
    this.frameRight = this.section.querySelector('#intro-frame-right');

    this.videoStage = this.section.querySelector('#intro-video-stage');
    this.videoCard = this.section.querySelector('#ugc-intro-video-card');
    this.video = this.section.querySelector('#ugc-intro-video');
    this.revealedCaption = this.section.querySelector('#intro-revealed-caption');

    this.playBtn = this.section.querySelector('#intro-play-toggle-btn');
    this.muteBtn = this.section.querySelector('#intro-mute-toggle-btn');
    this.playOverlay = this.section.querySelector('#intro-video-play-overlay');
    this.videoStatusBadge = this.section.querySelector('#intro-video-status-badge');

    this.scrollPromptWrap = this.section.querySelector('#intro-scroll-prompt-wrap');
    this.scrollPrompt = this.section.querySelector('#intro-scroll-prompt');
    this.progressBarFill = this.section.querySelector('#intro-scroll-progress-fill');
    this.skipBtn = this.section.querySelector('#intro-skip-btn');

    this.scrollTimeline = null;
    this.intersectionObserver = null;
    this.isPlaying = false;
    this.isMuted = true;
    this.videoAvailable = false;

    this.init();
  }

  init() {
    this.setupVideoElement();
    this.bindControls();
    this.setupIntersectionObserver();

    if (!this.prefersReducedMotion && !this.isMobile) {
      this.initScrollStory();
    } else {
      this.initStaticStory();
    }

    // Refresh ScrollTrigger after assets and fonts load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  /**
   * 1. VIDEO SETUP & AUTOPLAY LOGIC
   */
  setupVideoElement() {
    if (!this.video) return;

    // Force muted, playsinline, and loop for browser autoplay policy compliance
    this.video.muted = true;
    this.video.defaultMuted = true;
    this.video.playsInline = true;
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('muted', '');
    this.video.setAttribute('loop', '');

    const handleVideoReady = () => {
      this.videoAvailable = true;
      if (this.videoStatusBadge) {
        this.videoStatusBadge.classList.add('is-ready');
        this.videoStatusBadge.textContent = '4K CREATOR CAPTURE · 24FPS';
      }
      this.attemptAutoplay();
      ScrollTrigger.refresh();
    };

    if (this.video.readyState >= 2) {
      handleVideoReady();
    } else {
      this.video.addEventListener('loadedmetadata', handleVideoReady, { once: true });
      this.video.addEventListener('canplay', handleVideoReady, { once: true });
    }

    // Error handling: if video fails to load, gracefully retain poster and status
    this.video.addEventListener('error', () => {
      this.videoAvailable = false;
      console.info(
        `[UgcIntroController] Video playback error or pending footage. Displaying high-res creator poster frame.`
      );
      if (this.videoStatusBadge) {
        this.videoStatusBadge.classList.add('is-pending');
        this.videoStatusBadge.textContent = 'PREVIEW ARCHIVE · /videos/intro_ugc.mp4';
      }
      this.isPlaying = false;
      this.updatePlayStateUI();
    });

    this.video.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayStateUI();
    });

    this.video.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayStateUI();
    });

    // Try initial autoplay
    this.attemptAutoplay();
  }

  /**
   * Attempt muted autoplay safely and handle browser autoplay promise rejection
   */
  async attemptAutoplay() {
    if (!this.video) return;

    this.video.muted = true;
    try {
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isPlaying = true;
        this.updatePlayStateUI();
      }
    } catch (err) {
      // Browser autoplay policy prevented playback until user interaction
      this.isPlaying = false;
      this.updatePlayStateUI();
    }
  }

  /**
   * 2. BIND USER CONTROLS & INTERACTION
   */
  bindControls() {
    // Play/Pause button toggle
    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }

    // Centered Play Overlay click
    if (this.playOverlay) {
      this.playOverlay.addEventListener('click', () => {
        this.togglePlay();
      });
    }

    // Video card click toggles playback
    if (this.videoCard) {
      this.videoCard.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        this.togglePlay();
      });
    }

    // Audio Mute/Unmute toggle
    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
      });
    }

    // Skip to Hero button
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const heroSection = document.getElementById('hero');
        if (heroSection) {
          const headerEl = document.getElementById('site-header');
          const headerHeight = headerEl ? headerEl.offsetHeight : 76;
          const targetTop = heroSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    }

    // "Scroll to Explore" prompt link smooth scroll
    if (this.scrollPrompt) {
      this.scrollPrompt.addEventListener('click', (e) => {
        e.preventDefault();
        // Scroll down into the reveal phase
        const targetY = window.scrollY + window.innerHeight * 0.75;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      });
    }

    // Keyboard support for video card
    if (this.videoCard) {
      this.videoCard.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          if (e.target === this.videoCard) {
            e.preventDefault();
            this.togglePlay();
          }
        }
      });
    }
  }

  /**
   * 3. PLAYBACK LOGIC & SAFE PROMISE HANDLING
   */
  async togglePlay() {
    if (!this.video) return;

    if (this.video.paused) {
      try {
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.isPlaying = true;
        }
      } catch (err) {
        console.warn('[UgcIntroController] Playback prevented by browser policy:', err);
        this.isPlaying = false;
      }
    } else {
      this.video.pause();
      this.isPlaying = false;
    }

    this.updatePlayStateUI();
  }

  toggleMute() {
    if (!this.video) return;
    this.video.muted = !this.video.muted;
    this.isMuted = this.video.muted;
    this.updateMuteStateUI();
  }

  updatePlayStateUI() {
    if (this.playBtn) {
      const playIcon = this.playBtn.querySelector('.icon-play');
      const pauseIcon = this.playBtn.querySelector('.icon-pause');
      const textSpan = this.playBtn.querySelector('.play-btn-text');

      if (this.isPlaying) {
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (textSpan) textSpan.textContent = 'Pause';
        this.playBtn.setAttribute('aria-label', 'Pause showreel');
      } else {
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (textSpan) textSpan.textContent = 'Play';
        this.playBtn.setAttribute('aria-label', 'Play showreel');
      }
    }

    if (this.playOverlay) {
      if (this.isPlaying) {
        this.playOverlay.classList.add('is-hidden');
      } else {
        this.playOverlay.classList.remove('is-hidden');
      }
    }

    if (this.videoCard) {
      if (this.isPlaying) {
        this.videoCard.classList.add('is-playing');
      } else {
        this.videoCard.classList.remove('is-playing');
      }
    }
  }

  updateMuteStateUI() {
    if (!this.muteBtn) return;
    const mutedIcon = this.muteBtn.querySelector('.icon-muted');
    const unmutedIcon = this.muteBtn.querySelector('.icon-unmuted');
    const textSpan = this.muteBtn.querySelector('.mute-btn-text');

    if (this.isMuted) {
      if (mutedIcon) mutedIcon.style.display = 'block';
      if (unmutedIcon) unmutedIcon.style.display = 'none';
      if (textSpan) textSpan.textContent = 'Muted';
      this.muteBtn.setAttribute('aria-label', 'Unmute audio');
    } else {
      if (mutedIcon) mutedIcon.style.display = 'none';
      if (unmutedIcon) unmutedIcon.style.display = 'block';
      if (textSpan) textSpan.textContent = 'Audio On';
      this.muteBtn.setAttribute('aria-label', 'Mute audio');
    }
  }

  /**
   * 4. INTERSECTION OBSERVER FOR PERFORMANCE
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Intro is in view: attempt autoplay if paused
            if (this.video && this.video.paused) {
              this.attemptAutoplay();
            }
          } else {
            // Far offscreen: pause video to prevent resource drain
            if (this.video && !this.video.paused) {
              this.video.pause();
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    this.intersectionObserver.observe(this.section);
  }

  /**
   * 5. GSAP SCROLLTRIGGER STORYTELLING SEQUENCE (DESKTOP)
   * On page load: Opening screen is displayed with "REAL STORIES. REAL CREATORS."
   * As user scrolls: Coordinated ScrollTrigger timeline drives the video reveal.
   */
  initScrollStory() {
    if (!this.pinTrack) return;

    // Set initial states for elements before scroll starts
    gsap.set(this.videoStage, {
      opacity: 0,
      scale: 0.70,
      clipPath: 'inset(14% 14% round 32px)',
      pointerEvents: 'none',
    });

    if (this.revealedCaption) {
      gsap.set(this.revealedCaption, {
        opacity: 0,
        y: 12,
      });
    }

    if (this.progressBarFill) {
      gsap.set(this.progressBarFill, {
        scaleX: 0,
        transformOrigin: 'left center',
      });
    }

    // Master scrubbed timeline: pinned for 100vh of natural scroll distance
    this.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: '+=100%',
        pin: this.pinTrack,
        pinSpacing: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (this.progressBarFill) {
            gsap.set(this.progressBarFill, { scaleX: self.progress });
          }
        },
        onLeave: () => {
          // Transitioned into hero: pause video so hero form has full focus
          if (this.video && !this.video.paused) {
            this.video.pause();
          }
        },
        onEnterBack: () => {
          // Scrolled back into intro: resume playback smoothly
          if (this.video && this.video.paused) {
            this.attemptAutoplay();
          }
        },
      },
    });

    // --- PHASE 1: SCROLL INITIATION (0.00 -> 0.35) ---
    // User scrolls: Opening heading, subtitle, scroll prompt & frames animate away
    if (this.headline) {
      this.scrollTimeline.to(
        this.headline,
        {
          y: -40,
          opacity: 0,
          filter: 'blur(5px)',
          duration: 0.30,
          ease: 'power2.out',
        },
        0.00
      );
    }

    if (this.subtitle) {
      this.scrollTimeline.to(
        this.subtitle,
        {
          y: -25,
          opacity: 0,
          filter: 'blur(4px)',
          duration: 0.28,
          ease: 'power2.out',
        },
        0.04
      );
    }

    if (this.scrollPromptWrap) {
      this.scrollTimeline.to(
        this.scrollPromptWrap,
        {
          opacity: 0,
          y: -20,
          duration: 0.22,
          ease: 'power2.out',
        },
        0.02
      );
    }

    if (this.frameLeft) {
      this.scrollTimeline.to(
        this.frameLeft,
        {
          x: -50,
          opacity: 0,
          scale: 0.9,
          duration: 0.28,
          ease: 'power1.out',
        },
        0.02
      );
    }

    if (this.frameRight) {
      this.scrollTimeline.to(
        this.frameRight,
        {
          x: 50,
          opacity: 0,
          scale: 0.9,
          duration: 0.28,
          ease: 'power1.out',
        },
        0.02
      );
    }

    // --- PHASE 2: VIDEO REVEAL (0.12 -> 0.70) ---
    // Video frame emerges from center with scale and clip-path unmask
    this.scrollTimeline.to(
      this.videoStage,
      {
        opacity: 1,
        scale: 1.0,
        clipPath: 'inset(0% 0% round 24px)',
        pointerEvents: 'auto',
        duration: 0.48,
        ease: 'power2.out',
        onStart: () => {
          this.attemptAutoplay();
        },
      },
      0.12
    );

    // Caption reveals: "MADE TO FEEL REAL."
    if (this.revealedCaption) {
      this.scrollTimeline.to(
        this.revealedCaption,
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
        },
        0.30
      );
    }

    // --- PHASE 3: SEAMLESS HANDOFF INTO HERO (0.75 -> 1.00) ---
    // Video stays centered and 100% visible without leaving a blank void
    // Directly hands off into hero section as user scrolls
    this.scrollTimeline.to(
      this.videoStage,
      {
        scale: 0.98,
        y: -12,
        opacity: 1,
        duration: 0.25,
        ease: 'power1.inOut',
      },
      0.75
    );

    if (this.revealedCaption) {
      this.scrollTimeline.to(
        this.revealedCaption,
        {
          opacity: 0,
          duration: 0.18,
          ease: 'power1.in',
        },
        0.75
      );
    }
  }

  /**
   * 6. STATIC STORY (MOBILE & PREFERS-REDUCED-MOTION)
   * Disables pinned scrolling, ensuring instant readability and natural touch scrolling.
   */
  initStaticStory() {
    if (this.videoStage) {
      gsap.set(this.videoStage, {
        opacity: 1,
        scale: 1,
        clipPath: 'none',
        pointerEvents: 'auto',
      });
    }

    if (this.revealedCaption) {
      gsap.set(this.revealedCaption, {
        opacity: 1,
        y: 0,
      });
    }

    if (this.frameLeft) this.frameLeft.style.display = 'none';
    if (this.frameRight) this.frameRight.style.display = 'none';
  }

  destroy() {
    if (this.scrollTimeline) {
      if (this.scrollTimeline.scrollTrigger) {
        this.scrollTimeline.scrollTrigger.kill();
      }
      this.scrollTimeline.kill();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}
