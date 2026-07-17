// ============================================================
// TopBar (Header) Component — AJK PowerMeter Dashboard v2.0
// Persistent header: Logo+Brand | Status+Clock+Update | Notif+Profile
// ============================================================

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  User, LogOut, Clock, Bell, RefreshCw,
  UserCircle, Settings, X,
  Wifi, WifiOff, CheckCircle2, AlertTriangle,
  Info, Trash2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';
import {
  useNotifications,
  useDeviceNotifications,
} from '@/components/layout/NotificationProvider';
import type { Notification } from '@/components/layout/NotificationProvider';
import { formatTimeAgo } from '@/lib/utils/formatters';

export function TopBar() {
  const { user, logout } = useAuth();
  const { sidebarCollapsed } = useAppStore();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  // Device status
  const { data, lastUpdated } = useRealtimeData();
  const { isOnline, pzemStatus, updateStatus } = useDeviceStatus();

  useEffect(() => {
    updateStatus(data, lastUpdated);
  }, [data, lastUpdated, updateStatus]);

  // Auto-generate notifications from device status
  useDeviceNotifications(isOnline, pzemStatus);

  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  // Real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Enforce dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Close dropdowns on outside click
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
      setShowUserMenu(false);
    }
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
      setShowNotifPanel(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  // Format last updated text
  const lastUpdatedText = lastUpdated ? formatTimeAgo(lastUpdated) : '--';

  const notifTypeConfig: Record<Notification['type'], { icon: typeof CheckCircle2; color: string; bg: string }> = {
    success: { icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    warning: { icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    error: { icon: WifiOff, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  };

  return (
    <header
      className={`app-header ${
        sidebarCollapsed ? 'app-header--sidebar-collapsed' : 'app-header--sidebar-expanded'
      }`}
    >
      <div className="app-header__inner">
        {/* ═══ LEFT: Logo + Brand ═══ */}
        <div className="header-brand">
          <div className="header-brand__logo">
            <Image
              src="/logo-ajk.png"
              alt="Logo AJK"
              width={26}
              height={26}
              className="object-contain"
            />
          </div>
          <div className="header-brand__text">
            <div className="header-brand__title">AJK POWERMETER</div>
            <div className="header-brand__subtitle">Monitoring Kelistrikan</div>
          </div>
        </div>

        {/* ═══ CENTER: Status + Update + Clock ═══ */}
        <div className="header-info">
          {/* Online/Offline Status */}
          <div className={`status-badge ${isOnline ? 'status-badge--online' : 'status-badge--offline'}`}>
            <div className={`status-badge__dot ${isOnline ? 'status-badge__dot--online' : 'status-badge__dot--offline'}`} />
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* Last Updated */}
          <div className="header-update">
            <RefreshCw className="w-3 h-3 flex-shrink-0" />
            <span>{lastUpdatedText}</span>
          </div>

          <div className="header-info__separator hidden md:block" />

          {/* Clock */}
          <div className="header-clock">
            <Clock className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
            <span className="header-clock__time">{currentTime}</span>
          </div>

          {/* Date (desktop only) */}
          <div className="header-clock__date">{currentDate}</div>
        </div>

        {/* ═══ RIGHT: Notifications + Profile ═══ */}
        <div className="header-actions">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifPanel(!showNotifPanel);
                setShowUserMenu(false);
              }}
              className="header-action-btn"
              title="Notifikasi"
              aria-label={`Notifikasi${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ''}`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="header-action-btn__badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifPanel && (
              <div className="notification-panel animate-fade-in-down">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Notifikasi
                  </h3>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-medium text-blue-400 hover:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-500/10 transition-colors"
                      >
                        Tandai dibaca
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Hapus semua"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-[var(--text-muted)]">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">Tidak ada notifikasi</p>
                  </div>
                ) : (
                  <div className="max-h-[340px] overflow-y-auto">
                    {notifications.map((notif, index) => {
                      const config = notifTypeConfig[notif.type];
                      const NotifIcon = config.icon;
                      return (
                        <div
                          key={notif.id}
                          className={`notification-item ${!notif.read ? 'unread' : ''} animate-notif-slide`}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: config.bg }}
                          >
                            <NotifIcon className="w-4 h-4" style={{ color: config.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">
                              {notif.title}
                            </p>
                            <p className="text-[12px] text-[var(--text-muted)] mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] mt-1 opacity-60">
                              {formatTimeAgo(notif.timestamp)}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile — Icon only, username on click */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifPanel(false);
              }}
              className="header-avatar"
              title="Profil"
              aria-label="Menu profil"
            >
              <User className="w-4 h-4 text-white" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="profile-dropdown animate-fade-in-down">
                {/* User info */}
                <div className="px-3 py-3 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {user?.email?.split('@')[0] || 'Admin'}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {user?.email || 'admin@ajk.co.id'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 mx-2" />

                {/* Menu items */}
                <div className="py-1">
                  <button className="profile-dropdown-item">
                    <UserCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Profil</span>
                  </button>
                  <button className="profile-dropdown-item">
                    <Settings className="w-4 h-4 flex-shrink-0" />
                    <span>Informasi Akun</span>
                  </button>
                </div>

                <div className="h-px bg-white/5 mx-2" />

                <div className="py-1">
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); }}
                    className="profile-dropdown-item profile-dropdown-item--danger"
                  >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
