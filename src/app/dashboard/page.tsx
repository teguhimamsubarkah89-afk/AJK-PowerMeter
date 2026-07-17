// ============================================================
// Dashboard Page — AJK PowerMeter Dashboard v2.0
// Halaman utama: StatusBanner + RealtimeGrid + MiniTrendChart
// ============================================================

'use client';

import { useEffect } from 'react';
import { StatusIndicator } from '@/components/dashboard/StatusIndicator';
import { RealtimeGrid } from '@/components/dashboard/RealtimeGrid';
import { MiniTrendChart } from '@/components/dashboard/MiniTrendChart';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useDeviceStatus } from '@/hooks/useDeviceStatus';

export default function DashboardPage() {
  const { data, previousData, loading, lastUpdated } = useRealtimeData();
  const { isOnline, lastSeen, updateStatus } = useDeviceStatus();

  // Update device status setiap kali data realtime berubah
  useEffect(() => {
    updateStatus(data, lastUpdated);
  }, [data, lastUpdated, updateStatus]);

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner & Status */}
      <div className="animate-fade-in-up stagger-1">
        <StatusIndicator
          isOnline={isOnline}
          lastSeen={lastSeen}
        />
      </div>

      {/* Section: Realtime Metric Cards */}
      <div className="animate-fade-in-up stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">
            Data Real-time
          </h3>
          <div className="flex-1 h-px bg-[var(--border-color)]" />
        </div>
        <RealtimeGrid data={data} previousData={previousData} loading={loading} />
      </div>

      {/* Section: Mini Trend Chart */}
      <div className="animate-fade-in-up stagger-3">
        <MiniTrendChart />
      </div>
    </div>
  );
}
