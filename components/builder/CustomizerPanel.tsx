'use client';

import { COLOR_SCHEMES, THEMES } from '@/lib/theme';
import type { ColorScheme, Language, ThemeName } from '@/lib/types';

export default function CustomizerPanel({
  theme,
  colorScheme,
  language,
  onChange
}: {
  theme: ThemeName;
  colorScheme: ColorScheme;
  language: Language;
  onChange: (patch: Partial<{ theme: ThemeName; colorScheme: ColorScheme; language: Language }>) => void;
}) {
  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm shrink-0">
          <i className="fa-solid fa-sliders" />
        </div>
        <h3 className="text-xs font-bold text-slate-300">لوحة التخصيص اللحظي</h3>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] text-slate-400">النمط البصري (Theme)</label>
        <select
          value={theme}
          onChange={(e) => onChange({ theme: e.target.value as ThemeName })}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-2.5 py-2 text-xs text-white outline-none focus:border-[var(--primary-color)] transition"
        >
          {THEMES.map((t) => (
            <option key={t.value} value={t.value} className="bg-slate-900">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] text-slate-400">لوحة الألوان (Color Palette)</label>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_SCHEMES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange({ colorScheme: c.value })}
              className={`rounded-lg border p-2 text-[10px] font-semibold transition ${
                colorScheme === c.value ? 'border-white text-white' : 'border-white/10 text-slate-300 hover:border-white/30'
              }`}
            >
              <span
                className="mx-auto mb-1 block h-4 w-full rounded"
                style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
              />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] text-slate-400">اللغة والاتجاه</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ language: 'ar' })}
            className={`flex-1 rounded-lg border py-1.5 text-xs font-bold ${
              language === 'ar' ? 'border-indigo-400 bg-indigo-500/10 text-white' : 'border-white/10 text-slate-400'
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => onChange({ language: 'en' })}
            className={`flex-1 rounded-lg border py-1.5 text-xs font-bold ${
              language === 'en' ? 'border-indigo-400 bg-indigo-500/10 text-white' : 'border-white/10 text-slate-400'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}
