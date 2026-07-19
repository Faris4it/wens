/* ==========================================================================
   وِنس (Wens) — Animation utilities
   Scroll-reveal (IntersectionObserver) and button ripple effect. Exposed as
   window.WensAnimations so app.js can hook newly-rendered elements
   (game cards, testimonials) into the same observer/ripple logic.
   ========================================================================== */

(() => {
  'use strict';

  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* -- Scroll reveal -------------------------------------------------------- */
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  const observe = (el) => scrollObserver.observe(el);

  /* -- Button ripple ---------------------------------------------------------- */
  const attachRipple = (button) => {
    if (button.dataset.rippleBound) return;
    button.dataset.rippleBound = 'true';

    button.addEventListener('click', (e) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      ripple.className = 'btn__ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  };

  const bindRipples = (root = document) => {
    qsa('.btn', root).forEach(attachRipple);
  };

  /* -- Navbar aurora / decorative blobs stay purely CSS-driven; nothing to
     wire here beyond initial reveal + ripple binding on load. -- */
  document.addEventListener('DOMContentLoaded', () => {
    qsa('.reveal').forEach(observe);
    bindRipples();
  });

  window.WensAnimations = { observe, bindRipples, attachRipple };
})();
