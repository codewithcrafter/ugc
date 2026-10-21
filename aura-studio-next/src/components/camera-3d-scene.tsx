'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Camera3DSceneProps {
  onEntranceComplete?: () => void;
  className?: string;
}

export const Camera3DScene: React.FC<Camera3DSceneProps> = ({
  onEntranceComplete,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hudActionText, setHudActionText] = useState('SCROLL TO OPERATE');
  const [isWebGlSupported, setIsWebGlSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setIsWebGlSupported(false);
      onEntranceComplete?.();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || 520;
    let height = container.clientHeight || 275;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

    const updateCameraPlacement = (w: number) => {
      const isNarrow = w <= 480;
      const isMid = w > 480 && w <= 991;

      if (isNarrow) {
        camera.position.set(0, 0, 7.8);
        camera.fov = 36;
      } else if (isMid) {
        camera.position.set(0, 0, 7.5);
        camera.fov = 35;
      } else {
        camera.position.set(0, 0, 7.3);
        camera.fov = 34;
      }
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    updateCameraPlacement(width);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Pivot & Master groups
    const parallaxPivot = new THREE.Group();
    scene.add(parallaxPivot);

    const cameraMasterGroup = new THREE.Group();
    parallaxPivot.add(cameraMasterGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfffaf4, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffcf8, 1.85);
    keyLight.position.set(3.5, 5, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const violetLight = new THREE.PointLight(0x7545f5, 1.6, 16);
    violetLight.position.set(-4, -1, 3);
    scene.add(violetLight);

    const coralLight = new THREE.PointLight(0xffb8cb, 1.35, 14);
    coralLight.position.set(4, -1.5, 2);
    scene.add(coralLight);

    const skyLight = new THREE.PointLight(0xddebff, 1.1, 12);
    skyLight.position.set(0, 4.5, -2);
    scene.add(skyLight);

    // Procedural Textures & Materials
    const createLeatherBumpTexture = () => {
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 128, 128);
        for (let i = 0; i < 900; i++) {
          const px = Math.random() * 128;
          const py = Math.random() * 128;
          const rad = 0.8 + Math.random() * 1.6;
          const shade = Math.floor(100 + Math.random() * 90);
          ctx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 2);
      return tex;
    };

    const createLensMarkingsTexture = () => {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#181520';
        ctx.fillRect(0, 0, 1024, 128);
        ctx.fillStyle = '#E6DCF5';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('AURA OPTICS  •  50MM F/1.4  •  ASPHERICAL', 512, 45);
        ctx.fillStyle = '#7545F5';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('ƒ 1.4   2   2.8   4   5.6   8   11   16', 512, 92);
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    };

    const createLcdTexture = () => {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 320;
      const ctx = c.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 512, 320);
        grad.addColorStop(0, '#1E192B');
        grad.addColorStop(1, '#0F0D17');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 320);

        ctx.strokeStyle = 'rgba(233, 223, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(170, 0); ctx.lineTo(170, 320);
        ctx.moveTo(341, 0); ctx.lineTo(341, 320);
        ctx.moveTo(0, 106); ctx.lineTo(512, 106);
        ctx.moveTo(0, 213); ctx.lineTo(512, 213);
        ctx.stroke();

        ctx.strokeStyle = '#E4FF83';
        ctx.lineWidth = 2;
        ctx.strokeRect(226, 130, 60, 60);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('● REC', 28, 36);
        ctx.fillText('ISO 100', 420, 36);
        ctx.fillText('1/250s  ƒ/1.4', 28, 295);
        ctx.fillText('RAW 14-BIT', 390, 295);
      }
      return new THREE.CanvasTexture(c);
    };

    const leatherBump = createLeatherBumpTexture();
    const lensMarkingsTex = createLensMarkingsTexture();
    const lcdTex = createLcdTexture();

    const satinMetalMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.24,
      metalness: 0.88,
    });

    const leatheretteMat = new THREE.MeshStandardMaterial({
      color: 0x1c1a24,
      roughness: 0.85,
      metalness: 0.08,
      bumpMap: leatherBump,
      bumpScale: 0.06,
    });

    const darkAnodizedMat = new THREE.MeshStandardMaterial({
      color: 0x1f1c28,
      roughness: 0.35,
      metalness: 0.75,
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd9b875,
      roughness: 0.28,
      metalness: 0.85,
    });

    const opticalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.54,
      thickness: 0.9,
      specularColor: new THREE.Color(0xa275ff),
      attenuationColor: new THREE.Color(0xe9dfff),
      attenuationDistance: 1.2,
    });

    // Helper for rounded rectangle
    const createRoundedRectShape = (w: number, h: number, r: number) => {
      const s = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + h - r);
      s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      s.lineTo(x + r, y + h);
      s.quadraticCurveTo(x, y + h, x, y + h - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    };

    // Camera Body
    const cameraBodyGroup = new THREE.Group();
    cameraMasterGroup.add(cameraBodyGroup);

    const bodyW = 4.2;
    const bodyH = 2.4;
    const bodyD = 1.35;
    const bodyR = 0.52;

    const bodyGeom = new THREE.ExtrudeGeometry(createRoundedRectShape(bodyW, bodyH, bodyR), {
      steps: 1,
      depth: bodyD,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.08,
      bevelSegments: 4,
    });
    bodyGeom.center();
    const bodyMesh = new THREE.Mesh(bodyGeom, leatheretteMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    cameraBodyGroup.add(bodyMesh);

    // Top deck plate
    const topPlateH = 0.55;
    const topPlateGeom = new THREE.ExtrudeGeometry(createRoundedRectShape(bodyW + 0.02, topPlateH, bodyR), {
      steps: 1,
      depth: bodyD + 0.02,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    });
    topPlateGeom.center();
    const topPlateMesh = new THREE.Mesh(topPlateGeom, satinMetalMat);
    topPlateMesh.position.y = bodyH / 2 - topPlateH / 2 + 0.18;
    topPlateMesh.castShadow = true;
    cameraBodyGroup.add(topPlateMesh);

    // Bottom base plate
    const basePlateH = 0.15;
    const basePlateGeom = new THREE.ExtrudeGeometry(createRoundedRectShape(bodyW + 0.02, basePlateH, bodyR), {
      steps: 1,
      depth: bodyD + 0.02,
      bevelEnabled: false,
    });
    basePlateGeom.center();
    const basePlateMesh = new THREE.Mesh(basePlateGeom, satinMetalMat);
    basePlateMesh.position.y = -bodyH / 2 - basePlateH / 2 + 0.04;
    cameraBodyGroup.add(basePlateMesh);

    // Controls: Shutter dial, release button, rangefinder window
    const dialGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 36);
    const shutterDial = new THREE.Mesh(dialGeom, darkAnodizedMat);
    shutterDial.position.set(1.4, bodyH / 2 + 0.28, 0.1);
    cameraBodyGroup.add(shutterDial);

    const shutterBtnGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.18, 28);
    const shutterBtn = new THREE.Mesh(shutterBtnGeom, brassMat);
    shutterBtn.position.set(0.7, bodyH / 2 + 0.25, 0.2);
    cameraBodyGroup.add(shutterBtn);

    const rfWindowGeom = new THREE.BoxGeometry(0.75, 0.38, 0.12);
    const rfWindow = new THREE.Mesh(rfWindowGeom, darkAnodizedMat);
    rfWindow.position.set(1.15, bodyH / 2 - 0.1, bodyD / 2 + 0.06);
    cameraBodyGroup.add(rfWindow);

    // Rear LCD Viewfinder Screen
    const lcdScreenGeom = new THREE.PlaneGeometry(2.8, 1.8);
    const lcdMat = new THREE.MeshBasicMaterial({ map: lcdTex });
    const lcdScreen = new THREE.Mesh(lcdScreenGeom, lcdMat);
    lcdScreen.position.set(-0.35, 0, -bodyD / 2 - 0.05);
    lcdScreen.rotation.y = Math.PI;
    cameraBodyGroup.add(lcdScreen);

    // Lens System
    const lensGroup = new THREE.Group();
    lensGroup.position.set(-0.25, -0.05, bodyD / 2);
    cameraBodyGroup.add(lensGroup);

    // Base collar
    const collarGeom = new THREE.CylinderGeometry(1.22, 1.25, 0.35, 48);
    collarGeom.rotateX(Math.PI / 2);
    const collarMesh = new THREE.Mesh(collarGeom, satinMetalMat);
    collarMesh.position.z = 0.18;
    lensGroup.add(collarMesh);

    // Aperture Ring
    const apertureRingGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.38, 48);
    apertureRingGeom.rotateX(Math.PI / 2);
    const apertureRingMat = new THREE.MeshStandardMaterial({
      color: 0x181520,
      roughness: 0.4,
      metalness: 0.7,
      map: lensMarkingsTex,
    });
    const apertureRing = new THREE.Mesh(apertureRingGeom, apertureRingMat);
    apertureRing.position.z = 0.54;
    lensGroup.add(apertureRing);

    // Focus Ring
    const focusRingGeom = new THREE.CylinderGeometry(1.18, 1.18, 0.65, 48);
    focusRingGeom.rotateX(Math.PI / 2);
    const focusRing = new THREE.Mesh(focusRingGeom, darkAnodizedMat);
    focusRing.position.z = 1.05;
    lensGroup.add(focusRing);

    // Brass accent rim
    const brassRimGeom = new THREE.TorusGeometry(1.16, 0.04, 16, 48);
    const brassRim = new THREE.Mesh(brassRimGeom, brassMat);
    brassRim.position.z = 1.4;
    lensGroup.add(brassRim);

    // Aperture Iris Blades (8 blades)
    const apertureBlades: THREE.Mesh[] = [];
    const bladeGeom = new THREE.BoxGeometry(0.48, 0.16, 0.02);
    bladeGeom.translate(0.24, 0, 0);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x14121a,
      roughness: 0.5,
      metalness: 0.6,
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const bladeMesh = new THREE.Mesh(bladeGeom, bladeMat);
      bladeMesh.position.set(Math.cos(angle) * 0.42, Math.sin(angle) * 0.42, 1.18);
      bladeMesh.rotation.z = angle + 0.35;
      lensGroup.add(bladeMesh);
      apertureBlades.push(bladeMesh);
    }

    // Front Glass Element
    const frontGlassGeom = new THREE.SphereGeometry(1.1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 3);
    const frontGlassMesh = new THREE.Mesh(frontGlassGeom, opticalGlassMat);
    frontGlassMesh.position.z = 1.15;
    lensGroup.add(frontGlassMesh);

    // Pointer Parallax state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    // PHASE 2: Camera-first page load sequence
    if (!prefersReducedMotion) {
      cameraMasterGroup.position.set(0, -0.2, -0.45);
      cameraMasterGroup.rotation.set(0.16, -0.62, 0);

      gsap.to(cameraMasterGroup.position, {
        x: 0,
        y: -0.05,
        z: 0,
        duration: 0.85,
        ease: 'power2.out',
      });

      gsap.to(cameraMasterGroup.rotation, {
        x: 0.06,
        y: -0.38,
        z: 0,
        duration: 0.9,
        ease: 'power2.out',
      });

      gsap.fromTo(
        focusRing.rotation,
        { z: Math.PI / 2.5 },
        { z: 0, duration: 1.0, ease: 'power3.out' }
      );

      gsap.fromTo(
        apertureRing.rotation,
        { z: -Math.PI / 3 },
        { z: 0, duration: 0.9, ease: 'power2.out' }
      );

      gsap.fromTo(
        [violetLight, coralLight],
        { intensity: 0.5 },
        { intensity: 2.2, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' }
      );

      setTimeout(() => {
        onEntranceComplete?.();
      }, 450);
    } else {
      cameraMasterGroup.position.set(0, -0.05, 0);
      cameraMasterGroup.rotation.set(0.06, -0.38, 0);
      onEntranceComplete?.();
    }

    // PHASE 4: Controlled camera scroll experience (unpinned)
    let scrollTimeline: gsap.core.Timeline | null = null;

    if (!prefersReducedMotion) {
      scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          pin: false,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.25) {
              setHudActionText('SCROLL TO OPERATE');
            } else if (p < 0.65) {
              setHudActionText('35MM OPTICAL PROFILE');
            } else {
              setHudActionText('ƒ/1.4 DEPTH OF FIELD');
            }
          },
        },
      });

      scrollTimeline.to(
        cameraMasterGroup.rotation,
        {
          y: 0.52,
          x: 0.02,
          z: 0,
          duration: 2.2,
          ease: 'power1.inOut',
        },
        0
      );

      scrollTimeline.to(
        focusRing.rotation,
        { z: -Math.PI * 0.75, duration: 2.2, ease: 'none' },
        0
      );

      scrollTimeline.to(
        apertureRing.rotation,
        { z: -Math.PI * 0.6, duration: 2.0, ease: 'none' },
        0.1
      );

      apertureBlades.forEach((blade) => {
        scrollTimeline?.to(
          blade.rotation,
          { z: '+=' + (Math.PI / 4.8), duration: 0.9, ease: 'power1.inOut' },
          0.3
        );
        scrollTimeline?.to(
          blade.rotation,
          { z: '-=' + (Math.PI / 4.8), duration: 0.9, ease: 'power1.inOut' },
          1.2
        );
      });

      scrollTimeline.to(
        [violetLight, coralLight],
        { intensity: 2.0, duration: 0.9, yoyo: true, repeat: 1 },
        0.5
      );
    }

    // Resize Handler
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth || 520;
      height = container.clientHeight || 275;

      camera.aspect = width / height;
      updateCameraPlacement(width);
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize, { passive: true });

    // Render loop with IntersectionObserver optimization
    let isVisible = true;
    let rafId: number | null = null;

    const render = () => {
      if (!isVisible) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(render);

      currentMouseX += (targetMouseX * 0.12 - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY * 0.08 - currentMouseY) * 0.06;

      parallaxPivot.position.x = currentMouseX * 0.32;
      parallaxPivot.position.y = -currentMouseY * 0.22;
      parallaxPivot.rotation.y = currentMouseX * 0.07;
      parallaxPivot.rotation.x = -currentMouseY * 0.05;

      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !rafId) {
            render();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    render();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', onResize);
      observer.disconnect();

      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeline) scrollTimeline.kill();

      renderer.dispose();
      bodyGeom.dispose();
      topPlateGeom.dispose();
      basePlateGeom.dispose();
      collarGeom.dispose();
      apertureRingGeom.dispose();
      focusRingGeom.dispose();
      brassRimGeom.dispose();
      bladeGeom.dispose();
      frontGlassGeom.dispose();
      leatherBump.dispose();
      lensMarkingsTex.dispose();
      lcdTex.dispose();
    };
  }, [onEntranceComplete]);

  if (!isWebGlSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[520px] h-[230px] sm:h-[260px] lg:h-[275px] rounded-3xl overflow-hidden select-none isolate border border-[#7545F5]/15 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.92)_0%,rgba(246,242,255,0.6)_100%)] shadow-[0_16px_40px_-12px_rgba(117,69,245,0.14),0_2px_8px_rgba(35,21,60,0.04)] mx-auto ${className}`}
      aria-label="AURA Studio 3D Interactive Camera Experience"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Photography HUD */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-none bg-white/90 border border-[#7545F5]/20 px-3.5 py-1.5 rounded-full shadow-[0_4px_16px_-2px_rgba(117,69,245,0.12)] backdrop-blur-md whitespace-nowrap"
        aria-hidden="true"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7545F5] ring-2 ring-[#7545F5]/25 animate-pulse" />
          <span className="font-heading text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#1A1918]">
            AURA 35MM RANGEFINDER • 50MM F/1.4
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 border-l border-[#7545F5]/20 pl-3">
          <span className="text-xs font-black text-[#7545F5]">↓</span>
          <span className="font-heading text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#7545F5]">
            {hudActionText}
          </span>
        </div>
      </div>
    </div>
  );
};
