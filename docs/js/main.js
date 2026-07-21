/* ═══════════════════════════════════════════════════════
   وِنس — السلوك التفاعلي
   وحدات مستقلة، بدون أي مكتبات خارجية.
   ═══════════════════════════════════════════════════════ */
'use strict';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────── التنقّل: ظل عند التمرير + قائمة الجوال ─────────── */
const nav = (() => {
  const bar = document.querySelector('.nav');
  const burger = document.querySelector('.nav-burger');
  const menu = document.getElementById('mobileMenu');

  const onScroll = () => bar.classList.toggle('is-scrolled', window.scrollY > 24);

  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { menu.hidden = true; }, 350);
    }
  };

  const init = () => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    burger.addEventListener('click', () =>
      setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    // إغلاق القائمة عند اختيار رابط أو الضغط على Esc
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setMenu(false);
    });
  };

  return { init };
})();

/* ─────────── الكلمة المتغيّرة في الواجهة ─────────── */
const rotator = (() => {
  const WORDS = ['شلّتك', 'عيلتك', 'سهرتكم', 'رمضانكم'];
  const HOLD = 2400;   // مدة ثبات الكلمة
  const SWAP = 300;    // مدة حركة التبديل

  const init = () => {
    const el = document.getElementById('rotator');
    if (!el || REDUCED_MOTION) return; // مع تقليل الحركة تبقى الكلمة الأولى ثابتة
    let i = 0;
    setInterval(() => {
      el.classList.add('is-out');
      setTimeout(() => {
        i = (i + 1) % WORDS.length;
        el.textContent = WORDS[i];
        el.classList.remove('is-out');
      }, SWAP);
    }, HOLD);
  };

  return { init };
})();

/* ─────────── الظهور عند التمرير ─────────── */
const reveal = (() => {
  const init = () => {
    const items = document.querySelectorAll('[data-reveal]');
    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    // تتابع بسيط بين العناصر المتجاورة داخل نفس الأب
    items.forEach((el) => {
      const siblings = [...el.parentElement.querySelectorAll(':scope > [data-reveal]')];
      if (siblings.length > 1) {
        el.style.setProperty('--stagger', `${siblings.indexOf(el) * 0.09}s`);
      }
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -40px' });
    items.forEach((el) => io.observe(el));
  };

  return { init };
})();

/* ─────────── محادثة «بعد السهرة»: ظهور متسلسل ─────────── */
const chat = (() => {
  const GAP = 620;        // الفاصل بين الرسائل
  const TYPING_HOLD = 950; // مدة مؤشر الكتابة قبل الرسالة الأخيرة

  const play = (messages) => {
    let delay = 250;
    messages.forEach((msg) => {
      const isTyping = msg.classList.contains('msg-typing');
      setTimeout(() => msg.classList.add('is-in'), delay);
      if (isTyping) {
        // يظهر المؤشر ثم يختفي ليحل محله الرد الأخير
        setTimeout(() => msg.classList.add('is-done'), delay + TYPING_HOLD);
        delay += TYPING_HOLD;
      } else {
        delay += GAP;
      }
    });
  };

  const init = () => {
    const box = document.getElementById('chat');
    if (!box) return;
    const messages = [...box.querySelectorAll('[data-chat]')];
    if (REDUCED_MOTION || !('IntersectionObserver' in window)) {
      messages.forEach((m) => m.classList.add('is-in'));
      box.querySelector('.msg-typing')?.classList.add('is-done');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        play(messages);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(box);
  };

  return { init };
})();

/* ─────────── الأسئلة الشائعة: فتح واحد في كل مرة ─────────── */
const faq = (() => {
  const init = () => {
    const items = [...document.querySelectorAll('.faq-item')];
    items.forEach((item) => {
      const btn = item.querySelector('.faq-q');
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        items.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  };

  return { init };
})();

/* ─────────── بطاقة التجربة القلّابة ─────────── */
const flip = (() => {
  const init = () => {
    const card = document.getElementById('flipCard');
    if (!card) return;
    card.addEventListener('click', () => {
      const flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', String(flipped));
    });
  };

  return { init };
})();

/* ─────────── التشغيل ─────────── */
document.addEventListener('DOMContentLoaded', () => {
  nav.init();
  rotator.init();
  reveal.init();
  chat.init();
  faq.init();
  flip.init();
});
