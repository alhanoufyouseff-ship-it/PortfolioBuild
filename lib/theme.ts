import type { ColorScheme, ThemeName } from './types';

export const THEMES: { value: ThemeName; label: string; labelEn: string }[] = [
  { value: 'modern', label: 'زجاجي عصري (Modern Glass)', labelEn: 'Modern Glass' },
  { value: 'minimal', label: 'بسيط وأنيق (Minimal Clean)', labelEn: 'Minimal Clean' },
  { value: 'creative', label: 'توهج إبداعي (Creative Glow)', labelEn: 'Creative Glow' },
  { value: 'professional', label: 'رسمي (Professional)', labelEn: 'Professional' },
  { value: 'cyber', label: 'مستقبلي (Dark Cyber)', labelEn: 'Dark Cyber' }
];

export const COLOR_SCHEMES: { value: ColorScheme; label: string; labelEn: string; from: string; to: string }[] = [
  { value: 'blue', label: 'أزرق', labelEn: 'Ocean Blue', from: '#1d4ed8', to: '#38bdf8' },
  { value: 'purple', label: 'بنفسجي', labelEn: 'Deep Purple', from: '#7e22ce', to: '#c084fc' },
  { value: 'blue-purple', label: 'أزرق + بنفسجي', labelEn: 'Blue + Purple', from: '#4f46e5', to: '#9333ea' },
  { value: 'green', label: 'أخضر زمردي', labelEn: 'Emerald Green', from: '#059669', to: '#34d399' },
  { value: 'pink', label: 'وردي نيون', labelEn: 'Neon Pink', from: '#be185d', to: '#f472b6' },
  { value: 'black-white', label: 'أبيض وأسود', labelEn: 'Monochrome', from: '#cbd5e1', to: '#ffffff' }
];

export function getColorScheme(scheme: ColorScheme) {
  return COLOR_SCHEMES.find((c) => c.value === scheme) ?? COLOR_SCHEMES[2];
}
