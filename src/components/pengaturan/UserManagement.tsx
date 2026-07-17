// ============================================================
// UserManagement Component — AJK PowerMeter Dashboard v2.0
// User info + account details with premium styling
// ============================================================

'use client';

import { Users, ShieldAlert, Mail, Key, Fingerprint, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function UserManagement() {
  const { user } = useAuth();

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Current User Card */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
              Manajemen User
            </h3>
            <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5">
              Kelola akun pengguna dashboard
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex-shrink-0">
            <ShieldAlert className="w-3 h-3" />
            Single Admin
          </span>
        </div>

        {/* User profile card */}
        <div className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-white/[0.02]"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">
              {user?.email || 'admin@ajk.co.id'}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Administrator · Akun aktif
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-live" />
            Aktif
          </span>
        </div>
      </div>

      {/* Info Note */}
      <div className="glass-card p-5 sm:p-6">
        <div className="flex gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/10 mt-0.5">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-blue-300 font-semibold mb-1">
              Mode Single Admin
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Dashboard saat ini dikonfigurasi untuk satu admin. Untuk menambahkan
              multi-user dengan role-based access control (Admin + Operator),
              hubungi tim pengembang untuk mengaktifkan fitur ini.
            </p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="glass-card p-5 sm:p-6">
        <h4 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-4">Detail Akun</h4>
        <div className="space-y-0">
          {[
            {
              label: 'Email',
              value: user?.email || '-',
              icon: Mail,
              color: '#3b82f6',
              bg: 'rgba(59,130,246,0.1)',
            },
            {
              label: 'UID',
              value: user?.uid || '-',
              icon: Fingerprint,
              color: '#8b5cf6',
              bg: 'rgba(139,92,246,0.1)',
              mono: true,
              small: true,
            },
            {
              label: 'Provider',
              value: 'Email/Password',
              icon: Key,
              color: '#10b981',
              bg: 'rgba(16,185,129,0.1)',
            },
            {
              label: 'Login terakhir',
              value: user?.metadata?.lastSignInTime
                ? new Date(user.metadata.lastSignInTime).toLocaleString('id-ID')
                : '-',
              icon: Clock,
              color: '#f59e0b',
              bg: 'rgba(245,158,11,0.1)',
            },
          ].map((item, i, arr) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 py-3.5"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border-color)' : 'none' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <span className="text-xs sm:text-sm text-[var(--text-secondary)] flex-shrink-0">{item.label}</span>
                <span
                  className={`text-xs sm:text-sm truncate ml-auto text-right text-[var(--text-primary)] ${item.mono ? 'font-mono' : ''} ${item.small ? 'text-[10px] sm:text-xs text-[var(--text-muted)]' : ''}`}
                >
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
