'use client';

import type { Portfolio } from '@/lib/types';
import { SectionCard, TextInput } from './FormField';

export default function ContactSection({
  portfolio,
  onChange
}: {
  portfolio: Portfolio;
  onChange: (patch: Partial<Portfolio>) => void;
}) {
  return (
    <SectionCard title="معلومات التواصل والروابط">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="البريد الإلكتروني" type="email" value={portfolio.email} onChange={(v) => onChange({ email: v })} placeholder="name@example.com" />
        <TextInput label="رقم الجوال" value={portfolio.phone} onChange={(v) => onChange({ phone: v })} placeholder="+966501234567" />
        <TextInput label="رابط LinkedIn" value={portfolio.linkedinUrl} onChange={(v) => onChange({ linkedinUrl: v })} placeholder="https://linkedin.com/in/..." />
        <TextInput label="رابط GitHub" value={portfolio.githubUrl} onChange={(v) => onChange({ githubUrl: v })} placeholder="https://github.com/..." />
      </div>
    </SectionCard>
  );
}
