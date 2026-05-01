/**
 * projects.js
 * Carousel interactions for the Project Dashboard page.
 * Features:
 *  - Left / right button navigation (scrolls 2 cards at a time)
 *  - Button opacity auto-updates at scroll boundaries
 *  - Mouse drag-to-scroll with grab cursor
 *  - Touch / swipe support for mobile
 *  - Keyboard arrow key navigation
 *  - Progress bar widths set via data attributes (no inline styles)
 */

(function () {
  'use strict';

  /* ── Elements ────────────────────────────────────── */
  const track   = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!track || !prevBtn || !nextBtn) return; // Guard: elements must exist

  /* ── Progress bar widths from data attributes ────── */
  document.querySelectorAll('.card-progress-fill').forEach(function (bar) {
    const value = bar.getAttribute('data-progress') || '0';
    bar.style.width = value + '%';
  });

  /* ── Scroll amount per button click ─────────────── */
  const getScrollAmount = () => {
    const card = track.querySelector('.project-card');
    if (!card) return 320;
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    return (card.offsetWidth + gap) * 2; // Scroll 2 cards at a time
  };

  /* ── Left / Right button navigation ─────────────── */
  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  /* ── Update button opacity at boundaries ─────────── */
  const updateNavButtons = () => {
    const atStart = track.scrollLeft <= 4;
    const atEnd   = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

    prevBtn.style.opacity      = atStart ? '0.3' : '1';
    prevBtn.style.pointerEvents = atStart ? 'none' : 'auto';

    nextBtn.style.opacity      = atEnd ? '0.3' : '1';
    nextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
  };

  track.addEventListener('scroll', updateNavButtons, { passive: true });
  updateNavButtons(); // Set initial state on load

  /* ── Mouse drag to scroll ────────────────────────── */
  let isDragging   = false;
  let startX       = 0;
  let startScrollX = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging   = true;
    startX       = e.clientX;
    startScrollX = track.scrollLeft;
    track.classList.add('grabbing');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const delta = e.clientX - startX;
    track.scrollLeft = startScrollX - delta;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('grabbing');
  });

  /* ── Touch / swipe support ───────────────────────── */
  let touchStartX  = 0;
  let touchScrollX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX  = e.touches[0].clientX;
    touchScrollX = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const delta = e.touches[0].clientX - touchStartX;
    track.scrollLeft = touchScrollX - delta;
  }, { passive: true });

  /* ── Keyboard arrow key navigation ──────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
    if (e.key === 'ArrowLeft') {
      track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    }
  });

})();