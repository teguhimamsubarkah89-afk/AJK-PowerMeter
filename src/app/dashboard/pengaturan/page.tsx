// ============================================================
// Halaman Pengaturan — AJK PowerMeter Dashboard v2.0
// Premium animated tab switcher
// ============================================================

'use client';

import { useState } from 'react';
import { Settings, Users } from 'lucide-react';
import { DeviceInfoForm } from '@/components/pengaturan/DeviceInfoForm';
import { UserManagement } from '@/components/pengaturan/UserManagement';

type Tab = 'device' | 'user';

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<Tab>('device');

  const tabs = [
    { key: 'device' as Tab, label: 'Info Perangkat', icon: Settings },
    { key: 'user' as Tab, label: 'Manajemen User', icon: Users },
  ];

  return (
    <div className="space-y-5 pb-6">
      {/* Page Header */}
      <div className="animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
            <Settings className="w-4 h-4 text-amber-400" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Pengaturan</h1>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] ml-11">
          Kelola perangkat, konfigurasi dashboard, dan akun pengguna.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="animate-fade-in-up stagger-2">
        <div
          className="inline-flex gap-1 p-1 rounded-xl"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-250 relative"
                style={{
                  minHeight: '40px',
                  ...(isActive
                    ? {
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                      }
                    : {
                        color: 'var(--text-secondary)',
                        background: 'transparent',
                      }),
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-tab-slide" key={activeTab}>
        {activeTab === 'device' && <DeviceInfoForm />}
        {activeTab === 'user' && <UserManagement />}
      </div>
    </div>
  );
}
