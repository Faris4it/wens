/* ═══════════════════════════════════════════════
   الدخيل — منطق اللعبة
   حالة بسيطة: إعداد ← توزيع ← نقاش ← تصويت ← حكم
   ═══════════════════════════════════════════════ */
'use strict';

(() => {
  const { $, $$, show, shuffle, pick, arNum, chipGroup } = window.Wens;

  /* ─────────── بنوك الكلمات ─────────── */
  const WORDS = {
    places: [
      'استراحة', 'مخيم برّي', 'كوفي', 'مطعم مشويات', 'البقالة',
      'محطة بنزين', 'صالة أفراح', 'الحلّاق', 'مغسلة سيارات', 'سوق الخضار',
      'ملعب كرة', 'صالة رياضة', 'مكتبة جامعة', 'عيادة أسنان', 'مطار',
    ],
    food: [
      'كبسة', 'جريش', 'مندي', 'مطازيز', 'سليق',
      'لقيمات', 'معصوب', 'مرقوق', 'قهوة سعودية', 'كرك',
      'بروستد', 'تمر', 'كليجا', 'حنيني', 'شاي أتاي',
    ],
    home: [
      'ريموت المكيف', 'دلّة', 'مبخرة', 'ترمس الشاي', 'سجادة المجلس',
      'شاحن الجوال', 'مكنسة', 'طفاية حريق', 'علاقة المفاتيح', 'مروحة سقف',
      'وسادة', 'كاسة ماء', 'ساعة حائط', 'مقص', 'كرتون مناديل',
    ],
  };

  /* أسئلة تحرّك النقاش دون كشف الكلمة */
  const TIPS = [
    'كل واحد يقول: متى آخر مرة كنت قريب من الكلمة؟',
    'اسأل اللي على يمينك سؤال ما يجاوب عليه إلا اللي يعرف الكلمة.',
    'كل واحد يوصفها بكلمة وحدة… غامضة على قد ما يقدر.',
    'مين فيكم يحبها ومين ما يطيقها؟ بدون تفاصيل!',
    'لو صار عندها موقف محرج — وش ممكن يكون؟',
    'قولوا: بكم تشتريها لو تنباع؟ ولا ما تنباع أصلًا؟',
  ];

  /* ─────────── حالة الجولة ─────────── */
  const state = {
    count: 4,
    category: 'places',
    names: [],
    intruder: -1,
    word: '',
    passIndex: 0,
    accused: -1,
    timerId: null,
  };

  /* ─────────── ١ · الإعداد ─────────── */
  const countOut = $('#countOut');
  const cats = chipGroup($('#catChips'));

  const renderCount = () => {
    countOut.textContent = arNum(state.count);
    $('#minus').disabled = state.count <= 3;
    $('#plus').disabled = state.count >= 10;
  };
  $('#minus').addEventListener('click', () => { state.count--; renderCount(); });
  $('#plus').addEventListener('click', () => { state.count++; renderCount(); });
  renderCount();

  $('#toNames').addEventListener('click', () => {
    state.category = cats.value();
    const list = $('#nameList');
    list.innerHTML = '';
    for (let i = 0; i < state.count; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 14;
      input.value = state.names[i] || `لاعب ${arNum(i + 1)}`;
      list.appendChild(input);
    }
    show('names');
  });
  $('#backIntro').addEventListener('click', () => show('intro'));

  /* ─────────── ٢ · التوزيع ─────────── */
  $('#startGame').addEventListener('click', () => {
    state.names = $$('#nameList input').map((el, i) =>
      el.value.trim() || `لاعب ${arNum(i + 1)}`);
    state.word = pick(WORDS[state.category]);
    state.intruder = Math.floor(Math.random() * state.count);
    state.passIndex = 0;
    renderPass();
    show('pass');
  });

  const renderPass = () => {
    $('#passIdx').textContent = `${arNum(state.passIndex + 1)} من ${arNum(state.count)}`;
    $('#passName').textContent = state.names[state.passIndex];
    $('#passNext').hidden = true;
    hideSecret();
  };

  /* الكشف بالضغط المطوّل */
  const secret = $('#secretCard');
  const holdBtn = $('#holdBtn');

  const showSecret = () => {
    const isIntruder = state.passIndex === state.intruder;
    secret.classList.toggle('is-intruder', isIntruder);
    $('#secretHint').textContent = isIntruder
      ? 'أنت الدخيل 🤫'
      : 'الكلمة السرية — لا تعلّق عليها!';
    $('#secretWord').textContent = isIntruder
      ? 'ما عندك كلمة'
      : state.word;
    if (isIntruder) {
      $('#secretWord').style.fontSize = 'clamp(24px, 6vw, 32px)';
      $('#secretHint').insertAdjacentText('beforeend', '');
    } else {
      $('#secretWord').style.fontSize = '';
    }
    secret.classList.add('is-open');
    $('#passNext').hidden = false;
  };
  const hideSecret = () => secret.classList.remove('is-open');

  ['pointerdown', 'keydown'].forEach((ev) =>
    holdBtn.addEventListener(ev, (e) => {
      if (ev === 'keydown' && e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      showSecret();
    }));
  ['pointerup', 'pointerleave', 'pointercancel', 'keyup'].forEach((ev) =>
    holdBtn.addEventListener(ev, hideSecret));
  holdBtn.addEventListener('contextmenu', (e) => e.preventDefault());

  $('#passNext').addEventListener('click', () => {
    state.passIndex++;
    if (state.passIndex < state.count) {
      renderPass();
    } else {
      startTalk();
      show('talk');
    }
  });

  /* ─────────── ٣ · النقاش ─────────── */
  const TALK_SECONDS = 180;
  const fill = $('.timer-ring .fill', $('[data-screen="talk"]'));

  const startTalk = () => {
    $('#talkTip').textContent = pick(TIPS);
    let left = TALK_SECONDS;
    const tipCycle = setInterval(() => { $('#talkTip').textContent = pick(TIPS); }, 40000);
    const paint = () => {
      const m = Math.floor(left / 60);
      const s = String(left % 60).padStart(2, '0');
      $('#talkTimer').textContent = arNum(`${m}:${s}`);
      fill.style.strokeDasharray = '100';
      fill.style.strokeDashoffset = String(100 - (left / TALK_SECONDS) * 100);
      $('.timer-ring', $('[data-screen="talk"]')).classList.toggle('is-danger', left <= 20);
    };
    paint();
    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      left--;
      paint();
      if (left <= 0) {
        clearInterval(state.timerId);
        clearInterval(tipCycle);
        goVote();
      }
    }, 1000);
    $('#toVote').onclick = () => {
      clearInterval(state.timerId);
      clearInterval(tipCycle);
      goVote();
    };
  };

  /* ─────────── ٤ · التصويت ─────────── */
  const goVote = () => {
    const list = $('#voteList');
    list.innerHTML = '';
    state.names.forEach((name, i) => {
      const b = document.createElement('button');
      b.className = 'vote-btn';
      b.textContent = name;
      b.addEventListener('click', () => {
        state.accused = i;
        renderReveal();
        show('reveal');
      });
      list.appendChild(b);
    });
    show('vote');
  };

  /* ─────────── ٥ · النتيجة والحكم ─────────── */
  const renderReveal = () => {
    const caught = state.accused === state.intruder;
    $('#revealEmoji').textContent = caught ? '🎯' : '😏';
    $('#revealTitle').textContent = caught
      ? `انكشف! ${state.names[state.intruder]} هو الدخيل`
      : `خسارة… ${state.names[state.accused]} بريء`;
    $('#revealSub').textContent = caught
      ? 'شكّكم بمحله. بس اللعبة ما خلصت —'
      : `الدخيل الحقيقي كان: ${state.names[state.intruder]} — ونجا بذكائه 🕶️`;
    $('#lastChance').hidden = !caught;
    $('#revealWordBtn').textContent = caught ? 'اكشفوا الكلمة' : 'طيب وش كانت الكلمة؟';
    state.caught = caught;
  };

  $('#revealWordBtn').addEventListener('click', () => {
    $('#finalWord').textContent = state.word;
    const needJudge = state.caught; // المكشوف له فرصة التخمين
    $('#judgeBox').hidden = !needJudge;
    $('#finalBox').hidden = needJudge;
    if (!needJudge) {
      $('#finalEmoji').textContent = '🏆';
      $('#finalTitle').textContent = 'فوز الدخيل!';
      $('#finalSub').textContent = 'ضحك عليكم وطلع من الحلقة سالم. عيدوها وردّوا اعتباركم.';
      showEndButtons();
      window.Wens.confetti(40);
    }
    show('verdict');
  });

  const judge = (guessed) => {
    $('#judgeBox').hidden = true;
    $('#finalBox').hidden = false;
    $('#finalEmoji').textContent = guessed ? '🃏' : '🎉';
    $('#finalTitle').textContent = guessed
      ? 'نجا في آخر لحظة!'
      : 'فوز الحلقة!';
    $('#finalSub').textContent = guessed
      ? `${state.names[state.intruder]} خمّن الكلمة وقلبها عليكم. نقطة للدخيل.`
      : 'كشفتوه وما عرف الكلمة — الحلقة أقوى. نقطة لكم.';
    showEndButtons();
    window.Wens.confetti(guessed ? 30 : 60);
  };
  $('#guessYes').addEventListener('click', () => judge(true));
  $('#guessNo').addEventListener('click', () => judge(false));

  const showEndButtons = () => {
    $('#again').hidden = false;
    $('#reset').hidden = false;
  };

  $('#again').addEventListener('click', () => {
    $('#again').hidden = true;
    $('#reset').hidden = true;
    $('#finalBox').hidden = true;
    state.word = pick(WORDS[state.category]);
    state.intruder = Math.floor(Math.random() * state.count);
    state.passIndex = 0;
    renderPass();
    show('pass');
  });
  $('#reset').addEventListener('click', () => {
    $('#again').hidden = true;
    $('#reset').hidden = true;
    $('#finalBox').hidden = true;
    show('intro');
  });
})();
