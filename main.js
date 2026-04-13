// Fade-up on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach((el, i) => {
  el.dataset.delay = (i % 5) * 90;
  observer.observe(el);
});

// Nav shadow on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Carousel
let carouselIndex = 0;

function moveCarousel(dir) {
  const track = document.getElementById('carouselTrack');
  const cards = track.querySelectorAll('.carousel-card');
  const isMobile = window.innerWidth <= 960;
  const visible  = isMobile ? 1 : 3;
  const max      = cards.length - visible;

  carouselIndex = Math.max(0, Math.min(carouselIndex + dir, max));

  const gap  = isMobile ? 0 : 24; // gap en px (0 en mobile, 1.5rem en desktop)
  const step = cards[0].offsetWidth + gap;

  track.style.transform = `translateX(-${carouselIndex * step}px)`;
}

// Resetea el carousel al rotar/redimensionar
window.addEventListener('resize', () => {
  carouselIndex = 0;
  const track = document.getElementById('carouselTrack');
  if (track) track.style.transform = 'translateX(0)';
});

// Counter animation para los badges del hero
function animateCounter(el, target, suffix = '') {
  if (!el) return;
  let start = 0;
  const duration = 1500;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const badgesEl = document.querySelector('.hero-badges');
if (badgesEl) {
  const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(document.querySelector('.hero-badge:nth-child(1) .hero-badge-num'), 365);
        animateCounter(document.querySelector('.hero-badge:nth-child(2) .hero-badge-num'), 5, '+');
        badgeObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  badgeObserver.observe(badgesEl);
}

// Contact form submit (Formspree)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const data = new FormData(this);

    try {
      await fetch(this.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      btn.textContent = 'Mensaje enviado ✓';
      btn.style.background = '#1a6e3a';
      btn.disabled = true;
      this.reset();
      setTimeout(() => {
        btn.textContent = 'Enviar mensaje →';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    } catch {
      btn.textContent = 'Error al enviar. Intente de nuevo.';
      setTimeout(() => { btn.textContent = 'Enviar mensaje →'; }, 3000);
    }
  });
}

// ── HAMBURGER MENU ──
// Añadir al final de main.js

const hamburger = document.getElementById('navHamburger');
const drawer    = document.getElementById('navDrawer');
const overlay   = document.getElementById('navOverlay');

function openMenu() {
  hamburger.classList.add('open');
  drawer.classList.add('open');
  overlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // evita scroll de fondo
}

function closeMenu() {
  hamburger.classList.remove('open');
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeMenu() : openMenu();
});

// Cerrar al tocar el overlay
overlay.addEventListener('click', closeMenu);

// Cerrar al tocar cualquier link del drawer
document.querySelectorAll('.drawer-links a, .drawer-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.setAttribute('playsinline', '');
  heroVideo.load();
  heroVideo.play().catch(() => {});
}