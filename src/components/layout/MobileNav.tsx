// ============================================================
// MobileNav Component — AJK PowerMeter Dashboard
// Drawer navigasi mobile (slide dari kiri)
// ============================================================

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ClipboardList, FileText, Settings,
  LogOut, X,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Riwayat', href: '/dashboard/riwayat', icon: ClipboardList },
  { label: 'Laporan', href: '/dashboard/laporan', icon: FileText },
  { label: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  // Lock body scroll when open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Close on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  if (!sidebarOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Drawer */}
      <div
        className="absolute top-0 left-0 h-full flex flex-col animate-slide-in-left"
        style={{
          width: 'min(280px, 80vw)',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
              <Image src="/logo-ajk.png" alt="Logo AJK" width={26} height={26} className="object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[var(--text-primary)] truncate">AJK PowerMeter</h2>
              <p className="text-[10px] text-[var(--text-muted)] truncate">Monitoring Kelistrikan</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: active ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  color: active ? '#60a5fa' : 'var(--text-secondary)',
                  border: active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: User Info + Logout */}
        <div className="border-t border-[var(--border-color)] p-3 flex-shrink-0">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-[var(--bg-card)]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">Administrator</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => { setSidebarOpen(false); logout(); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
