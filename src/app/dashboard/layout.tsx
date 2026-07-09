// ============================================================
// Dashboard Layout — AJK PowerMeter Dashboard
// Auth guard + sidebar + topbar wrapper
// ============================================================

'use client';

import { type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';

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
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
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
    <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern">
      {/* Sidebar (desktop only) */}
      <Sidebar />

      {/* Mobile Nav Drawer */}
      <MobileNav />

      {/* TopBar */}
      <TopBar />

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
  );
}
