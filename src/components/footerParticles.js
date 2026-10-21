/**
 * AURA STUDIO — FOOTER AMBIENT PARTICLE CONTROLLER
 * -------------------------------------------------
 * Continuous, atmospheric particle simulation confined strictly to the footer area.
 *
 * Visual & Physics Principles:
 * - Tiny, softly glowing particles in luminous white, neon lavender (#C4A5FF),
 *   and electric violet (#9B6DFF).
 * - Slow, continuous upward & diagonal drift with subtle sinusoidal wave motion.
 * - Multiplane depth: diverse particle sizes (0.8px – 2.2px), opacities (0.15 – 0.65),
 *   and varied horizontal wander speeds.
 * - Seamless lifecycle: particles fade in gently, drift through their lifespan,
 *   fade out smoothly, and respawn at staggered intervals across the footer width.
 * - Dedicated absolute canvas: strictly confined to the footer, pointer-events: none,
 *   and rendered behind all links and text (z-index: 0).
 * - High-DPI support with devicePixelRatio scaling capped at 2.
 * - IntersectionObserver lifecycle: pauses when footer is scrolled offscreen (0% CPU cost),
 *   and smoothly resumes when approaching the viewport.
 * - Full prefers-reduced-motion compliance.
 */

export class FooterAmbientParticlesController {
  constructor(canvasId = 'footer-particle-canvas', options = {}) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.footer = this.canvas.closest('.site-footer') || this.canvas.parentElement;
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    this.options = Object.assign(
      {
        particleCount: window.innerWidth < 768 ? 35 : 70,
        colors: [
          // 1. Pure Luminous White
          { r: 255, g: 255, b: 255, glow: 'rgba(255, 255, 255, 0.4)' },
          // 2. Neon Lavender
          { r: 196, g: 165, b: 255, glow: 'rgba(196, 165, 255, 0.45)' },
          // 3. Electric Violet
          { r: 155, g: 109, b: 255, glow: 'rgba(155, 109, 255, 0.4)' },
          // 4. Soft Studio Violet-White
          { r: 235, g: 225, b: 255, glow: 'rgba(196, 165, 255, 0.35)' },
        ],
      },
      options
    );

    this.particles = [];
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    this.rafId = null;
    this.isRunning = false;
    this.isInView = false;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.boundResize = this.handleResize.bind(this);
    this.boundRender = this.render.bind(this);

    this.init();
  }

  init() {
    this.setupCanvas();
    this.handleResize();
    this.createParticles();
    this.setupObserver();
    this.bindEvents();

    if (this.prefersReducedMotion) {
      this.renderStaticFrame();
      return;
    }
  }

  setupCanvas() {
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '0';
  }

  handleResize() {
    if (!this.canvas || !this.footer) return;

    const rect = this.footer.getBoundingClientRect();
    this.width = Math.max(300, rect.width || window.innerWidth);
    this.height = Math.max(200, rect.height || this.footer.offsetHeight || 380);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    if (this.prefersReducedMotion) {
      this.renderStaticFrame();
    }
  }

  createParticles() {
    this.particles = [];
    const count = this.options.particleCount;

    for (let i = 0; i < count; i++) {
      this.particles.push(this.spawnParticle(true));
    }
  }

  spawnParticle(isInitial = false) {
    const color = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
    const isMote = Math.random() < 0.45;

    // Small, elegant sizes for sophisticated luxury atmosphere
    const radius = isMote ? 0.75 + Math.random() * 0.6 : 1.3 + Math.random() * 0.9;
    const maxOpacity = isMote ? 0.22 + Math.random() * 0.25 : 0.45 + Math.random() * 0.35;

    // Lifespan & progression
    const maxLife = 140 + Math.floor(Math.random() * 180);
    const life = isInitial ? Math.floor(Math.random() * maxLife) : 0;

    return {
      x: Math.random() * this.width,
      y: isInitial ? Math.random() * this.height : this.height + Math.random() * 20,
      vx: 0.08 + Math.random() * 0.22, // Gentle diagonal drift to the right
      vy: -(0.18 + Math.random() * 0.38), // Slow continuous upward float
      radius,
      color,
      isMote,
      opacity: 0,
      maxOpacity,
      life,
      maxLife,
      waveAngle: Math.random() * Math.PI * 2,
      waveSpeed: 0.015 + Math.random() * 0.025,
      waveAmp: 0.25 + Math.random() * 0.5,
    };
  }

  setupObserver() {
    if (!('IntersectionObserver' in window)) {
      this.isInView = true;
      this.startLoop();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isInView = entry.isIntersecting;
          if (this.isInView && !this.prefersReducedMotion) {
            this.startLoop();
          } else {
            this.stopLoop();
          }
        });
      },
      {
        root: null,
        rootMargin: '120px 0px 120px 0px',
        threshold: 0,
      }
    );

    this.observer.observe(this.footer);
  }

  bindEvents() {
    window.addEventListener('resize', this.boundResize, { passive: true });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.stopLoop();
        this.renderStaticFrame();
      } else if (this.isInView) {
        this.startLoop();
      }
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', onMotionChange);
    }
  }

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.rafId = requestAnimationFrame(this.boundRender);
  }

  stopLoop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  renderStaticFrame() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const alpha = p.maxOpacity * 0.65;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha.toFixed(3)})`;
      this.ctx.fill();
    }
  }

  render() {
    if (!this.isRunning || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.life++;
      p.waveAngle += p.waveSpeed;

      // Update position with upward drift + gentle wave sway
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.waveAngle) * p.waveAmp * 0.15;

      // Opacity envelope: smooth cubic fade in (first 18%), plateau, smooth fade out (last 25%)
      const progress = p.life / p.maxLife;
      let opacity = 0;

      if (progress < 0.18) {
        opacity = p.maxOpacity * (progress / 0.18);
      } else if (progress > 0.75) {
        opacity = p.maxOpacity * (1 - (progress - 0.75) / 0.25);
      } else {
        opacity = p.maxOpacity;
      }

      // Proximity fade near top edge
      if (p.y < 35) {
        opacity *= Math.max(0, p.y / 35);
      }

      // Draw particle
      if (opacity > 0.01) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${opacity.toFixed(3)})`;
        this.ctx.fill();

        // Subtle soft halo on larger particles
        if (!p.isMote && p.radius > 1.2 && opacity > 0.25) {
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(opacity * 0.16).toFixed(3)})`;
          this.ctx.fill();
        }
      }

      // Respawn when particle expires or drifts out of bounds
      if (p.life >= p.maxLife || p.y < -10 || p.x > this.width + 20) {
        this.particles[i] = this.spawnParticle(false);
      }
    }

    this.rafId = requestAnimationFrame(this.boundRender);
  }
}
