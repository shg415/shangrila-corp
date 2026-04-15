gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================
   LOADER
   ============================================ */
const loaderCircle = document.querySelector('.loader__mark circle');
const loaderPath   = document.querySelector('.loader__mark path');
const loader       = document.getElementById('loader');

const loaderTl = gsap.timeline({
  onComplete: () => { initPage(); }
});

loaderTl
  .to(loaderCircle,   { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' })
  .to(loaderPath,     { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
  .to('.loader__name',{ opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
  .to(loader, {
    yPercent: -100, duration: 1.0, ease: 'power3.inOut', delay: 0.4
  });

// Set initial states
gsap.set('.loader__name', { opacity: 0, y: 10 });

function initPage() {
  loader.style.pointerEvents = 'none';

  // Hero entrance
  const heroTl = gsap.timeline();
  heroTl
    .from('#heroTag', { opacity: 0, y: -12, duration: 0.6, ease: 'power2.out' })
    .from('.hero__line', { y: '100%', duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.3')
    .from('#heroSub',    { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .from('#heroActions',{ opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('.hero__scroll',{ opacity: 0, duration: 0.6 }, '-=0.3');

  initScrollAnimations();
}

/* ============================================
   NAV STATE
   ============================================ */
const nav = document.getElementById('nav');
nav.classList.add('is-dark');

const sections = [
  { trigger: '.marquee',  enter: 'is-white', leave: 'is-dark' },
  { trigger: '.concept',  enter: 'is-dark',  leave: 'is-white' },
  { trigger: '.about',    enter: 'is-white', leave: 'is-dark' },
  { trigger: '.contact',  enter: 'is-white', leave: 'is-dark' },
  { trigger: '.footer',   enter: 'is-dark',  leave: 'is-white' },
];

sections.forEach(({ trigger, enter, leave }) => {
  ScrollTrigger.create({
    trigger,
    start: 'top 64px',
    onEnter:     () => { nav.classList.remove(leave);  nav.classList.add(enter); },
    onLeaveBack: () => { nav.classList.remove(enter); nav.classList.add(leave); },
  });
});

/* ============================================
   MOBILE MENU
   ============================================ */
const menuBtn  = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.classList.remove('active');
  navLinks.classList.remove('active');
}));

/* ============================================
   MARQUEE
   ============================================ */
const track = document.getElementById('marqueeTrack');
const trackW = track.scrollWidth / 2;
gsap.to(track, {
  x: -trackW, duration: 25, ease: 'none', repeat: -1,
  modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % trackW) }
});

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {

  // Hero parallax
  gsap.to('#heroBg', {
    yPercent: 18, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Services header
  gsap.from('.services__head > *', {
    opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.services__head', start: 'top 82%' }
  });

  // Service cards
  gsap.utils.toArray('.svc-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      delay: (i % 3) * 0.1,
      scrollTrigger: { trigger: card, start: 'top 88%' }
    });
  });

  // Concept section
  gsap.to('#conceptBg', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '.concept', start: 'top bottom', end: 'bottom top', scrub: true }
  });
  gsap.from('.concept__quote p', {
    opacity: 0, x: -40, duration: 1, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '.concept__quote', start: 'top 78%' }
  });
  gsap.from('.concept__body p', {
    opacity: 0, y: 20, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.concept__body', start: 'top 80%' }
  });

  // About
  gsap.from('.about__left > *', {
    opacity: 0, x: -30, duration: 0.8, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__inner', start: 'top 78%' }
  });
  gsap.from('.about__right > *', {
    opacity: 0, x: 30, duration: 0.8, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__inner', start: 'top 78%' }
  });

  // Counters
  document.querySelectorAll('.stat__num[data-target]').forEach(el => {
    const target = +el.dataset.target;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.fromTo({ v: 0 }, { v: target }, {
          duration: 1.6, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
        });
      }
    });
  });

  // Value items
  gsap.from('.value-item', {
    opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__values', start: 'top 82%' }
  });

  // Contact
  gsap.from('.contact__title', {
    opacity: 0, y: 30, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 82%' }
  });
  gsap.from('.contact-card', {
    opacity: 0, y: 24, duration: 0.7, stagger: 0.15, ease: 'power2.out',
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
