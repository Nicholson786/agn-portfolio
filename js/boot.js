/* ============================================================
   AGN PORTFOLIO — BOOT SEQUENCE v2
   Particle name-formation intro → condensed terminal → hero reveal
   Plays on every visit. Skip button always available.
   ============================================================ */

(function () {
  const bootScreen  = document.getElementById('boot-screen');
  const bootTextEl  = document.getElementById('boot-text');
  const mainContent = document.getElementById('main-content');
  if (!bootScreen || !bootTextEl || !mainContent) return;

  /* ---- TIME-OF-DAY GREETING ---- */
  const hour = new Date().getHours();
  let greeting;
  if      (hour >= 5  && hour < 12) greeting = '> MORNING SHIFT DETECTED.';
  else if (hour >= 12 && hour < 17) greeting = '> MIDDAY CYCLE ACTIVE.';
  else if (hour >= 17 && hour < 22) greeting = '> EVENING PROTOCOL ENGAGED.';
  else                               greeting = '> LATE-NIGHT OPERATOR CONFIRMED.';

  const BOOT_LINES = [
    '> PROFILE LOADED: ADAM GLENN NICHOLSON',
    '> 18 YEARS OPERATIONAL // ALL SYSTEMS NOMINAL',
    '> LSS BLACK BELT // DBA ACTIVE // IISE MEMBER',
    '> 2 PUBLISHED WORKS // 3 OPERATIONAL APPS',
    greeting,
  ];

  /* ---- BOOT SCREEN STYLING ---- */
  Object.assign(bootScreen.style, {
    position:        'fixed',
    top:             '64px',
    left:            '0',
    right:           '0',
    bottom:          '0',
    background:      'var(--dark)',
    zIndex:          '8999',
    display:         'flex',
    flexDirection:   'column',
    alignItems:      'center',
    justifyContent:  'center',
    overflow:        'hidden',
  });

  /* ---- SKIP BUTTON ---- */
  const skipBtn = document.createElement('button');
  skipBtn.textContent = '[ SKIP ]';
  skipBtn.setAttribute('aria-label', 'Skip intro');
  Object.assign(skipBtn.style, {
    position:       'absolute',
    top:            '20px',
    right:          '32px',
    fontFamily:     'var(--font-mono)',
    fontSize:       '11px',
    letterSpacing:  '2px',
    color:          'var(--grey-dim)',
    background:     'none',
    border:         '1px solid rgba(42,58,82,0.6)',
    padding:        '6px 14px',
    zIndex:         '10',
    transition:     'color 0.2s, border-color 0.2s',
  });
  bootScreen.appendChild(skipBtn);

  let skipped = false;
  skipBtn.addEventListener('click', () => { skipped = true; finishBoot(); });
  skipBtn.addEventListener('mouseenter', () => {
    skipBtn.style.color = 'var(--blue)';
    skipBtn.style.borderColor = 'var(--blue)';
  });
  skipBtn.addEventListener('mouseleave', () => {
    skipBtn.style.color = 'var(--grey-dim)';
    skipBtn.style.borderColor = 'rgba(42,58,82,0.6)';
  });

  /* ---- PARTICLE CANVAS ---- */
  const pCanvas = document.createElement('canvas');
  pCanvas.setAttribute('aria-hidden', 'true');
  Object.assign(pCanvas.style, {
    position:       'absolute',
    top:            '0',
    left:           '0',
    width:          '100%',
    height:         '100%',
    pointerEvents:  'none',
  });
  bootScreen.appendChild(pCanvas);
  const pCtx = pCanvas.getContext('2d');

  /* ---- TERMINAL TEXT (hidden initially, appears after particles) ---- */
  Object.assign(bootTextEl.style, {
    position:    'absolute',
    bottom:      '14%',
    left:        '10vw',
    fontFamily:  'var(--font-mono)',
    fontSize:    'clamp(11px, 1.4vw, 14px)',
    color:       'var(--blue)',
    lineHeight:  '2.2',
    letterSpacing: '1px',
    whiteSpace:  'pre-wrap',
    opacity:     '0',
    transition:  'opacity 0.3s ease',
  });

  /* ---- CANVAS SIZING ---- */
  let W = 0, H = 0;
  function resizeCanvas() {
    W = pCanvas.width  = pCanvas.offsetWidth  || window.innerWidth;
    H = pCanvas.height = pCanvas.offsetHeight || Math.max(window.innerHeight - 64, 400);
  }
  resizeCanvas();

  /* ---- TEXT PIXEL SAMPLING ---- */
  function sampleTextPixels(lines, fontSize) {
    const off = document.createElement('canvas');
    off.width  = W || window.innerWidth;
    off.height = H || (window.innerHeight - 64);
    const oc = off.getContext('2d');

    oc.clearRect(0, 0, off.width, off.height);
    oc.fillStyle = '#ffffff';
    oc.font      = `900 ${fontSize}px 'Orbitron', monospace`;
    oc.textAlign    = 'center';
    oc.textBaseline = 'middle';

    const lineH  = fontSize * 1.35;
    const startY = off.height / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach((line, i) => {
      oc.fillText(line, off.width / 2, startY + i * lineH);
    });

    const pts     = [];
    const imgData = oc.getImageData(0, 0, off.width, off.height);
    const data    = imgData.data;
    const step    = 4;
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          pts.push({ x, y });
        }
      }
    }
    return pts;
  }

  function getFontSize() {
    const w = W || window.innerWidth;
    if (w < 480)  return 22;
    if (w < 640)  return 30;
    if (w < 900)  return 40;
    if (w < 1200) return 52;
    return 64;
  }

  /* ---- PARTICLE INIT ---- */
  let particles = [];

  function buildParticles(pts) {
    const shuffled = [...pts].sort(() => Math.random() - 0.5);
    const count    = Math.min(shuffled.length, 750);
    particles      = [];

    for (let i = 0; i < count; i++) {
      const tx = shuffled[i].x;
      const ty = shuffled[i].y;
      particles.push({
        x:   Math.random() * (W || window.innerWidth),
        y:   Math.random() * (H || window.innerHeight - 64),
        tx,
        ty,
        dvx: 0,
        dvy: 0,
        r:   Math.random() * 1.0 + 0.6,
      });
    }
  }

  /* ---- PHASES ---- */
  const ASSEMBLE_MS = 1500;
  const HOLD_MS     = 450;
  const DISPERSE_MS = 420;

  let phase      = 'waiting'; // waiting → assemble → hold → disperse → done
  let phaseStart = 0;
  let animId     = null;

  function drawFrame(ts) {
    if (skipped) return;
    pCtx.clearRect(0, 0, W, H);
    const elapsed = ts - phaseStart;

    if (phase === 'assemble') {
      const t    = Math.min(elapsed / ASSEMBLE_MS, 1);
      const glow = 0.4 + t * 0.6;

      for (const p of particles) {
        p.x += (p.tx - p.x) * 0.065;
        p.y += (p.ty - p.y) * 0.065;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0,238,255,${glow})`;
        pCtx.fill();
      }

      if (elapsed >= ASSEMBLE_MS) {
        phase      = 'hold';
        phaseStart = ts;
        // Sound cue
        if (typeof window.agnPlayAssemble === 'function') window.agnPlayAssemble();
      }

    } else if (phase === 'hold') {
      for (const p of particles) {
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = 'rgba(0,238,255,1)';
        pCtx.fill();
      }

      if (elapsed >= HOLD_MS) {
        phase      = 'disperse';
        phaseStart = ts;
        const cx   = W / 2;
        const cy   = H / 2;
        for (const p of particles) {
          const dx    = p.x - cx;
          const dy    = p.y - cy;
          const mag   = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = 4 + Math.random() * 5;
          p.dvx = (dx / mag) * speed;
          p.dvy = (dy / mag) * speed;
        }
      }

    } else if (phase === 'disperse') {
      const t    = Math.min(elapsed / DISPERSE_MS, 1);
      const fade = 1 - t;

      for (const p of particles) {
        p.x   += p.dvx;
        p.y   += p.dvy;
        p.dvx *= 0.91;
        p.dvy *= 0.91;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(0,238,255,${fade})`;
        pCtx.fill();
      }

      if (elapsed >= DISPERSE_MS) {
        cancelAnimationFrame(animId);
        animId = null;
        startBootLines();
        return;
      }
    }

    animId = requestAnimationFrame(drawFrame);
  }

  /* ---- CONDENSED BOOT LINES ---- */
  function startBootLines() {
    bootTextEl.style.opacity = '1';
    let lineIdx = 0, charIdx = 0, text = '';

    function typeLine() {
      if (skipped) { finishBoot(); return; }
      if (lineIdx >= BOOT_LINES.length) {
        setTimeout(finishBoot, 280);
        return;
      }
      const line = BOOT_LINES[lineIdx];
      if (charIdx < line.length) {
        text += line[charIdx++];
        bootTextEl.innerHTML = text.replace(/\n/g, '<br>') + '<span style="opacity:1">_</span>';
        setTimeout(typeLine, 10);
      } else {
        text += '\n';
        lineIdx++;
        charIdx = 0;
        setTimeout(typeLine, lineIdx >= BOOT_LINES.length ? 0 : 70);
      }
    }
    typeLine();
  }

  /* ---- FINISH (reveal hero) ---- */
  function finishBoot() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    pCtx.clearRect(0, 0, W, H);

    bootScreen.style.transition = 'opacity 0.5s ease';
    bootScreen.style.opacity    = '0';
    setTimeout(() => {
      bootScreen.style.display = 'none';
      mainContent.style.transition = 'opacity 0.7s ease';
      mainContent.style.opacity    = '1';
    }, 500);
  }

  /* ---- START (wait for Orbitron font to load) ---- */
  function startIntro() {
    resizeCanvas();
    const pts = sampleTextPixels(['ADAM GLENN', 'NICHOLSON'], getFontSize());

    if (pts.length === 0) {
      // Font didn't render — skip straight to boot lines
      startBootLines();
      return;
    }

    buildParticles(pts);
    phase      = 'assemble';
    phaseStart = performance.now();
    animId     = requestAnimationFrame(drawFrame);
  }

  // Ensure fonts are ready before sampling pixel positions
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(startIntro);
  } else {
    setTimeout(startIntro, 200);
  }

})();
