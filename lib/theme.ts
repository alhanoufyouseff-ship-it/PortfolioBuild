import type { ColorScheme, ThemeName } from './types';

export const THEMES: { value: ThemeName; label: string; labelEn: string }[] = [
  { value: 'modern', label: 'زجاجي عصري (Modern Glass)', labelEn: 'Modern Glass' },
  { value: 'minimal', label: 'بسيط وأنيق (Minimal Clean)', labelEn: 'Minimal Clean' },
  { value: 'creative', label: 'توهج إبداعي (Creative Glow)', labelEn: 'Creative Glow' },
  { value: 'professional', label: 'رسمي (Professional)', labelEn: 'Professional' },
  { value: 'cyber', label: 'مستقبلي (Dark Cyber)', labelEn: 'Dark Cyber' }
];

export const COLOR_SCHEMES: { value: ColorScheme; label: string; labelEn: string; from: string; to: string }[] = [
  { value: 'blue', label: 'أزرق', labelEn: 'Ocean Blue', from: '#3b82f6', to: '#06b6d4' },
  { value: 'purple', label: 'بنفسجي', labelEn: 'Deep Purple', from: '#8b5cf6', to: '#6366f1' },
  { value: 'blue-purple', label: 'أزرق + بنفسجي', labelEn: 'Blue + Purple', from: '#6366f1', to: '#a855f7' },
  { value: 'green', label: 'أخضر زمردي', labelEn: 'Emerald Green', from: '#10b981', to: '#22c55e' },
  { value: 'pink', label: 'وردي نيون', labelEn: 'Neon Pink', from: '#ec4899', to: '#f43f5e' },
  { value: 'monochrome', label: 'أبيض وأسود', labelEn: 'Monochrome', from: '#94a3b8', to: '#475569' }
];

export function getColorScheme(scheme: ColorScheme) {
  return COLOR_SCHEMES.find((c) => c.value === scheme) ?? COLOR_SCHEMES[2];
}

export const THEME_BACKGROUND: Record<ThemeName, string> = {
  modern: 'bg-slate-950',
  minimal: 'bg-slate-50',
  creative: 'bg-[#0b0620]',
  professional: 'bg-slate-100',
  cyber: 'bg-black'
};

export const THEME_TEXT: Record<ThemeName, string> = {
  modern: 'text-slate-100',
  minimal: 'text-slate-900',
  creative: 'text-slate-100',
  professional: 'text-slate-900',
  cyber: 'text-emerald-100'
};

export const THEME_PANEL: Record<ThemeName, string> = {
  modern: 'bg-white/5 backdrop-blur-xl border border-white/10',
  minimal: 'bg-white border border-slate-200 shadow-sm',
  creative: 'bg-white/5 backdrop-blur-xl border border-fuchsia-500/20 shadow-[0_0_40px_-15px_rgba(217,70,239,0.5)]',
  professional: 'bg-white border border-slate-300 shadow',
  cyber: 'bg-black/60 backdrop-blur border border-emerald-500/30 shadow-[0_0_25px_-10px_rgba(16,185,129,0.6)]'
};
