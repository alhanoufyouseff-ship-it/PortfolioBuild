'use client';

import type { VolunteeringItem } from '@/lib/types';
import { SectionCard, TextArea, TextInput } from './FormField';
import EnhanceButton from './EnhanceButton';

function emptyVolunteering(): VolunteeringItem {
  return { id: crypto.randomUUID(), role: '', organization: '', duration: '', description: '', logoUrl: '' };
}

export default function VolunteeringSection({
  items,
  onChange,
  onNeedsLogin
}: {
  items: VolunteeringItem[];
  onChange: (items: VolunteeringItem[]) => void;
  onNeedsLogin: () => void;
}) {
  function update(id: string, patch: Partial<VolunteeringItem>) {
    onChange(items.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }
  function remove(id: string) {
    onChange(items.filter((v) => v.id !== id));
  }

  return (
    <SectionCard title="التطوع والنوادي الطلابية">
      <div className="space-y-4">
        {items.map((vol) => (
          <div key={vol.id} className="rounded-lg border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">نشاط</span>
              <button type="button" onClick={() => remove(vol.id)} className="text-[11px] text-rose-400 hover:underline">
                حذف
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="المسمى / الدور" value={vol.role} onChange={(v) => update(vol.id, { role: v })} placeholder="رئيس نادي الحاسب" />
              <TextInput label="اسم النادي / المنظمة" value={vol.organization} onChange={(v) => update(vol.id, { organization: v })} />
            </div>
            <TextInput label="الفترة الزمنية" value={vol.duration} onChange={(v) => update(vol.id, { duration: v })} />
            <TextArea
              label="شرح الأنشطة والمساهمات"
              value={vol.description}
              onChange={(v) => update(vol.id, { description: v })}
              rows={3}
              action={
                <EnhanceButton
                  text={vol.description}
                  type="volunteering"
                  onEnhanced={(t) => update(vol.id, { description: t })}
                  onNeedsLogin={onNeedsLogin}
                />
              }
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, emptyVolunteering()])}
        className="w-full rounded-lg border border-dashed border-white/20 py-2 text-xs font-bold text-slate-300 hover:border-indigo-400 hover:text-white"
      >
        + إضافة نشاط طلابي / تطوعي
      </button>
    </SectionCard>
  );
}
