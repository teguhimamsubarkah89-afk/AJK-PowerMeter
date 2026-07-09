// ============================================================
// Halaman Pengaturan — AJK PowerMeter Dashboard
// Tab: Info Perangkat | Manajemen User
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
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="glass rounded-2xl p-1.5 inline-flex gap-1 animate-fade-in">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'device' && <DeviceInfoForm />}
      {activeTab === 'user' && <UserManagement />}
    </div>
  );
}
