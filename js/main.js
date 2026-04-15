gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ============================================
   CANVAS — Particle Network
   ============================================ */
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
let mouse = { x: -9999, y: -9999 };
const GREEN = '#2a7a4b';

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

class Pt {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .35;
    this.vy = (Math.random() - .5) * .35;
    this.r = Math.random() * 1.5 + .8;
  }
  tick() {
    const dx = mouse.x - this.x, dy = mouse.y - this.y;
    const d = Math.hypot(dx, dy);
    if (d < 180) { this.vx += dx / d * .055; this.vy += dy / d * .055; }
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > 1.4) { this.vx /= sp / 1.4; this.vy /= sp / 1.4; }
    this.vx *= .98; this.vy *= .98;
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
  }
}

function initPts() {
  pts = [];
  const n = Math.min(Math.floor(W * H / 15000), 70);
  for (let i = 0; i < n; i++) pts.push(new Pt());
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  // connections
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = GREEN;
        ctx.globalAlpha = (1 - d / 130) * .14;
        ctx.lineWidth = .7;
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  // dots
  pts.forEach(p => {
    p.tick();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = GREEN;
    ctx.globalAlpha = .3;
    ctx.fill();
    ctx.globalAlpha = 1;
  });
  requestAnimationFrame(draw);
}

resize();
initPts();
draw();
window.addEventListener('resize', () => { resize(); initPts(); });
window.addEventListener('mousemove', e => {
  const r = canvas.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
});

/* ============================================
   LOADER
   ============================================ */
let n = 0;
const lc = document.getElementById('loaderCount');
const ldr = document.getElementById('loader');

const li = setInterval(() => {
  n = Math.min(100, n + Math.floor(Math.random() * 18 + 5));
  lc.textContent = n;
  if (n >= 100) {
    clearInterval(li);
    setTimeout(() => {
      gsap.to(ldr, {
        yPercent: -100, duration: .9, ease: 'power3.inOut',
        onComplete: () => { ldr.style.display = 'none'; startHero(); }
      });
    }, 160);
  }
}, 70);

/* ============================================
   HERO ENTRANCE
   ============================================ */
function startHero() {
  const tl = gsap.timeline();
  tl
    .from('.hero-meta',  { opacity: 0, x: -20, duration: .6, ease: 'power2.out' })
    .from('#hl1', { y: '110%', duration: .85, ease: 'power3.out' }, '-=.1')
    .from('#hl2', { y: '110%', duration: .85, ease: 'power3.out' }, '-=.6')
    .from('#hl3', { y: '110%', duration: .85, ease: 'power3.out' }, '-=.6')
    .from('.hero-body',  { opacity: 0, y: 18, duration: .7, ease: 'power2.out' }, '-=.4')
    .from('.hero-bottom',{ opacity: 0, duration: .5 }, '-=.3');

  initScroll();
}

/* ============================================
   MOBILE MENU
   ============================================ */
const btn = document.getElementById('menuBtn');
const nl  = document.getElementById('navLinks');
btn?.addEventListener('click', () => {
  btn.classList.toggle('active');
  nl.classList.toggle('active');
});
nl?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  btn.classList.remove('active');
  nl.classList.remove('active');
}));

/* ============================================
   TICKER
   ============================================ */
const tt = document.getElementById('tickerTrack');
if (tt) {
  const w = tt.scrollWidth / 2;
  gsap.to(tt, { x: -w, duration: 24, ease: 'none', repeat: -1,
    modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % w) }
  });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScroll() {
  // Works head
  gsap.from('.works-head', {
    opacity: 0, y: 30, duration: .9, ease: 'power2.out',
    scrollTrigger: { trigger: '.works-head', start: 'top 82%' }
  });

  // Each service row
  gsap.utils.toArray('.wk-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -40, duration: .75, ease: 'power2.out',
      delay: i * .06,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  // Concept title
  gsap.from('.concept-title span', {
    y: '105%', duration: .95, stagger: .15, ease: 'power3.out',
    scrollTrigger: { trigger: '.concept-title', start: 'top 78%' }
  });
  gsap.from('.concept-body', {
    opacity: 0, y: 20, duration: .8, ease: 'power2.out',
    scrollTrigger: { trigger: '.concept-body', start: 'top 82%' }
  });

  // Count up
  document.querySelectorAll('.count-num').forEach(el => {
    const to = +el.dataset.to;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.fromTo({ v: 0 }, { v: to }, {
        duration: 1.6, ease: 'power2.out',
        onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
      })
    });
  });

  // About
  gsap.from('.about-title', {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-title', start: 'top 78%' }
  });
  gsap.from('.about-dl > div', {
    opacity: 0, y: 16, duration: .6, stagger: .08, ease: 'power2.out',
    scrollTrigger: { trigger: '.about-dl', start: 'top 82%' }
  });

  // Contact
  gsap.from('.contact-title', {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-title', start: 'top 80%' }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); gsap.to(window, { duration: 1.1, scrollTo: { y: t, offsetY: 58 }, ease: 'power3.inOut' }); }
  });
});
