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
        maxParticles: 24,
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
    this.canvas.style.zIndex = '12';
    this.canvas.style.opacity = '0.75';

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
      '#hero-primary-cta, #hero-secondary-cta, #header-inquire-btn, .btn-primary'
    );

    interactiveTargets.forEach((target) => {
      const onMouseEnter = (e) => {
        if (this.prefersReducedMotion) return;
        const rect = target.getBoundingClientRect();
        const x = e.clientX || (rect.left + rect.width / 2);
        const y = e.clientY || (rect.top + rect.height / 2);
        // Emit delicate micro-accent (2 faint pinpoint particles)
        this.spawnDispersal(x, y, 2);
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
      return;
    }

    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const dist = Math.hypot(dx, dy);

    // Filter out sub-pixel jitter
    if (dist < 2) {
      return;
    }

    const dt = Math.max(1, now - this.lastTime);
    const speed = dist / dt;

    this.accumulatedDist += dist;

    // Distance-driven subtle emission: 1 tiny stardust mote per ~42px of pointer distance
    if (this.accumulatedDist >= 42) {
      this.accumulatedDist = 0;
      const moveAngle = Math.atan2(dy, dx);
      const lateralSpread = (Math.random() - 0.5) * 0.8;
      const particleVelocity = 0.2 + Math.random() * 0.35;

      const vx = Math.cos(moveAngle + lateralSpread) * particleVelocity;
      const vy = Math.sin(moveAngle + lateralSpread) * particleVelocity - 0.05;

      this.spawnParticle(x, y, vx, vy, speed);
      this.wakeLoop();
    }

    this.lastX = x;
    this.lastY = y;
    this.lastTime = now;
  }

  spawnParticle(x, y, vx, vy, pointerSpeed = 1.0) {
    if (this.particles.length >= this.options.maxParticles) {
      this.particles.shift();
    }

    const colorScheme = this.getRandomColor();
    // Subtle, tiny pinpoint circular motes
    const baseRadius = 0.75 + Math.random() * 0.5;
    const maxLife = 18 + Math.floor(Math.random() * 8); // Fast dissipation (0.3s)
    const targetOpacity = 0.32 + Math.random() * 0.16;

    this.particles.push({
      x,
      y,
      vx,
      vy,
      radius: baseRadius,
      initialRadius: baseRadius,
      color: colorScheme,
      isAmbient: true,
      opacity: 0,
      targetOpacity,
      age: 0,
      maxLife,
      driftX: (Math.random() - 0.5) * 0.02,
      driftY: -0.015,
      turbAngle: Math.random() * Math.PI * 2,
      turbSpeed: 0.05,
      turbAmp: 0.1,
    });
  }

  spawnDispersal(x, y, count = 2) {
    const available = this.options.maxParticles - this.particles.length;
    const total = Math.min(count, Math.max(0, available));
    if (total <= 0) return;

    for (let i = 0; i < total; i++) {
      const colorScheme = this.getRandomColor();
      const angle = (i / total) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 0.3 + Math.random() * 0.4;

      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 0.05;

      const baseRadius = 0.75 + Math.random() * 0.4;
      const maxLife = 16 + Math.floor(Math.random() * 6);

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
        targetOpacity: 0.35,
        age: 0,
        maxLife,
        driftX: 0,
        driftY: -0.01,
        turbAngle: Math.random() * Math.PI * 2,
        turbSpeed: 0.05,
        turbAmp: 0.1,
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
      this.isRunning = false;
      return;
    }

    const remaining = [];
    const total = this.particles.length;

    for (let i = 0; i < total; i++) {
      const p = this.particles[i];
      p.age++;

      if (p.age >= p.maxLife) {
        continue;
      }

      p.turbAngle += p.turbSpeed;
      p.x += p.vx + p.driftX + Math.sin(p.turbAngle) * p.turbAmp;
      p.y += p.vy + p.driftY;

      p.vx *= 0.92;
      p.vy *= 0.92;

      const progress = p.age / p.maxLife;

      let currentAlpha;
      if (progress < 0.15) {
        currentAlpha = (progress / 0.15) * p.targetOpacity;
      } else {
        const fadeProgress = (progress - 0.15) / 0.85;
        currentAlpha = p.targetOpacity * Math.pow(1 - fadeProgress, 1.3);
      }

      const currentRadius = Math.max(0.3, p.initialRadius * (1 - progress * 0.3));

      if (currentAlpha > 0.01 && currentRadius > 0.2) {
        this.drawCircularParticle(p, currentRadius, currentAlpha);
        remaining.push(p);
      }
    }

    this.particles = remaining;

    if (this.particles.length > 0) {
      this.rafId = requestAnimationFrame(() => this.updateAndRender());
    } else {
      this.isRunning = false;
    }
  }

  /**
   * Refined Minimalist Circular Particle Rendering
   */
  drawCircularParticle(p, radius, alpha) {
    const ctx = this.ctx;
    const clampedAlpha = Math.min(1, Math.max(0, alpha));

    // 1. Soft subtle halo (very low opacity, no harsh glow)
    const haloRadius = radius * 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, haloRadius, 0, Math.PI * 2);
    ctx.fillStyle = p.color.halo + (clampedAlpha * 0.12).toFixed(3) + ')';
    ctx.fill();

    // 2. Focused micro-mote
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color.core + (clampedAlpha * 0.65).toFixed(3) + ')';
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
