// ============================================================
// Dashboard Page — AJK PowerMeter Dashboard
// Halaman utama: Status + RealtimeGrid + MiniTrendChart
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
  const { isOnline, pzemStatus, lastSeen, updateStatus } = useDeviceStatus();

  // Update device status setiap kali data realtime berubah
  useEffect(() => {
    updateStatus(data, lastUpdated);
  }, [data, lastUpdated, updateStatus]);

  return (
    <div className="space-y-6">
      {/* Status Indicator */}
      <StatusIndicator
        isOnline={isOnline}
        pzemStatus={pzemStatus}
        lastSeen={lastSeen}
        ip={data?.ip}
        localTime={data?.local_time}
      />

      {/* Realtime Metric Cards */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Data Real-Time
        </h2>
        <RealtimeGrid data={data} previousData={previousData} loading={loading} />
      </div>

      {/* Mini Trend Chart */}
      <MiniTrendChart />
    </div>
  );
}
