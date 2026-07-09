// ============================================================
// TopBar Component — AJK PowerMeter Dashboard
// Top bar dengan judul halaman, info waktu, dan user menu
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, User, LogOut, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/riwayat': 'Riwayat Data',
  '/dashboard/laporan': 'Laporan',
  '/dashboard/pengaturan': 'Pengaturan',
};

export function TopBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, setSidebarOpen } = useAppStore();
  const [currentTime, setCurrentTime] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleString('id-ID', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Enforce dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  const pageTitle = pageTitles[pathname] || 'Dashboard';

  return (
    <header
      className="fixed top-0 right-0 z-30 border-b border-[var(--glass-border)] transition-all duration-500 flex flex-col justify-center"
      style={{
        left: 0,
        height: 'var(--topbar-height)',
        background: 'rgba(10, 14, 26, 0.45)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 
          ? (sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)') 
          : 0
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          header {
            padding-left: ${sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'} !important;
          }
        }
      `}} />
      <div className="flex items-center justify-between px-4 lg:px-6 w-full max-w-[1600px] mx-auto">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-[var(--text-primary)] truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Time, Theme, User */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Current Time — hide on small screens */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-1.5 rounded-lg border border-[var(--border-color)]">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className="font-mono whitespace-nowrap">{currentTime}</span>
        </div>



        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--bg-card)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm text-[var(--text-secondary)] max-w-[100px] truncate">
              {user?.email?.split('@')[0] || 'Admin'}
            </span>
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 z-50 glass-thick rounded-xl py-2 animate-fade-in-down">
                <div className="px-4 py-2 border-b border-[var(--border-color)]">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {user?.email || 'admin@ajk.co.id'}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Administrator</p>
                </div>
                <button
                  onClick={() => { setShowUserMenu(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
        </div>
      </div>
    </header>
  );
}
