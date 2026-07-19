/* ==========================================================================
   وِنس (Wens) — App interactions
   Renders dynamic sections from data.js and wires up navbar, search,
   filters, FAQ accordion, and the buy/login modal.
   ========================================================================== */

(() => {
  'use strict';

  /* -- Small helpers ------------------------------------------------------ */
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const formatPrice = (value) => `${value} ر.س`;

  /* =========================================================================
     Navbar: mobile toggle + scroll behavior
     ========================================================================= */
  const initNavbar = () => {
    const header = qs('.site-header');
    const navbar = qs('.navbar');
    const toggle = qs('.nav-toggle');

    if (toggle && navbar) {
      toggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      qsa('.nav-links a').forEach((link) => {
        link.addEventListener('click', () => {
          navbar.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    if (header) {
      let lastScrollY = window.scrollY;

      window.addEventListener(
        'scroll',
        () => {
          const currentScrollY = window.scrollY;
          header.classList.toggle('is-scrolled', currentScrollY > 12);

          const scrollingDown = currentScrollY > lastScrollY && currentScrollY > 160;
          header.classList.toggle('is-hidden', scrollingDown);

          lastScrollY = currentScrollY;
        },
        { passive: true }
      );
    }
  };

  /* =========================================================================
     Games grid: render, filter by category, search
     ========================================================================= */
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  };

  const gameCardTemplate = (game) => `
    <article class="game-card card-lift reveal" data-name="${game.name}" data-category="${game.category}">
      <div class="game-card__media">
        <img src="${game.cover}" alt="غلاف لعبة ${game.name}" loading="lazy" width="400" height="300">
        ${game.badge ? `<span class="badge badge--accent game-card__badge">${game.badge}</span>` : ''}
        <span class="game-card__category">${game.category}</span>
      </div>
      <div class="game-card__body">
        <h3 class="game-card__title">${game.name}</h3>
        <p class="game-card__desc">${game.description}</p>
        <span class="game-card__rating" aria-label="التقييم ${game.rating} من 5">${renderStars(game.rating)} <span>${game.rating}</span></span>
        <div class="game-card__footer">
          <span class="price-tag">
            ${game.oldPrice ? `<span class="price-tag__old">${formatPrice(game.oldPrice)}</span>` : ''}
            <span class="price-tag__current">${formatPrice(game.price)}</span>
          </span>
          <button class="btn btn--primary btn--sm js-buy" type="button" data-game="${game.name}">شراء الآن</button>
        </div>
      </div>
    </article>
  `;

  const initGames = () => {
    const grid = qs('.js-games-grid');
    if (!grid) return;

    const emptyState = qs('.js-games-empty');
    const searchInputs = qsa('.js-search-input');
    const chips = qsa('.filter-chip');

    let activeCategory = 'الكل';
    let activeQuery = '';

    const render = () => {
      const filtered = WENS_GAMES.filter((game) => {
        const matchesCategory = activeCategory === 'الكل' || game.category === activeCategory;
        const matchesQuery = game.name.includes(activeQuery) || game.description.includes(activeQuery);
        return matchesCategory && matchesQuery;
      });

      grid.innerHTML = filtered.map(gameCardTemplate).join('');
      emptyState?.classList.toggle('is-visible', filtered.length === 0);

      // New cards need to be observed for scroll-reveal, ripple, and buy clicks.
      qsa('.reveal', grid).forEach((el) => window.WensAnimations.observe(el));
      window.WensAnimations.bindRipples(grid);
      qsa('.js-buy', grid).forEach((btn) => btn.addEventListener('click', () => openBuyModal(btn.dataset.game)));
    };

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        activeCategory = chip.dataset.category;
        render();
      });
    });

    searchInputs.forEach((input) => {
      input.addEventListener('input', (e) => {
        activeQuery = e.target.value.trim();
        // Keep every search field (desktop + mobile) in sync.
        searchInputs.forEach((other) => {
          if (other !== e.target) other.value = activeQuery;
        });
        render();
      });
    });

    render();
  };

  /* =========================================================================
     Testimonials: render from data
     ========================================================================= */
  const testimonialTemplate = (t) => `
    <article class="testimonial-card card-lift reveal">
      <span class="testimonial-card__stars" aria-hidden="true">${renderStars(t.rating)}</span>
      <p class="testimonial-card__quote">"${t.quote}"</p>
      <div class="testimonial-card__author">
        <span class="avatar" aria-hidden="true">${t.name.trim().charAt(0)}</span>
        <div>
          <strong>${t.name}</strong>
          <span>${t.role}</span>
        </div>
      </div>
    </article>
  `;

  const initTestimonials = () => {
    const wrap = qs('.js-testimonials-grid');
    if (!wrap) return;
    wrap.innerHTML = WENS_TESTIMONIALS.map(testimonialTemplate).join('');
    qsa('.reveal', wrap).forEach((el) => window.WensAnimations.observe(el));
  };

  /* =========================================================================
     FAQ accordion
     ========================================================================= */
  const faqItemTemplate = (item, index) => `
    <div class="accordion__item" id="${item.id}">
      <h3>
        <button class="accordion__trigger" type="button" aria-expanded="false" aria-controls="panel-${item.id}">
          <span>${item.question}</span>
          <span class="accordion__icon" aria-hidden="true">+</span>
        </button>
      </h3>
      <div class="accordion__panel" id="panel-${item.id}">
        <div class="accordion__panel-inner">
          <p>${item.answer}</p>
        </div>
      </div>
    </div>
  `;

  const initFaq = () => {
    const wrap = qs('.js-accordion');
    if (!wrap) return;
    wrap.innerHTML = WENS_FAQ.map(faqItemTemplate).join('');

    qsa('.accordion__trigger', wrap).forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        const isOpen = item.classList.contains('is-open');

        qsa('.accordion__item', wrap).forEach((other) => {
          other.classList.remove('is-open');
          qs('.accordion__trigger', other).setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  /* =========================================================================
     Modal (buy / login) — prototype only, no real transaction
     ========================================================================= */
  const modal = () => qs('.js-modal');
  let lastFocusedEl = null;

  const openModal = ({ title, message, icon }) => {
    const modalEl = modal();
    if (!modalEl) return;

    qs('.js-modal-title', modalEl).textContent = title;
    qs('.js-modal-message', modalEl).textContent = message;
    if (icon) qs('.js-modal-icon', modalEl).innerHTML = icon;

    lastFocusedEl = document.activeElement;
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    qs('.modal__close', modalEl)?.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    const modalEl = modal();
    if (!modalEl) return;
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedEl?.focus();
  };

  const openBuyModal = (gameName) => {
    openModal({
      title: 'تم إضافة اللعبة إلى السلة',
      message: `هذا نموذج أولي للتصميم فقط — عملية شراء "${gameName}" الحقيقية ستتوفر في النسخة الكاملة من المنصة.`,
    });
    showToast(`تمت إضافة "${gameName}" إلى السلة`);
  };

  const initModal = () => {
    const modalEl = modal();
    if (!modalEl) return;

    qs('.modal__overlay', modalEl)?.addEventListener('click', closeModal);
    qs('.modal__close', modalEl)?.addEventListener('click', closeModal);
    qs('.modal-confirm-close', modalEl)?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalEl.classList.contains('is-open')) closeModal();
    });

    qsa('.js-login-trigger').forEach((btn) => {
      btn.addEventListener('click', () =>
        openModal({
          title: 'تسجيل الدخول',
          message: 'هذا نموذج أولي للتصميم — نموذج تسجيل الدخول الفعلي سيُضاف عند بناء النسخة الكاملة من وِنس.',
        })
      );
    });
  };

  /* =========================================================================
     Toast notification
     ========================================================================= */
  let toastTimeout;
  const showToast = (message) => {
    const toast = qs('.js-toast');
    if (!toast) return;
    qs('.js-toast-message', toast).textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  };

  /* =========================================================================
     Misc: footer year
     ========================================================================= */
  const initMisc = () => {
    const yearEl = qs('.js-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  /* -- Boot ---------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initGames();
    initTestimonials();
    initFaq();
    initModal();
    initMisc();
  });
})();
