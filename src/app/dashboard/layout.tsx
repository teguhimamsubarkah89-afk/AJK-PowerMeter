// ============================================================
// Dashboard Layout — AJK PowerMeter Dashboard v2.0
// Auth guard + Header + Sidebar + BottomNav wrapper
// ============================================================

'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';
import { NotificationProvider } from '@/components/layout/NotificationProvider';

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { sidebarCollapsed } = useAppStore();

  // Auth guard
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen min-h-dvh flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center animate-fade-in">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) return null;

  return (
    <NotificationProvider>
      <div className="min-h-screen min-h-dvh bg-[var(--bg-primary)] bg-grid-pattern">
        {/* Persistent Header */}
        <TopBar />

        {/* Sidebar (desktop only) */}
        <Sidebar />

        {/* Bottom Navigation (mobile/tablet only) */}
        <BottomNav />

        {/* Main Content */}
        <main
          className={`dashboard-main ${
            sidebarCollapsed ? 'dashboard-main--collapsed' : 'dashboard-main--expanded'
          }`}
        >
          <div className="dashboard-content">
            {children}
          </div>
        </main>

        {/* Subtle radial gradient background */}
        <div className="fixed inset-0 bg-gradient-radial pointer-events-none z-0" />
      </div>
    </NotificationProvider>
  );
}
