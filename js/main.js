gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================
   HERO ENTRANCE
   ============================================ */
window.addEventListener('load', () => {
  const tl = gsap.timeline({ delay: 0.2 });
  tl
    .from('.sec-meta',   { opacity: 0, y: -10, duration: 0.5, ease: 'power2.out' })
    .from('#htl1', { y: '110%', duration: 0.8, ease: 'power3.out' }, '-=0.2')
    .from('#htl2', { y: '110%', duration: 0.8, ease: 'power3.out' }, '-=0.55')
    .from('#htl3', { y: '110%', duration: 0.8, ease: 'power3.out' }, '-=0.55')
    .from('.hero-tabs',  { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, '-=0.3')
    .from('.htab-content', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .from('.geo', { opacity: 0, x: 60, duration: 1.0, ease: 'power3.out' }, '-=1.2');

  initScroll();
});

/* ============================================
   HERO TABS
   ============================================ */
document.querySelectorAll('.htab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.htab').forEach(b => b.classList.remove('htab--active'));
    btn.classList.add('htab--active');
    const tab = btn.dataset.tab;
    document.getElementById('tabMission').classList.toggle('htab-content--hidden', tab !== 'mission');
    document.getElementById('tabVision').classList.toggle('htab-content--hidden', tab !== 'vision');
  });
});

/* ============================================
   SERVICE TABS
   ============================================ */
document.querySelectorAll('.stab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stab').forEach(b => b.classList.remove('stab--active'));
    btn.classList.add('stab--active');
    const tab = btn.dataset.stab;
    document.getElementById('svcDigital').classList.toggle('stab-panel--hidden', tab !== 'digital');
    document.getElementById('svcSpace').classList.toggle('stab-panel--hidden', tab !== 'space');
  });
});

/* ============================================
   MOBILE MENU
   ============================================ */
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
menuBtn?.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
});
navMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.classList.remove('active');
  navMenu.classList.remove('active');
}));

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScroll() {

  // About statement
  gsap.from('.sec-statement', {
    opacity: 0, y: 30, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.sec-statement', start: 'top 80%' }
  });

  // About stats
  document.querySelectorAll('.cnum').forEach(el => {
    const to = +el.dataset.to;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo({ v: 0 }, { v: to }, {
        duration: 1.5, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
      })
    });
  });

  // Svc tabs
  gsap.from('.svc-tabs', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '.svc-tabs', start: 'top 82%' }
  });

  // Svc cards
  gsap.from('.svc-card', {
    opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: '.svc-cards', start: 'top 82%' }
  });

  // Concept
  gsap.from('.concept-title span', {
    y: '105%', duration: 0.95, stagger: 0.18, ease: 'power3.out',
    scrollTrigger: { trigger: '.concept-title', start: 'top 78%' }
  });
  gsap.from('.concept-body', {
    opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.concept-body', start: 'top 82%' }
  });
  gsap.from('.sec-concept .geo', {
    opacity: 0, x: 80, duration: 1.0, ease: 'power3.out',
    scrollTrigger: { trigger: '.sec-concept', start: 'top 70%' }
  });

  // Contact
  gsap.from('#contactTitle', {
    opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#contactTitle', start: 'top 80%' }
  });
  gsap.from('.clink', {
    opacity: 0, x: -20, duration: 0.6, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact-links', start: 'top 82%' }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      gsap.to(window, { duration: 1.1, scrollTo: { y: t, offsetY: 60 }, ease: 'power3.inOut' });
    }
  });
});
