'use client';

import type { Portfolio } from '@/lib/types';
import { SectionCard, TextArea, TextInput } from './FormField';
import EnhanceButton from './EnhanceButton';

export default function PersonalInfoSection({
  portfolio,
  onChange,
  onNeedsLogin
}: {
  portfolio: Portfolio;
  onChange: (patch: Partial<Portfolio>) => void;
  onNeedsLogin: () => void;
}) {
  return (
    <SectionCard title="البيانات الشخصية والتعليم" icon="fa-user">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="الاسم الكامل" value={portfolio.name} onChange={(v) => onChange({ name: v })} placeholder="مثال: سارة الحربي" />
        <TextInput
          label="الجامعة / التخصص الدراسي"
          value={portfolio.education}
          onChange={(v) => onChange({ education: v })}
          placeholder="مثال: بكالوريوس علوم حاسب - جامعة الملك سعود"
        />
      </div>

      <TextInput
        label="رابط الصورة الشخصية"
        value={portfolio.photoUrl}
        onChange={(v) => onChange({ photoUrl: v })}
        placeholder="https://..."
      />

      <TextArea
        label="النبذة التعريفية (Bio)"
        value={portfolio.bio}
        onChange={(v) => onChange({ bio: v })}
        placeholder="اكتب نبذة مختصرة عن خبرتك وأهدافك المهنية..."
        rows={4}
        action={
          <EnhanceButton
            text={portfolio.bio}
            type="bio"
            onEnhanced={(t) => onChange({ bio: t })}
            onNeedsLogin={onNeedsLogin}
          />
        }
      />

      <TextInput
        label="المهارات التقنية (افصل بينها بفاصلة)"
        value={portfolio.skills}
        onChange={(v) => onChange({ skills: v })}
        placeholder="React, TypeScript, Node.js, Python"
      />
    </SectionCard>
  );
}
