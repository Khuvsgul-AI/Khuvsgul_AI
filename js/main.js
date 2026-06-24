/* ============================================================
   MAIN JS — scroll reveal, sticky nav, mobile menu
   js/main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Nav ─────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const scrollThreshold = 60;

  function updateNav() {
    if (!nav) return;
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      // On the single-page site the nav starts scrolled (always opaque)
      // Only make transparent if the page has a hero at the very top
      const hasHero = !!document.querySelector('.hero');
      if (hasHero) nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  // Always start scrolled (opaque) — looks better
  nav?.classList.add('scrolled');


  /* ── Mobile Hamburger ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');

  function openDrawer() {
    hamburger?.classList.add('open');
    drawer?.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  // Close on drawer link click
  drawer?.querySelectorAll('.nav__drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (drawer?.classList.contains('open') &&
        !drawer.contains(e.target) &&
        !hamburger?.contains(e.target)) {
      closeDrawer();
    }
  });

  /* ── Scroll Reveal (IntersectionObserver) ───────────────── */
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const revealElements = document.querySelectorAll(revealClasses.join(','));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ── Smooth scroll for ALL #anchor links ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const hash   = this.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        closeDrawer(); // close mobile menu if open
        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
        window.scrollTo({ top });
      }
    });
  });

  /* ── Team bio read-more toggle ───────────────────────────── */
  document.querySelectorAll('.team-card__read-more').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.team-card');
      const bioFull  = card?.querySelector('.team-card__bio-full');
      const bioShort = card?.querySelector('.team-card__bio-short');

      if (bioFull?.classList.contains('visible')) {
        bioFull.classList.remove('visible');
        bioShort?.style && (bioShort.style.display = '');
        this.innerHTML = 'Read more <span>→</span>';
        this.setAttribute('aria-expanded', 'false');
      } else {
        bioFull?.classList.add('visible');
        bioShort?.style && (bioShort.style.display = 'none');
        this.innerHTML = 'Read less <span>↑</span>';
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── Current year in footer ──────────────────────────────── */
  /* ── Calendly Link Config (Optional Helper) ──────────────── */
  // If you prefer to set the Calendly link in one place rather than editing each button in HTML,
  // simply uncomment the variable definition below:
  // const CALENDLY_URL = "https://calendly.com/your-profile";
  // if (typeof CALENDLY_URL !== 'undefined' && CALENDLY_URL) {
  //   document.querySelectorAll('a[data-i18n="cta.book-demo"], a[data-i18n="home.hero.cta1"]').forEach(btn => {
  //     btn.href = CALENDLY_URL;
  //     btn.target = "_blank";
  //     btn.rel = "noopener noreferrer";
  //   });
  // }

  const yearEl = document.querySelector('.footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
