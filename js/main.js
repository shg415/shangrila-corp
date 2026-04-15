gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================
   CANVAS — Particle Network
   ============================================ */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [], mouse = { x: -9999, y: -9999 };
const GREEN  = '#2a7a4b';
const MAXDIST = 140;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r  = Math.random() * 2 + 1;
  }
  update() {
    // Gentle cursor attraction
    const dx = mouse.x - this.x, dy = mouse.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 200) {
      this.vx += dx / dist * 0.06;
      this.vy += dy / dist * 0.06;
    }
    // Speed limit
    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    if (speed > 1.5) { this.vx /= speed / 1.5; this.vy /= speed / 1.5; }
    // Slow down
    this.vx *= 0.98; this.vy *= 0.98;

    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = GREEN;
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles = [];
  const count = Math.floor(W * H / 14000);
  for (let i = 0; i < Math.min(count, 80); i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < MAXDIST) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = GREEN;
        ctx.globalAlpha = (1 - d / MAXDIST) * 0.18;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animCanvas);
}

window.addEventListener('resize', () => { resize(); initParticles(); });
document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
resize();
initParticles();
animCanvas();

/* ============================================
   LOADER
   ============================================ */
let pct = 0;
const fill = document.getElementById('loaderFill');
const pctEl = document.getElementById('loaderPct');
const loader = document.getElementById('loader');

const interval = setInterval(() => {
  pct += Math.random() * 18 + 4;
  if (pct >= 100) { pct = 100; clearInterval(interval); }
  fill.style.width = pct + '%';
  pctEl.textContent = Math.round(pct) + '%';
  if (pct >= 100) {
    setTimeout(() => {
      gsap.to(loader, { yPercent: -100, duration: 0.8, ease: 'power3.inOut', onComplete: initPage });
    }, 200);
  }
}, 80);

/* ============================================
   INIT
   ============================================ */
function initPage() {
  loader.style.pointerEvents = 'none';

  // Hero entrance
  const tl = gsap.timeline();
  tl
    .from('#h1',  { opacity: 0, x: -30, duration: 0.7, ease: 'power2.out' })
    .from('#hw1', { y: '110%', duration: 0.8, ease: 'power3.out' }, '-=0.2')
    .from('#hw2', { y: '110%', duration: 0.8, ease: 'power3.out' }, '-=0.55')
    .from('#hw3', { y: '110%', duration: 0.8, ease: 'power3.out' }, '-=0.55')
    .from('#h2',  { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .from('#h3',  { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('#heroAside',{ opacity: 0, x: 30, duration: 0.8, ease: 'power2.out' }, '-=0.6');

  // Hero stat counter
  setTimeout(() => {
    countUp('counterA', 50);
    countUp('counterB', 6);
  }, 800);

  initScrollAnimations();
}

function countUp(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  gsap.fromTo({ v: 0 }, { v: target }, {
    duration: 1.5, ease: 'power2.out',
    onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
  });
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
const track = document.getElementById('tickerInner');
if (track) {
  const w = track.scrollWidth / 2;
  gsap.to(track, {
    x: -w, duration: 28, ease: 'none', repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % w) }
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {

  // Services intro
  gsap.from('.services__intro > *', {
    opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.services__intro', start: 'top 82%' }
  });

  // Service items
  gsap.utils.toArray('.svc-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.7, ease: 'power2.out',
      delay: i * 0.07,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Concept title
  gsap.from('.concept__title span', {
    y: '100%', duration: 1, stagger: 0.15, ease: 'power3.out',
    scrollTrigger: { trigger: '.concept__title', start: 'top 78%' }
  });
  gsap.from('.concept__body', {
    opacity: 0, y: 20, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.concept__body', start: 'top 80%' }
  });

  // About
  gsap.from('.about__header > *', {
    opacity: 0, y: 24, duration: 0.8, stagger: 0.12, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__header', start: 'top 82%' }
  });
  gsap.from('.about__dd-row', {
    opacity: 0, x: -20, duration: 0.6, stagger: 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__dl', start: 'top 82%' }
  });
  gsap.from('.av', {
    opacity: 0, x: 24, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.about__values', start: 'top 80%' }
  });

  // Contact
  gsap.from('.contact__title', {
    opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact__title', start: 'top 82%' }
  });
  gsap.from('.c-card', {
    opacity: 0, y: 20, duration: 0.7, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.contact__grid', start: 'top 82%' }
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
      gsap.to(window, { duration: 1.1, scrollTo: { y: target, offsetY: 62 }, ease: 'power3.inOut' });
    }
  });
});
