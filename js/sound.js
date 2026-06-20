/* ============================================================
   AGN PORTFOLIO — SOUND DESIGN SYSTEM
   Procedurally generated UI sounds + ambient hum
   No audio files required — synthesized via Web Audio API
   ============================================================ */

(function () {
  let audioCtx = null;
  let ambientOsc = null;
  let ambientGain = null;
  let soundEnabled = sessionStorage.getItem('agn-sound') === 'on';

  const toggleBtn = document.getElementById('sound-toggle');

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  /* --- UI CLICK SOUND --- */
  function playClick() {
    if (!soundEnabled || !audioCtx) return;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  }

  /* --- UI HOVER SOUND (subtle, higher pitch) --- */
  function playHover() {
    if (!soundEnabled || !audioCtx) return;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  }

  /* --- AMBIENT REACTOR HUM --- */
  function startAmbient() {
    if (!audioCtx || ambientOsc) return;

    ambientOsc  = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();
    const osc2  = audioCtx.createOscillator();

    ambientOsc.type = 'sine';
    ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110.5, audioCtx.currentTime); // slight detune for shimmer

    ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 1.2);

    ambientOsc.connect(ambientGain);
    osc2.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    ambientOsc.start();
    osc2.start();
    ambientOsc._osc2 = osc2; // keep reference for cleanup
  }

  function stopAmbient() {
    if (!ambientOsc || !ambientGain) return;
    const now = audioCtx.currentTime;
    ambientGain.gain.linearRampToValueAtTime(0, now + 0.6);
    setTimeout(() => {
      try {
        ambientOsc.stop();
        ambientOsc._osc2 && ambientOsc._osc2.stop();
      } catch (e) {}
      ambientOsc = null;
      ambientGain = null;
    }, 650);
  }

  function updateToggleUI() {
    if (!toggleBtn) return;
    toggleBtn.textContent = soundEnabled ? '[ AUDIO: ON ]' : '[ AUDIO: OFF ]';
    toggleBtn.classList.toggle('sound-on', soundEnabled);
  }

  function toggleSound() {
    initAudio();
    soundEnabled = !soundEnabled;
    sessionStorage.setItem('agn-sound', soundEnabled ? 'on' : 'off');
    updateToggleUI();
    if (soundEnabled) {
      playClick();
      startAmbient();
    } else {
      stopAmbient();
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleSound);
    updateToggleUI();
  }

  /* --- ASSEMBLY-COMPLETE SOUND (called by boot.js when name forms) --- */
  window.agnPlayAssemble = function () {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    // Rising dual-tone sweep — "power synthesis complete"
    [[300, 1100, 0.06, 0.65], [480, 1750, 0.04, 0.55]].forEach(([f0, f1, vol, dur]) => {
      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f0, now);
      osc.frequency.exponentialRampToValueAtTime(f1, now + dur * 0.7);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + dur);
    });
  };

  // Attach click/hover sounds to interactive elements
  document.addEventListener('click', (e) => {
    if (e.target.closest('a, button, .btn')) {
      initAudio();
      playClick();
    }
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.stat-item, .skill-node, .principle-card, .chapter-card, .book-card, .app-card, .cert-card, .value-card')) {
      if (soundEnabled && audioCtx) playHover();
    }
  });
})();