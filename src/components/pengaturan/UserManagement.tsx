// ============================================================
// UserManagement Component — AJK PowerMeter Dashboard
// (Opsional) Tabel user, tambah user, hapus user
// Saat ini: placeholder dengan info bahwa fitur ini opsional
// ============================================================

'use client';

import { Users, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

export function UserManagement() {
  const { user } = useAuth();

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Manajemen User
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Kelola akun pengguna dashboard
          </p>
        </div>
        <Badge variant="info" size="md">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Single Admin
          </span>
        </Badge>
      </div>

      {/* Current User Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)]">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
              {user?.email || 'admin@ajk.co.id'}
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Administrator · Akun aktif
            </p>
          </div>
          <Badge variant="success" dot size="sm">
            Aktif
          </Badge>
        </div>

        {/* Info Note */}
        <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <p className="text-sm text-blue-300 font-medium mb-1">
            ℹ️ Mode Single Admin
          </p>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Dashboard saat ini dikonfigurasi untuk satu admin. Untuk menambahkan 
            multi-user dengan role-based access control (Admin + Operator), 
            hubungi tim pengembang untuk mengaktifkan fitur ini.
          </p>
        </div>

        {/* Account Details */}
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold text-[var(--text-secondary)]">Detail Akun</h4>
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Email</span>
              <span className="font-mono text-[var(--text-primary)]">
                {user?.email || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">UID</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {user?.uid || '-'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Provider</span>
              <span className="text-[var(--text-primary)]">
                Email/Password
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[var(--text-secondary)]">Login terakhir</span>
              <span className="text-[var(--text-primary)]">
                {user?.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleString('id-ID')
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
