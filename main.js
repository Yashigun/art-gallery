/* ═══════════════════════════════════════════════════════════
   DayDream Pages — main.js
   • Smooth scroll to sections when nav links are clicked
   • Active nav link highlight based on scroll position
   • Section entrance animations via IntersectionObserver
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Smooth scroll + active state for nav links ──────── */
  const navLinks = document.querySelectorAll('.right-nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');

      // Only intercept hash links that point to a section on this page
      if (href && href.startsWith('#')) {
        e.preventDefault();

        // The HTML uses id="#gallery" etc. (with the #), so try both
        const rawTarget = href.replace(/^#/, '');          // e.g. "gallery"
        const target =
          document.getElementById(rawTarget) ||            // id="gallery"
          document.getElementById('#' + rawTarget);        // id="#gallery"

        if (target) {
          const navHeight = document.querySelector('.nav-container').offsetHeight;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });


  /* ── 2. Active link highlight on scroll ─────────────────── */
  // Collect all sections that the nav points to
  const sections = [];

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const rawTarget = href.replace(/^#/, '');
    const el =
      document.getElementById(rawTarget) ||
      document.getElementById('#' + rawTarget);

    if (el) sections.push({ el, link });
  });

  function updateActiveLink () {
    const navHeight = document.querySelector('.nav-container').offsetHeight;
    const scrollMid = window.scrollY + navHeight + window.innerHeight * 0.25;

    let current = null;
    sections.forEach(({ el }) => {
      if (el.offsetTop <= scrollMid) current = el;
    });

    sections.forEach(({ el, link }) => {
      link.classList.toggle('active', el === current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink(); // run once on load


  /* ── 3. Section entrance animations ─────────────────────── */
  // Add the .section-animate class to elements we want to animate in
  const animatables = document.querySelectorAll(
    '#\\#gallery, #\\#about, #\\#contact, ' +
    '.gallery-header, .scroll-panel, .page-btn, ' +
    '.about, .contact-page'
  );

  animatables.forEach(el => el.classList.add('section-animate'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  animatables.forEach(el => observer.observe(el));


  /* ── 4. Subtle nav shrink on scroll ─────────────────────── */
  const navContainer = document.querySelector('.nav-container');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navContainer.style.padding = '0.8rem 2.5rem';
    } else {
      navContainer.style.padding = '1.5rem 2.5rem';
    }
  }, { passive: true });

});