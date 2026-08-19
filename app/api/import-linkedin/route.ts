import { NextResponse } from 'next/server';
import { isValidLinkedInUrl, scrapeLinkedInProfile } from '@/lib/apify';
import { callOpenRouter, extractJson } from '@/lib/openrouter';
import { AuthError, requireAuthedUid } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const STRUCTURE_SYSTEM_PROMPT = `أنت مساعد يقوم بتحويل بيانات بروفايل LinkedIn العامة الخام (JSON) إلى بيانات بورتفوليو منظمة.
أعد فقط كائن JSON صالح بالمخطط التالي بدون أي نص إضافي أو شرح:
{
  "name": string,
  "bio": string,               // نبذة تعريفية احترافية من 2-3 جمل بالعربية
  "education": string,         // آخر مؤهل تعليمي (الجامعة/التخصص)
  "skills": string,            // مهارات مفصولة بفواصل
  "experiences": [ { "title": string, "company": string, "duration": string, "description": string } ],
  "certificates": [ { "title": string, "issuer": string, "year": string } ],
  "volunteering": [ { "role": string, "organization": string, "duration": string, "description": string } ]
}
اجعل الحقول الفارغة نصاً فارغاً "" أو مصفوفة فارغة [] إن لم تتوفر بيانات كافية. لا تختلق معلومات غير موجودة في المصدر.`;

export async function POST(request: Request) {
  try {
    await requireAuthedUid(request);

    const body = await request.json();
    const linkedinUrl = typeof body?.linkedinUrl === 'string' ? body.linkedinUrl.trim() : '';

    if (!linkedinUrl || !isValidLinkedInUrl(linkedinUrl)) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال رابط LinkedIn صالح مثل https://linkedin.com/in/username' },
        { status: 400 }
      );
    }

    const rawProfile = await scrapeLinkedInProfile(linkedinUrl);

    const aiResponse = await callOpenRouter(
      [
        { role: 'system', content: STRUCTURE_SYSTEM_PROMPT },
        { role: 'user', content: JSON.stringify(rawProfile).slice(0, 15000) }
      ],
      { json: true, temperature: 0.3 }
    );

    const structured = extractJson<Record<string, unknown>>(aiResponse);

    return NextResponse.json({ success: true, data: structured });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الاستيراد';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
