/* ============================================================
   AGN PORTFOLIO — BOOT SEQUENCE
   ============================================================ */

const bootLines = [
  '> INITIALIZING PROFILE: ADAM GLENN NICHOLSON',
  '> LOADING 17 YEARS OPERATIONAL DATA...',
  '> CROSS-REFERENCING: DAL-TILE // VALLOUREC // USM // OU // EDGEWOOD',
  '> PUBLISHED WORKS DETECTED: 2',
  '> DEPLOYED APPLICATIONS: 1 LIVE // 2 ALPHA',
  '> LSS BLACK BELT: CONFIRMED',
  '> PMP: IN PREPARATION',
  '> DBA RESEARCH: ACTIVE',
  '> IISE MEMBER: CONFIRMED',
  '> PMI MEMBER: CONFIRMED',
  '> PAST MASTER: CONFIRMED',
  '> CODE OF ETHICS: ADOPTED // ACTIVE',
  '> ALL SYSTEMS NOMINAL.',
  '> WELCOME.',
];

const bootScreen  = document.getElementById('boot-screen');
const bootTextEl  = document.getElementById('boot-text');
const mainContent = document.getElementById('main-content');

if (bootScreen && bootTextEl && mainContent) {

  if (sessionStorage.getItem('agn-booted')) {
    bootScreen.style.display = 'none';
    mainContent.style.opacity = '1';
  } else {

    // Style boot screen — sits BELOW the nav (64px)
    Object.assign(bootScreen.style, {
      position: 'fixed',
      top: '64px',
      left: '0',
      right: '0',
      bottom: '0',
      background: 'var(--dark)',
      zIndex: '8999',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '8vw 10vw',
      fontFamily: 'var(--font-mono)',
      fontSize: 'clamp(11px, 1.4vw, 15px)',
      color: 'var(--blue)',
      lineHeight: '2.2',
      letterSpacing: '1px',
      whiteSpace: 'pre-wrap',
    });

    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';

    function typeLine() {
      if (lineIndex >= bootLines.length) {
        sessionStorage.setItem('agn-booted', '1');
        setTimeout(() => {
          bootScreen.style.transition = 'opacity 0.6s ease';
          bootScreen.style.opacity = '0';
          setTimeout(() => {
            bootScreen.style.display = 'none';
            mainContent.style.transition = 'opacity 0.8s ease';
            mainContent.style.opacity = '1';
          }, 600);
        }, 400);
        return;
      }

      const line = bootLines[lineIndex];

      if (charIndex < line.length) {
        currentText += line[charIndex];
        charIndex++;
        bootTextEl.innerHTML = currentText.replace(/\n/g, '<br>') + '<span style="opacity:1">_</span>';
        setTimeout(typeLine, 18);
      } else {
        currentText += '\n';
        bootTextEl.innerHTML = currentText.replace(/\n/g, '<br>') + '<span style="opacity:1">_</span>';
        lineIndex++;
        charIndex = 0;
        const pause = lineIndex >= bootLines.length - 2 ? 400 : 60;
        setTimeout(typeLine, pause);
      }
    }

    typeLine();
  }
}