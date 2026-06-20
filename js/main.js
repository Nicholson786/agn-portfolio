/* ============================================================
   AGN PORTFOLIO — MAIN JS
   Arc Reactor Edition
   Custom cursor | Scroll reveal | Stat counters | Terminal
   ============================================================ */

/* --- CONSOLE EASTER EGG (3.2) --- */
console.log(
  '%c AGN // ADAM GLENN NICHOLSON ',
  'background:#020508;color:#00eeff;font-family:monospace;font-size:14px;font-weight:bold;padding:8px 20px;border:1px solid #00aaff;letter-spacing:3px;'
);
console.log(
  '%c > CURIOUS OPERATOR DETECTED\n > YOU FOUND THE CONSOLE. NICE.\n > TERMINAL ACCESS: CTRL + `\n > SYSTEM STATUS: ALL NOMINAL ',
  'background:#020508;color:#00aaff;font-family:monospace;font-size:11px;padding:6px 20px;letter-spacing:1px;line-height:2;'
);

/* --- CUSTOM CURSOR --- */
const cursorDot  = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

// Force cursor:none on everything dynamically added
document.addEventListener('mouseover', (e) => {
  if (e.target) e.target.style.cursor = 'none';
});

if (cursorDot && cursorRing) {
  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;
  let isVisible = false;

  // Show cursor on first move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';

    if (!isVisible) {
      cursorDot.style.opacity  = '1';
      cursorRing.style.opacity = '1';
      isVisible = true;
    }
  });

  // Ring follows with smooth lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Expand ring on interactive elements
  function addHoverEffect(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width        = '64px';
        cursorRing.style.height       = '64px';
        cursorRing.style.borderColor  = 'var(--cyan)';
        cursorRing.style.boxShadow    = '0 0 16px rgba(0,238,255,0.5), inset 0 0 16px rgba(0,238,255,0.1)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width        = '40px';
        cursorRing.style.height       = '40px';
        cursorRing.style.borderColor  = 'var(--blue)';
        cursorRing.style.boxShadow    = '0 0 8px rgba(0,170,255,0.4), inset 0 0 8px rgba(0,170,255,0.1)';
      });
    });
  }

  addHoverEffect('a, button, .btn, .stat-item, .skill-node, .principle-card, .chapter-card, .book-card, .app-card, .cert-card, .value-card, .resp-card, .callout-item, input, textarea');
}

/* --- SCROLL REVEAL --- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObserver.observe(el));

/* --- STAT COUNTERS --- */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target);
  const isPct    = el.classList.contains('stat-pct');
  const suffix   = isPct ? '%' : '+';
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

/* --- ACTIVE NAV LINK --- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* --- TERMINAL EASTER EGG --- */
const terminalOverlay  = document.getElementById('terminal-overlay');
const terminalInput    = document.getElementById('terminal-input');
const terminalBody     = document.getElementById('terminal-body');
const terminalCloseBtn = document.getElementById('terminal-close-btn');

const COMMANDS = {
  help: () => `AVAILABLE COMMANDS:
  whoami            — operator identity
  cat philosophy    — operating philosophy
  cat manifesto     — core manifesto
  cat legacy        — legacy principle
  cat purpose       — cumulative purpose
  cat ethics        — leadership oath
  ls skills         — capability domains
  ls values         — core ethical values
  ls certifications — certifications & memberships
  ls works          — published works & apps
  ls tech           — technical stack
  show experience   — career arc
  contact           — contact info
  uptime            — operational uptime
  status            — current system status
  clear             — clear terminal`,

  whoami: () =>
    'ADAM GLENN NICHOLSON\nPROCESS ENGINEER // LSS BLACK BELT // PUBLISHED AUTHOR\nPAST MASTER // DOCTORAL CANDIDATE',

  'cat philosophy': () =>
    '"The question I ask at the start of every engagement\nisn\'t what\'s broken.\nIt\'s what does this system think it\'s supposed to do\n— and what does it actually do?"',

  'cat manifesto': () =>
    '"I don\'t fix problems.\nI eliminate the conditions that create them."',

  'cat legacy': () =>
    '"If we have the ability to make a difference,\nwe have the responsibility to act on it."',

  'cat purpose': () =>
    '"My cumulative purpose is to lead with integrity,\nelevate others, and ensure that my influence contributes\nto a culture of trust, accountability,\nand sustainable performance."',

  'cat ethics': () =>
    'LEADERSHIP OATH:\n"By adopting this code, I affirm my commitment\nto lead with integrity, courage, and accountability.\nMy influence must elevate others, strengthen the organization,\nand contribute to a culture where ethical behavior\nis the norm and not the exception.\n\nThis code represents not only how I lead today,\nbut the standard I hold myself to as I grow\ninto greater responsibility and broader impact."',

  'ls skills': () =>
    '[ PROCESS ENGINEERING      ]\n[ CONTINUOUS IMPROVEMENT   ]\n[ MAINTENANCE SYSTEMS      ]\n[ PROJECT MANAGEMENT       ]\n[ COMPLIANCE & TRADE       ]\n[ TECHNOLOGY & DATA        ]\n[ APPLICATION DEVELOPMENT  ]\n[ ACADEMIC RESEARCH        ]',

  'ls values': () =>
    '[ INTEGRITY              ]\n[ RESPECT FOR PEOPLE     ]\n[ ACCOUNTABILITY         ]\n[ JUSTICE AND FAIRNESS   ]\n[ EXCELLENCE & CI        ]\n[ STEWARDSHIP            ]',

  'ls certifications': () =>
    '[ LSS BLACK BELT     ] — VALIDATED\n[ GOOGLE PM          ] — VALIDATED\n[ PMP                ] — IN PREPARATION\n[ IISE               ] — ACTIVE MEMBER\n[ PMI                ] — ACTIVE MEMBER\n[ DBA                ] — IN PROGRESS',

  'ls works': () =>
    '[BOOK] BEYOND THE BOTTLENECK — PUBLISHED\n[BOOK] LEGACY BY IMPROVEMENT — PUBLISHED\n[APP]  SAFETY APP             — LIVE\n[APP]  EMS APP                — ALPHA\n[APP]  TROUBLESHOOTING APP    — ALPHA',

  'ls tech': () =>
    'SQL // RASPBERRY PI // SAP CMMS\n3D PRINTING // AI INTEGRATION',

  'show experience': () =>
    'DAL-TILE OPERATIONS   [2008—2019] ████████████ FOUNDATION BUILT\nDAL-TILE MAINTENANCE  [2019—2022] ████████     PROCESS BUILT FROM ZERO\nVALLOUREC             [2022—2025] ████████     COMPLEXITY NAVIGATED\nDAL-TILE PROCESS ENG  [2025—NOW ] ████         ACTIVE // OPTIMIZING',

  contact: () =>
    'EMAIL:    nicholson786@gmail.com\nLINKEDIN: Adam Glenn Nicholson\nWORKS:    Amazon — Beyond the Bottleneck\n                   Legacy by Improvement',

  uptime: () => {
    const start = new Date('2008-01-01');
    const now   = new Date();
    const ms    = now - start;
    const totalDays = Math.floor(ms / 86400000);
    const years     = Math.floor(totalDays / 365.25);
    const days      = Math.floor(totalDays - years * 365.25);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `OPERATIONAL SINCE : 2008.01.01\nUPTIME            : ${years} YRS ${days} DAYS ${hh}:${mm}:${ss}\nDOWNTIME EVENTS   : 0\nSTATUS            : NOMINAL`;
  },

  status: () =>
    'ALL SYSTEMS OPERATIONAL\nCURRENTLY OPTIMIZING\n3 APPS IN PIPELINE\nDBA ACTIVE // PMP IN PREP',

  clear: () => '__CLEAR__',
};

function terminalPrint(text, isError = false) {
  const div = document.createElement('div');
  div.className = isError ? 'terminal-error' : 'terminal-output';
  div.textContent = text;
  terminalBody.appendChild(div);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function openTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.classList.add('open');
  setTimeout(() => terminalInput && terminalInput.focus(), 100);
}

function closeTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.classList.remove('open');
}

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === '`') {
    e.preventDefault();
    terminalOverlay && terminalOverlay.classList.contains('open')
      ? closeTerminal() : openTerminal();
  }
  if (e.key === 'Escape') closeTerminal();
});

if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', closeTerminal);

if (terminalInput) {
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const raw = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';
    if (!raw) return;

    const echo = document.createElement('div');
    echo.className = 'terminal-output';
    echo.style.color = 'var(--white)';
    echo.textContent = 'AGN://> ' + raw;
    terminalBody.appendChild(echo);

    const handler = COMMANDS[raw];
    if (handler) {
      const result = handler();
      if (result === '__CLEAR__') {
        terminalBody.innerHTML =
          '<div class="terminal-output">AGN TERMINAL v1.0 // TYPE \'help\' FOR COMMANDS</div>' +
          '<div class="terminal-output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>';
      } else {
        terminalPrint(result);
      }
    } else {
      terminalPrint(`COMMAND NOT RECOGNIZED: '${raw}' — type 'help' for commands`, true);
    }
    terminalBody.scrollTop = terminalBody.scrollHeight;
  });
}

/* --- CHAT WIDGET TOGGLE ---
   NOTE: All chat widget logic (toggle, send, DOM refs) lives in chat.js
   to avoid duplicate const declarations colliding across script files. */

/* --- MOBILE HAMBURGER NAV --- */
const navHamburger = document.querySelector('.nav-hamburger');
const navLinksMobile = document.querySelector('.nav-links');

if (navHamburger && navLinksMobile) {
  navHamburger.addEventListener('click', () => {
    const isOpen = navHamburger.classList.toggle('open');
    navLinksMobile.classList.toggle('open');
    navHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close menu when a link is clicked
  navLinksMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navHamburger.classList.remove('open');
      navLinksMobile.classList.remove('open');
      navHamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --- PAGE TRANSITION WIPE --- */
const pageTransition = document.getElementById('page-transition');
const prefersReducedMotionNav = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (pageTransition) {
  // Reveal immediately on load — no artificial delay
  requestAnimationFrame(() => pageTransition.classList.add('revealed'));

  // Intercept internal navigation links for an exit flash
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    const isInternalPage = /\.html($|#)/.test(href);
    const opensNewTab = link.target === '_blank';
    const isAnchorOnly = href.startsWith('#');

    if (isInternalPage && !opensNewTab && !isAnchorOnly) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (prefersReducedMotionNav) {
          window.location.href = href;
          return;
        }
        pageTransition.classList.remove('revealed');
        pageTransition.classList.add('flash');
        setTimeout(() => {
          window.location.href = href;
        }, 120);
      });
    }
  });
}

/* --- CARD TILT (3.8) --- */
(function() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;

  const TILT_MAX = 4; // degrees
  document.querySelectorAll(
    '.stat-item, .skill-node, .principle-card, .chapter-card, .book-card, .app-card, .cert-card, .value-card'
  ).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left)  / r.width  - 0.5;
      const y = (e.clientY - r.top)   / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * TILT_MAX}deg) rotateY(${x * TILT_MAX}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'background 0.3s, border-color 0.3s, transform 0.35s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 360);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'background 0.3s, border-color 0.3s, transform 0.1s ease';
    });
  });
})();

/* --- RADAR CHART REVEAL --- */
const radarDataGroup = document.getElementById('radar-data-group');

if (radarDataGroup) {
  const radarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        radarDataGroup.classList.add('active');
        radarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  radarObserver.observe(radarDataGroup);
}

/* --- PULSING FAVICON (3.4) — synced to 3s breathing cycle --- */
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (!faviconLink || prefersReduced) return;

  const SIZE = 64;
  const PERIOD = 3000; // ms — matches nav logo pulse
  const fc = document.createElement('canvas');
  fc.width = fc.height = SIZE;
  const cx = fc.getContext('2d');

  function drawFavicon(pulse) {
    cx.clearRect(0, 0, SIZE, SIZE);

    // Outer circle
    cx.beginPath();
    cx.arc(32, 32, 30, 0, Math.PI * 2);
    cx.fillStyle = '#020508';
    cx.fill();
    cx.strokeStyle = `rgba(0,170,255,${0.55 + pulse * 0.45})`;
    cx.lineWidth = 2.5;
    cx.stroke();

    // Inner ring
    cx.beginPath();
    cx.arc(32, 32, 22, 0, Math.PI * 2);
    cx.strokeStyle = `rgba(0,170,255,${0.28 + pulse * 0.28})`;
    cx.lineWidth = 1.5;
    cx.stroke();

    // Tick marks
    cx.strokeStyle = `rgba(0,170,255,${0.4 + pulse * 0.3})`;
    cx.lineWidth = 1.5;
    [[32,6,32,14],[32,50,32,58],[6,32,14,32],[50,32,58,32]].forEach(([x1,y1,x2,y2]) => {
      cx.beginPath(); cx.moveTo(x1,y1); cx.lineTo(x2,y2); cx.stroke();
    });

    // Core glow
    const grad = cx.createRadialGradient(32,32,0,32,32,11);
    grad.addColorStop(0,   '#ffffff');
    grad.addColorStop(0.4, `rgba(0,238,255,${0.7 + pulse * 0.3})`);
    grad.addColorStop(1,   `rgba(0,170,255,${0.5 + pulse * 0.4})`);
    cx.beginPath();
    cx.arc(32, 32, 11, 0, Math.PI * 2);
    cx.fillStyle = grad;
    cx.fill();

    // Center dot
    cx.beginPath();
    cx.arc(32, 32, 4, 0, Math.PI * 2);
    cx.fillStyle = '#ffffff';
    cx.fill();

    faviconLink.href = fc.toDataURL('image/png');
  }

  let t0 = null;
  function tick(ts) {
    if (!t0) t0 = ts;
    const pulse = (Math.sin(((ts - t0) / PERIOD) * Math.PI * 2) + 1) / 2;
    drawFavicon(pulse);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})()

/* ============================================================
   PHASE 6 — COMMAND PALETTE (6.1)
   Ctrl+K / Cmd+K triggers a HUD-styled page/action search box
   ============================================================ */
(function () {
  const COMMANDS = [
    { type: 'PAGE',   label: 'Home',           href: 'index.html' },
    { type: 'PAGE',   label: 'About',          href: 'about.html' },
    { type: 'PAGE',   label: 'Experience',     href: 'experience.html' },
    { type: 'PAGE',   label: 'Works',          href: 'works.html' },
    { type: 'PAGE',   label: 'Ethics',         href: 'ethics.html' },
    { type: 'PAGE',   label: 'Contact',        href: 'contact.html' },
    { type: 'LIB',    label: 'Manifesto',      href: 'manifesto.html' },
    { type: 'LIB',    label: 'Build Log',      href: 'buildlog.html' },
    { type: 'LIB',    label: 'Lexicon',        href: 'lexicon.html' },
    { type: 'LIB',    label: 'Origin',         href: 'origin.html' },
    { type: 'LIB',    label: 'Doctrine',       href: 'doctrine.html' },
    { type: 'LIB',    label: 'Reading',        href: 'reading.html' },
    { type: 'ACTION', label: 'Open Terminal',  action: 'terminal',  icon: '⌘' },
    { type: 'ACTION', label: 'Toggle Audio',   action: 'audio',     icon: '♪' },
    { type: 'ACTION', label: 'Download Dossier', action: 'dossier', icon: '↓' },
  ];

  /* Inject palette HTML */
  const pal = document.createElement('div');
  pal.id = 'cmd-palette';
  pal.setAttribute('role', 'dialog');
  pal.setAttribute('aria-modal', 'true');
  pal.setAttribute('aria-label', 'Command palette');
  pal.innerHTML = `
    <div class="cmd-window">
      <div class="cmd-header">
        <span class="cmd-prompt">⌘</span>
        <input type="text" id="cmd-input" placeholder="Search pages or commands..." autocomplete="off" spellcheck="false" aria-label="Command search" />
        <span class="cmd-hint">ESC to close</span>
      </div>
      <div class="cmd-results" id="cmd-results"></div>
      <div class="cmd-footer">
        <span class="cmd-footer-key">↑↓ navigate</span>
        <span class="cmd-footer-key">↵ select</span>
        <span class="cmd-footer-key">esc close</span>
      </div>
    </div>`;
  document.body.appendChild(pal);

  const cmdInput   = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');
  let filtered = [], selIdx = 0;

  function navTo(href) {
    if (pageTransition && !prefersReducedMotionNav) {
      pageTransition.classList.remove('revealed');
      pageTransition.classList.add('flash');
      setTimeout(() => { window.location.href = href; }, 120);
    } else {
      window.location.href = href;
    }
  }

  function execute(cmd) {
    closePal();
    if (cmd.href) { navTo(cmd.href); }
    else if (cmd.action === 'terminal') { openTerminal(); }
    else if (cmd.action === 'audio')    { document.getElementById('sound-toggle')?.click(); }
    else if (cmd.action === 'dossier')  {
      const a = document.createElement('a');
      a.href = 'assets/operator_dossier.pdf';
      a.download = 'operator_dossier.pdf';
      a.click();
    }
  }

  function renderResults(q) {
    const query = q.toLowerCase().trim();
    filtered = query
      ? COMMANDS.filter(c => c.label.toLowerCase().includes(query) || c.type.toLowerCase().includes(query))
      : COMMANDS;
    selIdx = 0;
    cmdResults.innerHTML = filtered.map((c, i) => `
      <div class="cmd-item${i === 0 ? ' cmd-selected' : ''}" data-idx="${i}">
        <span class="cmd-item-type">${c.type}</span>
        <span class="cmd-item-label">${c.label}</span>
        <span class="cmd-item-icon">${c.icon || '↗'}</span>
      </div>`).join('');
    cmdResults.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => execute(filtered[+el.dataset.idx]));
      el.addEventListener('mouseenter', () => {
        cmdResults.querySelectorAll('.cmd-item').forEach(i => i.classList.remove('cmd-selected'));
        el.classList.add('cmd-selected');
        selIdx = +el.dataset.idx;
      });
    });
  }

  function openPal() {
    pal.classList.add('open');
    renderResults('');
    setTimeout(() => cmdInput?.focus(), 40);
    if (typeof window.unlockAchievement === 'function') window.unlockAchievement('cmd-palette');
  }

  function closePal() {
    pal.classList.remove('open');
    if (cmdInput) cmdInput.value = '';
  }

  cmdInput?.addEventListener('input', e => renderResults(e.target.value));
  cmdInput?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selIdx = Math.min(selIdx + 1, filtered.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selIdx = Math.max(selIdx - 1, 0); }
    else if (e.key === 'Enter') { filtered[selIdx] && execute(filtered[selIdx]); return; }
    else if (e.key === 'Escape') { closePal(); return; }
    cmdResults.querySelectorAll('.cmd-item').forEach((el, i) => el.classList.toggle('cmd-selected', i === selIdx));
    cmdResults.querySelector('.cmd-selected')?.scrollIntoView({ block: 'nearest' });
  });

  pal.addEventListener('click', e => { if (e.target === pal) closePal(); });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      pal.classList.contains('open') ? closePal() : openPal();
    }
  });

  window.openCmdPalette = openPal;
})();

/* ============================================================
   CUSTOM CONTEXT MENU (6.2)
   ============================================================ */
(function () {
  const menu = document.createElement('div');
  menu.id = 'ctx-menu';
  menu.setAttribute('role', 'menu');
  menu.innerHTML = `
    <div class="ctx-header">// AGN // CONTEXT MENU</div>
    <div class="ctx-item" id="ctx-copy"  role="menuitem"><span class="ctx-icon">⎘</span>COPY PAGE LINK</div>
    <div class="ctx-item" id="ctx-dos"   role="menuitem"><span class="ctx-icon">↓</span>DOWNLOAD DOSSIER</div>
    <div class="ctx-divider"></div>
    <div class="ctx-item" id="ctx-term"  role="menuitem"><span class="ctx-icon">⌘</span>OPEN TERMINAL</div>
    <div class="ctx-item" id="ctx-audio" role="menuitem"><span class="ctx-icon">♪</span>TOGGLE AUDIO</div>
    <div class="ctx-item" id="ctx-pal"   role="menuitem"><span class="ctx-icon">⌥</span>COMMAND PALETTE</div>`;
  document.body.appendChild(menu);

  const close = () => menu.classList.remove('open');

  document.addEventListener('contextmenu', e => {
    e.preventDefault();
    menu.style.left = Math.min(e.clientX, window.innerWidth  - 216) + 'px';
    menu.style.top  = Math.min(e.clientY, window.innerHeight - 200) + 'px';
    menu.classList.add('open');
  });

  document.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  document.getElementById('ctx-copy')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    close();
  });
  document.getElementById('ctx-dos')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = 'assets/operator_dossier.pdf';
    a.download = 'operator_dossier.pdf';
    a.click();
    close();
  });
  document.getElementById('ctx-term')?.addEventListener('click',  () => { openTerminal(); close(); });
  document.getElementById('ctx-audio')?.addEventListener('click', () => { document.getElementById('sound-toggle')?.click(); close(); });
  document.getElementById('ctx-pal')?.addEventListener('click',   () => { window.openCmdPalette?.(); close(); });
})();

/* ============================================================
   ACHIEVEMENT SYSTEM (6.3)
   localStorage-based — quiet, never interrupts normal browsing
   ============================================================ */
(function () {
  const ACH = {
    'terminal':    { icon: '⌘', name: 'TERMINAL OPERATOR' },
    'audio-on':    { icon: '♪', name: 'AUDIO ENABLED'     },
    'cmd-palette': { icon: '⌥', name: 'COMMAND INTERFACE' },
    'all-pages':   { icon: '◉', name: 'FULL SWEEP'        },
    'library':     { icon: '▣', name: 'LIBRARIAN'         },
  };

  const CORE_PAGES    = ['index.html','about.html','experience.html','works.html','ethics.html','contact.html'];
  const LIBRARY_PAGES = ['manifesto.html','buildlog.html','lexicon.html','origin.html','doctrine.html','reading.html'];
  const KEY           = 'agn-ach';
  const VISITED_KEY   = 'agn-visited';

  function getUnlocked() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  function getVisited()  { try { return JSON.parse(localStorage.getItem(VISITED_KEY)) || []; } catch { return []; } }

  const container = document.createElement('div');
  container.id = 'achievement-container';
  document.body.appendChild(container);

  window.unlockAchievement = function (key) {
    const u = getUnlocked();
    if (u[key] || !ACH[key]) return;
    u[key] = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(u)); } catch {}
    const a = ACH[key];
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `<div class="ach-icon">${a.icon}</div><div><div class="ach-label">// ACHIEVEMENT UNLOCKED</div><div class="ach-name">${a.name}</div></div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4300);
  };

  /* Track page visits */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  (function trackVisit() {
    const visited = getVisited();
    if (!visited.includes(currentPage)) {
      visited.push(currentPage);
      try { localStorage.setItem(VISITED_KEY, JSON.stringify(visited)); } catch {}
    }
    if (CORE_PAGES.every(p => visited.includes(p)))    window.unlockAchievement('all-pages');
    if (LIBRARY_PAGES.every(p => visited.includes(p))) window.unlockAchievement('library');
  })();

  /* Terminal achievement via MutationObserver */
  const termOverlay = document.getElementById('terminal-overlay');
  if (termOverlay) {
    new MutationObserver(muts => {
      muts.forEach(m => { if (m.target.classList.contains('open')) window.unlockAchievement('terminal'); });
    }).observe(termOverlay, { attributes: true, attributeFilter: ['class'] });
  }

  /* Audio achievement */
  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      setTimeout(() => {
        if (soundBtn.classList.contains('sound-on')) window.unlockAchievement('audio-on');
      }, 120);
    });
  }
})();

/* ============================================================
   CURSOR HOVER — DYNAMIC ELEMENTS (Phase 6 additions)
   ============================================================ */
document.addEventListener('mouseover', e => {
  if (!cursorRing) return;
  if (e.target.closest('.cmd-item, .ctx-item, .quote-share-btn')) {
    cursorRing.style.width  = '64px';
    cursorRing.style.height = '64px';
    cursorRing.style.borderColor = 'var(--cyan)';
    cursorRing.style.boxShadow   = '0 0 16px rgba(0,238,255,0.5), inset 0 0 16px rgba(0,238,255,0.1)';
  }
});
document.addEventListener('mouseout', e => {
  if (!cursorRing) return;
  if (e.target.closest('.cmd-item, .ctx-item, .quote-share-btn')) {
    cursorRing.style.width  = '40px';
    cursorRing.style.height = '40px';
    cursorRing.style.borderColor = 'var(--blue)';
    cursorRing.style.boxShadow   = '0 0 8px rgba(0,170,255,0.4), inset 0 0 8px rgba(0,170,255,0.1)';
  }
});