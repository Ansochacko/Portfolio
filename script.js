/* ==========================================================================
   ANSO THATTIASSERIL CHACKO — SCI-FI / HUD TERMINAL JAVASCRIPT
   Vanilla JS for Terminal Typewriter, Crosshair Cursor, and Telemetry Toggle
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriterEffect();
  initCrosshairCursor();
  initTelemetryToggle();
  initNavbarAndMobileMenu();
  initScrollGlitchObserver();
});

/* --------------------------------------------------------------------------
   01. TERMINAL TYPEWRITER EFFECT
   -------------------------------------------------------------------------- */
function initTypewriterEffect() {
  const headlineEl = document.getElementById('typewriter-headline');
  if (!headlineEl) return;

  const fullText = `"Building an AI that doesn't just answer questions — it can listen, see, remember, reason and understand the devices around it."`;
  let index = 0;

  function typeChar() {
    if (index < fullText.length) {
      headlineEl.textContent += fullText.charAt(index);
      index++;
      const speed = Math.floor(Math.random() * 20) + 25; // 25-45ms random variance
      setTimeout(typeChar, speed);
    }
  }

  // Initial delay before terminal boot typing starts
  setTimeout(typeChar, 400);
}

/* --------------------------------------------------------------------------
   02. CUSTOM REACTIVE CROSSHAIR RETICLE CURSOR
   -------------------------------------------------------------------------- */
function initCrosshairCursor() {
  const cursor = document.getElementById('cursor-crosshair');
  if (!cursor) return;

  // Disable on touch devices
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 992) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderCursor() {
    // Smooth trailing lag easing
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Target hover locks
  const targets = document.querySelectorAll(
    'a, button, input, textarea, .interactive-target, .hud-card, .btn'
  );

  targets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('reticle-locked'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('reticle-locked'));
  });
}

/* --------------------------------------------------------------------------
   03. COLLAPSIBLE TELEMETRY TOGGLE
   -------------------------------------------------------------------------- */
function initTelemetryToggle() {
  const toggleBtn = document.getElementById('atom-toggle-btn');
  const panel = document.getElementById('atom-telemetry-panel');

  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    panel.classList.toggle('open');

    const textEl = toggleBtn.querySelector('.btn-text');
    const arrowEl = toggleBtn.querySelector('.arrow-icon');

    if (textEl && arrowEl) {
      if (!isExpanded) {
        textEl.textContent = '[ COLLAPSE_TELEMETRY ]';
        arrowEl.textContent = '↑';
      } else {
        textEl.textContent = '[ EXPAND_SYSTEM_TELEMETRY ]';
        arrowEl.textContent = '↓';
      }
    }
  });
}

/* --------------------------------------------------------------------------
   04. NAVBAR & MOBILE MENU
   -------------------------------------------------------------------------- */
function initNavbarAndMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   05. INTERSECTION OBSERVER & SCROLL GLITCH EFFECT
   -------------------------------------------------------------------------- */
function initScrollGlitchObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('hud-visible');
        
        // Trigger brief static glitch flash on entry
        entry.target.style.animation = 'glitch-anim 0.3s ease';
        setTimeout(() => {
          entry.target.style.animation = '';
        }, 300);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hud-card, .hud-section').forEach((el) => {
    observer.observe(el);
  });
}
