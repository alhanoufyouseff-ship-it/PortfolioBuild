'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signInEmail, signUpEmail, signInGoogle, configured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, name);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setBusy(true);
    try {
      await signInGoogle();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            {mode === 'signin' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>

        {!configured && (
          <p className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3">
            لم يتم ضبط إعدادات Firebase بعد. أضف متغيرات NEXT_PUBLIC_FIREBASE_* في .env.local لتفعيل تسجيل الدخول.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="الاسم الكامل"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
            />
          )}
          <input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-400"
          />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={busy || !configured}
            className="w-full rounded-lg bg-gradient-accent py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy ? '...جاري' : mode === 'signin' ? 'دخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-2 text-[10px] text-slate-500">
          <div className="h-px flex-1 bg-white/10" />
          <span>أو</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={busy || !configured}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
        >
          المتابعة عبر Google
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          {mode === 'signin' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-indigo-300 hover:underline font-semibold"
          >
            {mode === 'signin' ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}
