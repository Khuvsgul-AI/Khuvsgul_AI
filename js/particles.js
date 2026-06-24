/* ============================================================
   PARTICLE CANVAS — lightweight hero background
   js/particles.js
   ============================================================ */

(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let w, h, particles, animId;

  const CONFIG = {
    count:        80,
    minRadius:    1.5,
    maxRadius:    3,
    speed:        0.25,
    connectDist:  160,
    nodeColor:    '0, 168, 232',   // cyan-400 rgb
    lineColor:    '0, 102, 204',   // blue-500 rgb
    maxLineAlpha: 0.25,
  };

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x  = Math.random() * w;
      this.y  = initial ? Math.random() * h : (Math.random() < 0.5 ? -8 : h + 8);
      this.r  = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      const angle = Math.random() * Math.PI * 2;
      const speed = CONFIG.speed * (0.5 + Math.random() * 0.8);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 0.4 + Math.random() * 0.6;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.nodeColor}, ${this.alpha})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `rgba(${CONFIG.nodeColor}, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    if (particles) {
      particles.forEach(p => {
        if (p.x > w) p.x = Math.random() * w;
        if (p.y > h) p.y = Math.random() * h;
      });
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectDist) {
          const alpha = CONFIG.maxLineAlpha * (1 - dist / CONFIG.connectDist);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.lineColor}, ${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animate();
    }
  });

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement || document.body);

  init();
  animate();
})();
