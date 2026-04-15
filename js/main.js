gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================
   LOADER
   ============================================ */
gsap.set('.loader__text', { opacity: 0 });

const loaderTl = gsap.timeline({ onComplete: initPage });
loaderTl
  .to('.loader__line', { width: 200, duration: 0.8, ease: 'power2.inOut' })
  .to('.loader__text', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
  .to('#loader', { yPercent: -100, duration: 0.9, ease: 'power3.inOut', delay: 0.3 });

function initPage() {
  document.getElementById('loader').style.pointerEvents = 'none';

  // Hero entrance
  const heroTl = gsap.timeline();
  heroTl
    .from('.hero__tag',  { opacity: 0, y: -10, duration: 0.5, ease: 'power2.out' })
    .from('.hero__title span', { y: '110%', duration: 0.9, stagger: 0.15, ease: 'power3.out' }, '-=0.2')
    .from('.hero__desc',  { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .from('.hero__btns',  { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('#heroGeo',     { opacity: 0, x: 40, duration: 1.0, ease: 'power2.out' }, '-=0.8');

  // Geo element animation (floating)
  gsap.to('.geo-circle', {
    attr: { r: 34 }, duration: 3, ease: 'sine.inOut', repeat: -1, yoyo: true
  });
  gsap.to('.geo-rect', {
    rotation: 15, transformOrigin: 'center', duration: 6,
    ease: 'sine.inOut', repeat: -1, yoyo: true
  });

  initScroll();
}

/* ============================================
   MOBILE MENU
   ============================================ */
const menuBtn  = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn?.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.classList.remove('active');
  navLinks.classList.remove('active');
}));

/* ============================================
   TICKER
   ============================================ */
const track = document.getElementById('tickerTrack');
if (track) {
  const w = track.scrollWidth / 2;
  gsap.to(track, {
    x: -w, duration: 30, ease: 'none', repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % w) }
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScroll() {

  // Services head
  gsap.from('.services__head > *', {
    opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.services__head', start: 'top 82%' }
  });

  // Service rows — stagger in
  gsap.utils.toArray('.svc-row').forEach((row, i) => {
    gsap.from(row, {
      opacity: 0, x: -24, duration: 0.7, ease: 'power2.out',
      delay: i * 0.06,
      scrollTrigger: { trigger: row, start: 'top 88%' }
    });
  });

  // Concept
  gsap.from('.concept__title', {
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.concept__title', start: 'top 80%' }
  });
  gsap.from('.concept__body', {
    opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.concept__right', start: 'top 78%' }
  });

  // Counter
  document.querySelectorAll('.cstat__num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo({ v: 0 }, { v: target }, {
        duration: 1.6, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
      })
    });
  });

  // About
  gsap.from('.about__left > *', {
    opacity: 0, x: -30, duration: 0.8, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__inner', start: 'top 78%' }
  });
  gsap.from('.aval', {
    opacity: 0, x: 30, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__values', start: 'top 80%' }
  });

  // Contact
  gsap.from('.contact__title', {
    opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 82%' }
  });
  gsap.from('.contact-card', {
    opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact__cards', start: 'top 82%' }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      gsap.to(window, { duration: 1.1, scrollTo: { y: target, offsetY: 64 }, ease: 'power3.inOut' });
    }
  });
});
