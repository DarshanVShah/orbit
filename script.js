const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const hero = document.querySelector('.hero');
const mediaBadge = document.querySelector('.media-badge');
const ctaConfirmation = document.querySelector('.cta-confirmation');
const cursorBlob = document.querySelector('.cursor-blob');

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

const handleFormSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value.trim();

  if (!email) return;

  const hiddenMessage = form.querySelector('#preorderMessage');
  if (hiddenMessage) {
    hiddenMessage.value = `Preorder request from ${email}`;
  }

  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    if (ctaConfirmation) {
      ctaConfirmation.hidden = false;
      ctaConfirmation.textContent = 'Thanks for joining the waitlist. We will be in touch soon.';
    }

    form.reset();
  } catch (error) {
    if (ctaConfirmation) {
      ctaConfirmation.hidden = false;
      ctaConfirmation.textContent = 'We could not submit your request. Please try again in a moment.';
    }
  }
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

const updateCursorGlow = (event) => {
  const point = getEventPoint(event);
  if (!point) return;

  const x = point.clientX;
  const y = point.clientY;
  if (!cursorBlob) return;

  cursorBlob.style.transform = `translate(${x - 100}px, ${y - 100}px)`;
};

const handlePointerOut = (event) => {
  if (!event.relatedTarget && cursorBlob) {
    cursorBlob.style.transform = `translate(-200px, -200px)`;
  }
};

const init = () => {
  setDynamicYear();
  setScrollAccent();
  configureExperienceNote();

  document.addEventListener('pointermove', updateCursorGlow);
  document.addEventListener('mousemove', updateCursorGlow);
  document.addEventListener('pointerout', handlePointerOut);
  window.addEventListener('blur', () => {
    if (cursorBlob) {
      cursorBlob.style.transform = `translate(-200px, -200px)`;
    }
  });

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

