'use client';

import type { ExperienceItem } from '@/lib/types';
import { AddButton, RemoveButton, SectionCard, TextArea, TextInput } from './FormField';
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
    <SectionCard title="الخبرات العملية والتدريب" icon="fa-briefcase">
      <div className="space-y-4">
        {items.map((exp) => (
          <div key={exp.id} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">خبرة</span>
              <RemoveButton onClick={() => remove(exp.id)} />
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
      <AddButton label="إضافة خبرة جديدة" onClick={() => onChange([...items, emptyExperience()])} />
    </SectionCard>
  );
}
