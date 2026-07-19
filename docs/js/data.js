/* ==========================================================================
   وِنس (Wens) — Static prototype data
   In the real product this would come from an API. For this static MVP it's
   plain data used to render the games grid, testimonials, and FAQ.
   ========================================================================== */

const WENS_GAMES = [
  {
    id: 'g1',
    name: 'أساطير الحرب',
    category: 'أكشن',
    description: 'ملحمة قتالية بطابع أسطوري وقصة مشوقة تأخذك بين الممالك.',
    price: 45,
    oldPrice: 60,
    rating: 4.8,
    cover: 'assets/images/cover-1.svg',
    badge: 'الأكثر مبيعًا',
  },
  {
    id: 'g2',
    name: 'سباق الأبطال',
    category: 'سباقات',
    description: 'سباقات سيارات عالية السرعة مع تحكم واقعي وحلبات متنوعة.',
    price: 30,
    oldPrice: null,
    rating: 4.5,
    cover: 'assets/images/cover-2.svg',
    badge: null,
  },
  {
    id: 'g3',
    name: 'مستعمرة المريخ',
    category: 'مغامرات',
    description: 'استكشف كوكبًا غريبًا وابنِ مستعمرتك الخاصة على المريخ.',
    price: 60,
    oldPrice: 75,
    rating: 4.9,
    cover: 'assets/images/cover-3.svg',
    badge: 'جديد',
  },
  {
    id: 'g4',
    name: 'نجوم الملعب',
    category: 'رياضة',
    description: 'كوّن فريق أحلامك وتنافس في دوريات كرة القدم الليلية.',
    price: 25,
    oldPrice: null,
    rating: 4.3,
    cover: 'assets/images/cover-4.svg',
    badge: null,
  },
  {
    id: 'g5',
    name: 'مملكة الألغاز',
    category: 'ألغاز',
    description: 'مئات المراحل الذهنية المصممة لتتحدى تفكيرك خطوة بخطوة.',
    price: 20,
    oldPrice: 28,
    rating: 4.6,
    cover: 'assets/images/cover-5.svg',
    badge: 'عرض خاص',
  },
  {
    id: 'g6',
    name: 'جزيرة الناجين',
    category: 'بقاء',
    description: 'اجمع الموارد، ابنِ ملجأك، وابقَ آخر الناجين في الجزيرة.',
    price: 35,
    oldPrice: null,
    rating: 4.4,
    cover: 'assets/images/cover-6.svg',
    badge: null,
  },
];

const WENS_TESTIMONIALS = [
  {
    id: 't1',
    name: 'عبدالله الحربي',
    role: 'لاعب أساسي',
    quote: 'أسرع منصة تعاملت معها للحصول على الألعاب، والأسعار فعلاً مناسبة مقارنة بالمتاجر الثانية.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'سارة القحطاني',
    role: 'مطورة برمجيات',
    quote: 'تجربة الشراء سلسة والتصميم مريح للعين، صارت وِنس وجهتي الأولى للألعاب الرقمية.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'محمد العتيبي',
    role: 'محتوى ألعاب',
    quote: 'الدعم الفني رد علي بسرعة وحل مشكلتي خلال دقائق، فريق محترف فعلاً.',
    rating: 4,
  },
];

const WENS_FAQ = [
  {
    id: 'f1',
    question: 'هل الألعاب المتوفرة على وِنس أصلية؟',
    answer: 'نعم، جميع الألعاب المعروضة على المنصة أصلية ومرخّصة بالكامل، ونحرص على التعامل مع مزودين موثوقين فقط.',
  },
  {
    id: 'f2',
    question: 'كم يستغرق استلام اللعبة بعد الشراء؟',
    answer: 'عملية الشراء والتفعيل تتم بشكل فوري تقريبًا، وستصلك تفاصيل التفعيل مباشرة بعد إتمام الدفع.',
  },
  {
    id: 'f3',
    question: 'ما وسائل الدفع المتاحة؟',
    answer: 'هذا نموذج أولي (Prototype) لعرض التصميم فقط، وسيتم لاحقًا دعم وسائل الدفع المحلية والعالمية المناسبة.',
  },
  {
    id: 'f4',
    question: 'هل يوجد دعم فني بعد الشراء؟',
    answer: 'بالتأكيد، فريق الدعم الفني متاح لمساعدتك في أي استفسار أو مشكلة تتعلق بالتفعيل أو الحساب.',
  },
  {
    id: 'f5',
    question: 'هل يمكنني استرجاع أو استبدال لعبة؟',
    answer: 'تخضع عمليات الاسترجاع لسياسة استخدام واضحة سيتم نشرها ضمن الإصدار الكامل من المنصة.',
  },
];
