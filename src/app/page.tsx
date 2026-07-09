// ============================================================
// Root Page — AJK PowerMeter Dashboard
// Redirect ke /login atau /dashboard berdasarkan auth state
// ============================================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Loading screen saat cek auth state
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
      <div className="animate-fade-in-up text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-4 animate-float">
          <Image
            src="/logo-ajk.png"
            alt="Logo AJK"
            width={44}
            height={44}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-3">
          AJK PowerMeter
        </h1>
        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
        <p className="text-sm text-[var(--text-muted)] mt-3">
          Memuat dashboard...
        </p>
      </div>
    </div>
  );
}
