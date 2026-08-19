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
    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-3">
      <h3 className="flex items-center gap-2 text-xs font-bold text-indigo-200">
        🔗 استيراد سريع من LinkedIn
      </h3>
      <p className="text-[11px] text-slate-400">
        الصق رابط بروفايلك العام على LinkedIn وسنقوم بتعبئة النبذة والمهارات والخبرات تلقائياً (يمكنك تعديلها لاحقاً).
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://linkedin.com/in/username"
          className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
        />
        <button
          type="button"
          onClick={handleImport}
          disabled={busy || !url.trim()}
          className="rounded-lg bg-gradient-accent px-4 py-2 text-xs font-bold text-white disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? '...جاري الاستيراد' : 'ربط حساب LinkedIn'}
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
      {success && <p className="text-[11px] text-emerald-400">تم استيراد بياناتك بنجاح! راجع الحقول أدناه.</p>}
    </div>
  );
}
