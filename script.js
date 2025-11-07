const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const hero = document.querySelector('.hero');
const mediaBadge = document.querySelector('.media-badge');
const ctaConfirmation = document.querySelector('.cta-confirmation');
const arButton = document.querySelector('.ar-button');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const setScrollAccent = () => {
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

const configureARBadge = () => {
  if (!mediaBadge || !arButton) return;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    mediaBadge.textContent = 'Tap View in AR on iPhone or iPad';
  } else {
    mediaBadge.textContent = 'Download the USDZ file to preview on Apple devices';
    arButton.setAttribute('download', 'Orbit.usdz');
  }
};

const init = () => {
  setDynamicYear();
  setScrollAccent();
  configureARBadge();

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

