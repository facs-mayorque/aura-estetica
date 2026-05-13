// ══════════════════════════════════════════════
//  AURA — Centro de Estética Premium
//  script.js
// ══════════════════════════════════════════════

// ── Mobile Menu ──────────────────────────────
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileBackdrop = document.getElementById('mobileBackdrop');
const mobileLinks   = document.querySelectorAll('.mobile-link, .mobile-cta-btn');

let menuOpen = false;

function setMenu(open) {
  menuOpen = open;
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  mobileBackdrop.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => setMenu(!menuOpen));
mobileBackdrop.addEventListener('click', () => setMenu(false));
mobileLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });


// ── Navbar scroll glass effect ────────────────
const navbar = document.getElementById('navbar');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();


// ── Scroll Reveal (IntersectionObserver) ─────
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -48px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero elements on load (already in viewport)
requestAnimationFrame(() => {
  setTimeout(() => {
    document.querySelectorAll('.hero [data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
  }, 80);
});


// ── Animated Counters ─────────────────────────
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1900;
  const start    = performance.now();

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutQuart(progress) * target);

    // Locale formatting for large numbers
    el.textContent = value >= 1000
      ? value.toLocaleString('es-AR')
      : value.toString();

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  let counted = false;
  const statsObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      statsSection.querySelectorAll('.stat-num').forEach(animateCounter);
    }
  }, { threshold: 0.35 });
  statsObserver.observe(statsSection);
}


// ── Form submission feedback ──────────────────
const bookingForm = document.getElementById('bookingForm');
const formBtn     = document.getElementById('formBtn');

if (bookingForm && formBtn) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre   = document.getElementById('nombre')?.value  || '';
    const servicio = document.getElementById('servicio')?.value || '';
    const mensaje  = document.getElementById('mensaje')?.value  || '';

    const lines = ['Hola! Me llegó desde la web de Aura Estética.'];
    if (nombre)   lines.push(`Nombre: ${nombre}`);
    if (servicio) lines.push(`Servicio: ${servicio}`);
    if (mensaje)  lines.push(`Consulta: ${mensaje}`);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/5491159355881?text=${text}`, '_blank');

    // Visual success feedback
    formBtn.classList.add('success');
    formBtn.innerHTML = `
      Abriendo WhatsApp…
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
    formBtn.style.pointerEvents = 'none';

    setTimeout(() => {
      formBtn.classList.remove('success');
      formBtn.innerHTML = `
        Solicitar turno
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      `;
      formBtn.style.pointerEvents = '';
      bookingForm.reset();
    }, 3500);
  });
}


// ── Smooth anchor scroll (with nav offset) ────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
