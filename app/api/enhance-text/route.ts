import { NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { AuthError, requireAuthedUid } from '@/lib/firebase/admin';

export const runtime = 'nodejs';
export const maxDuration = 30;

type EnhanceType = 'bio' | 'project' | 'experience' | 'volunteering';

const TYPE_INSTRUCTIONS: Record<EnhanceType, string> = {
  bio: 'أعد صياغة النبذة التعريفية التالية بأسلوب احترافي وجذاب، بحد أقصى 3 جمل، مع الحفاظ على نفس اللغة المستخدمة في النص الأصلي.',
  project: 'أعد صياغة وصف المشروع التالي بأسلوب احترافي يبرز الأثر والتقنيات المستخدمة، بحد أقصى 4 جمل، بنفس لغة النص الأصلي.',
  experience: 'أعد صياغة وصف الخبرة العملية التالية بأسلوب احترافي يبرز الإنجازات والمهام الرئيسية، بحد أقصى 4 جمل، بنفس لغة النص الأصلي.',
  volunteering: 'أعد صياغة وصف النشاط التطوعي/الطلابي التالي بأسلوب احترافي يبرز المساهمة والقيادة، بحد أقصى 3 جمل، بنفس لغة النص الأصلي.'
};

export async function POST(request: Request) {
  try {
    await requireAuthedUid(request);

    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    const type = (typeof body?.type === 'string' ? body.type : 'bio') as EnhanceType;

    if (!text) {
      return NextResponse.json({ success: false, error: 'النص مطلوب' }, { status: 400 });
    }

    const instruction = TYPE_INSTRUCTIONS[type] || TYPE_INSTRUCTIONS.bio;

    const enhanced = await callOpenRouter(
      [
        {
          role: 'system',
          content: 'أنت محرر محتوى احترافي متخصص في صياغة نصوص البورتفوليو والسير الذاتية. أعد النص المحسّن فقط بدون أي مقدمات أو علامات اقتباس.'
        },
        { role: 'user', content: `${instruction}\n\nالنص الأصلي:\n${text}` }
      ],
      { temperature: 0.6 }
    );

    return NextResponse.json({ success: true, enhancedText: enhanced.trim() });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 401 });
    }
    const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء تحسين الصياغة';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
