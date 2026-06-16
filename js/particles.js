/* ============================================================
   AGN PORTFOLIO — PARTICLE NETWORK BACKGROUND
   Lightweight canvas circuit/node animation
   ============================================================ */

(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  let animationId;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const density = (width * height) / 18000;
    const count = Math.min(Math.max(Math.floor(density), 30), 90);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.5 + 0.5,
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Update positions
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width)  p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    // Draw connections
    const maxDist = 140;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.18;
          ctx.strokeStyle = `rgba(0, 170, 255, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 238, 255, 0.45)';
      ctx.fill();
    }

    animationId = requestAnimationFrame(step);
  }

  function start() {
    if (!animationId) step();
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Pause when tab is hidden — saves battery/CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (!prefersReducedMotion) start();
  });

  window.addEventListener('resize', resize);

  resize();

  if (!prefersReducedMotion) {
    start();
  } else {
    // Static single frame for reduced-motion preference
    step();
    stop();
  }
})();