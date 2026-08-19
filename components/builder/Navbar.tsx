'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import LoginModal from '@/components/LoginModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" className="flex items-center gap-2 text-sm font-black text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-accent text-xs">🧩</span>
          PortfolioBuild
        </a>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-300 sm:inline">{user.displayName || user.email}</span>
            <button
              onClick={() => logout()}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <button
            onClick={() => setLoginOpen(true)}
            className="rounded-lg bg-gradient-accent px-4 py-1.5 text-xs font-bold text-white"
          >
            تسجيل الدخول
          </button>
        )}
      </div>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
