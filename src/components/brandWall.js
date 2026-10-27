/**
 * UGC STUDIO — SEAMLESS INFINITE BRAND LOGO MARQUEE
 * --------------------------------------------------
 * Solves the infinite-loop boundary issue completely:
 * - Genuine Seamless Infinite Loop: The slider moves continuously in one direction.
 * - After Twitter/X, the sequence (Spotify, Apple, Vite, etc.) enters immediately.
 * - 2-half track architecture (20 logos in Half 1, 20 logos in Half 2) guarantees
 *   that a -50% CSS GPU translation loops with mathematical 0-pixel accuracy.
 * - NO blank gap, NO sudden jump, NO reverse movement, NO visible restart.
 * - Contrast & Authentic Color Only:
 *   - No application names or tooltips on hover (as requested in Task 3).
 *   - Normal state: clean, recognizable, balanced dark luxury aesthetics.
 *   - Hover state: reveals authentic brand colors (Spotify green, Vite purple,
 *     Google colors, Figma colors, etc.) with subtle scale & restrained glow.
 *   - Zero DOM measurements or JS loops needed for the continuous marquee.
 */

export class BrandLogoWall {
  constructor(containerElement, brandData = {}) {
    this.container = containerElement;
    this.data = brandData;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.render();
  }

  renderCard(brand, isDuplicate = false) {
    if (!brand || !brand.logoSrc) return '';
    const brandColor = brand.brandColor || '#9B6DFF';
    const brandGlow = brand.brandGlow || 'rgba(155, 109, 255, 0.4)';
    const name = brand.name || 'Brand Partner';

    return `
      <div 
        class="brand-logo-card" 
        role="img" 
        aria-label="${name}"
        data-brand="${name}"
        style="--brand-color: ${brandColor}; --brand-glow: ${brandGlow};"
        ${isDuplicate ? 'tabindex="-1" aria-hidden="true"' : 'tabindex="0"'}
      >
        <div class="brand-logo-img-wrap">
          <img 
            src="${brand.logoSrc}" 
            alt="${name}" 
            class="brand-logo-img" 
            loading="eager" 
            decoding="async" 
            draggable="false" 
            width="120" 
            height="36" 
          />
        </div>
      </div>
    `;
  }

  render() {
    const { logos = [] } = this.data;

    // Filter to verified logo items
    const validLogos = Array.isArray(logos) ? logos.filter((item) => Boolean(item && item.logoSrc)) : [];
    if (!validLogos.length) return;

    // Build Half 1: 2 consecutive sets of the 10 logos (20 cards)
    // Ensures Twitter/X is immediately followed by Spotify, Apple, Vite, etc. within each half
    const set1CardsHtml = validLogos.map((item) => this.renderCard(item, false)).join('');
    const set2CardsHtml = validLogos.map((item) => this.renderCard(item, true)).join('');
    const half1Html = set1CardsHtml + set2CardsHtml;

    // Build Half 2: Exact duplicate of Half 1 (20 cards, aria-hidden="true")
    // When track translates -50%, Half 2 seamlessly occupies Half 1's initial coordinate
    const set3CardsHtml = validLogos.map((item) => this.renderCard(item, true)).join('');
    const set4CardsHtml = validLogos.map((item) => this.renderCard(item, true)).join('');
    const half2Html = set3CardsHtml + set4CardsHtml;

    this.container.innerHTML = `
      <!-- Pure Seamless Infinite Logo Slider -->
      <div class="logo-wall-viewport" id="logo-wall-viewport">
        <div class="logo-wall-row" id="logo-wall-row" role="region" aria-label="Brand Partners Infinite Logo Slider">
          <div class="logo-wall-track" id="logo-wall-track">
            <!-- Half 1 (20 logos) -->
            <div class="logo-wall-half logo-half-primary">
              ${half1Html}
            </div>
            <!-- Half 2 (20 logos identical duplicate) -->
            <div class="logo-wall-half logo-half-duplicate" aria-hidden="true">
              ${half2Html}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    // Stateless pure CSS animation; container can be cleared
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
