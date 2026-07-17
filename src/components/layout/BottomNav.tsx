// ============================================================
// BottomNav Component — AJK PowerMeter Dashboard v2.0
// Fixed bottom navigation for mobile/tablet (replaces MobileNav drawer)
// ============================================================

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Settings,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Riwayat', href: '/dashboard/riwayat', icon: ClipboardList },
  { label: 'Laporan', href: '/dashboard/laporan', icon: FileText },
  { label: 'Pengaturan', href: '/dashboard/pengaturan', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className="bottom-nav__icon" />
            <span className="bottom-nav__label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
