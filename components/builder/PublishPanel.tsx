'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { Portfolio } from '@/lib/types';

export default function PublishPanel({
  portfolio,
  username,
  onUsernameChange,
  onPublished,
  onNeedsLogin
}: {
  portfolio: Portfolio;
  username: string;
  onUsernameChange: (v: string) => void;
  onPublished: (username: string) => void;
  onNeedsLogin: () => void;
}) {
  const { user, getIdToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');

  async function handlePublish() {
    if (!user) {
      onNeedsLogin();
      return;
    }
    if (!portfolio.name.trim()) {
      setError('الاسم الكامل مطلوب قبل النشر');
      return;
    }

    setBusy(true);
    setError('');
    setShareUrl('');
    try {
      const token = await getIdToken();
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...portfolio, username })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل النشر');
      setShareUrl(data.shareUrl);
      onPublished(data.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
      <h3 className="text-xs font-bold text-emerald-200">🚀 النشر والمشاركة</h3>
      <label className="block space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400">رابط البورتفوليو الخاص بك</span>
        <div className="flex items-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
          <span className="px-2 text-[11px] text-slate-500 whitespace-nowrap">/p/</span>
          <input
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="your-name"
            className="w-full bg-transparent px-1 py-2 text-xs text-white outline-none"
          />
        </div>
      </label>

      <button
        type="button"
        onClick={handlePublish}
        disabled={busy}
        className="w-full rounded-lg bg-gradient-accent py-2.5 text-sm font-bold text-white disabled:opacity-50"
      >
        {busy ? '...جاري النشر' : 'نشر البورتفوليو'}
      </button>

      {error && <p className="text-[11px] text-rose-400">{error}</p>}
      {shareUrl && (
        <p className="text-[11px] text-emerald-300">
          تم النشر بنجاح! رابط ملفك:{' '}
          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline">
            {shareUrl}
          </a>
        </p>
      )}
    </div>
  );
}
