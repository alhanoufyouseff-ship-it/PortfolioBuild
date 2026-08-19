'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function EnhanceButton({
  text,
  type,
  onEnhanced,
  onNeedsLogin
}: {
  text: string;
  type: 'bio' | 'project' | 'experience' | 'volunteering';
  onEnhanced: (newText: string) => void;
  onNeedsLogin: () => void;
}) {
  const { user, getIdToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    if (!user) {
      onNeedsLogin();
      return;
    }
    if (!text.trim()) return;

    setBusy(true);
    setError('');
    try {
      const token = await getIdToken();
      const res = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text, type })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل التحسين');
      onEnhanced(data.enhancedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || !text.trim()}
        className="badge-tag rounded-md px-2.5 py-1 text-[11px] font-bold disabled:opacity-40 transition"
      >
        {busy ? '...جاري التحسين' : '✨ تحسين الصياغة'}
      </button>
      {error && <span className="text-[10px] text-rose-400">{error}</span>}
    </span>
  );
}
