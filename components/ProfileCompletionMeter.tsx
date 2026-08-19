'use client';

import { useMemo } from 'react';
import type { Portfolio } from '@/lib/types';

interface Weighted {
  key: string;
  label: string;
  weight: number;
  done: boolean;
  tip: string;
}

export function computeCompletion(p: Portfolio): { percent: number; items: Weighted[] } {
  const items: Weighted[] = [
    { key: 'name', label: 'الاسم الكامل', weight: 10, done: p.name.trim().length > 0, tip: 'أضف اسمك الكامل ليظهر في أعلى الصفحة.' },
    { key: 'photo', label: 'الصورة الشخصية', weight: 8, done: p.photoUrl.trim().length > 0, tip: 'أضف رابط صورة شخصية احترافية.' },
    { key: 'bio', label: 'النبذة التعريفية', weight: 15, done: p.bio.trim().length >= 30, tip: 'اكتب نبذة من جملتين إلى ثلاث تصف خبرتك وأهدافك.' },
    { key: 'education', label: 'التعليم', weight: 8, done: p.education.trim().length > 0, tip: 'أضف جامعتك أو تخصصك الدراسي.' },
    { key: 'skills', label: 'المهارات', weight: 12, done: p.skills.split(',').map((s) => s.trim()).filter(Boolean).length >= 3, tip: 'أضف 3 مهارات تقنية على الأقل.' },
    { key: 'projects', label: 'المشاريع', weight: 15, done: p.projects.length > 0, tip: 'أضف مشروعاً واحداً على الأقل لإبراز أعمالك.' },
    { key: 'experiences', label: 'الخبرات', weight: 12, done: p.experiences.length > 0, tip: 'أضف خبرة عملية أو تدريبية واحدة على الأقل.' },
    { key: 'certificates', label: 'الشهادات', weight: 6, done: p.certificates.length > 0, tip: 'أضف شهادة أو اعتماداً حصلت عليه.' },
    { key: 'volunteering', label: 'التطوع', weight: 4, done: p.volunteering.length > 0, tip: 'أضف نشاطاً تطوعياً أو طلابياً إن وجد.' },
    { key: 'contact', label: 'معلومات التواصل', weight: 10, done: Boolean(p.email || p.phone || p.linkedinUrl || p.githubUrl), tip: 'أضف بريدك الإلكتروني أو رابط LinkedIn/GitHub.' }
  ];

  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const doneWeight = items.filter((i) => i.done).reduce((sum, i) => sum + i.weight, 0);
  const percent = Math.round((doneWeight / totalWeight) * 100);

  return { percent, items };
}

export default function ProfileCompletionMeter({ portfolio }: { portfolio: Portfolio }) {
  const { percent, items } = useMemo(() => computeCompletion(portfolio), [portfolio]);

  const nextTip = useMemo(() => {
    const missing = items.filter((i) => !i.done).sort((a, b) => b.weight - a.weight);
    return missing[0]?.tip ?? 'ملفك الشخصي مكتمل! يمكنك الآن النشر بثقة.';
  }, [items]);

  const color = percent >= 80 ? 'text-emerald-400' : percent >= 50 ? 'text-amber-400' : 'text-rose-400';
  const barColor = percent >= 80 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">اكتمال الملف الشخصي</span>
        <span className={`text-sm font-extrabold ${color}`}>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">💡 {nextTip}</p>
    </div>
  );
}
