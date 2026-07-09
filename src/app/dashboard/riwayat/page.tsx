// ============================================================
// Halaman Riwayat — AJK PowerMeter Dashboard
// FilterBar + HistoryChart + LogTable
// ============================================================

'use client';

import { useState } from 'react';
import { FilterBar } from '@/components/riwayat/FilterBar';
import { HistoryChart } from '@/components/riwayat/HistoryChart';
import { LogTable } from '@/components/riwayat/LogTable';
import { useLogData } from '@/hooks/useLogData';
import type { PeriodFilter, DateRange } from '@/types';

export default function RiwayatPage() {
  const [period, setPeriod] = useState<PeriodFilter>('hari');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const { logs, loading, totalCount, refetch } = useLogData(period, customRange);

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        activePeriod={period}
        onPeriodChange={setPeriod}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        onRefresh={refetch}
        loading={loading}
      />

      {/* Summary */}
      {!loading && (
        <p className="text-sm text-[var(--text-muted)] animate-fade-in">
          Total: <span className="text-[var(--text-secondary)] font-semibold">{totalCount.toLocaleString('id-ID')}</span> titik data
        </p>
      )}

      {/* History Chart */}
      <HistoryChart logs={logs} loading={loading} />

      {/* Data Table */}
      <LogTable logs={logs} loading={loading} />
    </div>
  );
}
