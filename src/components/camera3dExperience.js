/**
 * AURA STUDIO — REAL 3D SCROLL-DRIVEN PHOTOGRAPHY STORY
 * =======================================================
 * Uses Three.js WebGL and GSAP ScrollTrigger to transform the hero
 * into a continuous, interactive 3D photography storytelling experience.
 *
 * Storyboard Scenes:
 * - Scene A: Camera Component Assembly (procedural parts converge, lens aligns)
 * - Scene B: Scroll-Controlled 3D Rotation (rotates around Y & X axes, reveals side & rear LCD)
 * - Scene C: Lens Macro Moment (macro zoom, 8-blade aperture iris stop-down, light sweep)
 * - Scene D: Photographs Emerge (4 genuine project photos fan out as floating 3D frames)
 * - Scene E: Seamless Transition into Section 2 (Reels) and existing site flow
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

export class Camera3DExperience {
  constructor(options = {}) {
    this.container = document.getElementById(options.containerId || 'hero-3d-scene-container');
    this.canvas = document.getElementById(options.canvasId || 'hero-3d-canvas');

    if (!this.container || !this.canvas) {
      console.warn('[Camera3DExperience] Container or canvas not found. Skipping 3D initialization.');
      return;
    }

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isWebGLAvailable = this.checkWebGLSupport();

    if (!this.isWebGLAvailable) {
      console.warn('[Camera3DExperience] WebGL not supported on this device. Providing graceful fallback.');
      this.container.classList.add('webgl-unavailable');
      return;
    }

    // State & Animation references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rafId = null;
    this.isVisible = true;
    this.scrollTimeline = null;

    // 3D Objects
    this.cameraMasterGroup = null;
    this.cameraBodyGroup = null;
    this.lensGroup = null;
    this.focusRing = null;
    this.apertureRing = null;
    this.apertureIrisGroup = null;
    this.apertureBlades = [];
    this.photoFramesGroup = null;
    this.photoFrames = [];

    // Lighting
    this.violetLight = null;
    this.coralLight = null;
    this.skyLight = null;
    this.keyLight = null;

    // Interactive pointer parallax state
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;

    // Asset paths for Scene D floating photos
    this.photoAssets = [
      { url: '/images/ugc_morning.jpg', title: 'Morning Ritual', aspect: 4 / 3 },
      { url: '/images/ugc_workspace.jpg', title: 'Studio Setup', aspect: 4 / 3 },
      { url: '/images/about_brand.jpg', title: 'Craft & Architecture', aspect: 4 / 3 },
      { url: '/images/ugc_outdoor.jpg', title: 'Terrace Living', aspect: 4 / 3 },
    ];

    this.init();
  }

  checkWebGLSupport() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  init() {
    this.setupScene();
    this.setupLights();
    this.buildProceduralCamera();
    this.buildFloatingPhotoFrames();
    this.setupGSAPScrollStory();
    this.bindEvents();
    this.startRenderLoop();
    this.playInitialEntrance();
  }

  playInitialEntrance() {
    if (this.prefersReducedMotion || !this.cameraMasterGroup) {
      document.body.classList.add('page-loaded');
      return;
    }

    // Camera body starts at a controlled size and gentle offset inside its container
    this.cameraMasterGroup.position.set(0, -0.16, -0.38);
    this.cameraMasterGroup.rotation.set(0.14, -0.62, 0);

    gsap.to(this.cameraMasterGroup.position, {
      x: 0,
      y: -0.05,
      z: 0,
      duration: 0.95,
      ease: 'power2.out',
    });

    gsap.to(this.cameraMasterGroup.rotation, {
      x: 0.06,
      y: -0.38,
      z: 0,
      duration: 1.05,
      ease: 'power2.out',
    });

    // Lens rings & focus movement
    if (this.focusRing) {
      gsap.fromTo(
        this.focusRing.rotation,
        { z: Math.PI / 2.2 },
        { z: 0, duration: 1.1, ease: 'power3.out' }
      );
    }

    if (this.apertureRing) {
      gsap.fromTo(
        this.apertureRing.rotation,
        { z: -Math.PI / 3 },
        { z: 0, duration: 0.95, ease: 'power2.out' }
      );
    }

    // Soft violet/coral light sweep across coated optical elements
    if (this.violetLight && this.coralLight) {
      gsap.fromTo(
        [this.violetLight, this.coralLight],
        { intensity: 0.6 },
        { intensity: 2.3, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }
      );
    }

    // Trigger page-loaded immediately on next frame so CSS and GSAP entrance are synchronized
    requestAnimationFrame(() => {
      document.body.classList.add('page-loaded');
      document.dispatchEvent(new CustomEvent('aura-camera-settled'));
    });
  }

  setupScene() {
    const width = this.container.clientWidth || 520;
    const height = this.container.clientHeight || 260;

    this.scene = new THREE.Scene();

    // Perspective Camera: FOV 33deg for natural photography focal length inside bounded box
    this.camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 100);
    this.updateCameraPlacement(width, height);

    // High performance WebGL renderer with transparent canvas
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Master parallax pivot cleanly isolates mouse parallax from scroll animation
    this.parallaxPivot = new THREE.Group();
    this.scene.add(this.parallaxPivot);

    // Float group cleanly isolates idle floating from parallax and scroll
    this.floatGroup = new THREE.Group();
    this.parallaxPivot.add(this.floatGroup);

    // Master container for scroll story animation
    this.cameraMasterGroup = new THREE.Group();
    this.floatGroup.add(this.cameraMasterGroup);
  }

  updateCameraPlacement(width, height) {
    if (!this.camera) return;
    const isMobile = width <= 480;
    const isTablet = width > 480 && width <= 991;

    if (isMobile) {
      this.camera.position.set(0, 0, 7.6);
      this.camera.fov = 36;
      if (this.cameraMasterGroup) {
        this.cameraMasterGroup.scale.set(0.85, 0.85, 0.85);
      }
    } else if (isTablet) {
      this.camera.position.set(0, 0, 7.3);
      this.camera.fov = 34;
      if (this.cameraMasterGroup) {
        this.cameraMasterGroup.scale.set(0.92, 0.92, 0.92);
      }
    } else {
      this.camera.position.set(0, 0, 7.1);
      this.camera.fov = 33;
      if (this.cameraMasterGroup) {
        this.cameraMasterGroup.scale.set(1, 1, 1);
      }
    }
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  setupLights() {
    // 1. Soft pearl ambient fill for natural studio look
    const ambientLight = new THREE.AmbientLight(0xfffaf4, 1.4);
    this.scene.add(ambientLight);

    // 2. Studio key light with soft shadow
    this.keyLight = new THREE.DirectionalLight(0xfffcf8, 1.85);
    this.keyLight.position.set(3.5, 5, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // 3. Electric violet fill light (AURA brand identity)
    this.violetLight = new THREE.PointLight(0x7545f5, 1.6, 16);
    this.violetLight.position.set(-4, -1, 3);
    this.scene.add(this.violetLight);

    // 4. Coral pink rim/specular light
    this.coralLight = new THREE.PointLight(0xffb8cb, 1.35, 14);
    this.coralLight.position.set(4, -1.5, 2);
    this.scene.add(this.coralLight);

    // 5. Sky blue grazing top light
    this.skyLight = new THREE.PointLight(0xddebff, 1.1, 12);
    this.skyLight.position.set(0, 4.5, -2);
    this.scene.add(this.skyLight);
  }

  /**
   * Helper: Extrudes a clean rounded rectangle shape
   */
  createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
  }

  /**
   * Procedural canvas bump texture for camera leatherette grip
   */
  createLeatheretteBumpTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);

    // Fine organic pebble grain
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

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
    return texture;
  }

  /**
   * Procedural canvas texture for lens barrel engraved typography
   */
  createLensMarkingsTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#181520';
    ctx.fillRect(0, 0, 1024, 128);

    ctx.fillStyle = '#E6DCF5';
    ctx.font = 'bold 32px "Inter", "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AURA OPTICS  •  50MM F/1.4  •  ASPHERICAL  •  N° 84920', 512, 45);

    ctx.fillStyle = '#7545F5';
    ctx.font = 'bold 24px "Inter", sans-serif';
    ctx.fillText('ƒ 1.4   2   2.8   4   5.6   8   11   16', 512, 92);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  /**
   * Procedural canvas texture for rear LCD live viewfinder screen
   */
  createLcdScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // Dark studio preview gradient
    const grad = ctx.createLinearGradient(0, 0, 512, 320);
    grad.addColorStop(0, '#1E192B');
    grad.addColorStop(1, '#0F0D17');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 320);

    // Rule of thirds subtle grid lines
    ctx.strokeStyle = 'rgba(233, 223, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(170, 0);
    ctx.lineTo(170, 320);
    ctx.moveTo(341, 0);
    ctx.lineTo(341, 320);
    ctx.moveTo(0, 106);
    ctx.lineTo(512, 106);
    ctx.moveTo(0, 213);
    ctx.lineTo(512, 213);
    ctx.stroke();

    // Golden center autofocus bracket
    ctx.strokeStyle = '#E4FF83';
    ctx.lineWidth = 2;
    ctx.strokeRect(226, 130, 60, 60);

    // Status overlay typography
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Inter", sans-serif';
    ctx.fillText('● REC', 28, 36);
    ctx.fillText('ISO 100', 420, 36);
    ctx.fillText('1/250s  ƒ/1.4', 28, 295);
    ctx.fillText('RAW 14-BIT', 390, 295);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * Builds the complete procedural 3D camera model
   */
  buildProceduralCamera() {
    this.cameraBodyGroup = new THREE.Group();
    this.lensGroup = new THREE.Group();

    // ----------------------------------------------------
    // MATERIALS
    // ----------------------------------------------------
    const leatherBump = this.createLeatheretteBumpTexture();

    // 1. Satin titanium / brushed pearl aluminum
    const satinMetalMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.24,
      metalness: 0.88,
    });

    // 2. Warm dark pebble leatherette
    const leatheretteMat = new THREE.MeshStandardMaterial({
      color: 0x1c1a24,
      roughness: 0.85,
      metalness: 0.08,
      bumpMap: leatherBump,
      bumpScale: 0.06,
    });

    // 3. Dark machined anodized barrel aluminum
    const darkAnodizedMat = new THREE.MeshStandardMaterial({
      color: 0x1f1c28,
      roughness: 0.35,
      metalness: 0.75,
    });

    // 4. Gold / solid brass accent
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd9b875,
      roughness: 0.28,
      metalness: 0.85,
    });

    // 5. Optical glass physical material
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

    // ----------------------------------------------------
    // 1. CAMERA CHASSIS / BODY
    // ----------------------------------------------------
    const bodyW = 4.2;
    const bodyH = 2.4;
    const bodyD = 1.35;
    const bodyR = 0.52;

    const bodyShape = this.createRoundedRectShape(bodyW, bodyH, bodyR);
    const bodyGeom = new THREE.ExtrudeGeometry(bodyShape, {
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
    this.cameraBodyGroup.add(bodyMesh);

    // ----------------------------------------------------
    // 2. TOP DECK PLATE (Machined Satin Aluminum)
    // ----------------------------------------------------
    const topPlateH = 0.55;
    const topPlateShape = this.createRoundedRectShape(bodyW + 0.02, topPlateH, bodyR);
    const topPlateGeom = new THREE.ExtrudeGeometry(topPlateShape, {
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
    this.cameraBodyGroup.add(topPlateMesh);

    // Bottom base plate
    const basePlateH = 0.15;
    const basePlateGeom = new THREE.ExtrudeGeometry(
      this.createRoundedRectShape(bodyW + 0.02, basePlateH, bodyR),
      { steps: 1, depth: bodyD + 0.02, bevelEnabled: false }
    );
    basePlateGeom.center();
    const basePlateMesh = new THREE.Mesh(basePlateGeom, satinMetalMat);
    basePlateMesh.position.y = -bodyH / 2 - basePlateH / 2 + 0.04;
    this.cameraBodyGroup.add(basePlateMesh);

    // ----------------------------------------------------
    // 3. TOP DECK HARDWARE & CONTROLS
    // ----------------------------------------------------
    // Shutter speed dial (right)
    const dialGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 36);
    const speedDial = new THREE.Mesh(dialGeom, satinMetalMat);
    speedDial.position.set(1.2, bodyH / 2 + 0.44, -0.1);
    this.cameraBodyGroup.add(speedDial);

    // Mode dial (left)
    const modeDial = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 36), satinMetalMat);
    modeDial.position.set(-1.3, bodyH / 2 + 0.43, -0.1);
    this.cameraBodyGroup.add(modeDial);

    // Tactile Shutter Button
    const collarGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.18, 32);
    const shutterCollar = new THREE.Mesh(collarGeom, satinMetalMat);
    shutterCollar.position.set(0.6, bodyH / 2 + 0.42, 0.25);

    const buttonGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.16, 32);
    const shutterButton = new THREE.Mesh(buttonGeom, brassMat);
    shutterButton.position.set(0.6, bodyH / 2 + 0.5, 0.25);
    this.cameraBodyGroup.add(shutterCollar);
    this.cameraBodyGroup.add(shutterButton);

    // Hot Shoe Mount
    const hotshoeGeom = new THREE.BoxGeometry(0.55, 0.14, 0.55);
    const hotshoeMesh = new THREE.Mesh(hotshoeGeom, satinMetalMat);
    hotshoeMesh.position.set(0, bodyH / 2 + 0.4, 0);

    const hotshoeContact = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16), brassMat);
    hotshoeContact.position.set(0, bodyH / 2 + 0.48, 0);
    this.cameraBodyGroup.add(hotshoeMesh);
    this.cameraBodyGroup.add(hotshoeContact);

    // ----------------------------------------------------
    // 4. FRONT SENSORS & VIEWFINDER WINDOWS
    // ----------------------------------------------------
    // Optical rangefinder window (front right from camera POV, front left from user POV)
    const rfGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x9370db,
      transmission: 0.85,
      roughness: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const rfWindow = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.26, 0.1), rfGlassMat);
    rfWindow.position.set(-1.3, 0.72, bodyD / 2 + 0.08);
    this.cameraBodyGroup.add(rfWindow);

    // Frameline illuminator window
    const illumWindow = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.24, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xddd5ea, roughness: 0.3 })
    );
    illumWindow.position.set(-0.85, 0.72, bodyD / 2 + 0.08);
    this.cameraBodyGroup.add(illumWindow);

    // Studio Tally LED (glowing electric violet)
    const tallyMat = new THREE.MeshBasicMaterial({ color: 0x7545f5 });
    const tallyLight = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), tallyMat);
    tallyLight.position.set(1.4, 0.72, bodyD / 2 + 0.08);
    this.cameraBodyGroup.add(tallyLight);

    // ----------------------------------------------------
    // 5. REAR LCD SCREEN & CONTROLS (Authentic 3D camera back!)
    // ----------------------------------------------------
    const lcdScreenMat = new THREE.MeshBasicMaterial({ map: this.createLcdScreenTexture() });
    const lcdMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.45), lcdScreenMat);
    lcdMesh.rotation.y = Math.PI;
    lcdMesh.position.set(-0.35, -0.05, -bodyD / 2 - 0.09);
    this.cameraBodyGroup.add(lcdMesh);

    // LCD Bezel
    const lcdBezel = new THREE.Mesh(new THREE.BoxGeometry(2.45, 1.6, 0.04), darkAnodizedMat);
    lcdBezel.position.set(-0.35, -0.05, -bodyD / 2 - 0.07);
    this.cameraBodyGroup.add(lcdBezel);

    // Viewfinder Eyepiece
    const eyepieceGeom = new THREE.CylinderGeometry(0.24, 0.28, 0.2, 32);
    eyepieceGeom.rotateX(Math.PI / 2);
    const eyepieceMesh = new THREE.Mesh(
      eyepieceGeom,
      new THREE.MeshStandardMaterial({ color: 0x110f17, roughness: 0.9 })
    );
    eyepieceMesh.position.set(1.2, 0.65, -bodyD / 2 - 0.12);
    this.cameraBodyGroup.add(eyepieceMesh);

    // ----------------------------------------------------
    // 6. MULTI-STAGE CONCENTRIC OPTICAL LENS ASSEMBLY
    // ----------------------------------------------------
    const lensCenterZ = bodyD / 2 + 0.06;

    // A. Lens Base Bayonet Mount (Chrome Flange)
    const bayonetMount = new THREE.Mesh(
      new THREE.CylinderGeometry(1.22, 1.25, 0.16, 48),
      satinMetalMat
    );
    bayonetMount.rotation.x = Math.PI / 2;
    bayonetMount.position.set(0, -0.08, lensCenterZ + 0.08);
    this.lensGroup.add(bayonetMount);

    // B. Outer Knurled Focus Ring (with rotational animation during focus)
    this.focusRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.18, 1.18, 0.45, 64),
      new THREE.MeshStandardMaterial({
        color: 0x221f2d,
        roughness: 0.4,
        metalness: 0.8,
      })
    );
    this.focusRing.rotation.x = Math.PI / 2;
    this.focusRing.position.set(0, -0.08, lensCenterZ + 0.38);
    this.lensGroup.add(this.focusRing);

    // Knurling ribs on focus ring
    const ribCount = 36;
    for (let r = 0; r < ribCount; r++) {
      const ribAngle = (r / ribCount) * Math.PI * 2;
      const ribGeom = new THREE.BoxGeometry(0.025, 0.44, 0.03);
      const ribMesh = new THREE.Mesh(ribGeom, satinMetalMat);
      ribMesh.position.set(
        Math.cos(ribAngle) * 1.18,
        Math.sin(ribAngle) * 1.18,
        0
      );
      ribMesh.rotation.z = ribAngle;
      this.focusRing.add(ribMesh);
    }

    // C. Aperture Index Ring with Engraved Markings
    const apertureMarkingsTex = this.createLensMarkingsTexture();
    this.apertureRing = new THREE.Mesh(
      new THREE.CylinderGeometry(1.12, 1.12, 0.35, 48),
      new THREE.MeshStandardMaterial({
        map: apertureMarkingsTex,
        roughness: 0.3,
        metalness: 0.7,
      })
    );
    this.apertureRing.rotation.x = Math.PI / 2;
    this.apertureRing.position.set(0, -0.08, lensCenterZ + 0.75);
    this.lensGroup.add(this.apertureRing);

    // D. Chamfered Metallic Step-Down Front Bevel
    const stepDownBevel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.96, 1.1, 0.28, 48),
      satinMetalMat
    );
    stepDownBevel.rotation.x = Math.PI / 2;
    stepDownBevel.position.set(0, -0.08, lensCenterZ + 1.05);
    this.lensGroup.add(stepDownBevel);

    // E. Inner Matte Velvet Barrel
    const innerBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.85, 0.8, 36),
      new THREE.MeshStandardMaterial({ color: 0x0a0910, roughness: 0.95 })
    );
    innerBarrel.rotation.x = Math.PI / 2;
    innerBarrel.position.set(0, -0.08, lensCenterZ + 0.8);
    this.lensGroup.add(innerBarrel);

    // F. 8-Blade Aperture Iris Diaphragm (Animates open/close!)
    this.apertureIrisGroup = new THREE.Group();
    this.apertureIrisGroup.position.set(0, -0.08, lensCenterZ + 0.88);
    this.lensGroup.add(this.apertureIrisGroup);

    const bladeCount = 8;
    const irisRadius = 0.78;
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.68, 0.26);
    bladeShape.quadraticCurveTo(0.62, 0.44, 0.18, 0.38);
    bladeShape.closePath();

    const bladeGeom = new THREE.ShapeGeometry(bladeShape);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x14121a,
      roughness: 0.55,
      metalness: 0.45,
      side: THREE.DoubleSide,
    });

    for (let b = 0; b < bladeCount; b++) {
      const angle = (b / bladeCount) * Math.PI * 2;
      const bladePivot = new THREE.Group();
      bladePivot.position.set(Math.cos(angle) * irisRadius, Math.sin(angle) * irisRadius, b * 0.003);
      bladePivot.rotation.z = angle + Math.PI / 2.2;

      const bladeMesh = new THREE.Mesh(bladeGeom, bladeMat);
      bladePivot.add(bladeMesh);
      this.apertureIrisGroup.add(bladePivot);
      this.apertureBlades.push(bladePivot);
    }

    // G. Convex Multi-Coated Optical Glass Front Element
    const glassDomeGeom = new THREE.SphereGeometry(0.92, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.8);
    const glassDome = new THREE.Mesh(glassDomeGeom, opticalGlassMat);
    glassDome.position.set(0, -0.08, lensCenterZ + 1.15);
    this.lensGroup.add(glassDome);

    // Internal curved lens refraction ring
    const innerGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 0.05, 36),
      new THREE.MeshPhysicalMaterial({
        color: 0x7545f5,
        transmission: 0.7,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
      })
    );
    innerGlass.rotation.x = Math.PI / 2;
    innerGlass.position.set(0, -0.08, lensCenterZ + 0.95);
    this.lensGroup.add(innerGlass);

    // Assemble groups into master hierarchy
    this.cameraMasterGroup.add(this.cameraBodyGroup);
    this.cameraMasterGroup.add(this.lensGroup);

    // Initial default pose (Centered beauty pose)
    this.cameraMasterGroup.position.set(0, -0.1, 0);
    this.cameraMasterGroup.rotation.set(0.08, -0.42, 0);
  }

  /**
   * Hero 3D camera scene remains strictly focused on the tactile camera model
   */
  buildFloatingPhotoFrames() {
    // Kept clean: photo frames removed to preserve bounded container clarity
  }

  /**
   * GSAP ScrollTrigger Master Timeline
   * Controls 3D camera assembly, rotation, lens macro, and photo emergence
   */
  setupGSAPScrollStory() {
    const heroSection = document.getElementById('hero');
    if (!heroSection || !this.cameraMasterGroup) return;

    if (this.prefersReducedMotion) {
      this.cameraMasterGroup.position.set(0, -0.05, 0);
      this.cameraMasterGroup.rotation.set(0.06, -0.38, 0);
      return;
    }

    const hudAction = document.querySelector('.camera-3d-hud .hud-action .hud-label');

    // PHASE 4: Controlled camera scroll experience
    // Bound strictly to hero section scroll with scrub. pin: false prevents page trapping or blank spaces!
    this.scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        pin: false,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (hudAction) {
            if (p < 0.25) {
              hudAction.textContent = 'SCROLL TO OPERATE';
            } else if (p < 0.65) {
              hudAction.textContent = '35MM OPTICAL PROFILE';
            } else {
              hudAction.textContent = 'ƒ/1.4 DEPTH OF FIELD';
            }
          }
        },
      },
    });

    // 1. Controlled 3D rotation within container boundaries (beauty angle to side profile)
    this.scrollTimeline.to(
      this.cameraMasterGroup.rotation,
      {
        y: 0.52,
        x: 0.02,
        z: 0,
        duration: 2.2,
        ease: 'power1.inOut',
      },
      0
    );

    // 2. Dynamic focus ring rotation during scroll
    if (this.focusRing) {
      this.scrollTimeline.to(
        this.focusRing.rotation,
        { z: -Math.PI * 0.75, duration: 2.2, ease: 'none' },
        0
      );
    }

    // 3. Aperture ring rotation
    if (this.apertureRing) {
      this.scrollTimeline.to(
        this.apertureRing.rotation,
        { z: -Math.PI * 0.6, duration: 2.0, ease: 'none' },
        0.1
      );
    }

    // 4. Aperture blades stop-down and reopen
    if (this.apertureBlades.length) {
      this.apertureBlades.forEach((blade) => {
        this.scrollTimeline.to(
          blade.rotation,
          {
            z: '+=' + (Math.PI / 4.8),
            duration: 0.9,
            ease: 'power1.inOut',
          },
          0.3
        );
        this.scrollTimeline.to(
          blade.rotation,
          {
            z: '-=' + (Math.PI / 4.8),
            duration: 0.9,
            ease: 'power1.inOut',
          },
          1.2
        );
      });
    }

    // 5. Gentle violet/pink lighting sweep across optical elements
    if (this.violetLight && this.coralLight) {
      this.scrollTimeline.to(
        [this.violetLight, this.coralLight],
        { intensity: 2.0, duration: 0.9, yoyo: true, repeat: 1 },
        0.5
      );
    }
  }

  bindEvents() {
    // 1. Mouse Parallax (desktop only)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener(
        'mousemove',
        (e) => {
          this.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
          this.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        },
        { passive: true }
      );

      window.addEventListener(
        'mouseleave',
        () => {
          this.targetMouseX = 0;
          this.targetMouseY = 0;
        },
        { passive: true }
      );
    }

    // 2. Responsive Resize
    const onResize = () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || 520;
      const height = this.container.clientHeight || 260;

      this.camera.aspect = width / height;
      this.updateCameraPlacement(width, height);
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      if (ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', onResize, { passive: true });

    // 3. Viewport Visibility / Performance Optimization
    if ('IntersectionObserver' in window && this.container) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            this.isVisible = entry.isIntersecting;
            if (this.isVisible && !this.rafId) {
              this.startRenderLoop();
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(this.container);
    }
  }

  startRenderLoop() {
    const clock = new THREE.Clock();

    const animate = () => {
      if (!this.isVisible) {
        this.rafId = null;
        return;
      }

      this.rafId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // 1. Gentle floating animation (desktop and mobile when visible)
      if (this.floatGroup && !this.prefersReducedMotion) {
        this.floatGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.045;
        this.floatGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.012;
        this.floatGroup.rotation.x = Math.cos(elapsedTime * 1.0) * 0.010;
      }

      // 2. Optical highlight shimmer and subtle lens focus breathing
      if (!this.prefersReducedMotion) {
        if (this.violetLight) {
          this.violetLight.intensity = 1.6 + Math.sin(elapsedTime * 2.2) * 0.35;
          this.violetLight.position.x = -4 + Math.sin(elapsedTime * 1.2) * 0.5;
        }
        if (this.coralLight) {
          this.coralLight.intensity = 1.35 + Math.cos(elapsedTime * 1.8) * 0.3;
          this.coralLight.position.x = 4 + Math.cos(elapsedTime * 1.4) * 0.5;
        }
      }

      // 3. Smooth pointer parallax lerp (desktop only)
      if (!this.prefersReducedMotion) {
        this.currentMouseX += (this.targetMouseX * 0.12 - this.currentMouseX) * 0.05;
        this.currentMouseY += (this.targetMouseY * 0.08 - this.currentMouseY) * 0.05;

        if (this.parallaxPivot) {
          this.parallaxPivot.position.x = this.currentMouseX * 0.22;
          this.parallaxPivot.position.y = -this.currentMouseY * 0.16;
          this.parallaxPivot.rotation.y = this.currentMouseX * 0.10;
          this.parallaxPivot.rotation.x = -this.currentMouseY * 0.07;
        }
      }

      // Render Three.js frame
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };

    this.rafId = requestAnimationFrame(animate);
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.scrollTimeline) {
      this.scrollTimeline.kill();
    }

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  }
}
