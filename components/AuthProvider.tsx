'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { getFirebaseAuth, googleProvider, isFirebaseConfigured } from '@/lib/firebase/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, name: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isFirebaseConfigured();

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured,
      async signInEmail(email, password) {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      },
      async signUpEmail(email, password, name) {
        const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
        if (name) {
          await updateProfile(cred.user, { displayName: name });
        }
      },
      async signInGoogle() {
        await signInWithPopup(getFirebaseAuth(), googleProvider);
      },
      async logout() {
        await signOut(getFirebaseAuth());
      },
      async getIdToken() {
        const current = getFirebaseAuth().currentUser;
        if (!current) throw new Error('يجب تسجيل الدخول أولاً');
        return current.getIdToken();
      }
    }),
    [user, loading, configured]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth يجب أن يُستخدم داخل AuthProvider');
  return ctx;
}
