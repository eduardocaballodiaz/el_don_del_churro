document.querySelector('#year').textContent = new Date().getFullYear();
const links = [...document.querySelectorAll('nav a')];
const mobileBar = document.querySelector('.mobile-bar');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        for (const link of links) {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        }
      }
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('#carta, #latas, #contacto').forEach(section => observer.observe(section));
  new IntersectionObserver(([entry]) => {
    mobileBar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    if (entry.isIntersecting) links.forEach(link => link.removeAttribute('aria-current'));
  }).observe(document.querySelector('.hero'));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const packagingSection = document.querySelector('.packaging-section');
const packagingStage = packagingSection?.querySelector('.packaging-stage');
let lastPackagingFrame = '';

// The two objects follow the page position, so scrolling back retraces their path.
// Text and links stay outside these transformed visual layers.
function updatePackaging(force = false) {
  if (!packagingSection || !packagingStage) return;
  const box = packagingSection.getBoundingClientRect();
  if (!force && (box.bottom < -innerHeight * 0.5 || box.top > innerHeight * 1.5)) return;

  const progress = reducedMotion.matches ? 0.65
    : Math.max(0, Math.min(1, (innerHeight - box.top) / (innerHeight + box.height)));
  const amplitude = Math.max(0.28, Math.min(1, packagingStage.clientWidth / 1000));
  const frame = `${progress.toFixed(4)}:${amplitude.toFixed(4)}`;
  if (frame === lastPackagingFrame) return;
  lastPackagingFrame = frame;

  const firstLeg = progress <= 0.65;
  const fraction = firstLeg ? progress / 0.65 : (progress - 0.65) / 0.35;
  const eased = fraction * fraction * (3 - 2 * fraction);
  const from = firstLeg ? [-50, 12, -10, 55, -12, 12] : [-8, -2, -3, 10, 1, 4];
  const to = firstLeg ? [-8, -2, -3, 10, 1, 4] : [-18, -7, -6, 22, 8, 7];
  const names = ['sleeve-x', 'sleeve-y', 'sleeve-rotate', 'cup-x', 'cup-y', 'cup-rotate'];
  names.forEach((name, index) => {
    const rotation = index === 2 || index === 5;
    const value = (from[index] + (to[index] - from[index]) * eased) * (rotation ? 1 : amplitude);
    packagingStage.style.setProperty(`--${name}`, `${value.toFixed(2)}${rotation ? 'deg' : 'px'}`);
  });
  packagingStage.style.setProperty('--pack-progress', progress.toFixed(4));
  packagingStage.style.setProperty('--pack-orbit-angle', `${(-24 + progress * 48).toFixed(2)}deg`);
  packagingStage.dataset.packProgress = progress.toFixed(3);
}

// Reversible reveals: entering from below reveals; moving back up retracts them.
// Keep focused content visible, and keep every section readable without motion.
const reveals = [...document.querySelectorAll('.section-heading, .type-heading, .type-options, .menu-card, .tin-visual, .tin-copy, .moments-heading, .moment-photo, .moment-story, .visit-copy, .real-map, .contact-copy, .contact-panel, .faq-section > div, .closing-cta .section-wrap')];
let lastRevealY = scrollY;
function updateRevealStates(initial = false) {
  const movingUp = scrollY < lastRevealY;
  for (const element of reveals) {
    if (reducedMotion.matches || element.contains(document.activeElement)) {
      element.classList.add('is-revealed');
      continue;
    }
    const box = element.getBoundingClientRect();
    // Hysteresis prevents flickering at the boundary during a reversal.
    if (initial) element.classList.toggle('is-revealed', box.top < innerHeight * 0.86);
    else if (movingUp && box.top > innerHeight * 0.72) element.classList.remove('is-revealed');
    else if (box.top < innerHeight * 0.86 && box.bottom > 0) element.classList.add('is-revealed');
  }
  lastRevealY = scrollY;
}
function configureMotion() {
  document.body.classList.toggle('motion-enabled', !reducedMotion.matches);
  reveals.forEach(element => element.classList.add('reveal'));
  document.querySelectorAll('.menu-card').forEach((card, index) => card.style.setProperty('--reveal-delay', `${index * 110}ms`));
  updateRevealStates(true);
  updatePackaging(true);
}
configureMotion();
reducedMotion.addEventListener('change', configureMotion);
document.addEventListener('focusin', event => {
  for (const element of reveals) {
    if (element.contains(event.target)) element.classList.add('is-revealed');
  }
});
let scrollQueued = false;
const hero = document.querySelector('.hero');
function updateScrollEffects() {
  const available = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--scroll-progress', available > 0 ? Math.min(1, scrollY / available) : 0);
  const heroBox = hero.getBoundingClientRect();
  const shift = !reducedMotion.matches && heroBox.bottom > 0 ? Math.max(-24, Math.min(24, -heroBox.top * 0.045)) : 0;
  hero.style.setProperty('--hero-shift', `${shift}px`);
  updateRevealStates();
  updatePackaging();
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScrollEffects); }
}, { passive: true });
updateScrollEffects();

window.addEventListener('resize', () => {
  updatePackaging(true);
  updateScrollEffects();
});
document.fonts?.ready.then(() => updateRevealStates(true));

// Contact only: native POST forwards the query; it never creates an account.
const contactForm = document.querySelector('.contact-form');
const contactFields = [
  { input: document.querySelector('#contact-name'), min: 2, error: 'Escribe tu nombre para que sepamos cómo llamarte.' },
  { input: document.querySelector('#contact-subject'), min: 3, error: 'Escribe un asunto de al menos tres caracteres.' },
  { input: document.querySelector('#contact-message'), min: 10, error: 'Cuéntanos un poco más: escribe al menos diez caracteres.' }
];
contactFields.forEach(({ input }) => input.addEventListener('input', () => input.setCustomValidity('')));
contactForm.addEventListener('submit', event => {
  let firstInvalid;
  for (const field of contactFields) {
    field.input.value = field.input.value.trim();
    if (field.input.value.length < field.min) {
      field.input.setCustomValidity(field.error);
      firstInvalid ??= field.input;
    }
  }
  if (firstInvalid) {
    event.preventDefault();
    firstInvalid.reportValidity();
  }
  if (contactForm.elements._honey.value) {
    event.preventDefault();
    const error = contactForm.querySelector('.form-error');
    error.textContent = 'No hemos podido enviar el mensaje. Escríbenos a eldondelchurro@gmail.com.';
    error.hidden = false;
  }
});
document.querySelector('.form-consent a').addEventListener('click', event => {
  event.preventDefault();
  const privacy = document.querySelector('#contacto-privacidad');
  if (!privacy.open) privacy.querySelector('summary').click();
  privacy.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
});
