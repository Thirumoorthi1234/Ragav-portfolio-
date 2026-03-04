/* ============================================================
   RAGAVENDHIRAN R - PORTFOLIO JAVASCRIPT
   Fantasy Particle System | Animations | Interactions
   ============================================================ */

'use strict';

// ─── MAGICAL PARTICLE SYSTEM ───
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = -Math.random() * 0.6 - 0.2;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
    this.hue = Math.random() * 60 + 190; // sky blue to indigo
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    const ratio = this.life / this.maxLife;
    this.opacity = ratio < 0.2
      ? ratio / 0.2 * 0.5
      : ratio > 0.8
        ? (1 - ratio) / 0.2 * 0.5
        : 0.5;
    if (this.life >= this.maxLife || this.y < -10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = `hsl(${this.hue}, 80%, 65%)`;
    ctx.shadowBlur = 6;
    ctx.shadowColor = `hsl(${this.hue}, 80%, 65%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Sparkle class for magical effect
class Sparkle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.opacity = 0;
    this.maxOpacity = Math.random() * 0.6 + 0.2;
    this.speed = Math.random() * 0.02 + 0.01;
    this.growing = true;
    this.hue = Math.random() * 80 + 180;
  }
  update() {
    if (this.growing) {
      this.opacity += this.speed;
      if (this.opacity >= this.maxOpacity) this.growing = false;
    } else {
      this.opacity -= this.speed;
      if (this.opacity <= 0) this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    // Draw 4-pointed star
    const s = this.size;
    ctx.fillStyle = `hsl(${this.hue}, 90%, 70%)`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `hsl(${this.hue}, 90%, 70%)`;
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(0, -s * 2.5);
      ctx.lineTo(s * 0.4, -s * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// Initialize particles
const PARTICLE_COUNT = 60;
const SPARKLE_COUNT = 25;
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
const sparkles = [];
for (let i = 0; i < SPARKLE_COUNT; i++) sparkles.push(new Sparkle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  sparkles.forEach(s => { s.update(); s.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── MOUSE INTERACTION ───
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Spawn extra particles on mouse move (throttled)
  if (Math.random() < 0.08) {
    const p = new Particle();
    p.x = mouseX + (Math.random() - 0.5) * 20;
    p.y = mouseY + (Math.random() - 0.5) * 20;
    p.size = Math.random() * 2 + 1;
    p.speedY = -Math.random() * 1.5 - 0.5;
    p.maxLife = 60;
    particles.push(p);
    if (particles.length > 120) particles.shift();
  }
});

// ─── NAVIGATION ───
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // Navbar scroll effect
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });

  // Scroll-to-top button
  const scrollBtn = document.getElementById('scrollTop');
  if (window.scrollY > 400) scrollBtn.classList.add('visible');
  else scrollBtn.classList.remove('visible');

  // Reveal animations
  revealOnScroll();
  animateSkillBars();
});

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinksEl.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

// Close menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

// ─── SCROLL TO TOP ───
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── REVEAL ON SCROLL ───
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}
revealOnScroll();

// ─── SKILL BAR ANIMATIONS ───
let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return;
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    document.querySelectorAll('.skill-fill').forEach((bar, i) => {
      setTimeout(() => bar.classList.add('animated'), i * 180);
    });
    skillsAnimated = true;
  }
}

// ─── TYPEWRITER EFFECT ───
const words = [
  'MERN Stack Enthusiast 🚀',
  'IT Graduate 🎓',
  'SQL Developer 💾',
  'Web Developer 🌐',
  'Problem Solver 🧩'
];
let wIdx = 0, cIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const word = words[wIdx];
  if (!deleting && cIdx <= word.length) {
    typeEl.textContent = word.substring(0, cIdx++);
    setTimeout(type, 80);
  } else if (!deleting && cIdx > word.length) {
    deleting = true;
    setTimeout(type, 1800);
  } else if (deleting && cIdx > 0) {
    typeEl.textContent = word.substring(0, cIdx--);
    setTimeout(type, 45);
  } else {
    deleting = false;
    wIdx = (wIdx + 1) % words.length;
    setTimeout(type, 300);
  }
}
setTimeout(type, 800);

// ─── CONTACT FORM ───
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('.form-btn');
  const origHtml = btn.innerHTML;

  // Loading state
  btn.innerHTML = '<span>Sending...</span><span class="spin">⏳</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = origHtml;
    btn.disabled = false;
    contactForm.reset();
    showToast('✨ Message sent! I\'ll get back to you soon.');
  }, 1800);
});

// ─── TOAST NOTIFICATION ───
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── TILT EFFECT ON CARDS ───
const tiltCards = document.querySelectorAll('.glass-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 6;
    const rotY = (x / rect.width) * 6;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── SMOOTH ANCHOR SCROLLING ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── CURSOR TRAIL ───
const trail = [];
const TRAIL_LENGTH = 8;
for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed; width: ${4 + i * 1.5}px; height: ${4 + i * 1.5}px;
    border-radius: 50%; pointer-events: none; z-index: 9999;
    background: linear-gradient(135deg, rgba(56,189,248,${0.7 - i * 0.07}), rgba(99,102,241,${0.5 - i * 0.05}));
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: 0, y: 0 });
}

let cursorX = 0, cursorY = 0;
document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  let prevX = cursorX, prevY = cursorY;
  trail.forEach((dot, i) => {
    dot.x += (prevX - dot.x) * (0.6 - i * 0.05);
    dot.y += (prevY - dot.y) * (0.6 - i * 0.05);
    dot.el.style.left = dot.x + 'px';
    dot.el.style.top = dot.y + 'px';
    prevX = dot.x;
    prevY = dot.y;
  });
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ─── SECTION ENTRANCE ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── RANDOM FLOATING HEARTS / STARS ───
function spawnMagicParticle() {
  const emojis = ['✨', '⭐', '💫', '🌟', '💎'];
  const el = document.createElement('div');
  el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  el.style.cssText = `
    position: fixed;
    left: ${Math.random() * 100}vw;
    bottom: -40px;
    font-size: ${Math.random() * 16 + 10}px;
    pointer-events: none;
    z-index: 1;
    animation: magicRise ${Math.random() * 4 + 5}s ease-in forwards;
    opacity: 0.6;
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 9000);
}

// Inject keyframe for magic rise
const style = document.createElement('style');
style.textContent = `
  @keyframes magicRise {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
    100% { transform: translateY(-110vh) rotate(${Math.random() > 0.5 ? 360 : -360}deg); opacity: 0; }
  }
  .spin { display: inline-block; animation: spinAnim 1s linear infinite; }
  @keyframes spinAnim { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// Spawn magic particles periodically
setInterval(spawnMagicParticle, 3000);
spawnMagicParticle();

// ─── INITIAL LOAD ANIMATION ───
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  setTimeout(() => {
    revealOnScroll();
    animateSkillBars();
  }, 600);
});

console.log('%c🌟 Ragavendhiran R Portfolio', 'font-size:20px; font-weight:bold; color:#0ea5e9;');
console.log('%cBuilt with ✨ magic, HTML, CSS & JS', 'font-size:14px; color:#6366f1;');
