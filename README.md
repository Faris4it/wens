# وِنس — Wens

موقع تعريفي ثابت لمنصة «وِنس» للألعاب الجماعية.
HTML5 + CSS3 + JavaScript (ES6) فقط — بدون أي مكتبات أو أدوات بناء.

## البنية

الموقع المنشور بالكامل داخل `docs/` (متطلب GitHub Pages عند النشر من فرع `main`):

```
docs/
├── index.html              الصفحة الرئيسية
├── games/                  صفحات الألعاب المستقلة
│   ├── dakheel.html
│   ├── khams.html
│   └── qahwa.html
├── css/
│   ├── styles.css          ورقة الأنماط الرئيسية (مفهرسة بالأقسام)
│   └── game.css            أنماط خاصة بصفحات الألعاب
├── js/
│   ├── main.js              التفاعلات العامة للصفحة الرئيسية
│   └── games/                منطق كل لعبة + shell.js المشترك بينها
└── assets/
    ├── logo.svg, logo-dark.svg, logo-mark.svg
    └── fonts/cairo-var.woff2   خط Cairo مستضاف محليًا
```

ملفات غير منشورة (تبقى خارج `docs/` كمرجع تصميم فقط): `assets/brand-logo.html` ومتغيرات الشعار الإضافية، و`unused-assests/`.

## النشر على GitHub Pages

1. ادفع المستودع إلى GitHub.
2. من Settings → Pages اختر الفرع `main` والمجلد `/docs`.
3. الموقع سيعمل مباشرة على `https://<username>.github.io/<repo>/` — كل المسارات نسبية ولا توجد أي اعتماديات خارجية.

## ملاحظات

- الخط Cairo مضمّن كملف `woff2` مقتطع (٨٧KB لكل الأوزان) — لا حاجة لـ Google Fonts.
- شعارات SVG بنصوص محوّلة لمسارات: تعمل في أي سياق بدون تحميل خطوط.
- الموقع يحترم `prefers-reduced-motion` ويدعم التنقل بلوحة المفاتيح.
