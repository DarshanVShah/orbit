const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const hero = document.querySelector('.hero');
const mediaOverlay = document.querySelector('.media-overlay');
const canvas = document.getElementById('orbitCanvas');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const setScrollAccent = () => {
  const rect = hero.getBoundingClientRect();
  const progress = clamp(1 - rect.top / window.innerHeight, 0, 1);
  const opacity = (0.08 + progress * 0.12).toFixed(3);
  root.style.setProperty('--accent', `rgba(10, 132, 255, ${opacity})`);
};

const handleScroll = () => {
  setScrollAccent();
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const { width, height } = canvas;
  const intensity = clamp(window.scrollY / window.innerHeight, 0, 1);
  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `rgba(10, 132, 255, ${0.16 + intensity * 0.3})`);
  gradient.addColorStop(1, 'rgba(10, 132, 255, 0)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = `rgba(255,255,255,${0.1 + intensity * 0.3})`;
  context.lineWidth = 1;
  context.beginPath();
  context.arc(width / 2, height / 2, width * 0.25 + intensity * 16, 0, Math.PI * 2);
  context.stroke();
};

const resizeCanvas = () => {
  if (!canvas) return;

  const parent = canvas.parentElement;
  if (!parent) return;

  const { width, height } = parent.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext('2d');
  if (context) {
    context.scale(pixelRatio, pixelRatio);
  }

  handleScroll();
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

  mediaOverlay.textContent = 'Thanks for joining the waitlist';
  mediaOverlay.classList.add('media-overlay--success');

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

const init = () => {
  setDynamicYear();
  resizeCanvas();
  setScrollAccent();

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', toggleNavigation);
    navLinks.addEventListener('click', closeNavigationOnLink);
  }

  const preorderForm = document.querySelector('.cta-form');
  if (preorderForm) {
    preorderForm.addEventListener('submit', handleFormSubmit);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('scroll', handleScroll);
};

document.addEventListener('DOMContentLoaded', init);

