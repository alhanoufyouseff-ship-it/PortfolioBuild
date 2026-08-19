'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface ImportedData {
  name?: string;
  bio?: string;
  education?: string;
  skills?: string;
  experiences?: { title: string; company: string; duration: string; description: string }[];
  certificates?: { title: string; issuer: string; year: string }[];
  volunteering?: { role: string; organization: string; duration: string; description: string }[];
}

export default function LinkedInImportPanel({
  onImported,
  onNeedsLogin
}: {
  onImported: (data: ImportedData) => void;
  onNeedsLogin: () => void;
}) {
  const { user, getIdToken } = useAuth();
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleImport() {
    if (!user) {
      onNeedsLogin();
      return;
    }
    if (!url.trim()) return;

    setBusy(true);
    setError('');
    setSuccess(false);
    try {
      const token = await getIdToken();
      const res = await fetch('/api/import-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ linkedinUrl: url.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل الاستيراد');
      onImported(data.data as ImportedData);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm shrink-0">
          <i className="fa-brands fa-linkedin" />
        </div>
        <h3 className="text-xs font-bold text-white">استيراد سريع من LinkedIn</h3>
      </div>
      <p className="text-[11px] text-slate-400">
        الصق رابط بروفايلك العام على LinkedIn وسنقوم بتعبئة النبذة والمهارات والخبرات تلقائياً (يمكنك تعديلها لاحقاً).
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://linkedin.com/in/username"
          className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[var(--primary-color)] transition"
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={busy || !url.trim()}
          className="rounded-lg bg-gradient-primary px-4 py-2 text-xs font-bold text-white glow-btn disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-link text-[10px]" />
          <span>{busy ? '...جاري الاستيراد' : 'ربط حساب LinkedIn'}</span>
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
      {success && <p className="text-[11px] text-emerald-400">تم استيراد بياناتك بنجاح! راجع الحقول أدناه.</p>}
    </div>
  );
}
