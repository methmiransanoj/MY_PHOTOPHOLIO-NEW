/**
 * Cinematic Web Portfolio & Photofolio Engine
 * Pure Vanilla JS + Canvas
 */

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initParticleCanvas();
  initNavigation();
  //initLightbox();
  initSkillObserver()
  initContactForm();
});

/* ==========================================================================
   1. FLASH / SPLASH SCREEN ENGINE
   ========================================================================== */
function initSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  const terminalBody = document.getElementById('terminal-logs');
  const progressBar = document.getElementById('splash-progress-bar');
  const skipBtn = document.getElementById('skip-splash-btn');

  const logs = [
    { text: '> init dev.environment --version 3.0', delay: 150 },
    { text: '> loading core: HTML5, CSS3, JavaScript', delay: 350 },
    { text: '> verifying degree modules: Software Eng (UoW) & Chemical Eng (UoM)', delay: 550 },
    { text: '> starting interactive photofolio & web mail service...', delay: 1100 },
    { text: '> STATUS: 100% READY! Launching portfolio...', delay: 1350 }
  ];

  let currentLog = 0;

  function typeLogs() {
    if (currentLog < logs.length) {
      const item = logs[currentLog];
      setTimeout(() => {
        const line = document.createElement('div');
        line.className = 'text-xs md:text-sm font-code text-cyan-400 opacity-90 mb-1';
        line.textContent = item.text;
        terminalBody.appendChild(line);
        
        // Progress fill
        const progress = Math.min(100, Math.round(((currentLog + 1) / logs.length) * 100));
        if (progressBar) progressBar.style.width = `${progress}%`;

        currentLog++;
        typeLogs();
      }, item.delay);
    } else {
      setTimeout(closeSplash, 700);
    }
  }

  function closeSplash() {
    if (!splashScreen.classList.contains('fade-out')) {
      splashScreen.classList.add('fade-out');
      document.body.style.overflow = 'auto';
    }
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', closeSplash);
  }

  // Prevent scroll during splash
  document.body.style.overflow = 'hidden';
  typeLogs();
}

/* ==========================================================================
   2. PARTICLES CANVAS SYSTEM
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((width * height) / 15000));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          let opacity = 1 - dist / 120;
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    connect();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
  }

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active', 'text-cyan-400');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active', 'text-cyan-400');
      }
    });
  });
}

/* ==========================================================================
   4. SKILL BAR ANIMATION OBSERVER
   ========================================================================== */
function initSkillObserver() {
  const skillSection = document.getElementById('skills');
  const skillFills = document.querySelectorAll('.skill-progress-fill');

  if (!skillSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          const targetWidth = fill.getAttribute('data-percentage') || '85%';
          fill.style.width = targetWidth;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(skillSection);
}



/* ==========================================================================
   7. INTERACTIVE WEB MAIL / CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('webmail-form');
  const toast = document.getElementById('toast-notification');
  const submitBtn = document.getElementById('mail-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const subject = document.getElementById('sender-subject') ? document.getElementById('sender-subject').value.trim() : 'General Inquiry';
    const message = document.getElementById('sender-message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all fields before sending.', 'border-amber-500/50 text-amber-300');
      return;
    }

    // Button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Transmitting Message...`;
    }

   try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();
        showToast('🚀 Message Transmitted Successfully!', 'border-cyan-500/50 text-cyan-300');
      } else {
        showToast('❌ Transmission Failed. Please try again.', 'border-red-500/50 text-red-300');
      }
    } catch (error) {
      showToast('❌ Network Error. Check connection.', 'border-red-500/50 text-red-300');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane mr-2"></i> Send Message`;
      }
    }
  });

  function showToast(msg, extraClass = '') {
    if (!toast) return;
    toast.innerHTML = `<div class="flex items-center space-x-3"><i class="fas fa-check-circle text-cyan-400 text-lg"></i><span>${msg}</span></div>`;
    toast.className = `fixed bottom-8 right-8 z-50 bg-slate-900/90 text-white px-6 py-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 transform translate-y-0 opacity-100 ${extraClass}`;

    setTimeout(() => {
      toast.className = `fixed bottom-8 right-8 z-50 bg-slate-900/90 text-white px-6 py-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-500 transform translate-y-12 opacity-0 pointer-events-none`;
    }, 4500);
  }
}
