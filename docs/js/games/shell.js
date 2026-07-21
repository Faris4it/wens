/* ═══════════════════════════════════════════════
   وِنس — أدوات مشتركة بين الألعاب الثلاث
   (بدون وحدات ES حتى تعمل الملفات محليًا وعلى GitHub Pages)
   ═══════════════════════════════════════════════ */
'use strict';

window.Wens = (() => {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* التنقّل بين شاشات اللعبة */
  const show = (name) => {
    $$('[data-screen]').forEach((s) =>
      s.classList.toggle('is-active', s.dataset.screen === name));
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  };

  /* خلط مصفوفة (Fisher–Yates) دون تعديل الأصل */
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* أرقام هندية-عربية للاتساق مع هوية الموقع */
  const arNum = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

  /* مجموعة رقائق يُختار منها خيار واحد */
  const chipGroup = (container, onChange) => {
    const chips = $$('.chip-btn', container);
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        if (onChange) onChange(chip.dataset.value);
      });
    });
    return {
      value: () => $('.chip-btn[aria-pressed="true"]', container)?.dataset.value,
      set: (v) => {
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.value === v)));
      },
    };
  };

  /* قصاصات احتفال بألوان الحلقة */
  const confetti = (count = 60) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    const colors = ['#E8833A', '#E85D75', '#7FA98F', '#E8B44A'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('i');
      p.style.insetInlineStart = `${Math.random() * 100}%`;
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = `${2.2 + Math.random() * 2.4}s`;
      p.style.animationDelay = `${Math.random() * .9}s`;
      const s = .6 + Math.random() * .9;
      p.style.transform = `scale(${s})`;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 6200);
  };

  return { $, $$, show, shuffle, pick, arNum, chipGroup, confetti };
})();
