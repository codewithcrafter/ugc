/**
 * AURA Studio — Smartphone Reels Viewer
 * -----------------------------------------------------
 * Transforms the UGC carousel into a centered, animated smartphone mockup
 * featuring a real vertical 9:16 short-video reels feed.
 *
 * Capabilities:
 * - Centered flagship smartphone chassis with realistic physical details
 * - Dynamic Island, status bar, screen clipping & home indicator
 * - 9:16 vertical scroll-snapping feed with smooth reel transitions
 * - Mouse-wheel, touch swipe, keyboard (Arrow Up/Down), and button navigation
 * - Top segmented story progress bars (jump to any reel)
 * - Right-side functional action toolbar (Like heart toggle, sound toggle, share link toast, story details)
 * - Bottom creator profile, product tags, captions, and animated acoustic waveform
 * - Video play/pause synchronization & poster fallback
 * - Ambient floating pastel lighting orbs
 * - Full responsive scaling (1440px -> 320px) and prefers-reduced-motion support
 */

export class SmartphoneReelsViewer {
  constructor(containerElement, reelsData = [], options = {}) {
    this.container = containerElement;
    this.reels = Array.isArray(reelsData) && reelsData.length ? reelsData : [];
    this.currentIndex = 0;
    this.isMuted = true;
    this.isScrolling = false;
    this.scrollCooldown = false;
    this.wheelCooldownTime = 450; // ms between wheel snap steps
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.intersectionObserver = null;
    this.toastTimeout = null;
    this.likedState = new Set(); // tracks liked reel IDs

    this.init();
  }

  init() {
    if (!this.container || !this.reels.length) return;

    this.render();
    this.cacheElements();
    this.setupIntersectionObserver();
    this.bindEvents();
    this.updateActiveReel(0, false);
  }

  render() {
    const totalReels = this.reels.length;

    // Top progress segments
    const progressSegmentsHtml = this.reels
      .map(
        (_, i) => `
        <button 
          type="button" 
          class="progress-segment ${i === 0 ? 'is-active is-filled' : ''}" 
          data-segment-index="${i}" 
          aria-label="Go to story ${i + 1} of ${totalReels}"
        >
          <span class="segment-fill"></span>
        </button>
      `
      )
      .join('');

    // Bottom dot indicators
    const dotsHtml = this.reels
      .map(
        (_, i) => `
        <button 
          type="button" 
          class="reels-dot ${i === 0 ? 'is-active' : ''}" 
          data-dot-index="${i}" 
          aria-label="Jump to reel ${i + 1}"
        ></button>
      `
      )
      .join('');

    // Render individual reel cards inside vertical feed
    const reelsHtml = this.reels
      .map((item, index) => {
        const hasVideo = Boolean(item.videoSrc);
        const isLiked = this.likedState.has(item.id);

        return `
        <article 
          class="reel-item ${index === 0 ? 'is-active' : ''}" 
          data-index="${index}" 
          data-reel-id="${item.id}"
          role="article" 
          aria-label="${item.title} by ${item.creator}"
        >
          <!-- Media Layer -->
          <div class="reel-media-wrapper">
            ${
              hasVideo
                ? `
              <video 
                class="reel-video-element" 
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
              alt="${item.alt || item.title}" 
              class="reel-poster-img ${hasVideo ? 'has-video-element' : ''}" 
              loading="${index === 0 ? 'eager' : 'lazy'}"
              width="720"
              height="1280"
            />

            <!-- Play/Pause Feedback Circle -->
            <div class="reel-center-feedback" aria-hidden="true">
              <div class="feedback-circle">
                <svg class="icon-feedback-play" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <svg class="icon-feedback-pause" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" style="display:none;">
                  <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                  <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
                </svg>
              </div>
            </div>
          </div>

          <!-- Vertical Functional Action Bar (Right side) -->
          <aside class="reel-action-bar" aria-label="Reel Actions">
            <!-- Like Button -->
            <button 
              type="button" 
              class="reel-action-btn action-like ${isLiked ? 'is-liked' : ''}" 
              data-action="like" 
              data-reel-id="${item.id}"
              aria-label="Love this reel" 
              title="Love this reel"
            >
              <div class="action-btn-circle">
                <svg class="heart-icon" viewBox="0 0 24 24" width="19" height="19" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <span class="action-label like-label">${isLiked ? 'Loved' : 'Love'}</span>
            </button>

            <!-- Audio Mute/Unmute Button -->
            <button 
              type="button" 
              class="reel-action-btn action-sound" 
              data-action="sound" 
              aria-label="Toggle sound" 
              title="Mute / Unmute audio"
            >
              <div class="action-btn-circle">
                <svg class="sound-icon-muted" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
                <svg class="sound-icon-unmuted" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </div>
              <span class="action-label sound-label">Sound</span>
            </button>

            <!-- Share / Copy Link Button -->
            <button 
              type="button" 
              class="reel-action-btn action-share" 
              data-action="share" 
              data-reel-id="${item.id}"
              aria-label="Share this reel" 
              title="Copy share link"
            >
              <div class="action-btn-circle">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </div>
              <span class="action-label">Share</span>
            </button>

            <!-- Details / Lightbox Expand Button -->
            <button 
              type="button" 
              class="reel-action-btn action-details" 
              data-action="details" 
              data-reel-id="${item.id}"
              aria-label="Open detailed story lightbox" 
              title="Expand story"
            >
              <div class="action-btn-circle">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </div>
              <span class="action-label">Story</span>
            </button>
          </aside>

          <!-- Bottom Creator & Caption Overlay -->
          <div class="reel-bottom-overlay">
            <!-- Creator Profile Header -->
            <div class="reel-creator-header">
              <div class="reel-creator-avatar">${item.avatar || item.creator.charAt(0)}</div>
              <div class="reel-creator-meta">
                <div class="reel-handle-line">
                  <span class="reel-creator-handle">${item.handle}</span>
                  <svg class="verified-check" viewBox="0 0 24 24" width="14" height="14" fill="#3897F0" aria-label="Verified Creator">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"></path>
                  </svg>
                </div>
                <span class="reel-creator-role">${item.role}</span>
              </div>
            </div>

            <!-- Product Pill & Duration -->
            <div class="reel-tag-row">
              <span class="reel-product-pill">
                <span class="tag-dot"></span>
                <span>${item.productTag}</span>
              </span>
              <span class="reel-duration-badge">${item.duration}</span>
            </div>

            <!-- Title & Caption -->
            <h3 class="reel-item-title">${item.title}</h3>
            <p class="reel-caption-text">${item.caption}</p>

            <!-- Mini Acoustic Waveform -->
            <div class="reel-waveform-row" aria-hidden="true">
              <svg class="waveform-music-note" viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <span class="waveform-label">AURA Ambient Sanctuary • 360° Studio Sound</span>
              <div class="waveform-bars">
                <span class="w-bar bar-1"></span>
                <span class="w-bar bar-2"></span>
                <span class="w-bar bar-3"></span>
                <span class="w-bar bar-4"></span>
              </div>
            </div>
          </div>
        </article>
      `;
      })
      .join('');

    this.container.innerHTML = `
      <div class="smartphone-reels-experience" role="region" aria-label="AURA Interactive Smartphone UGC Feed">
        <!-- Ambient Pastel Glow Orbs behind Phone -->
        <div class="ambient-phone-glow" aria-hidden="true">
          <div class="ambient-orb orb-lavender"></div>
          <div class="ambient-orb orb-pink"></div>
          <div class="ambient-orb orb-blue"></div>
          <div class="ambient-orb orb-lime"></div>
        </div>

        <!-- Phone Stage: Prev Arrow + Phone Mockup + Next Arrow -->
        <div class="phone-stage-container">
          <!-- Desktop Prev Reel Floating Button -->
          <button 
            type="button" 
            class="reel-stage-nav btn-stage-prev" 
            id="reel-stage-prev" 
            aria-label="Previous reel story"
            title="Previous story (or scroll up)"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <span class="nav-direction-text">Prev</span>
          </button>

          <!-- Smartphone Hardware Chassis -->
          <div 
            class="smartphone-chassis" 
            id="smartphone-chassis" 
            tabindex="0" 
            role="application" 
            aria-label="Interactive Smartphone: Use Arrow keys or scroll inside to navigate reels"
          >
            <!-- Hardware Buttons on Chassis Edges -->
            <div class="phone-btn-volume-up" aria-hidden="true"></div>
            <div class="phone-btn-volume-down" aria-hidden="true"></div>
            <div class="phone-btn-action" aria-hidden="true"></div>
            <div class="phone-btn-power" aria-hidden="true"></div>

            <!-- Outer Bezel Frame -->
            <div class="phone-bezel">
              <!-- Clipped Screen Viewport -->
              <div class="phone-screen" id="phone-screen">

                <!-- Phone Status Bar -->
                <header class="phone-status-bar" aria-hidden="true">
                  <span class="status-time">9:41</span>
                  
                  <!-- Dynamic Island Pill Cutout -->
                  <div class="dynamic-island">
                    <span class="island-camera"></span>
                    <span class="island-sensor"></span>
                    <span class="island-pulse"></span>
                  </div>

                  <div class="status-system-icons">
                    <!-- Cellular -->
                    <svg class="sys-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <rect x="2" y="16" width="3" height="6" rx="0.5"/>
                      <rect x="7" y="12" width="3" height="10" rx="0.5"/>
                      <rect x="12" y="8" width="3" height="14" rx="0.5"/>
                      <rect x="17" y="4" width="3" height="18" rx="0.5"/>
                    </svg>
                    <!-- Wifi -->
                    <svg class="sys-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <path d="M12 18c.8 0 1.5.7 1.5 1.5S12.8 21 12 21s-1.5-.7-1.5-1.5S11.2 18 12 18zm-4.9-3.9a7 7 0 0 1 9.8 0l-1.4 1.4a5 5 0 0 0-7 0l-1.4-1.4zm-2.8-2.8a11 11 0 0 1 15.4 0l-1.4 1.4a9 9 0 0 0-12.6 0l-1.4-1.4z"/>
                    </svg>
                    <!-- Battery -->
                    <svg class="sys-icon" viewBox="0 0 24 24" width="15" height="13" fill="currentColor">
                      <rect x="2" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                      <rect x="4" y="8" width="11" height="8" rx="1"/>
                      <path d="M20 10v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                </header>

                <!-- Top Segmented Story Progress Bars -->
                <nav class="phone-progress-bar" id="phone-progress-bar" aria-label="Reel story progress">
                  ${progressSegmentsHtml}
                </nav>

                <!-- Vertical Snap Reels Feed Viewport -->
                <main 
                  class="reels-feed-viewport" 
                  id="reels-feed-viewport" 
                  tabindex="0" 
                  role="feed" 
                  aria-label="Sanctuary Stories Vertical Feed"
                >
                  ${reelsHtml}
                </main>

                <!-- In-Phone Feedback Toast Message -->
                <div class="phone-toast-pill" id="phone-toast-pill" aria-live="polite">
                  <span class="toast-text" id="phone-toast-text">Link copied to clipboard! ✨</span>
                </div>

                <!-- Initial Gentle Swipe Hint -->
                <div class="phone-swipe-hint" id="phone-swipe-hint" aria-hidden="true">
                  <span class="swipe-hint-chevron">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                  </span>
                  <span class="swipe-hint-label">Scroll inside phone</span>
                </div>

                <!-- Bottom Home Bar Indicator -->
                <div class="phone-home-bar" aria-hidden="true"></div>

              </div> <!-- /.phone-screen -->
            </div> <!-- /.phone-bezel -->
          </div> <!-- /.smartphone-chassis -->

          <!-- Desktop Next Reel Floating Button -->
          <button 
            type="button" 
            class="reel-stage-nav btn-stage-next" 
            id="reel-stage-next" 
            aria-label="Next reel story"
            title="Next story (or scroll down)"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span class="nav-direction-text">Next</span>
          </button>
        </div> <!-- /.phone-stage-container -->

        <!-- Bottom Controller Bar (Reel Counter + Dots + Quick Jump) -->
        <div class="reels-bottom-controls">
          <div class="reels-counter-badge">
            <span class="counter-pulse" aria-hidden="true"></span>
            <span class="counter-numbers">
              <strong class="counter-curr" id="reel-counter-curr">1</strong>
              <span class="counter-div">/</span>
              <span class="counter-total">${totalReels}</span>
            </span>
            <span class="counter-label">Sanctuary Reels</span>
          </div>

          <div class="reels-dots-bar" id="reels-dots-bar" aria-label="Reel selection dots">
            ${dotsHtml}
          </div>

          <div class="reels-desktop-hints">
            <span class="kbd-pill"><kbd>↑</kbd> <kbd>↓</kbd> Keys</span>
            <span class="hint-sep">•</span>
            <span class="kbd-pill">Mouse Wheel Inside</span>
          </div>
        </div>
      </div>
    `;
  }

  cacheElements() {
    this.stageWrapper = this.container.querySelector('.smartphone-reels-experience');
    this.chassis = this.container.querySelector('#smartphone-chassis');
    this.screen = this.container.querySelector('#phone-screen');
    this.viewport = this.container.querySelector('#reels-feed-viewport');
    this.reelItems = Array.from(this.container.querySelectorAll('.reel-item'));
    this.progressSegments = Array.from(this.container.querySelectorAll('.progress-segment'));
    this.dots = Array.from(this.container.querySelectorAll('.reels-dot'));
    this.prevBtn = this.container.querySelector('#reel-stage-prev');
    this.nextBtn = this.container.querySelector('#reel-stage-next');
    this.counterCurr = this.container.querySelector('#reel-counter-curr');
    this.toastPill = this.container.querySelector('#phone-toast-pill');
    this.toastText = this.container.querySelector('#phone-toast-text');
    this.swipeHint = this.container.querySelector('#phone-swipe-hint');
  }

  setupIntersectionObserver() {
    // Detect which reel is currently active inside the scroll viewport
    const options = {
      root: this.viewport,
      threshold: 0.6,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(index) && index !== this.currentIndex) {
            this.updateActiveReel(index, true);
          }
        }
      });
    }, options);

    this.reelItems.forEach((item) => {
      this.intersectionObserver.observe(item);
    });
  }

  bindEvents() {
    // 1. Desktop Prev/Next Buttons
    this.prevBtn?.addEventListener('click', () => this.goToPrevReel());
    this.nextBtn?.addEventListener('click', () => this.goToNextReel());

    // 2. Click on Progress Segments (Direct Jump)
    this.progressSegments.forEach((segment) => {
      segment.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(segment.getAttribute('data-segment-index'), 10);
        if (!isNaN(index)) this.goToReel(index);
      });
    });

    // 3. Click on Dots
    this.dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(dot.getAttribute('data-dot-index'), 10);
        if (!isNaN(index)) this.goToReel(index);
      });
    });

    // 4. Mouse Wheel over Phone Screen: smooth reel-by-reel snapping without hijacking outer page scroll
    this.setupWheelHandler();

    // 5. Keyboard Navigation when focused on Phone Chassis or Viewport
    const handleKeyNav = (e) => {
      if (['ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        this.goToNextReel();
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        this.goToPrevReel();
      } else if (e.key === ' ' && e.target === this.viewport) {
        e.preventDefault();
        this.toggleCurrentPlayPause();
      }
    };

    this.chassis?.addEventListener('keydown', handleKeyNav);
    this.viewport?.addEventListener('keydown', handleKeyNav);

    // 6. Action buttons inside reels (Like, Sound, Share, Details)
    this.setupReelActionButtons();

    // 7. Video Play/Pause toggle on clicking media
    this.setupMediaClickHandlers();

    // 8. Dismiss swipe hint after first interaction
    const dismissHint = () => {
      if (this.swipeHint) {
        this.swipeHint.style.opacity = '0';
        this.swipeHint.style.pointerEvents = 'none';
      }
    };
    this.viewport?.addEventListener('scroll', dismissHint, { once: true, passive: true });
    this.viewport?.addEventListener('touchstart', dismissHint, { once: true, passive: true });
  }

  setupWheelHandler() {
    if (!this.viewport) return;

    this.viewport.addEventListener(
      'wheel',
      (e) => {
        const delta = e.deltaY;
        const isAtTop = this.viewport.scrollTop <= 5;
        const isAtBottom =
          this.viewport.scrollTop + this.viewport.clientHeight >=
          this.viewport.scrollHeight - 5;

        // If scrolling down and not at the very end, handle inside phone
        if (delta > 20) {
          if (!isAtBottom) {
            e.preventDefault();
            if (!this.scrollCooldown) {
              this.scrollCooldown = true;
              this.goToNextReel();
              setTimeout(() => {
                this.scrollCooldown = false;
              }, this.wheelCooldownTime);
            }
          }
        } else if (delta < -20) {
          // If scrolling up and not at the top, handle inside phone
          if (!isAtTop) {
            e.preventDefault();
            if (!this.scrollCooldown) {
              this.scrollCooldown = true;
              this.goToPrevReel();
              setTimeout(() => {
                this.scrollCooldown = false;
              }, this.wheelCooldownTime);
            }
          }
        }
      },
      { passive: false }
    );
  }

  setupReelActionButtons() {
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('.reel-action-btn');
      if (!btn) return;

      e.stopPropagation();
      const action = btn.getAttribute('data-action');
      const reelId = btn.getAttribute('data-reel-id');
      const reelItem = this.reels.find((r) => r.id === reelId);

      switch (action) {
        case 'like':
          this.handleLikeAction(btn, reelId);
          break;
        case 'sound':
          this.handleSoundAction();
          break;
        case 'share':
          this.handleShareAction(reelItem);
          break;
        case 'details':
          this.handleDetailsAction(reelItem);
          break;
      }
    });
  }

  handleLikeAction(btn, reelId) {
    const heartSvg = btn.querySelector('.heart-icon');
    const label = btn.querySelector('.like-label');
    const isLiked = this.likedState.has(reelId);

    if (isLiked) {
      this.likedState.delete(reelId);
      btn.classList.remove('is-liked');
      if (heartSvg) heartSvg.setAttribute('fill', 'none');
      if (label) label.textContent = 'Love';
      this.showToast('Unsaved from favourites');
    } else {
      this.likedState.add(reelId);
      btn.classList.add('is-liked');
      if (heartSvg) heartSvg.setAttribute('fill', 'currentColor');
      if (label) label.textContent = 'Loved';

      // Pulse animation
      btn.classList.add('heart-burst');
      setTimeout(() => btn.classList.remove('heart-burst'), 600);

      this.showToast('Added to favourite spaces ❤️');
    }
  }

  handleSoundAction() {
    this.isMuted = !this.isMuted;

    // Apply to all video elements
    const allVideos = this.container.querySelectorAll('video');
    allVideos.forEach((v) => {
      v.muted = this.isMuted;
    });

    // Update all sound buttons
    const allSoundBtns = this.container.querySelectorAll('.action-sound');
    allSoundBtns.forEach((btn) => {
      const mutedIcon = btn.querySelector('.sound-icon-muted');
      const unmutedIcon = btn.querySelector('.sound-icon-unmuted');
      const label = btn.querySelector('.sound-label');

      if (mutedIcon) mutedIcon.style.display = this.isMuted ? 'block' : 'none';
      if (unmutedIcon) unmutedIcon.style.display = this.isMuted ? 'none' : 'block';
      if (label) label.textContent = this.isMuted ? 'Muted' : 'Sound';
    });

    this.showToast(this.isMuted ? 'Audio muted 🔇' : 'Acoustics unmuted 🔊');
  }

  handleShareAction(reelItem) {
    const title = reelItem ? reelItem.title : 'AURA Studio Reel';
    const url = window.location.href.split('#')[0] + `#reel-${reelItem ? reelItem.id : ''}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          this.showToast('Story link copied to clipboard! 📋');
        })
        .catch(() => {
          this.showToast(`Shared: ${title}`);
        });
    } else {
      this.showToast(`Shared: ${title}`);
    }
  }

  handleDetailsAction(reelItem) {
    if (!reelItem) return;

    // Dispatch the existing ugc-reel-clicked event to open the studio modal
    const event = new CustomEvent('ugc-reel-clicked', {
      detail: reelItem,
      bubbles: true,
    });
    this.container.dispatchEvent(event);
  }

  setupMediaClickHandlers() {
    this.reelItems.forEach((item) => {
      const mediaWrapper = item.querySelector('.reel-media-wrapper');
      if (!mediaWrapper) return;

      mediaWrapper.addEventListener('click', (e) => {
        // Ignore if clicking action toolbar
        if (e.target.closest('.reel-action-bar')) return;

        const video = item.querySelector('video');
        const feedback = item.querySelector('.reel-center-feedback');
        const playIcon = item.querySelector('.icon-feedback-play');
        const pauseIcon = item.querySelector('.icon-feedback-pause');

        if (video) {
          if (video.paused) {
            video.play().catch(() => {});
            this.showFeedbackPulse(feedback, playIcon, pauseIcon, false);
          } else {
            video.pause();
            this.showFeedbackPulse(feedback, playIcon, pauseIcon, true);
          }
        } else {
          // Poster image only: show soft interactive pulse & open details
          const reelId = item.getAttribute('data-reel-id');
          const reelData = this.reels.find((r) => r.id === reelId);
          if (reelData) {
            this.handleDetailsAction(reelData);
          }
        }
      });
    });
  }

  showFeedbackPulse(feedbackEl, playIcon, pauseIcon, isNowPaused) {
    if (!feedbackEl) return;

    if (playIcon) playIcon.style.display = isNowPaused ? 'none' : 'block';
    if (pauseIcon) pauseIcon.style.display = isNowPaused ? 'block' : 'none';

    feedbackEl.classList.remove('pulse-active');
    void feedbackEl.offsetWidth; // trigger reflow
    feedbackEl.classList.add('pulse-active');

    setTimeout(() => {
      feedbackEl.classList.remove('pulse-active');
    }, 700);
  }

  toggleCurrentPlayPause() {
    const activeItem = this.reelItems[this.currentIndex];
    if (!activeItem) return;

    const video = activeItem.querySelector('video');
    const feedback = activeItem.querySelector('.reel-center-feedback');
    const playIcon = activeItem.querySelector('.icon-feedback-play');
    const pauseIcon = activeItem.querySelector('.icon-feedback-pause');

    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
        this.showFeedbackPulse(feedback, playIcon, pauseIcon, false);
      } else {
        video.pause();
        this.showFeedbackPulse(feedback, playIcon, pauseIcon, true);
      }
    }
  }

  showToast(message) {
    if (!this.toastPill || !this.toastText) return;

    this.toastText.textContent = message;
    this.toastPill.classList.add('is-visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastPill.classList.remove('is-visible');
    }, 2200);
  }

  goToReel(index) {
    if (index < 0 || index >= this.reels.length) return;
    const targetItem = this.reelItems[index];
    if (!targetItem || !this.viewport) return;

    const targetTop = targetItem.offsetTop;
    this.viewport.scrollTo({
      top: targetTop,
      behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
    });

    this.updateActiveReel(index, false);
  }

  goToNextReel() {
    if (this.currentIndex < this.reels.length - 1) {
      this.goToReel(this.currentIndex + 1);
    } else {
      // Gentle bounce at end or wrap around
      this.goToReel(0);
    }
  }

  goToPrevReel() {
    if (this.currentIndex > 0) {
      this.goToReel(this.currentIndex - 1);
    } else {
      this.goToReel(this.reels.length - 1);
    }
  }

  updateActiveReel(newIndex, triggeredByScroll = false) {
    this.currentIndex = newIndex;

    // 1. Update reel item classes
    this.reelItems.forEach((item, i) => {
      const isCurrent = i === newIndex;
      item.classList.toggle('is-active', isCurrent);

      const video = item.querySelector('video');
      if (video) {
        if (isCurrent) {
          video.currentTime = 0;
          video.muted = this.isMuted;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });

    // 2. Update Top Story Progress Segments
    this.progressSegments.forEach((segment, i) => {
      segment.classList.toggle('is-active', i === newIndex);
      segment.classList.toggle('is-filled', i <= newIndex);
    });

    // 3. Update Dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === newIndex);
    });

    // 4. Update Counter Text
    if (this.counterCurr) {
      this.counterCurr.textContent = newIndex + 1;
    }

    // 5. Update Prev/Next button states
    if (this.prevBtn) {
      this.prevBtn.setAttribute(
        'aria-label',
        newIndex === 0
          ? `Loop to last story (${this.reels.length})`
          : `Previous story (${newIndex})`
      );
    }
    if (this.nextBtn) {
      this.nextBtn.setAttribute(
        'aria-label',
        newIndex === this.reels.length - 1
          ? `Loop to first story (1)`
          : `Next story (${newIndex + 2})`
      );
    }
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
}

// Backward-compatibility aliases
export const ProductSlider = SmartphoneReelsViewer;
export const UgcVideoCarousel = SmartphoneReelsViewer;
export default SmartphoneReelsViewer;
