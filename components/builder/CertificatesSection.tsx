'use client';

import type { CertificateItem } from '@/lib/types';
import { AddButton, RemoveButton, SectionCard, TextInput } from './FormField';

function emptyCertificate(): CertificateItem {
  return { id: crypto.randomUUID(), title: '', issuer: '', year: '', imageUrl: '' };
}

export default function CertificatesSection({
  items,
  onChange
}: {
  items: CertificateItem[];
  onChange: (items: CertificateItem[]) => void;
}) {
  function update(id: string, patch: Partial<CertificateItem>) {
    onChange(items.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function remove(id: string) {
    onChange(items.filter((c) => c.id !== id));
  }

  return (
    <SectionCard title="الشهادات والاعتمادات" icon="fa-award">
      <div className="space-y-4">
        {items.map((cert) => (
          <div key={cert.id} className="rounded-xl bg-white/5 border border-white/10 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">شهادة</span>
              <RemoveButton onClick={() => remove(cert.id)} />
            </div>
            <TextInput label="عنوان الشهادة" value={cert.title} onChange={(v) => update(cert.id, { title: v })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="الجهة المانحة" value={cert.issuer} onChange={(v) => update(cert.id, { issuer: v })} />
              <TextInput label="سنة الحصول عليها" value={cert.year} onChange={(v) => update(cert.id, { year: v })} />
            </div>
            <TextInput label="رابط صورة الشهادة" value={cert.imageUrl} onChange={(v) => update(cert.id, { imageUrl: v })} />
          </div>
        ))}
      </div>
      <AddButton label="إضافة شهادة جديدة" onClick={() => onChange([...items, emptyCertificate()])} />
    </SectionCard>
  );
}
