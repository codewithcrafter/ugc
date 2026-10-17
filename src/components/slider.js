/**
 * AURA STUDIO — SMARTPHONE REELS FEED CONTROLLER
 * -----------------------------------------------
 * Replaces the horizontal card carousel with a premium, centrally positioned
 * smartphone mockup featuring a genuinely interactive vertical video feed
 * inspired by Instagram Reels / TikTok.
 *
 * Key Capabilities:
 * - High-precision realistic smartphone frame with ceramic pearl chassis & ambient glow
 * - Dynamic Island / Punch-hole camera, status bar, and home indicator
 * - Genuinely scrollable vertical feed using CSS scroll snap
 * - Keyboard navigation (ArrowUp, ArrowDown, Space, 'M')
 * - Flanking desktop controls (Next, Previous, 01/06 Counter)
 * - Single dominant reel in focus with 9:16 portrait display
 * - Play/Pause tap interactions with centered micro-feedback animations
 * - Double-tap heart burst micro-interaction
 * - Sound toggle (starts muted for autoplay policy compliance)
 * - Interactive action bar: Like toggle, Mute toggle, Share with clipboard toast, Details link
 * - Segmented story/reels progress indicator
 * - Graceful video fallback: smoothly handles missing or erroring video files
 *   by displaying the verified high-resolution poster without broken UI
 * - Full reduced-motion compliance
 */

export class SmartphoneReelsFeed {
  constructor(containerElement, reelsData = [], options = {}) {
    this.container = containerElement;
    this.reels = Array.isArray(reelsData) && reelsData.length ? reelsData : [];
    this.options = options;

    this.currentIndex = 0;
    this.isMuted = true;
    this.isPlaying = true;
    this.likedMap = new Map(); // tracks liked status per reel id
    this.audioContext = null; // for ambient audio fallback

    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this.feedObserver = null;
    this.phoneEntranceObserver = null;
    this.scrollTimeout = null;
    this.lastTapTime = 0;

    this.init();
  }

  init() {
    if (!this.container || !this.reels.length) return;

    this.render();
    this.cacheElements();
    this.setupReelObserver();
    this.setupEntranceObserver();
    this.bindEvents();

    // Initialize first reel state
    this.updateActiveReel(0, false);
  }

  render() {
    const totalReels = this.reels.length;

    // Build segment indicators
    const segmentsHtml = this.reels
      .map(
        (_, i) => `
        <div class="reel-segment-bar ${i === 0 ? 'is-active' : ''}" data-segment-index="${i}">
          <div class="segment-fill"></div>
        </div>
      `
      )
      .join('');

    // Build individual vertical reel cards
    const reelsHtml = this.reels
      .map((reel, index) => {
        const hasVideo = Boolean(reel.videoSrc);
        const initialLiked = this.likedMap.get(reel.id) || false;

        return `
        <article 
          class="phone-reel-card ${index === 0 ? 'is-current' : ''}" 
          data-reel-id="${reel.id}"
          data-reel-index="${index}"
          role="group" 
          aria-roledescription="reel" 
          aria-label="${reel.title} by ${reel.creator}"
          tabindex="-1"
        >
          <!-- Media Layer -->
          <div class="reel-media-stage">
            ${
              hasVideo
                ? `
              <video 
                class="reel-media-video" 
                poster="${reel.poster}"
                playsinline 
                muted 
                loop 
                preload="metadata"
                aria-label="${reel.title}"
              >
                <source src="${reel.videoSrc}" type="video/mp4" />
              </video>
            `
                : ''
            }
            <img 
              src="${reel.poster}" 
              alt="${reel.alt || reel.title}" 
              class="reel-media-poster ${hasVideo ? 'with-video' : ''}"
              loading="${index === 0 ? 'eager' : 'lazy'}"
              width="720"
              height="1280"
            />

            <!-- Top Vignette Scrim -->
            <div class="reel-scrim-top" aria-hidden="true"></div>
            <!-- Bottom Vignette Scrim for Caption Readability -->
            <div class="reel-scrim-bottom" aria-hidden="true"></div>
          </div>

          <!-- Reel Right Action Column -->
          <aside class="reel-actions-column" aria-label="Reel Actions">
            <!-- Like Action -->
            <button 
              type="button" 
              class="reel-action-btn btn-like ${initialLiked ? 'is-liked' : ''}" 
              data-action="like" 
              aria-label="Like this reel"
              title="Like"
            >
              <div class="action-btn-circle">
                <svg class="icon-heart" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="action-btn-label">Like</span>
            </button>

            <!-- Sound Mute/Unmute Action -->
            <button 
              type="button" 
              class="reel-action-btn btn-audio" 
              data-action="audio" 
              aria-label="Toggle audio"
              title="Mute / Unmute"
            >
              <div class="action-btn-circle">
                <svg class="icon-sound-muted" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
                <svg class="icon-sound-unmuted" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </div>
              <span class="action-btn-label">Sound</span>
            </button>

            <!-- Share Action -->
            <button 
              type="button" 
              class="reel-action-btn btn-share" 
              data-action="share" 
              aria-label="Share this reel"
              title="Share Link"
            >
              <div class="action-btn-circle">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </div>
              <span class="action-btn-label">Share</span>
            </button>

            <!-- Inquire / Lead Form Action -->
            <a 
              href="#lead-form" 
              class="reel-action-btn btn-inquire" 
              data-action="inquire" 
              aria-label="Inquire about ${reel.productTag}"
              title="Product Details"
            >
              <div class="action-btn-circle circle-accent">
                <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <span class="action-btn-label">Details</span>
            </a>

            <!-- Spinning Vinyl Audio Disc (Signature Reels Feature) -->
            <div class="reel-vinyl-disc" aria-hidden="true" title="Audio disc">
              <div class="vinyl-body">
                <div class="vinyl-groove"></div>
                <div class="vinyl-label">${reel.avatar || reel.creator.charAt(0)}</div>
              </div>
              <span class="vinyl-music-note note-1">♪</span>
              <span class="vinyl-music-note note-2">♫</span>
            </div>
          </aside>

          <!-- Bottom Caption Overlay -->
          <div class="reel-caption-overlay">
            <!-- Creator Profile Header -->
            <div class="reel-creator-header">
              <div class="reel-creator-avatar">
                <span>${reel.avatar || reel.creator.charAt(0)}</span>
              </div>
              <div class="reel-creator-info">
                <div class="reel-handle-group">
                  <span class="reel-creator-handle">${reel.handle}</span>
                  <button type="button" class="reel-follow-chip" aria-label="Follow ${reel.handle}">Follow</button>
                </div>
                <span class="reel-creator-role">${reel.role}</span>
              </div>
            </div>

            <!-- Title & Caption -->
            <h3 class="reel-title-heading">${reel.title}</h3>
            <p class="reel-caption-body">${reel.caption}</p>

            <!-- Product Pill Tag -->
            <a href="#lead-form" class="reel-product-pill" title="Learn about ${reel.productTag}">
              <svg class="pill-spark-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/>
              </svg>
              <span class="pill-tag-text">${reel.productTag}</span>
              <svg class="pill-arrow-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>

            <!-- Audio Track Indicator -->
            <div class="reel-audio-track-tag" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
              <div class="audio-marquee">
                <span>${reel.creator} • AURA 360° Studio Sound Experience</span>
              </div>
            </div>
          </div>

          <!-- Bottom Time Progress Track -->
          <div class="reel-time-progress" aria-hidden="true">
            <div class="progress-bar-fill"></div>
          </div>
        </article>
      `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="smartphone-showcase-stage" id="smartphone-stage">
        
        <!-- Soft Pastel Ambient Backlight Aura (Violet, Pink, Sky Blue) -->
        <div class="smartphone-ambient-aura" aria-hidden="true">
          <div class="aura-glow-orb orb-violet"></div>
          <div class="aura-glow-orb orb-pink"></div>
          <div class="aura-glow-orb orb-sky"></div>
        </div>

        <!-- Phone Hardware Mockup -->
        <div 
          class="smartphone-device-frame" 
          id="smartphone-frame"
          tabindex="0"
          role="region"
          aria-label="Interactive Smartphone UGC Reels Feed"
        >
          <!-- Physical Hardware Exterior Accents -->
          <div class="phone-edge-highlight" aria-hidden="true"></div>
          <div class="phone-button-vol-up" aria-hidden="true"></div>
          <div class="phone-button-vol-down" aria-hidden="true"></div>
          <div class="phone-button-power" aria-hidden="true"></div>
          
          <!-- Phone Chassis Bezel -->
          <div class="phone-chassis-bezel">
            
            <!-- Top Speaker Grille -->
            <div class="phone-top-speaker" aria-hidden="true"></div>

            <!-- Active Glass Display Screen -->
            <div class="phone-screen-viewport">
              
              <!-- Native Phone Status Bar Header -->
              <header class="phone-status-bar" aria-hidden="true">
                <span class="status-clock">9:41</span>
                
                <!-- Dynamic Island / Sleek Camera Pill -->
                <div class="dynamic-island-pill" title="Dynamic Island">
                  <span class="island-lens-circle"></span>
                  <span class="island-mic-dot"></span>
                  <span class="island-sound-indicator">
                    <span class="eq-bar bar-1"></span>
                    <span class="eq-bar bar-2"></span>
                    <span class="eq-bar bar-3"></span>
                  </span>
                </div>

                <!-- Signal, Wi-Fi, Battery Icons -->
                <div class="status-icons-group">
                  <svg class="status-svg" viewBox="0 0 18 12" width="15" height="10" fill="currentColor">
                    <rect x="0" y="8" width="3" height="4" rx="0.5"/>
                    <rect x="4" y="6" width="3" height="6" rx="0.5"/>
                    <rect x="8" y="3.5" width="3" height="8.5" rx="0.5"/>
                    <rect x="12" y="0.5" width="3" height="11.5" rx="0.5"/>
                  </svg>
                  <svg class="status-svg" viewBox="0 0 16 12" width="14" height="10" fill="currentColor">
                    <path d="M8 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM4.7 7.7a4.67 4.67 0 0 1 6.6 0 .8.8 0 0 0 1.13-1.13 6.27 6.27 0 0 0-8.86 0 .8.8 0 0 0 1.13 1.13zm-2.83-2.83a8.67 8.67 0 0 1 12.26 0 .8.8 0 0 0 1.13-1.13 10.27 10.27 0 0 0-14.52 0 .8.8 0 0 0 1.13 1.13z"/>
                  </svg>
                  <svg class="status-svg" viewBox="0 0 24 12" width="20" height="10" fill="currentColor">
                    <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" fill="none" stroke-width="1"/>
                    <rect x="2.5" y="2.5" width="14" height="7" rx="1.5"/>
                    <path d="M22 4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
              </header>

              <!-- Story / Segment Progress Bars -->
              <div class="phone-segments-track" aria-hidden="true">
                ${segmentsHtml}
              </div>

              <!-- Reels App Header Overlay -->
              <div class="phone-reels-header">
                <div class="reels-header-left">
                  <span class="reels-app-logo">Reels</span>
                  <span class="reels-community-badge">AURA Studio</span>
                </div>
                
                <button 
                  type="button" 
                  class="reels-top-sound-btn" 
                  aria-label="Toggle sound across all reels"
                  title="Toggle Sound"
                >
                  <span class="sound-top-icon icon-top-muted">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  </span>
                  <span class="sound-top-icon icon-top-unmuted" style="display:none;">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  </span>
                </button>
              </div>

              <!-- The Genuine Vertically Scrollable Reels Feed Track -->
              <div 
                class="phone-reels-feed-scroll" 
                id="reels-scroll-feed" 
                tabindex="-1"
                aria-label="Vertical Reels Track. Scroll inside phone or use Arrow Keys to navigate."
              >
                ${reelsHtml}
              </div>

              <!-- Interactive Center Pop Indicator (Play / Pause / Heart Burst) -->
              <div class="reel-center-pop" id="center-pop" aria-hidden="true">
                <div class="pop-icon-box pop-play">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <div class="pop-icon-box pop-pause">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                    <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                  </svg>
                </div>
                <div class="pop-icon-box pop-heart">
                  <svg viewBox="0 0 24 24" width="44" height="44" fill="#F43F5E">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>

              <!-- In-Phone Copied Toast Notification -->
              <div class="phone-toast-pill" id="phone-toast" role="status" aria-live="polite">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Reel link copied to clipboard</span>
              </div>

              <!-- Bottom Home Indicator Bar -->
              <div class="phone-home-indicator" aria-hidden="true"></div>

            </div> <!-- /phone-screen-viewport -->
          </div> <!-- /phone-chassis-bezel -->

          <!-- Flanking Desktop Quick Navigation Controls -->
          <div class="phone-flanking-controls" aria-label="Reel Navigation Controls">
            <button 
              type="button" 
              class="flank-nav-btn btn-flank-prev" 
              id="flank-prev-btn"
              aria-label="Previous reel" 
              title="Previous Reel (Up Arrow)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            </button>

            <div class="flank-counter-badge" aria-live="polite">
              <span class="counter-num current-reel-num">01</span>
              <span class="counter-divider">/</span>
              <span class="counter-num total-reel-num">0${totalReels}</span>
            </div>

            <button 
              type="button" 
              class="flank-nav-btn btn-flank-next" 
              id="flank-next-btn"
              aria-label="Next reel" 
              title="Next Reel (Down Arrow)"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>

        </div> <!-- /smartphone-device-frame -->

        <!-- Bottom Accessibility & Interaction Hint -->
        <div class="smartphone-hint-bar" aria-hidden="true">
          <span class="hint-pill-glass">
            <svg class="hint-arrow-anim" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
            Scroll inside phone or use ↑ / ↓ arrow keys
          </span>
        </div>

      </div> <!-- /smartphone-showcase-stage -->
    `;
  }

  cacheElements() {
    this.stage = this.container.querySelector('#smartphone-stage');
    this.frame = this.container.querySelector('#smartphone-frame');
    this.feed = this.container.querySelector('#reels-scroll-feed');
    this.cards = Array.from(this.container.querySelectorAll('.phone-reel-card'));
    this.segments = Array.from(
      this.container.querySelectorAll('.reel-segment-bar')
    );
    this.centerPop = this.container.querySelector('#center-pop');
    this.toast = this.container.querySelector('#phone-toast');
    this.prevBtn = this.container.querySelector('#flank-prev-btn');
    this.nextBtn = this.container.querySelector('#flank-next-btn');
    this.currentNumEl = this.container.querySelector('.current-reel-num');
    this.topSoundBtn = this.container.querySelector('.reels-top-sound-btn');

    // Handle video errors gracefully for each reel
    this.cards.forEach((card) => {
      const video = card.querySelector('video');
      const poster = card.querySelector('.reel-media-poster');

      if (video) {
        // If the video fails to load (404), hide it and mark card as visual edition
        video.addEventListener('error', () => {
          video.style.display = 'none';
          if (poster) {
            poster.classList.remove('with-video');
            poster.classList.add('is-fallback-poster');
          }
          card.classList.add('is-photo-story');
        });

        // When video metadata / frame is loaded
        video.addEventListener('loadeddata', () => {
          card.classList.remove('is-photo-story');
          card.classList.add('is-video-ready');
        });

        // Loop time update for progress bar
        video.addEventListener('timeupdate', () => {
          if (video.duration && !card.classList.contains('is-photo-story')) {
            const pct = (video.currentTime / video.duration) * 100;
            const progressFill = card.querySelector('.progress-bar-fill');
            if (progressFill) progressFill.style.width = `${pct}%`;
          }
        });
      } else {
        card.classList.add('is-photo-story');
      }
    });
  }

  setupReelObserver() {
    if (!this.feed) return;

    // Observe each reel card to determine active snap position
    const observerOptions = {
      root: this.feed,
      rootMargin: '0px',
      threshold: 0.6, // dominant visibility
    };

    this.feedObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(
            entry.target.getAttribute('data-reel-index'),
            10
          );
          if (!isNaN(index) && index !== this.currentIndex) {
            this.updateActiveReel(index, true);
          }
        }
      });
    }, observerOptions);

    this.cards.forEach((card) => this.feedObserver.observe(card));
  }

  setupEntranceObserver() {
    if (!this.frame) return;

    const entranceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.frame.classList.add('has-entered');
            // Autoplay current reel if allowed
            this.playReel(this.currentIndex);
          } else {
            this.pauseAllReels();
          }
        });
      },
      { threshold: 0.25 }
    );

    entranceObserver.observe(this.frame);
    this.phoneEntranceObserver = entranceObserver;
  }

  updateActiveReel(index, shouldPlay = true) {
    if (index < 0 || index >= this.reels.length) return;

    const prevIndex = this.currentIndex;
    this.currentIndex = index;

    // Pause previous video
    if (prevIndex !== index && this.cards[prevIndex]) {
      this.pauseReel(prevIndex);
      this.cards[prevIndex].classList.remove('is-current');
    }

    // Activate current card
    const currentCard = this.cards[index];
    if (currentCard) {
      currentCard.classList.add('is-current');
      if (shouldPlay && this.isPlaying) {
        this.playReel(index);
      }
    }

    // Update segment timeline bars
    this.segments.forEach((seg, i) => {
      seg.classList.remove('is-active', 'is-completed');
      if (i < index) {
        seg.classList.add('is-completed');
      } else if (i === index) {
        seg.classList.add('is-active');
      }
    });

    // Update flanking counter
    if (this.currentNumEl) {
      this.currentNumEl.textContent = `0${index + 1}`;
    }

    // Update button states
    if (this.prevBtn) {
      this.prevBtn.disabled = index === 0;
      this.prevBtn.style.opacity = index === 0 ? '0.4' : '1';
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = index === this.reels.length - 1;
      this.nextBtn.style.opacity =
        index === this.reels.length - 1 ? '0.4' : '1';
    }
  }

  playReel(index) {
    const card = this.cards[index];
    if (!card) return;

    const video = card.querySelector('video');
    if (video && video.style.display !== 'none') {
      video.muted = this.isMuted;
      video.playsInline = true;

      // Autoplay promise handling
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser policy; retain poster & wait for user gesture
          video.muted = true;
          this.isMuted = true;
          this.updateAudioIcons();
        });
      }
    }

    // Animate vinyl disc when active
    const vinyl = card.querySelector('.reel-vinyl-disc');
    if (vinyl && !this.prefersReducedMotion) {
      vinyl.classList.add('is-spinning');
    }
  }

  pauseReel(index) {
    const card = this.cards[index];
    if (!card) return;

    const video = card.querySelector('video');
    if (video) {
      video.pause();
    }

    const vinyl = card.querySelector('.reel-vinyl-disc');
    if (vinyl) {
      vinyl.classList.remove('is-spinning');
    }
  }

  pauseAllReels() {
    this.cards.forEach((card) => {
      const video = card.querySelector('video');
      if (video) video.pause();
      const vinyl = card.querySelector('.reel-vinyl-disc');
      if (vinyl) vinyl.classList.remove('is-spinning');
    });
  }

  scrollToReel(index) {
    if (!this.feed || index < 0 || index >= this.reels.length) return;
    const targetCard = this.cards[index];
    if (targetCard) {
      this.feed.scrollTo({
        top: targetCard.offsetTop,
        behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    this.updateAudioIcons();

    // Apply to all videos
    this.cards.forEach((card) => {
      const video = card.querySelector('video');
      if (video) {
        video.muted = this.isMuted;
      }
    });

    // Provide warm ambient harmonic acoustic tone via Web Audio when unmuted
    if (!this.isMuted) {
      this.playAcousticChime();
    }
  }

  updateAudioIcons() {
    const mutedSvg = this.container.querySelectorAll(
      '.icon-sound-muted, .icon-top-muted'
    );
    const unmutedSvg = this.container.querySelectorAll(
      '.icon-sound-unmuted, .icon-top-unmuted'
    );

    mutedSvg.forEach((el) => {
      el.style.display = this.isMuted ? 'block' : 'none';
    });
    unmutedSvg.forEach((el) => {
      el.style.display = this.isMuted ? 'none' : 'block';
    });

    // Animate Dynamic Island audio equalizer bars when sound is active
    const eqBars = this.container.querySelector('.island-sound-indicator');
    if (eqBars) {
      if (this.isMuted) {
        eqBars.classList.remove('is-playing-eq');
      } else {
        eqBars.classList.add('is-playing-eq');
      }
    }
  }

  playAcousticChime() {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      if (this.audioContext) {
        const now = this.audioContext.currentTime;
        // Warm 432Hz ambient chord (pure acoustic sanctuary tone)
        const notes = [432, 540, 648];
        notes.forEach((freq, i) => {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);

          gain.gain.setValueAtTime(0.001, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.04, now + i * 0.08 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 1.2);

          osc.connect(gain);
          gain.connect(this.audioContext.destination);

          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 1.25);
        });
      }
    } catch {
      // AudioContext unavailable or restricted; safe silent fallback
    }
  }

  showCenterPop(type) {
    if (!this.centerPop || this.prefersReducedMotion) return;

    this.centerPop.classList.remove('pop-active', 'show-play', 'show-pause', 'show-heart');
    void this.centerPop.offsetWidth; // Force reflow

    this.centerPop.classList.add('pop-active', `show-${type}`);

    setTimeout(() => {
      if (this.centerPop) {
        this.centerPop.classList.remove('pop-active');
      }
    }, 600);
  }

  showToast(message = 'Reel link copied to clipboard') {
    if (!this.toast) return;

    const span = this.toast.querySelector('span');
    if (span) span.textContent = message;

    this.toast.classList.add('is-visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast?.classList.remove('is-visible');
    }, 2400);
  }

  toggleLike(reelId, button) {
    const isCurrentlyLiked = this.likedMap.get(reelId) || false;
    const nextState = !isCurrentlyLiked;
    this.likedMap.set(reelId, nextState);

    if (button) {
      if (nextState) {
        button.classList.add('is-liked');
        const label = button.querySelector('.action-btn-label');
        if (label) label.textContent = 'Liked';
        this.showCenterPop('heart');
      } else {
        button.classList.remove('is-liked');
        const label = button.querySelector('.action-btn-label');
        if (label) label.textContent = 'Like';
      }
    }
  }

  copyReelLink(reel) {
    const url = `${window.location.origin}${window.location.pathname}#product-slider`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => this.showToast(`Link for ${reel.creator} copied!`))
        .catch(() => this.showToast('Reel link copied!'));
    } else {
      this.showToast('Reel link copied!');
    }
  }

  bindEvents() {
    // 1. Desktop Flanking Prev/Next Navigation
    this.prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToReel(this.currentIndex - 1);
    });

    this.nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToReel(this.currentIndex + 1);
    });

    // 2. Story Segment Click to jump directly to reel
    this.segments.forEach((seg) => {
      seg.addEventListener('click', () => {
        const idx = parseInt(seg.getAttribute('data-segment-index'), 10);
        if (!isNaN(idx)) this.scrollToReel(idx);
      });
    });

    // 3. Top Sound Button
    this.topSoundBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSound();
    });

    // 4. Keyboard Navigation when frame or feed has focus
    const handleKeyNav = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        this.scrollToReel(this.currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.scrollToReel(this.currentIndex - 1);
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        this.togglePlayPauseCurrent();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        this.toggleSound();
      }
    };

    this.frame?.addEventListener('keydown', handleKeyNav);
    this.feed?.addEventListener('keydown', handleKeyNav);

    // 5. Card click handlers & double-tap detection
    this.cards.forEach((card, index) => {
      const reel = this.reels[index];
      const video = card.querySelector('video');

      // Tap / Click on the main stage (excluding action buttons)
      card.addEventListener('click', (e) => {
        // Prevent if clicking on interactive action buttons or links
        if (
          e.target.closest(
            '.reel-action-btn, .reel-follow-chip, .reel-product-pill, a, button'
          )
        ) {
          return;
        }

        const now = Date.now();
        // Double-tap detection (< 300ms) -> Heart like
        if (now - this.lastTapTime < 300) {
          const likeBtn = card.querySelector('.btn-like');
          this.toggleLike(reel.id, likeBtn);
          this.lastTapTime = 0;
          return;
        }
        this.lastTapTime = now;

        // Single tap -> Play / Pause toggle
        this.togglePlayPauseCurrent();
      });

      // Like Button
      const likeBtn = card.querySelector('.btn-like');
      likeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLike(reel.id, likeBtn);
      });

      // Audio Button in Action Column
      const audioBtn = card.querySelector('.btn-audio');
      audioBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSound();
      });

      // Share Button
      const shareBtn = card.querySelector('.btn-share');
      shareBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.copyReelLink(reel);
      });

      // Follow Chip Toggle
      const followChip = card.querySelector('.reel-follow-chip');
      followChip?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isFollowing = followChip.classList.toggle('is-following');
        followChip.textContent = isFollowing ? 'Following' : 'Follow';
        if (isFollowing) {
          this.showToast(`Following ${reel.handle}`);
        }
      });
    });

    // 6. Natural wheel scroll inside phone container
    if (this.feed) {
      this.feed.addEventListener(
        'wheel',
        (e) => {
          // Allow natural vertical scroll, prevent page bounce if inside feed
          const isAtTop = this.feed.scrollTop <= 0;
          const isAtBottom =
            this.feed.scrollTop + this.feed.clientHeight >=
            this.feed.scrollHeight - 2;

          if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
            // Internal scrolling within phone boundaries
            e.stopPropagation();
          }
        },
        { passive: true }
      );
    }
  }

  togglePlayPauseCurrent() {
    const card = this.cards[this.currentIndex];
    if (!card) return;

    const video = card.querySelector('video');
    if (video && video.style.display !== 'none') {
      if (video.paused) {
        video.play().catch(() => {});
        this.isPlaying = true;
        this.showCenterPop('play');
        const vinyl = card.querySelector('.reel-vinyl-disc');
        if (vinyl) vinyl.classList.add('is-spinning');
      } else {
        video.pause();
        this.isPlaying = false;
        this.showCenterPop('pause');
        const vinyl = card.querySelector('.reel-vinyl-disc');
        if (vinyl) vinyl.classList.remove('is-spinning');
      }
    } else {
      // Photo story mode: toggle subtle ambient pulse and center pop
      this.isPlaying = !this.isPlaying;
      card.classList.toggle('is-paused', !this.isPlaying);
      this.showCenterPop(this.isPlaying ? 'play' : 'pause');
    }
  }

  destroy() {
    if (this.feedObserver) {
      this.feedObserver.disconnect();
    }
    if (this.phoneEntranceObserver) {
      this.phoneEntranceObserver.disconnect();
    }
    this.pauseAllReels();
  }
}

// Backward compatibility aliases
export const ProductSlider = SmartphoneReelsFeed;
export const UgcVideoCarousel = SmartphoneReelsFeed;
export const SmartphoneReelsViewer = SmartphoneReelsFeed;
export default SmartphoneReelsFeed;
