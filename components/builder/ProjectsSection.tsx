'use client';

import type { ProjectItem } from '@/lib/types';
import { AddButton, RemoveButton, SectionCard, TextArea, TextInput } from './FormField';
import EnhanceButton from './EnhanceButton';

function emptyProject(): ProjectItem {
  return { id: crypto.randomUUID(), title: '', description: '', tags: '', projectLink: '', imageUrl: '' };
}

export default function ProjectsSection({
  items,
  onChange,
  onNeedsLogin
}: {
  items: ProjectItem[];
  onChange: (items: ProjectItem[]) => void;
  onNeedsLogin: () => void;
}) {
  function update(id: string, patch: Partial<ProjectItem>) {
    onChange(items.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function remove(id: string) {
    onChange(items.filter((p) => p.id !== id));
  }

  return (
    <SectionCard title="المشاريع والأعمال" icon="fa-cubes">
      <div className="space-y-4">
        {items.map((proj) => (
          <div key={proj.id} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">مشروع</span>
              <RemoveButton onClick={() => remove(proj.id)} />
            </div>
            <TextInput label="عنوان المشروع" value={proj.title} onChange={(v) => update(proj.id, { title: v })} />
            <TextArea
              label="وصف المشروع"
              value={proj.description}
              onChange={(v) => update(proj.id, { description: v })}
              rows={3}
              action={
                <EnhanceButton
                  text={proj.description}
                  type="project"
                  onEnhanced={(t) => update(proj.id, { description: t })}
                  onNeedsLogin={onNeedsLogin}
                />
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="التقنيات (مفصولة بفواصل)" value={proj.tags} onChange={(v) => update(proj.id, { tags: v })} />
              <TextInput label="رابط المشروع" value={proj.projectLink} onChange={(v) => update(proj.id, { projectLink: v })} />
            </div>
            <TextInput label="رابط صورة المشروع" value={proj.imageUrl} onChange={(v) => update(proj.id, { imageUrl: v })} />
          </div>
        ))}
      </div>
      <AddButton label="إضافة مشروع جديد" onClick={() => onChange([...items, emptyProject()])} />
    </SectionCard>
  );
}
