// ============================================================
// useAuth Hook — AJK PowerMeter Dashboard
// Custom hook untuk autentikasi Firebase
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { type User } from 'firebase/auth';
import { signIn, signOut, onAuthChange, getAuthErrorMessage } from '@/lib/firebase/auth';
import toast from 'react-hot-toast';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Auto-redirect logic
      if (firebaseUser && pathname === '/login') {
        router.replace('/dashboard');
      } else if (!firebaseUser && pathname !== '/login' && pathname !== '/') {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Berhasil masuk!');
      router.replace('/dashboard');
      return true;
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      const message = getAuthErrorMessage(firebaseError.code || '');
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await signOut();
      toast.success('Berhasil keluar.');
      router.replace('/login');
    } catch {
      toast.error('Gagal logout. Silakan coba lagi.');
    }
  }, [router]);

  return { user, loading, error, login, logout };
}
