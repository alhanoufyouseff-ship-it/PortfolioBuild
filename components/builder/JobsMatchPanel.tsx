'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import type { CertificateItem } from '@/lib/types';

interface JobResult {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  matchPercent: number;
  missingSkills: string[];
}

export default function JobsMatchPanel({
  skills,
  certificates,
  onNeedsLogin
}: {
  skills: string;
  certificates: CertificateItem[];
  onNeedsLogin: () => void;
}) {
  const { user, getIdToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<JobResult[] | null>(null);
  const [demo, setDemo] = useState(false);

  async function handleSearch() {
    if (!user) {
      onNeedsLogin();
      return;
    }
    setBusy(true);
    setError('');
    try {
      const token = await getIdToken();
      const res = await fetch('/api/jobs-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ skills, certificates: certificates.map((c) => c.title) })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'فشل جلب الوظائف');
      setResults(data.results);
      setDemo(data.demo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-panel rounded-2xl border border-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-white text-sm shrink-0">
            <i className="fa-solid fa-bullseye" />
          </div>
          <h3 className="text-xs font-bold text-white">مطابقة الفرص الوظيفية</h3>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={busy || !skills.trim()}
          className="rounded-lg bg-gradient-primary px-3 py-1.5 text-[11px] font-bold text-white glow-btn disabled:opacity-50 whitespace-nowrap"
        >
          {busy ? '...جاري البحث' : 'ابحث عن فرص'}
        </button>
      </div>

      {demo && (
        <p className="text-[10px] text-amber-400">
          يتم عرض نتائج تجريبية (لم يتم ضبط JOB_SEARCH_API_KEY بعد).
        </p>
      )}
      {error && <p className="text-[11px] text-rose-400">{error}</p>}

      {results && results.length === 0 && <p className="text-[11px] text-slate-400">لم يتم العثور على وظائف مطابقة حالياً.</p>}

      {results && results.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin">
          {results.map((job) => (
            <div key={job.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-white hover:underline"
                  >
                    {job.title}
                  </a>
                  <p className="text-[10px] text-slate-400">
                    {job.company} {job.location && `· ${job.location}`}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    job.matchPercent >= 70
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : job.matchPercent >= 40
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {job.matchPercent}%
                </span>
              </div>
              {job.missingSkills.length > 0 && (
                <p className="mt-1.5 text-[10px] text-slate-400">
                  مهارات ناقصة: {job.missingSkills.join('، ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
