# 🚀 PortfolioBuild

باني بورتفوليو تفاعلي للمطورين وطلاب الجامعات — مبني بـ **Next.js 14 (App Router)**، **TypeScript**، و**Tailwind CSS**، ومتوافق بالكامل مع معمارية **Vercel**.

## المزايا

- **بناء وتخصيص كامل** بدون قيود على الصفحة الرئيسية: بيانات شخصية، مشاريع، خبرات، شهادات، تطوع، نمط بصري، لوحة ألوان، ولغة (عربي/إنجليزي).
- **صفحات بورتفوليو عامة** على `/p/[username]` — متاحة للجميع، متجاوبة، وتدعم الثيم وشبكة الخلفية التفاعلية (Neural Canvas).
- **استيراد من LinkedIn** عبر Apify + هيكلة تلقائية بالذكاء الاصطناعي عبر OpenRouter.
- **تحسين الصياغة بالذكاء الاصطناعي** لكل نص (نبذة، مشاريع، خبرات، تطوع).
- **مطابقة الفرص الوظيفية**: يقارن مهاراتك وشهاداتك مع وظائف حقيقية ويعرض نسبة التطابق والمهارات الناقصة.
- **مؤشر اكتمال الملف الشخصي** مع نصائح ديناميكية.
- **تسجيل الدخول والتخزين عبر Firebase** (Authentication + Firestore).

## البنية التقنية

| الطبقة | التقنية |
| --- | --- |
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication (Email/Password + Google) |
| Database | Firestore (عبر Firebase Admin SDK — لا يتم الوصول له مباشرة من المتصفح) |
| LinkedIn Import | Apify API |
| AI (هيكلة + تحسين الصياغة + مطابقة الوظائف) | OpenRouter API |
| Hosting | Vercel |

## البدء السريع (تطوير محلي)

```bash
npm install
cp .env.example .env.local   # ثم عبّئ القيم الحقيقية
npm run dev
```

افتح http://localhost:3000

## متغيرات البيئة

راجع `.env.example` للحصول على القائمة الكاملة. **لا يتم قراءة أي مفتاح سري إلا من كود السيرفر (`process.env`)** — لا شيء يُسرّب للمتصفح باستثناء مفاتيح Firebase العامة (`NEXT_PUBLIC_FIREBASE_*`) وهي آمنة للعرض حسب تصميم Firebase.

- `NEXT_PUBLIC_FIREBASE_*` — إعداد Firebase من جهة العميل (للمصادقة فقط).
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — Firebase Admin SDK (سري، من Service Account).
- `APIFY_API_KEY` — لاستيراد بيانات LinkedIn العامة.
- `OPENROUTER_API_KEY` — لتشغيل ميزات الذكاء الاصطناعي.
- `JOB_SEARCH_API_KEY` — لجلب الفرص الوظيفية (اختياري؛ بدونه يعمل النظام ببيانات تجريبية عبر Remotive).

`.env.local` مضاف إلى `.gitignore` ولن يُرفع أبداً لضبط النسخة الفعلية على Vercel، استخدم **Project → Settings → Environment Variables**.

## النشر على Vercel

المشروع Next.js قياسي — يكفي ربط المستودع بـ Vercel وضبط متغيرات البيئة أعلاه؛ لا حاجة لأي `vercel.json` مخصص.

## هيكل المجلدات

```
app/
  page.tsx                    # الصفحة الرئيسية / الباني (عامة بالكامل)
  p/[username]/page.tsx       # صفحة البورتفوليو العامة
  api/
    publish/route.ts          # حفظ البورتفوليو في Firestore (يتطلب تسجيل دخول)
    portfolio/[username]/     # جلب بيانات بورتفوليو عام
    me/route.ts                # جلب بورتفوليو المستخدم الحالي
    import-linkedin/route.ts  # Apify + OpenRouter
    enhance-text/route.ts     # تحسين الصياغة عبر OpenRouter
    jobs-match/route.ts       # مطابقة الوظائف
components/
  BuilderApp.tsx               # المنسّق الرئيسي لصفحة الباني
  PortfolioView.tsx            # عرض البورتفوليو (يُستخدم للمعاينة والصفحة العامة)
  NeuralCanvas.tsx             # خلفية الجسيمات التفاعلية
  ProfileCompletionMeter.tsx
  builder/                     # مكونات نموذج الباني (أقسام، أزرار، لوحة التخصيص)
lib/
  firebase/client.ts           # Firebase Auth (عميل)
  firebase/admin.ts            # Firebase Admin (سيرفر فقط)
  openrouter.ts / apify.ts / jobs.ts
  theme.ts / types.ts / slug.ts
```
