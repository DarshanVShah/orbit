const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const hero = document.querySelector('.hero');
const mediaBadge = document.querySelector('.media-badge');
const ctaConfirmation = document.querySelector('.cta-confirmation');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getEventPoint = (event) => {
  if (event.touches && event.touches.length) {
    return event.touches[0];
  }

  if (event.changedTouches && event.changedTouches.length) {
    return event.changedTouches[0];
  }

  return event;
};

const setScrollAccent = () => {
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  const progress = clamp(1 - rect.top / window.innerHeight, 0, 1);
  const opacity = (0.14 + progress * 0.18).toFixed(3);
  root.style.setProperty('--hero-glow-opacity', opacity);
};

const handleScroll = () => {
  setScrollAccent();
};

const toggleNavigation = () => {
  body.classList.toggle('nav-open');
  navLinks.classList.toggle('open');
};

const closeNavigationOnLink = (event) => {
  if (event.target.closest('a')) {
    body.classList.remove('nav-open');
    navLinks.classList.remove('open');
  }
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const email = event.target.email.value.trim();

  if (!email) return;

  if (ctaConfirmation) {
    ctaConfirmation.hidden = false;
    ctaConfirmation.textContent = 'Thanks for joining the waitlist. We will be in touch soon.';
  }

  event.target.reset();
};

const setDynamicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const target = document.getElementById('copyrightYear');
  if (target) {
    target.textContent = year;
  }
};

const configureExperienceNote = () => {
  if (!mediaBadge) return;

  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    mediaBadge.textContent = 'Tap “AR” to place Orbit in your space';
  } else if (/android/.test(ua)) {
    mediaBadge.textContent = 'Tap “AR” to view Orbit in your room';
  } else {
    mediaBadge.textContent = 'Drag to orbit. Scan on mobile for AR mode';
  }
};

const hideCursorGlow = () => {
  root.style.setProperty('--cursor-glow-opacity', '0');
};

const updateCursorGlow = (event) => {
  const point = getEventPoint(event);
  if (!point) return;

  root.style.setProperty('--cursor-glow-x', `${point.clientX}px`);
  root.style.setProperty('--cursor-glow-y', `${point.clientY}px`);
  root.style.setProperty('--cursor-glow-opacity', '1');
};

const handlePointerOut = (event) => {
  if (!event.relatedTarget) {
    hideCursorGlow();
  }
};

const init = () => {
  setDynamicYear();
  setScrollAccent();
  configureExperienceNote();

  hideCursorGlow();

  document.addEventListener('pointermove', updateCursorGlow);
  document.addEventListener('mousemove', updateCursorGlow);
  document.addEventListener('pointerleave', hideCursorGlow);
  document.addEventListener('mouseleave', hideCursorGlow);
  document.addEventListener('pointerout', handlePointerOut);
  window.addEventListener('blur', hideCursorGlow);

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', toggleNavigation);
    navLinks.addEventListener('click', closeNavigationOnLink);
  }

  const preorderForm = document.querySelector('.cta-form');
  if (preorderForm) {
    preorderForm.addEventListener('submit', handleFormSubmit);
  }

  window.addEventListener('resize', setScrollAccent);
  window.addEventListener('scroll', handleScroll);
};

document.addEventListener('DOMContentLoaded', init);

