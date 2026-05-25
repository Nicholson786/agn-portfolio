/* ============================================================
   AGN PORTFOLIO — MAIN JS
   Arc Reactor Edition
   Custom cursor | Scroll reveal | Stat counters | Terminal
   ============================================================ */

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

  uptime: () => '17 YEARS // 0 DAYS DOWNTIME',

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

/* --- CHAT WIDGET TOGGLE --- */
const chatToggle  = document.getElementById('chat-toggle');
const chatWindow  = document.getElementById('chat-window');
const chatInput   = document.getElementById('chat-input');

if (chatToggle && chatWindow) {
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatInput) {
      chatInput.focus();
    }
  });
}