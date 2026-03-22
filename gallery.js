/* ═══════════════════════════════════════════════════════════
   DayDream Pages — gallery.js
   • Category tab switching (shows only the selected section)
   • Staggered card entrance animations on tab change
   • Lightbox (click to enlarge any image)
   • Nav shrink on scroll
   • Active tab driven by URL hash on load
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── References ─────────────────────────────────────────── */
  const tabs      = document.querySelectorAll('.catelog a');
  const sections  = document.querySelectorAll('.gallery-section');
  const navContainer = document.querySelector('.nav-container');


  /* ── 1. Tab switching ───────────────────────────────────── */

  function showSection (targetId) {
    // Deactivate all tabs and hide all sections
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => {
      s.classList.remove('active');
      // Reset animation so cards re-animate each time
      s.querySelectorAll('.gallery-item').forEach(item => {
        item.style.animation = 'none';
        // Force reflow so the reset takes effect
        void item.offsetWidth;
        item.style.animation = '';
      });
    });

    // Activate the matching tab and section
    const matchingTab = document.querySelector(`.catelog a[href="#${targetId}"]`);
    const matchingSection = document.getElementById(targetId);

    if (matchingTab) matchingTab.classList.add('active');
    if (matchingSection) matchingSection.classList.add('active');
  }

  // Handle tab clicks
  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();

      const href = tab.getAttribute('href');          // e.g. "#all"
      const targetId = href.replace('#', '');         // e.g. "all"

      // Update the URL hash silently (no page jump)
      history.replaceState(null, '', href);

      showSection(targetId);
    });
  });

  // On load: show section matching current hash, or default to "all"
  const initialHash = window.location.hash.replace('#', '') || 'all';
  showSection(initialHash);


  /* ── 2. Lightbox ────────────────────────────────────────── */

  // Build lightbox DOM once
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <img src="" alt="Enlarged artwork">
    <span class="lightbox-count"></span>
  `;
  document.body.appendChild(lightbox);

  const lbImg   = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbCount = lightbox.querySelector('.lightbox-count');

  let currentImages = [];   // images in the currently active section
  let currentIndex  = 0;

  function openLightbox (imgs, idx) {
    currentImages = imgs;
    currentIndex  = idx;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox () {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox () {
    lbImg.src = currentImages[currentIndex].src;
    lbImg.alt = currentImages[currentIndex].alt;
    lbCount.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  }

  function nextImage (dir) {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    // Quick scale-out then back in
    lbImg.style.transform = 'scale(0.88)';
    setTimeout(() => {
      updateLightbox();
      lbImg.style.transform = '';
    }, 160);
  }

  // Click on any gallery image → open lightbox
  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    // Only images in the active section
    const activeSection = document.querySelector('.gallery-section.active');
    if (!activeSection || !activeSection.contains(item)) return;

    const imgs = Array.from(activeSection.querySelectorAll('.gallery-item img'));
    const idx  = imgs.indexOf(item.querySelector('img'));
    openLightbox(imgs, idx);
  });

  // Close button
  lbClose.addEventListener('click', closeLightbox);

  // Click outside image to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  nextImage(+1);
    if (e.key === 'ArrowLeft')   nextImage(-1);
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) nextImage(diff > 0 ? +1 : -1);
  });


  /* ── 3. Nav shrink on scroll ────────────────────────────── */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navContainer.style.padding = '0.8rem 2.5rem';
    } else {
      navContainer.style.padding = '1.5rem 2.5rem';
    }
  }, { passive: true });

});