// ============================================================
// StatusIndicator → WelcomeBanner — AJK PowerMeter Dashboard v2.0
// Compact welcome/summary banner with quick status overview
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff, ShieldCheck, Clock, Database, AlertCircle, Zap } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils/formatters';

interface StatusIndicatorProps {
  isOnline: boolean;
  lastSeen: Date | null;
}

export function StatusIndicator({ isOnline, lastSeen }: StatusIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState(lastSeen ? formatTimeAgo(lastSeen) : '--');

  useEffect(() => {
    if (!lastSeen) return;

    setTimeAgo(formatTimeAgo(lastSeen));

    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(lastSeen));
    }, 60000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  const statusItems = [
    {
      label: 'WIFI',
      value: isOnline ? 'Terhubung' : 'Terputus',
      icon: isOnline ? Wifi : WifiOff,
      color: isOnline ? '#3b82f6' : '#6b7280',
      bg: isOnline ? 'rgba(59,130,246,0.1)' : 'rgba(107,114,128,0.1)',
      valueColor: isOnline ? 'var(--text-primary)' : 'var(--text-muted)',
    },
    {
      label: 'DATABASE',
      value: isOnline ? 'Aktif' : 'Terputus',
      icon: isOnline ? Database : WifiOff,
      color: isOnline ? '#10b981' : '#ef4444',
      bg: isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
      valueColor: isOnline ? '#10b981' : '#ef4444',
    },
    {
      label: 'KESEHATAN',
      value: isOnline ? 'OK' : 'Peringatan',
      icon: isOnline ? ShieldCheck : AlertCircle,
      color: isOnline ? '#10b981' : '#f59e0b',
      bg: isOnline ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
      valueColor: isOnline ? '#10b981' : '#f59e0b',
    },
    {
      label: 'DIPERBARUI',
      value: timeAgo,
      icon: Clock,
      color: '#94a3b8',
      bg: 'rgba(148,163,184,0.08)',
      valueColor: 'var(--text-primary)',
    },
  ];

  return (
    <div className="glass-card p-0 overflow-hidden">
      {/* Welcome Header */}
      <div className="p-5 sm:p-6 border-b border-[var(--glass-border)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.12)' }}
              >
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">
                Monitoring Daya Industri
              </p>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
              Monitoring dan analitik real-time untuk sistem kelistrikan.
            </h2>
          </div>

          {/* Status pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold flex-shrink-0 ${
              isOnline
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                isOnline ? 'bg-emerald-400 animate-pulse-live' : 'bg-red-400 animate-pulse-live-red'
              }`}
            />
            {isOnline ? 'System Online' : 'System Offline'}
          </div>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {statusItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 p-4 sm:p-5 transition-colors hover:bg-white/[0.02] ${
                index < statusItems.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-[var(--glass-border)]' : ''
              } ${index === 1 ? 'border-l lg:border-l-0 border-[var(--glass-border)]' : ''} ${
                index === 3 ? 'border-l lg:border-l-0 border-[var(--glass-border)]' : ''
              }`}
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: item.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {item.label}
                </p>
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: item.valueColor }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
