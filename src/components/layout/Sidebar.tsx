// ============================================================
// Sidebar Component — AJK PowerMeter Dashboard
// Navigasi utama dengan logo, menu, collapse, dan logout
// ============================================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Riwayat', href: '/dashboard/riwayat', icon: ClipboardList },
  { label: 'Laporan', href: '/dashboard/laporan', icon: FileText },
  { label: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { sidebarCollapsed, toggleSidebarCollapsed, setSidebarOpen } = useAppStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const width = sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';

  return (
    <aside
      className="fixed top-0 left-0 h-full z-40 hidden lg:flex flex-col border-r border-[var(--border-color)] transition-all duration-300 ease-in-out"
      style={{ width, background: 'var(--bg-sidebar)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 border-b border-[var(--border-color)] flex-shrink-0 px-4"
        style={{ height: 'var(--topbar-height)', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
      >
        <div className="w-9 h-9 rounded-xl glass flex items-center justify-center flex-shrink-0">
          <Image src="/logo-ajk.png" alt="Logo AJK" width={26} height={26} className="object-contain" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden min-w-0">
            <h2 className="text-sm font-bold text-[var(--text-primary)] truncate">AJK PowerMeter</h2>
            <p className="text-[10px] text-[var(--text-muted)] truncate">Monitoring Kelistrikan</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              title={sidebarCollapsed ? item.label : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden"
              style={{
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                color: active ? '#60a5fa' : 'var(--text-secondary)',
                border: active ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-[var(--border-color)] p-2.5 flex-shrink-0 space-y-1">
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-secondary)] transition-all duration-200"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          title={sidebarCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : (
            <><ChevronLeft className="w-5 h-5" /><span className="truncate">Perkecil</span></>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          title={sidebarCollapsed ? 'Keluar' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="truncate">Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
