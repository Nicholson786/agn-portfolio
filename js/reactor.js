/* ============================================================
   AGN PORTFOLIO — ARC REACTOR
   Three.js centerpiece for index.html hero
   ============================================================ */

(function () {
  const canvas = document.getElementById('reactor-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  if (!container || container.clientWidth === 0) return;

  const isMobile      = window.innerWidth < 768;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- RENDERER ---- */
  const SIZE = Math.min(container.clientWidth, container.clientHeight, 380);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(SIZE, SIZE);
  renderer.setClearColor(0x000000, 0);

  /* ---- SCENE + CAMERA ---- */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 5;

  /* ---- MATERIAL FACTORY ---- */
  function mat(hex, opacity) {
    return new THREE.MeshBasicMaterial({
      color: hex,
      transparent: true,
      opacity: opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  /* ---- OUTER RING ---- */
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.88, 0.022, 8, 120),
    mat(0x00aaff, 0.82)
  );
  const outerGlow = new THREE.Mesh(
    new THREE.TorusGeometry(1.88, 0.07, 8, 120),
    mat(0x00aaff, 0.07)
  );

  /* ---- MID RINGS ---- */
  const midRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.016, 8, 90),
    mat(0x00ccff, 0.58)
  );
  midRing1.rotation.x = Math.PI / 2.7;

  const midRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.013, 8, 90),
    mat(0x0099dd, 0.48)
  );
  midRing2.rotation.x = -Math.PI / 2.7;
  midRing2.rotation.y =  Math.PI / 3.5;

  /* ---- INNER RING ---- */
  const innerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.84, 0.018, 8, 60),
    mat(0x00eeff, 0.75)
  );
  innerRing.rotation.x = Math.PI / 1.9;

  /* ---- TICK MARKS (8 outer, on outer ring plane) ---- */
  const tickGroup = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.16, 0.01),
      mat(0x00eeff, 0.65)
    );
    tick.position.set(Math.cos(angle) * 1.88, Math.sin(angle) * 1.88, 0);
    tick.rotation.z = angle;
    tickGroup.add(tick);
  }

  /* ---- SPOKES (4, core → inner ring) ---- */
  const spokeGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.82, 4),
      mat(0x00aaff, 0.22)
    );
    spoke.position.set(Math.cos(angle) * 0.41, Math.sin(angle) * 0.41, 0);
    spoke.rotation.z = angle + Math.PI / 2;
    spokeGroup.add(spoke);
  }

  /* ---- CORE ---- */
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 16),
    mat(0xffffff, 1)
  );
  const coreGlow1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    mat(0x00eeff, 0.22)
  );
  const coreGlow2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 16, 16),
    mat(0x00aaff, 0.07)
  );

  scene.add(
    outerRing, outerGlow,
    midRing1, midRing2,
    innerRing,
    tickGroup, spokeGroup,
    coreGlow2, coreGlow1, core
  );

  /* ---- ANIMATE ---- */
  const PULSE_PERIOD = 3000; // ms — synced to nav logo / favicon
  let animId = null;

  function animate() {
    animId = requestAnimationFrame(animate);

    const pulse = (Math.sin((Date.now() / PULSE_PERIOD) * Math.PI * 2) + 1) / 2;

    outerRing.rotation.z  += 0.002;
    outerGlow.rotation.z  += 0.002;
    tickGroup.rotation.z  += 0.002;
    midRing1.rotation.z   += 0.0045;
    midRing2.rotation.z   -= 0.0035;
    innerRing.rotation.z  += 0.0075;
    spokeGroup.rotation.z += 0.002;

    coreGlow1.scale.setScalar(1 + pulse * 0.38);
    coreGlow2.scale.setScalar(1 + pulse * 0.28);
    coreGlow1.material.opacity = 0.16 + pulse * 0.18;
    coreGlow2.material.opacity = 0.05 + pulse * 0.06;
    core.material.opacity      = 0.82 + pulse * 0.18;

    renderer.render(scene, camera);
  }

  if (prefersReduced) {
    renderer.render(scene, camera);
  } else {
    animate();
  }

  /* ---- RESIZE ---- */
  window.addEventListener('resize', () => {
    const s = Math.min(container.clientWidth, container.clientHeight, 380);
    renderer.setSize(s, s);
    renderer.render(scene, camera);
  });

  /* ---- PAUSE WHEN HIDDEN ---- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else if (!prefersReduced && !animId) {
      animate();
    }
  });
})();
