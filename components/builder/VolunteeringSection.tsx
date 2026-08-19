'use client';

import type { VolunteeringItem } from '@/lib/types';
import { AddButton, RemoveButton, SectionCard, TextArea, TextInput } from './FormField';
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
    <SectionCard title="التطوع والنوادي الطلابية" icon="fa-users">
      <div className="space-y-4">
        {items.map((vol) => (
          <div key={vol.id} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">نشاط</span>
              <RemoveButton onClick={() => remove(vol.id)} />
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
      <AddButton label="إضافة نشاط طلابي / تطوعي" onClick={() => onChange([...items, emptyVolunteering()])} />
    </SectionCard>
  );
}
