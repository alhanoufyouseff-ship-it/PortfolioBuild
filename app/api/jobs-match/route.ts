import { NextResponse } from 'next/server';
import { fetchJobListings } from '@/lib/jobs';
import { callOpenRouter, extractJson } from '@/lib/openrouter';
import { AuthError, requireAuthedUid } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MATCH_SYSTEM_PROMPT = `أنت مساعد توظيف ذكي. ستحصل على مهارات وشهادات مرشح، وقائمة وظائف (عنوان + وصف).
لكل وظيفة، احسب نسبة مطابقة تقريبية (0-100) بين مهارات المرشح ومتطلبات الوظيفة، وحدد أهم 3-5 مهارات ناقصة.
أعد فقط كائن JSON بالمخطط التالي بدون أي نص إضافي:
{
  "matches": [
    { "jobId": string, "matchPercent": number, "missingSkills": string[] }
  ]
}`;

export async function POST(request: Request) {
  try {
    await requireAuthedUid(request);

    const body = await request.json();
    const skills = typeof body?.skills === 'string' ? body.skills.trim() : '';
    const certificates = Array.isArray(body?.certificates) ? body.certificates : [];
    const query = typeof body?.query === 'string' && body.query.trim() ? body.query.trim() : skills.split(',')[0] || 'software developer';

    if (!skills) {
      return NextResponse.json({ success: false, error: 'أضف مهاراتك أولاً لمطابقتها مع الوظائف' }, { status: 400 });
    }

    const { jobs, demo } = await fetchJobListings(query);

    if (jobs.length === 0) {
      return NextResponse.json({ success: true, demo, results: [] });
    }

    const aiResponse = await callOpenRouter(
      [
        { role: 'system', content: MATCH_SYSTEM_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({
            skills,
            certificates,
            jobs: jobs.map((j) => ({ jobId: j.id, title: j.title, description: j.description }))
          }).slice(0, 18000)
        }
      ],
      { json: true, temperature: 0.2 }
    );

    const parsed = extractJson<{ matches: { jobId: string; matchPercent: number; missingSkills: string[] }[] }>(
      aiResponse
    );

    const matchById = new Map(parsed.matches.map((m) => [m.jobId, m]));

    const results = jobs.map((job) => ({
      ...job,
      matchPercent: matchById.get(job.id)?.matchPercent ?? 0,
      missingSkills: matchById.get(job.id)?.missingSkills ?? []
    }));

    results.sort((a, b) => b.matchPercent - a.matchPercent);

    return NextResponse.json({ success: true, demo, results });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء مطابقة الوظائف';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
