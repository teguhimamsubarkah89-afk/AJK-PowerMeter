// ============================================================
// Sidebar Component — AJK PowerMeter Dashboard v2.0
// Desktop-only sidebar navigation (logo moved to Header)
// ============================================================

'use client';

import Link from 'next/link';
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
  const { sidebarCollapsed, toggleSidebarCollapsed } = useAppStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`app-sidebar ${
        sidebarCollapsed ? 'app-sidebar--collapsed' : 'app-sidebar--expanded'
      }`}
    >
      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Menu utama">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={`sidebar-nav-item ${active ? 'sidebar-nav-item--active' : ''}`}
              style={{
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="sidebar-nav-item__icon" />
              {!sidebarCollapsed && (
                <span className="sidebar-nav-item__label">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebarCollapsed}
          className="sidebar-collapse-btn"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          title={sidebarCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          aria-label={sidebarCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Perkecil</span>
            </>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="sidebar-logout-btn"
          style={{ justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}
          title={sidebarCollapsed ? 'Keluar' : undefined}
          aria-label="Keluar dari akun"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
