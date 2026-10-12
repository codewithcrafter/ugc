/**
 * Premium UGC Video Carousel
 * ---------------------------
 * Features:
 * - Continuous slow horizontal auto-scrolling with seamless infinite loop
 * - Portrait 9:16 vertical video cards inspired by TikTok / Instagram Reels
 * - Responsive sizing: 4-5 cards on desktop, 2-3 on tablet, 1-1.3 on mobile with peek
 * - Real <video> playback with playsInline, muted autoplay, and sound toggle
 * - IntersectionObserver to lazy-play visible videos and pause offscreen videos
 * - Play/Pause controls on click & accessible manual control bar
 * - Touch & swipe support for mobile
 * - Edge fade gradients and verified creator badges
 * - Respects prefers-reduced-motion
 */

export class UgcVideoCarousel {
  constructor(containerElement, reelsData, options = {}) {
    this.container = containerElement;
    this.reels = reelsData || [];
    this.speed = options.speed || 0.6; // pixels per animation frame
    this.currentOffset = 0;
    this.isPaused = false;
    this.isUserInteracting = false;
    this.animationFrameId = null;
    this.interactionTimeout = null;

    // Touch / Drag tracking
    this.isDragging = false;
    this.startX = 0;
    this.startOffset = 0;

    // Check user's motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.prefersReducedMotion) {
      this.isPaused = true;
    }

    this.intersectionObserver = null;
    this.init();
  }

  init() {
    if (!this.container || !this.reels.length) return;

    this.render();
    this.cacheElements();
    this.setupIntersectionObserver();
    this.bindEvents();

    if (!this.prefersReducedMotion) {
      this.startAnimation();
    }
  }

  render() {
    // Duplicate items once to create seamless infinite loop: [reels, reels]
    const duplicatedItems = [...this.reels, ...this.reels];

    const cardsHtml = duplicatedItems
      .map((item, index) => {
        const hasVideo = Boolean(item.videoSrc);
        const uniqueKey = `${item.id}-clone-${index}`;

        return `
        <article 
          class="ugc-video-card" 
          data-reel-id="${item.id}"
          data-card-index="${index}"
          role="group" 
          aria-roledescription="video card" 
          aria-label="${item.title} by ${item.creator}"
          tabindex="0"
        >
          <div class="ugc-card-inner">
            <!-- Media Layer (Video or High-Res Poster) -->
            <div class="ugc-media-box">
              ${
                hasVideo
                  ? `
                <video 
                  class="ugc-video-element" 
                  poster="${item.poster}"
                  playsinline 
                  muted 
                  loop 
                  preload="metadata"
                  aria-label="${item.title}"
                >
                  <source src="${item.videoSrc}" type="video/mp4" />
                </video>
              `
                  : ''
              }
              <img 
                src="${item.poster}" 
                alt="${item.alt}" 
                class="ugc-card-poster ${hasVideo ? 'has-video-element' : ''}" 
                loading="lazy"
                width="720"
                height="1280"
              />

              <!-- Top Overlay: Reel Badge & Audio Toggle -->
              <div class="ugc-top-bar">
                <div class="ugc-badge-pill">
                  <span class="live-pulse" aria-hidden="true"></span>
                  <span class="badge-text">UGC REEL • ${item.duration}</span>
                </div>

                ${
                  hasVideo
                    ? `
                  <button 
                    type="button" 
                    class="ugc-audio-btn" 
                    aria-label="Toggle sound for this video"
                    title="Mute / Unmute"
                  >
                    <svg class="icon-muted" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                    <svg class="icon-unmuted" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:none;">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  </button>
                `
                    : ''
                }
              </div>

              <!-- Center Play/Pause State Indicator -->
              <div class="ugc-center-indicator" aria-hidden="true">
                <div class="play-state-circle">
                  <svg class="play-state-icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>

              <!-- Bottom Vignette & Creator Label Overlay -->
              <div class="ugc-bottom-overlay">
                <!-- Creator Header -->
                <div class="ugc-creator-row">
                  <div class="ugc-creator-avatar">${item.avatar || item.creator.charAt(0)}</div>
                  <div class="ugc-creator-details">
                    <div class="ugc-handle-group">
                      <span class="ugc-creator-handle">${item.handle}</span>
                      <svg class="verified-check" viewBox="0 0 24 24" width="14" height="14" fill="#3897F0" aria-label="Verified creator">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"></path>
                      </svg>
                    </div>
                    <span class="ugc-creator-role">${item.role}</span>
                  </div>
                </div>

                <!-- Short Product or Campaign Label -->
                <h4 class="ugc-reel-title">${item.title}</h4>
                <div class="ugc-pill-tag">
                  <span class="tag-dot"></span>
                  <span>${item.productTag}</span>
                </div>

                <!-- Mini Animated Audio Waveform -->
                <div class="ugc-waveform" aria-hidden="true">
                  <span class="wave-bar bar-1"></span>
                  <span class="wave-bar bar-2"></span>
                  <span class="wave-bar bar-3"></span>
                  <span class="wave-bar bar-4"></span>
                </div>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    this.container.innerHTML = `
      <div 
        class="ugc-carousel-viewport" 
        tabindex="0"
        role="region" 
        aria-roledescription="carousel" 
        aria-label="Community Video Moments Carousel"
      >
        <!-- Edge Gradient Fades for Infinite Appearance -->
        <div class="carousel-edge-fade fade-left" aria-hidden="true"></div>
        <div class="carousel-edge-fade fade-right" aria-hidden="true"></div>

        <!-- Continuous Horizontally Scrolling Track -->
        <div class="ugc-carousel-track" id="ugc-carousel-track">
          ${cardsHtml}
        </div>
      </div>

      <!-- Carousel Navigation & Control Bar -->
      <div class="ugc-carousel-controls">
        <div class="ugc-controls-left">
          <button 
            type="button" 
            class="carousel-marquee-toggle btn-icon-glass" 
            id="carousel-marquee-toggle" 
            aria-label="${this.isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}"
            title="Toggle continuous motion"
          >
            <svg class="icon-pause-marquee" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="${this.isPaused ? 'display:none;' : ''}">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
            <svg class="icon-play-marquee" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" style="${this.isPaused ? '' : 'display:none;'}">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span class="control-text">${this.isPaused ? 'Resume Scroll' : 'Pause Scroll'}</span>
          </button>
        </div>

        <div class="ugc-controls-arrows">
          <button 
            type="button" 
            class="btn-arrow-glass arrow-prev" 
            id="carousel-arrow-prev" 
            aria-label="Scroll carousel to the left"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button 
            type="button" 
            class="btn-arrow-glass arrow-next" 
            id="carousel-arrow-next" 
            aria-label="Scroll carousel to the right"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  cacheElements() {
    this.viewport = this.container.querySelector('.ugc-carousel-viewport');
    this.track = this.container.querySelector('#ugc-carousel-track');
    this.cards = Array.from(this.container.querySelectorAll('.ugc-video-card'));
    this.prevBtn = this.container.querySelector('#carousel-arrow-prev');
    this.nextBtn = this.container.querySelector('#carousel-arrow-next');
    this.marqueeToggleBtn = this.container.querySelector('#carousel-marquee-toggle');
    this.pauseIcon = this.container.querySelector('.icon-pause-marquee');
    this.playIcon = this.container.querySelector('.icon-play-marquee');
    this.controlText = this.container.querySelector('.control-text');
  }

  setupIntersectionObserver() {
    // Observe cards so only visible videos are playing in the viewport
    const options = {
      root: this.viewport,
      threshold: 0.5,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const video = card.querySelector('video');
        if (!video) return;

        if (entry.isIntersecting && !card.classList.contains('is-manually-paused')) {
          // Play visible video if muted
          video.play().catch(() => {
            // Autoplay policy fallback
          });
        } else {
          // Pause offscreen video
          video.pause();
        }
      });
    }, options);

    this.cards.forEach((card) => {
      if (card.querySelector('video')) {
        this.intersectionObserver.observe(card);
      }
    });
  }

  startAnimation() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    const step = () => {
      if (!this.isPaused && !this.isDragging && this.track) {
        // Calculate the width of one full set of reels (half of the duplicated track)
        const halfWidth = this.track.scrollWidth / 2;

        if (halfWidth > 0) {
          this.currentOffset += this.speed;

          // Seamless looping: wrap around smoothly when half width is reached
          if (this.currentOffset >= halfWidth) {
            this.currentOffset -= halfWidth;
          }

          this.track.style.transform = `translate3d(-${this.currentOffset}px, 0, 0)`;
        }
      }

      this.animationFrameId = requestAnimationFrame(step);
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setPaused(paused) {
    this.isPaused = paused;
    if (this.marqueeToggleBtn) {
      this.marqueeToggleBtn.setAttribute(
        'aria-label',
        paused ? 'Resume auto-scroll' : 'Pause auto-scroll'
      );
      if (this.pauseIcon) this.pauseIcon.style.display = paused ? 'none' : 'block';
      if (this.playIcon) this.playIcon.style.display = paused ? 'block' : 'none';
      if (this.controlText) this.controlText.textContent = paused ? 'Resume Scroll' : 'Pause Scroll';
    }
  }

  bindEvents() {
    // Pause on hover
    this.viewport?.addEventListener('mouseenter', () => {
      this.isPaused = true;
    });

    this.viewport?.addEventListener('mouseleave', () => {
      if (!this.isUserInteracting && !this.prefersReducedMotion) {
        this.isPaused = false;
      }
    });

    // Pause on keyboard focus within
    this.viewport?.addEventListener('focusin', () => {
      this.isPaused = true;
    });

    this.viewport?.addEventListener('focusout', (e) => {
      if (!this.viewport.contains(e.relatedTarget) && !this.prefersReducedMotion) {
        this.isPaused = false;
      }
    });

    // Manual Marquee Toggle button
    this.marqueeToggleBtn?.addEventListener('click', () => {
      this.isUserInteracting = !this.isPaused;
      this.setPaused(!this.isPaused);
    });

    // Arrow navigation buttons: nudge by 1 card width (approx 300px)
    const nudgeAmount = 300;
    this.nextBtn?.addEventListener('click', () => {
      this.nudgeOffset(nudgeAmount);
    });

    this.prevBtn?.addEventListener('click', () => {
      this.nudgeOffset(-nudgeAmount);
    });

    // Touch & Mouse Drag on the track
    this.setupPointerDrag();

    // Card Video Playback & Sound Click Handlers
    this.setupCardInteractions();
  }

  nudgeOffset(delta) {
    if (!this.track) return;
    const halfWidth = this.track.scrollWidth / 2;
    this.currentOffset += delta;

    if (this.currentOffset < 0) {
      this.currentOffset += halfWidth;
    } else if (this.currentOffset >= halfWidth) {
      this.currentOffset -= halfWidth;
    }

    this.track.style.transition = 'transform 320ms cubic-bezier(0.2, 0, 0, 1)';
    this.track.style.transform = `translate3d(-${this.currentOffset}px, 0, 0)`;

    // Remove transition after animation finishes to keep continuous scrolling seamless
    setTimeout(() => {
      if (this.track) {
        this.track.style.transition = 'none';
      }
    }, 330);
  }

  setupPointerDrag() {
    const onStart = (clientX) => {
      this.isDragging = true;
      this.startX = clientX;
      this.startOffset = this.currentOffset;
      if (this.track) this.track.style.transition = 'none';
    };

    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const diffX = this.startX - clientX;
      const halfWidth = this.track.scrollWidth / 2;
      this.currentOffset = this.startOffset + diffX;

      if (this.currentOffset < 0) {
        this.currentOffset += halfWidth;
      } else if (this.currentOffset >= halfWidth) {
        this.currentOffset -= halfWidth;
      }

      if (this.track) {
        this.track.style.transform = `translate3d(-${this.currentOffset}px, 0, 0)`;
      }
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      // Temporarily pause continuous scroll for a moment after swiping
      clearTimeout(this.interactionTimeout);
      this.interactionTimeout = setTimeout(() => {
        if (!this.prefersReducedMotion) {
          this.isPaused = false;
        }
      }, 1800);
    };

    // Touch events
    this.viewport?.addEventListener(
      'touchstart',
      (e) => onStart(e.touches[0].clientX),
      { passive: true }
    );
    this.viewport?.addEventListener(
      'touchmove',
      (e) => onMove(e.touches[0].clientX),
      { passive: true }
    );
    this.viewport?.addEventListener('touchend', onEnd);

    // Mouse drag
    this.viewport?.addEventListener('mousedown', (e) => {
      // Only drag with left mouse click, not on buttons
      if (e.target.closest('button')) return;
      onStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) onMove(e.clientX);
    });

    window.addEventListener('mouseup', onEnd);
  }

  setupCardInteractions() {
    this.cards.forEach((card) => {
      const video = card.querySelector('video');
      const audioBtn = card.querySelector('.ugc-audio-btn');
      const centerIndicator = card.querySelector('.ugc-center-indicator');

      // Audio mute/unmute button
      if (audioBtn && video) {
        audioBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          const isMuted = video.muted;

          const mutedIcon = audioBtn.querySelector('.icon-muted');
          const unmutedIcon = audioBtn.querySelector('.icon-unmuted');

          if (mutedIcon) mutedIcon.style.display = isMuted ? 'block' : 'none';
          if (unmutedIcon) unmutedIcon.style.display = isMuted ? 'none' : 'block';
        });
      }

      // Card click toggles video playback or dispatches selection
      card.addEventListener('click', (e) => {
        if (e.target.closest('.ugc-audio-btn')) return;

        if (video) {
          if (video.paused) {
            video.play();
            card.classList.remove('is-manually-paused');
            if (centerIndicator) centerIndicator.classList.remove('show-paused');
          } else {
            video.pause();
            card.classList.add('is-manually-paused');
            if (centerIndicator) centerIndicator.classList.add('show-paused');
          }
        } else {
          // If in poster mode, dispatch event to open interactive lightbox
          const reelId = card.getAttribute('data-reel-id');
          const reelItem = this.reels.find((r) => r.id === reelId);
          if (reelItem) {
            const event = new CustomEvent('ugc-reel-clicked', {
              detail: reelItem,
              bubbles: true,
            });
            card.dispatchEvent(event);
          }
        }
      });
    });
  }

  destroy() {
    this.stopAnimation();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

// Backward-compatibility alias
export const ProductSlider = UgcVideoCarousel;
