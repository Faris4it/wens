/* ═══════════════════════════════════════════════
   خمس ثواني — منطق اللعبة
   فريقان يتناوبان، مؤقّت ٥ ثوانٍ، أول من يبلغ الهدف يفوز
   ═══════════════════════════════════════════════ */
'use strict';

(() => {
  const { $, show, shuffle, arNum, chipGroup, confetti } = window.Wens;

  /* ─────────── بنوك التحديات ─────────── */
  const PACKS = {
    mix: [
      'سمّ ٣ أكلات فيها رز',
      'سمّ ٣ أشياء تلقاها في أي عزيمة',
      'سمّ ٣ فرق كرة سعودية',
      'سمّ ٣ أشياء تاخذها للمخيم',
      'سمّ ٣ أسماء أولاد تبدأ بحرف الميم',
      'سمّ ٣ أشياء باردة',
      'سمّ ٣ أعذار مشهورة للتأخير',
      'سمّ ٣ أشياء موجودة في شنطة السيارة',
      'سمّ ٣ نكهات آيسكريم',
      'سمّ ٣ أشياء تسويها لو راح النت',
      'سمّ ٣ مدن سعودية ما فيها بحر',
      'سمّ ٣ أشياء لونها أخضر',
      'سمّ ٣ وظايف تحتاج زي رسمي',
      'سمّ ٣ أشياء تنسيها دايم',
      'سمّ ٣ أصوات تسمعها الصبح',
      'سمّ ٣ أشياء في المطبخ تشتغل بالكهرب',
    ],
    ramadan: [
      'سمّ ٣ أصناف على سفرة الفطور',
      'سمّ ٣ أشياء تسويها بعد التراويح',
      'سمّ ٣ خيارات سحور خفيف',
      'سمّ ٣ عبارات تسمعها قبل أذان المغرب',
      'سمّ ٣ مشروبات رمضانية',
      'سمّ ٣ أشياء تتغير في يومك برمضان',
      'سمّ ٣ حلويات ما تختفي من رمضان',
      'سمّ ٣ أشياء تجهزها العيلة للعيد',
      'سمّ ٣ أوقات يكون فيها الزحام عالآخر',
      'سمّ ٣ أشياء تقولها لما توصل متأخر عن الفطور',
      'سمّ ٣ أشياء في صينية الشاي',
      'سمّ ٣ أسباب تخليك تسهر لين السحور',
    ],
    family: [
      'سمّ ٣ جمل تسمعها في كل اجتماع عائلي',
      'سمّ ٣ ألعاب كنتم تلعبونها صغار',
      'سمّ ٣ أشياء ما تخلو منها سيارة العيلة بالمشوار',
      'سمّ ٣ مناسبات تجمع العيلة كلها',
      'سمّ ٣ أكلات ما يضبطها إلا بيت العيلة',
      'سمّ ٣ أشياء يتفنن فيها أهل البيت بالضيافة',
      'سمّ ٣ برامج كانت تجمعكم قدام التلفزيون',
      'سمّ ٣ أشياء تلقاها في مجلس الجد',
      'سمّ ٣ أسئلة يسألونها الطالب آخر السنة',
      'سمّ ٣ أشياء تصير لما تنقطع الكهرب بالبيت',
      'سمّ ٣ هدايا تنجح مع أي أحد بالعيلة',
      'سمّ ٣ أشياء يسوونها الصغار وتضحّك الكبار',
    ],
  };

  const TEAMS = ['فريق الدلّة', 'فريق الفنجال'];

  /* ─────────── حالة اللعبة ─────────── */
  const state = {
    deck: [],
    deckPos: 0,
    scores: [0, 0],
    turn: 0,
    target: 7,
    running: false,
    raf: 0,
  };

  const packs = chipGroup($('#packChips'));
  const targets = chipGroup($('#targetChips'));

  /* اختيار حزمة رمضان تلقائيًا لو جاي من بطاقة رمضان */
  const urlPack = new URLSearchParams(location.search).get('pack');
  if (urlPack && PACKS[urlPack]) packs.set(urlPack);

  /* ─────────── بدء اللعبة ─────────── */
  $('#startBtn').addEventListener('click', () => {
    state.deck = shuffle(PACKS[packs.value()]);
    state.deckPos = 0;
    state.scores = [0, 0];
    state.turn = 0;
    state.target = Number(targets.value());
    renderTurn();
    show('turn');
  });

  const renderScores = () => {
    $('#scoreA').textContent = arNum(state.scores[0]);
    $('#scoreB').textContent = arNum(state.scores[1]);
    $('#pillA').classList.toggle('is-turn', state.turn === 0);
    $('#pillB').classList.toggle('is-turn', state.turn === 1);
  };

  const renderTurn = () => {
    renderScores();
    $('#turnTeam').textContent = TEAMS[state.turn];
  };

  /* ─────────── التحدي الحي ─────────── */
  const nextPrompt = () => {
    if (state.deckPos >= state.deck.length) {
      state.deck = shuffle(state.deck);
      state.deckPos = 0;
    }
    return state.deck[state.deckPos++];
  };

  $('#showPrompt').addEventListener('click', () => {
    $('#promptText').textContent = nextPrompt();
    $('#goBtn').hidden = false;
    $('#judgeRow').hidden = true;
    $('#countNum').textContent = '٥';
    const fill = $('#ring .fill');
    fill.style.strokeDasharray = '100';
    fill.style.strokeDashoffset = '0';
    $('#ring').classList.remove('is-danger');
    show('live');
  });

  const DURATION = 5000;
  $('#goBtn').addEventListener('click', () => {
    if (state.running) return;
    state.running = true;
    $('#goBtn').hidden = true;
    const fill = $('#ring .fill');
    const start = performance.now();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1);
      if (!reduced) fill.style.strokeDashoffset = String(t * 100);
      const left = Math.ceil((1 - t) * 5);
      $('#countNum').textContent = arNum(Math.max(left, 0));
      $('#ring').classList.toggle('is-danger', t > .6);
      if (t < 1) {
        state.raf = requestAnimationFrame(tick);
      } else {
        state.running = false;
        $('#countNum').textContent = '⏰';
        if (navigator.vibrate) navigator.vibrate(180);
        $('#judgeRow').hidden = false;
      }
    };
    state.raf = requestAnimationFrame(tick);
  });

  /* ─────────── التحكيم والنقاط ─────────── */
  const score = (success) => {
    if (success) state.scores[state.turn]++;
    if (state.scores[state.turn] >= state.target) {
      $('#winTitle').textContent = `${TEAMS[state.turn]} خذاها!`;
      $('#winScore').textContent =
        `النتيجة: ${arNum(state.scores[0])} — ${arNum(state.scores[1])}. تستاهلون فنجال زيادة ☕`;
      confetti(70);
      show('win');
      return;
    }
    state.turn = 1 - state.turn;
    renderTurn();
    show('turn');
  };
  $('#passBtn').addEventListener('click', () => score(true));
  $('#failBtn').addEventListener('click', () => score(false));

  /* ─────────── إعادة ─────────── */
  $('#rematch').addEventListener('click', () => {
    state.scores = [0, 0];
    state.turn = Math.round(Math.random());
    state.deck = shuffle(state.deck);
    state.deckPos = 0;
    renderTurn();
    show('turn');
  });
  $('#toSetup').addEventListener('click', () => show('intro'));
})();
