/**
 * Premium Brand Logo Wall Component
 * -----------------------------------
 * Displays exactly ONE continuous horizontal moving strip of genuine brand logos.
 * - Exactly one horizontal row.
 * - One card equals one genuine logo image.
 * - No descriptive text, captions, or multiple rows.
 * - Seamless infinite loop from right to left.
 * - Pauses on hover and respects prefers-reduced-motion.
 * - Supports touch scrolling on mobile.
 */

export class BrandLogoWall {
  constructor(containerElement, brandData = {}) {
    this.container = containerElement;
    this.data = brandData;
    this._cleanupEvents = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
    this.bindEvents();
  }

  renderCard(brand) {
    if (!brand || !brand.logoSrc) return '';

    return `
      <div class="brand-logo-card" role="img" aria-label="${brand.name || 'Brand Partner'}">
        <img 
          src="${brand.logoSrc}" 
          alt="" 
          class="brand-logo-img" 
          loading="lazy" 
          decoding="async" 
          draggable="false" 
          width="120" 
          height="38" 
        />
      </div>
    `;
  }

  render() {
    const { eyebrow, headline, lead, logos = [] } = this.data;

    const eyebrowText = eyebrow || 'TRUSTED BY LEADING BRANDS';
    const headlineText = headline || 'Recognized Across Design, Sound & Living';
    const leadText =
      lead ||
      'Featured and celebrated by leading publications, architectural innovators, and acoustic connoisseurs worldwide.';

    // Source valid logo list
    const logoList =
      Array.isArray(logos) && logos.length
        ? logos
        : this.data.rows
          ? Object.values(this.data.rows).flat()
          : [];

    // Filter to only items that have verified logo image assets
    const validLogos = logoList.filter((item) => Boolean(item && item.logoSrc));

    // Base sequence of cards
    const baseCardsHtml = validLogos.map((item) => this.renderCard(item)).join('');

    // Duplicate sequence within each group to ensure flawless coverage on ultrawide screens
    const groupCardsHtml = baseCardsHtml + baseCardsHtml;

    this.container.innerHTML = `
      <div class="brand-wall-header-wrap container text-center">
        <span class="section-eyebrow">${eyebrowText}</span>
        <h2 class="section-title">${headlineText}</h2>
        <p class="section-lead">${leadText}</p>
      </div>

      <!-- Exactly ONE Horizontal Edge-to-Edge Moving Logo Row -->
      <div class="logo-wall-viewport" id="logo-wall-viewport">
        <div class="logo-wall-row row-direction-left" id="logo-wall-row" role="region" aria-label="Brand Partners Strip">
          <div class="logo-wall-track" id="logo-wall-track">
            <!-- Set A -->
            <div class="logo-wall-group logo-group-a">
              ${groupCardsHtml}
            </div>
            <!-- Duplicated Set B for Seamless Infinite Loop -->
            <div class="logo-wall-group logo-group-b" aria-hidden="true">
              ${groupCardsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const row = this.container.querySelector('.logo-wall-row');
    const track = this.container.querySelector('.logo-wall-track');

    if (!row || !track) return;

    let touchStartX = 0;
    let touchScrollLeft = 0;
    let isTouching = false;
    let resumeTimeout = null;

    const handleTouchStart = (e) => {
      isTouching = true;
      clearTimeout(resumeTimeout);
      track.style.animationPlayState = 'paused';
      touchStartX = e.touches[0].clientX;
      touchScrollLeft = row.scrollLeft;
    };

    const handleTouchMove = (e) => {
      if (!isTouching) return;
      const currentX = e.touches[0].clientX;
      const diffX = touchStartX - currentX;
      row.scrollLeft = touchScrollLeft + diffX;
    };

    const handleTouchEnd = () => {
      isTouching = false;
      resumeTimeout = setTimeout(() => {
        track.style.animationPlayState = 'running';
      }, 1200);
    };

    row.addEventListener('touchstart', handleTouchStart, { passive: true });
    row.addEventListener('touchmove', handleTouchMove, { passive: true });
    row.addEventListener('touchend', handleTouchEnd, { passive: true });
    row.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    this._cleanupEvents = () => {
      clearTimeout(resumeTimeout);
      row.removeEventListener('touchstart', handleTouchStart);
      row.removeEventListener('touchmove', handleTouchMove);
      row.removeEventListener('touchend', handleTouchEnd);
      row.removeEventListener('touchcancel', handleTouchEnd);
    };
  }

  destroy() {
    if (this._cleanupEvents) {
      this._cleanupEvents();
      this._cleanupEvents = null;
    }
  }
}
