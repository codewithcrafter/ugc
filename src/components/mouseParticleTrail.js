/**
 * AURA STUDIO — CINEMATIC MOUSE PARTICLE TRAIL CONTROLLER
 * -------------------------------------------------------
 * Replaces the previous sparkle / glitter effect with a sophisticated,
 * physics-based interactive particle system on HTML5 Canvas.
 *
 * Physics & Simulation Principles:
 * - Distance-driven emission: Calculates Euclidean distance along the pointer
 *   trajectory and interpolates positions to guarantee a smooth, continuous
 *   stream without gaps during fast sweeps.
 * - Dynamic velocity & momentum: Particles inherit directional momentum from
 *   the cursor motion vector, blended with randomized radial deflection and
 *   gentle upward atmospheric drift.
 * - Aerodynamic deceleration: Applies smooth drag friction (vx *= 0.93, vy *= 0.93)
 *   every frame until particles naturally slow down and dissipate.
 * - Smooth opacity & scale envelope: Rapid ease-in (first 10% of life), natural cubic
 *   ease-out fade, and gentle diameter shrinking.
 * - Pure circular particles: NO stars, NO diamonds, NO glitter symbols.
 * - Multi-layer visual depth: Ambient soft motes (smaller, lower opacity) and core
 *   luminous micro-particles in luxury dark palette (white, electric violet #9B6DFF,
 *   neon lavender #C4A5FF, and soft pink #FF5DAA).
 * - Interactive element dispersal: Gentle subtle radial pulse on hovering primary CTAs
 *   and portfolio cards.
 * - High-DPI Canvas scaling & bounded particle pool (strict cap of 140 particles).
 * - Adaptive RAF loop: sleeps when no particles exist and cursor is idle, saving 100% CPU.
 * - Safety: Pointer-events: none, touch device bypass, prefers-reduced-motion compliance.
 */

export class MouseParticleTrailController {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        maxParticles: 140,
        colors: [
          // 1. Pure Luminous White
          {
            core: 'rgba(255, 255, 255, ',
            halo: 'rgba(216, 180, 254, ',
          },
          // 2. Electric Violet
          {
            core: 'rgba(155, 109, 255, ',
            halo: 'rgba(155, 109, 255, ',
          },
          // 3. Neon Lavender
          {
            core: 'rgba(196, 165, 255, ',
            halo: 'rgba(196, 165, 255, ',
          },
          // 4. Soft Accent Pink
          {
            core: 'rgba(255, 93, 170, ',
            halo: 'rgba(255, 93, 170, ',
          },
          // 5. Soft Luminous Cream
          {
            core: 'rgba(247, 245, 252, ',
            halo: 'rgba(196, 165, 255, ',
          },
        ],
      },
      options
    );

    this.isDesktopFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;

    this.particles = [];
    this.rafId = null;
    this.isRunning = false;

    // Pointer movement tracking
    this.lastX = null;
    this.lastY = null;
    this.lastTime = 0;
    this.accumulatedDist = 0;

    this.boundListeners = [];

    this.init();
  }

  init() {
    if (!this.isDesktopFine || this.prefersReducedMotion) {
      return;
    }

    this.setupCanvas();
    this.bindEvents();
  }

  setupCanvas() {
    // Remove old sparkle canvas if present
    const oldSparkleCanvas = document.getElementById('aura-sparkle-canvas');
    if (oldSparkleCanvas && oldSparkleCanvas.parentNode) {
      oldSparkleCanvas.parentNode.removeChild(oldSparkleCanvas);
    }

    // Check if particle canvas already exists
    let existing = document.getElementById('aura-particle-canvas');
    if (existing) {
      this.canvas = existing;
    } else {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'aura-particle-canvas';
      this.canvas.className = 'aura-particle-canvas';
      this.canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.canvas);
    }

    // Explicit full-screen fixed positioning and click transparency
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9998';

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.handleResize();
  }

  handleResize() {
    if (!this.canvas || !this.ctx) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    // Apply DPR transform
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    // If particles are active, request an update
    if (this.particles.length > 0) {
      this.wakeLoop();
    }
  }

  bindEvents() {
    const onResize = () => this.handleResize();
    window.addEventListener('resize', onResize, { passive: true });
    this.boundListeners.push({ target: window, type: 'resize', fn: onResize });

    const onMouseMove = (e) => this.handleMouseMove(e);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    this.boundListeners.push({ target: window, type: 'mousemove', fn: onMouseMove });

    const onMouseLeave = (e) => {
      if (!e.relatedTarget && !e.toElement) {
        this.lastX = null;
        this.lastY = null;
        this.accumulatedDist = 0;
      }
    };
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    this.boundListeners.push({ target: document, type: 'mouseleave', fn: onMouseLeave });

    // Interactive button & card subtle hover dispersal
    this.bindInteractiveHover();

    // Listen for reduced motion change
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.clear();
      }
    };
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', onMotionChange);
      this.boundListeners.push({ target: motionQuery, type: 'change', fn: onMotionChange });
    }
  }

  bindInteractiveHover() {
    const interactiveTargets = document.querySelectorAll(
      '#hero-primary-cta, #hero-secondary-cta, #header-inquire-btn, .btn-primary, .ugc-card, .gallery-card, .phone-reel-card, .image-stack-card'
    );

    interactiveTargets.forEach((target) => {
      const onMouseEnter = (e) => {
        if (this.prefersReducedMotion) return;
        const rect = target.getBoundingClientRect();
        const x = e.clientX || (rect.left + rect.width / 2);
        const y = e.clientY || (rect.top + rect.height / 2);
        // Emit subtle gentle dispersal (5-7 delicate micro-particles)
        this.spawnDispersal(x, y, 6);
      };

      target.addEventListener('mouseenter', onMouseEnter, { passive: true });
      this.boundListeners.push({ target, type: 'mouseenter', fn: onMouseEnter });
    });
  }

  handleMouseMove(e) {
    if (this.prefersReducedMotion) return;

    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    if (this.lastX === null || this.lastY === null) {
      this.lastX = x;
      this.lastY = y;
      this.lastTime = now;
      this.accumulatedDist = 0;
      this.spawnParticle(x, y, 0, 0, 1.0);
      this.wakeLoop();
      return;
    }

    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const dist = Math.hypot(dx, dy);

    // Filter out sub-pixel jitter
    if (dist < 1.5) {
      return;
    }

    const dt = Math.max(1, now - this.lastTime);
    const speed = dist / dt; // px per ms

    // Distance-driven emission:
    // When moving slowly, spacing is ~14px; when moving fast, spacing is ~9px
    const spacing = speed > 1.2 ? 9 : 14;
    const steps = Math.min(10, Math.max(1, Math.floor(dist / spacing)));

    // Direction angle of pointer movement
    const moveAngle = Math.atan2(dy, dx);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      // Interpolated position along actual cursor trajectory
      const px = this.lastX + dx * t;
      const py = this.lastY + dy * t;

      // Particles inherit slight directional velocity along the wake
      // plus subtle randomized lateral deflection
      const lateralSpread = (Math.random() - 0.5) * 1.4;
      const particleVelocity = (0.35 + Math.random() * 0.75) * Math.min(1.8, 0.8 + speed * 0.35);

      const vx = Math.cos(moveAngle + lateralSpread) * particleVelocity * 0.45;
      const vy = Math.sin(moveAngle + lateralSpread) * particleVelocity * 0.45 - 0.12;

      this.spawnParticle(px, py, vx, vy, speed);
    }

    this.lastX = x;
    this.lastY = y;
    this.lastTime = now;

    this.wakeLoop();
  }

  spawnParticle(x, y, vx, vy, pointerSpeed = 1.0) {
    if (this.particles.length >= this.options.maxParticles) {
      // Recycle the oldest particle to keep array size bounded
      this.particles.shift();
    }

    const colorScheme = this.getRandomColor();
    const isAmbient = Math.random() < 0.4;

    // Small, elegant circular particles
    // Ambient background motes are smaller and softer; core particles are slightly more defined
    const baseRadius = isAmbient
      ? 1.0 + Math.random() * 0.8
      : 1.6 + Math.random() * 1.4;

    const maxLife = isAmbient
      ? 42 + Math.floor(Math.random() * 26) // ~0.7 - 1.1s
      : 30 + Math.floor(Math.random() * 20); // ~0.5 - 0.8s

    const targetOpacity = isAmbient
      ? 0.45 + Math.random() * 0.25
      : 0.75 + Math.random() * 0.22;

    this.particles.push({
      x,
      y,
      vx,
      vy,
      radius: baseRadius,
      initialRadius: baseRadius,
      color: colorScheme,
      isAmbient,
      opacity: 0,
      targetOpacity,
      age: 0,
      maxLife,
      // Subtle natural drift variation & fluid turbulence
      driftX: (Math.random() - 0.5) * 0.04,
      driftY: -0.018 - Math.random() * 0.025, // Gentle upward float
      turbAngle: Math.random() * Math.PI * 2,
      turbSpeed: 0.06 + Math.random() * 0.08,
      turbAmp: 0.18 + Math.random() * 0.25,
    });
  }

  spawnDispersal(x, y, count = 6) {
    const available = this.options.maxParticles - this.particles.length;
    const total = Math.min(count, Math.max(0, available));
    if (total <= 0) return;

    for (let i = 0; i < total; i++) {
      const colorScheme = this.getRandomColor();
      const angle = (i / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
      const speed = 0.6 + Math.random() * 1.4;

      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 0.1;

      const baseRadius = 1.4 + Math.random() * 1.2;
      const maxLife = 32 + Math.floor(Math.random() * 18);

      this.particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx,
        vy,
        radius: baseRadius,
        initialRadius: baseRadius,
        color: colorScheme,
        isAmbient: false,
        opacity: 0,
        targetOpacity: 0.85,
        age: 0,
        maxLife,
        driftX: 0,
        driftY: -0.02,
        turbAngle: Math.random() * Math.PI * 2,
        turbSpeed: 0.08,
        turbAmp: 0.22,
      });
    }

    this.wakeLoop();
  }

  getRandomColor() {
    const list = this.options.colors;
    return list[Math.floor(Math.random() * list.length)];
  }

  wakeLoop() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.rafId = requestAnimationFrame(() => this.updateAndRender());
    }
  }

  updateAndRender() {
    if (!this.ctx || !this.canvas) {
      this.isRunning = false;
      return;
    }

    // Clear entire canvas with high performance
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.particles.length === 0) {
      // Loop can safely sleep when no particles are active
      this.isRunning = false;
      return;
    }

    const remaining = [];
    const total = this.particles.length;

    for (let i = 0; i < total; i++) {
      const p = this.particles[i];
      p.age++;

      if (p.age >= p.maxLife) {
        continue; // Expired, skip from remaining
      }

      // Physics update: apply velocity + drift + natural sinusoidal turbulence
      p.turbAngle += p.turbSpeed;
      p.x += p.vx + p.driftX + Math.sin(p.turbAngle) * p.turbAmp;
      p.y += p.vy + p.driftY;

      // Smooth aerodynamic drag friction
      p.vx *= 0.932;
      p.vy *= 0.932;

      const progress = p.age / p.maxLife; // 0.0 to 1.0

      // Smooth opacity envelope:
      // Fast fade-in in first 10% of life, then silky cubic fade-out
      let currentAlpha;
      if (progress < 0.12) {
        currentAlpha = (progress / 0.12) * p.targetOpacity;
      } else {
        const fadeProgress = (progress - 0.12) / 0.88;
        currentAlpha = p.targetOpacity * Math.pow(1 - fadeProgress, 1.4);
      }

      // Gentle diameter dissipation
      const currentRadius = Math.max(0.4, p.initialRadius * (1 - progress * 0.4));

      if (currentAlpha > 0.01 && currentRadius > 0.3) {
        this.drawCircularParticle(p, currentRadius, currentAlpha);
        remaining.push(p);
      }
    }

    this.particles = remaining;

    // Continue loop as long as particles remain
    if (this.particles.length > 0) {
      this.rafId = requestAnimationFrame(() => this.updateAndRender());
    } else {
      this.isRunning = false;
    }
  }

  /**
   * High-Performance Pure Circular Particle Rendering
   * - Avoids expensive shadowBlur or SVG symbols
   * - Uses an ambient soft halo circle and an inner luminous core
   */
  drawCircularParticle(p, radius, alpha) {
    const ctx = this.ctx;
    const clampedAlpha = Math.min(1, Math.max(0, alpha));

    // 1. Soft Ambient Halo (wider radius, gentle low opacity for atmospheric glow)
    const haloRadius = radius * 2.2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
    ctx.fillStyle = p.color.halo + (clampedAlpha * 0.28).toFixed(3) + ')';
    ctx.fill();

    // 2. Luminous Micro Core (sharp, focused circular particle)
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color.core + clampedAlpha.toFixed(3) + ')';
    ctx.fill();
  }

  clear() {
    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  destroy() {
    this.clear();

    this.boundListeners.forEach(({ target, type, fn }) => {
      if (target.removeEventListener) {
        target.removeEventListener(type, fn);
      }
    });
    this.boundListeners = [];

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }
}
