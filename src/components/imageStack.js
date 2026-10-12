/**
 * Interactive Overlapping Image Stack
 * -----------------------------------
 * An editorial image deck with layered depth, mouse dragging, touch swipe,
 * smooth transforms, and wrapping index navigation.
 */

export class ImageStackController {
  constructor(containerElement, imagesData = []) {
    this.container = containerElement;
    this.images = imagesData;
    this.currentIndex = 0;
    this.total = this.images.length;

    // Drag / Swipe tracking
    this.isDragging = false;
    this.startX = 0;
    this.currentDragX = 0;
    this.dragThreshold = 45; // Minimum px to trigger transition
    this.hasInteracted = false;

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (!this.container || !this.images.length) return;

    this.render();
    this.cacheElements();
    this.updateStackPositions(false);
    this.bindEvents();
  }

  render() {
    const cardsHtml = this.images
      .map((item, index) => {
        return `
        <div 
          class="image-stack-card" 
          data-stack-index="${index}"
          role="group" 
          aria-roledescription="image card" 
          aria-label="${item.title || 'Product view'} (${index + 1} of ${this.total})"
        >
          <div class="card-media-wrapper">
            <img 
              src="${item.src}" 
              alt="${item.alt}" 
              class="stack-card-img" 
              loading="${index === 0 ? 'eager' : 'lazy'}"
              width="800" 
              height="600"
              draggable="false"
            />
            <div class="stack-card-overlay" aria-hidden="true"></div>
            
            ${
              item.badge
                ? `
              <div class="stack-floating-badge" aria-hidden="true">
                <span class="badge-accent-dot"></span>
                <div class="badge-text-wrap">
                  <span class="stack-badge-title">${item.title || 'AURA Studio'}</span>
                  <span class="stack-badge-sub">${item.badge}</span>
                </div>
              </div>
            `
                : ''
            }
          </div>
        </div>
      `;
      })
      .join('');

    const dotsHtml = this.images
      .map(
        (_, index) => `
        <button 
          type="button" 
          class="stack-dot ${index === 0 ? 'is-active' : ''}" 
          data-dot-index="${index}"
          aria-label="Go to view ${index + 1} of ${this.total}"
        ></button>
      `
      )
      .join('');

    this.container.innerHTML = `
      <div 
        class="image-stack-viewport" 
        tabindex="0"
        role="region" 
        aria-roledescription="interactive image stack" 
        aria-label="The Craft & Philosophy Interactive Image Deck. Drag left or right to browse."
      >
        <!-- Stack Layer Cards -->
        <div class="image-stack-deck" id="image-stack-deck">
          ${cardsHtml}
        </div>

        <!-- Floating Drag Interaction Hint -->
        <div class="stack-drag-hint" id="stack-drag-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <span>Drag or Swipe</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        <!-- Controls: Counter & Mini Arrows -->
        <div class="image-stack-controls">
          <div class="stack-counter" id="stack-counter" aria-live="polite">
            <span class="counter-current">01</span>
            <span class="counter-sep">/</span>
            <span class="counter-total">0${this.total}</span>
          </div>

          <div class="stack-dots" role="tablist" aria-label="Image indicators">
            ${dotsHtml}
          </div>

          <div class="stack-arrows">
            <button 
              type="button" 
              class="stack-arrow-btn stack-arrow-prev" 
              id="stack-prev-btn" 
              aria-label="Previous view in stack"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button 
              type="button" 
              class="stack-arrow-btn stack-arrow-next" 
              id="stack-next-btn" 
              aria-label="Next view in stack"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  cacheElements() {
    this.viewport = this.container.querySelector('.image-stack-viewport');
    this.deck = this.container.querySelector('#image-stack-deck');
    this.cardElements = Array.from(this.container.querySelectorAll('.image-stack-card'));
    this.counterCurrent = this.container.querySelector('.counter-current');
    this.prevBtn = this.container.querySelector('#stack-prev-btn');
    this.nextBtn = this.container.querySelector('#stack-next-btn');
    this.dotElements = Array.from(this.container.querySelectorAll('.stack-dot'));
    this.hintEl = this.container.querySelector('#stack-drag-hint');
  }

  updateStackPositions(animate = true) {
    const total = this.total;

    this.cardElements.forEach((card, index) => {
      // Calculate relative circular distance from currentIndex
      // diff = 0 is active, diff = 1 is first card behind, etc.
      const diff = (index - this.currentIndex + total) % total;

      if (!animate || this.prefersReducedMotion) {
        card.style.transition = 'none';
      } else {
        card.style.transition =
          'transform 420ms cubic-bezier(0.2, 0.8, 0.25, 1), opacity 420ms ease, box-shadow 420ms ease';
      }

      if (diff === 0) {
        // Foreground Active Card
        card.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        card.style.zIndex = '5';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.classList.add('is-active');
        card.setAttribute('aria-hidden', 'false');
      } else if (diff === 1) {
        // First Layer Behind (Subtle offset to the right & top, slight positive tilt)
        card.style.transform = 'translate3d(24px, -14px, -20px) scale(0.95) rotate(3deg)';
        card.style.zIndex = '4';
        card.style.opacity = '0.92';
        card.style.pointerEvents = 'auto';
        card.classList.remove('is-active');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === 2) {
        // Second Layer Behind (Subtle offset to the left & higher, slight negative tilt)
        card.style.transform = 'translate3d(-20px, -24px, -40px) scale(0.90) rotate(-2.5deg)';
        card.style.zIndex = '3';
        card.style.opacity = '0.78';
        card.style.pointerEvents = 'auto';
        card.classList.remove('is-active');
        card.setAttribute('aria-hidden', 'true');
      } else if (diff === 3) {
        // Third Layer Behind (Subtle centered elevation)
        card.style.transform = 'translate3d(12px, -32px, -60px) scale(0.85) rotate(1.5deg)';
        card.style.zIndex = '2';
        card.style.opacity = '0.55';
        card.style.pointerEvents = 'none';
        card.classList.remove('is-active');
        card.setAttribute('aria-hidden', 'true');
      } else {
        // Deep background cards
        card.style.transform = 'translate3d(0, -38px, -80px) scale(0.80) rotate(0deg)';
        card.style.zIndex = '1';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.classList.remove('is-active');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    // Update Counter
    if (this.counterCurrent) {
      this.counterCurrent.textContent = String(this.currentIndex + 1).padStart(2, '0');
    }

    // Update Dots
    this.dotElements.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === this.currentIndex);
    });
  }

  goTo(index) {
    this.currentIndex = (index + this.total) % this.total;
    this.updateStackPositions(true);

    if (!this.hasInteracted && this.hintEl) {
      this.hasInteracted = true;
      this.hintEl.style.opacity = '0';
    }
  }

  next() {
    this.goTo(this.currentIndex + 1);
  }

  prev() {
    this.goTo(this.currentIndex - 1);
  }

  bindEvents() {
    this.eventCleanups = [];

    // Arrow buttons
    if (this.prevBtn) {
      const prevHandler = () => this.prev();
      this.prevBtn.addEventListener('click', prevHandler);
      this.eventCleanups.push(() => this.prevBtn.removeEventListener('click', prevHandler));
    }

    if (this.nextBtn) {
      const nextHandler = () => this.next();
      this.nextBtn.addEventListener('click', nextHandler);
      this.eventCleanups.push(() => this.nextBtn.removeEventListener('click', nextHandler));
    }

    // Dot indicators
    this.dotElements.forEach((dot) => {
      const dotHandler = (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-dot-index'), 10);
        if (!isNaN(index)) {
          this.goTo(index);
        }
      };
      dot.addEventListener('click', dotHandler);
      this.eventCleanups.push(() => dot.removeEventListener('click', dotHandler));
    });

    // Keyboard navigation (Left / Right Arrow)
    if (this.viewport) {
      const keyHandler = (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prev();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.next();
        }
      };
      this.viewport.addEventListener('keydown', keyHandler);
      this.eventCleanups.push(() => this.viewport.removeEventListener('keydown', keyHandler));
    }

    // Mouse drag handling
    this.setupMouseDrag();

    // Touch swipe handling
    this.setupTouchSwipe();
  }

  setupMouseDrag() {
    const activeCard = () => this.cardElements[this.currentIndex];

    const onMouseDown = (e) => {
      // Do not initiate drag if clicking buttons or controls
      if (e.target.closest('button') || e.button !== 0) return;

      const clickedCard = e.target.closest('.image-stack-card');
      this.clickedCardIndex = clickedCard
        ? parseInt(clickedCard.getAttribute('data-stack-index'), 10)
        : -1;

      // Prevent native image dragging and accidental text selection
      e.preventDefault();

      this.isDragging = true;
      this.startX = e.clientX;
      this.currentDragX = 0;
      this.viewport?.classList.add('is-dragging');

      const card = activeCard();
      if (card) {
        card.style.transition = 'none';
      }
    };

    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      this.currentDragX = e.clientX - this.startX;

      const card = activeCard();
      if (card) {
        // Natural physics: translate horizontally and tilt gently
        const rotation = (this.currentDragX * 0.04).toFixed(2);
        card.style.transform = `translate3d(${this.currentDragX}px, 0, 0) scale(1) rotate(${rotation}deg)`;
      }
    };

    const onMouseUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.viewport?.classList.remove('is-dragging');

      if (this.currentDragX < -this.dragThreshold) {
        // Dragged left -> advance to next
        this.next();
      } else if (this.currentDragX > this.dragThreshold) {
        // Dragged right -> go to previous
        this.prev();
      } else {
        // If user simply clicked a visible background card that was peeking
        if (
          Math.abs(this.currentDragX) < 8 &&
          this.clickedCardIndex >= 0 &&
          this.clickedCardIndex !== this.currentIndex
        ) {
          this.goTo(this.clickedCardIndex);
        } else {
          // Snap back to active center position
          this.updateStackPositions(true);
        }
      }

      this.currentDragX = 0;
      this.clickedCardIndex = -1;
    };

    this.viewport?.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    this.eventCleanups.push(() => {
      this.viewport?.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    });
  }

  setupTouchSwipe() {
    let startY = 0;
    let isHorizontalSwipe = null;

    const onTouchStart = (e) => {
      if (e.touches.length > 1) return;
      this.isDragging = true;
      this.startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      this.currentDragX = 0;
      isHorizontalSwipe = null;

      const card = this.cardElements[this.currentIndex];
      if (card) {
        card.style.transition = 'none';
      }
    };

    const onTouchMove = (e) => {
      if (!this.isDragging) return;
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - this.startX;
      const diffY = touchY - startY;

      // Detect gesture intent on first significant movement
      if (isHorizontalSwipe === null) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      // If user is scrolling vertically down the page, don't hijack
      if (isHorizontalSwipe === false) return;

      this.currentDragX = diffX;
      const card = this.cardElements[this.currentIndex];
      if (card) {
        const rotation = (this.currentDragX * 0.04).toFixed(2);
        card.style.transform = `translate3d(${this.currentDragX}px, 0, 0) scale(1) rotate(${rotation}deg)`;
      }
    };

    const onTouchEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      if (isHorizontalSwipe) {
        if (this.currentDragX < -this.dragThreshold) {
          this.next();
        } else if (this.currentDragX > this.dragThreshold) {
          this.prev();
        } else {
          this.updateStackPositions(true);
        }
      } else {
        this.updateStackPositions(true);
      }

      this.currentDragX = 0;
      isHorizontalSwipe = null;
    };

    this.viewport?.addEventListener('touchstart', onTouchStart, { passive: true });
    this.viewport?.addEventListener('touchmove', onTouchMove, { passive: true });
    this.viewport?.addEventListener('touchend', onTouchEnd);
    this.viewport?.addEventListener('touchcancel', onTouchEnd);

    this.eventCleanups.push(() => {
      this.viewport?.removeEventListener('touchstart', onTouchStart);
      this.viewport?.removeEventListener('touchmove', onTouchMove);
      this.viewport?.removeEventListener('touchend', onTouchEnd);
      this.viewport?.removeEventListener('touchcancel', onTouchEnd);
    });
  }

  destroy() {
    if (this.eventCleanups) {
      this.eventCleanups.forEach((cleanup) => cleanup());
      this.eventCleanups = [];
    }
  }
}
