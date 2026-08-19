'use client';

import type { ExperienceItem } from '@/lib/types';
import { SectionCard, TextArea, TextInput } from './FormField';
import EnhanceButton from './EnhanceButton';

function emptyExperience(): ExperienceItem {
  return { id: crypto.randomUUID(), title: '', company: '', duration: '', description: '' };
}

export default function ExperienceSection({
  items,
  onChange,
  onNeedsLogin
}: {
  items: ExperienceItem[];
  onChange: (items: ExperienceItem[]) => void;
  onNeedsLogin: () => void;
}) {
  function update(id: string, patch: Partial<ExperienceItem>) {
    onChange(items.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }
  function remove(id: string) {
    onChange(items.filter((e) => e.id !== id));
  }

  return (
    <SectionCard title="الخبرات العملية والتدريب">
      <div className="space-y-4">
        {items.map((exp) => (
          <div key={exp.id} className="rounded-lg border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">خبرة</span>
              <button type="button" onClick={() => remove(exp.id)} className="text-[11px] text-rose-400 hover:underline">
                حذف
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="المسمى الوظيفي" value={exp.title} onChange={(v) => update(exp.id, { title: v })} />
              <TextInput label="الشركة / الجهة" value={exp.company} onChange={(v) => update(exp.id, { company: v })} />
            </div>
            <TextInput label="الفترة الزمنية" value={exp.duration} onChange={(v) => update(exp.id, { duration: v })} placeholder="2023 - الآن" />
            <TextArea
              label="شرح المهام والإنجازات"
              value={exp.description}
              onChange={(v) => update(exp.id, { description: v })}
              rows={3}
              action={
                <EnhanceButton
                  text={exp.description}
                  type="experience"
                  onEnhanced={(t) => update(exp.id, { description: t })}
                  onNeedsLogin={onNeedsLogin}
                />
              }
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, emptyExperience()])}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-xs font-bold text-slate-300 hover:border-indigo-400 hover:text-white"
      >
        + إضافة خبرة جديدة
      </button>
    </SectionCard>
  );
}
