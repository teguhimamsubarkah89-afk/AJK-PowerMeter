// ============================================================
// Halaman Riwayat — AJK PowerMeter Dashboard v2.0
// FilterBar + HistoryChart + LogTable
// ============================================================

'use client';

import { useState } from 'react';
import { ClipboardList } from 'lucide-react';
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
    <div className="space-y-5 pb-6">
      {/* Page Header */}
      <div className="animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.12)' }}>
            <ClipboardList className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Riwayat Data</h1>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] ml-11">
          Lihat dan analisis data historis dari perangkat monitoring.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="animate-fade-in-up stagger-2">
        <FilterBar
          activePeriod={period}
          onPeriodChange={setPeriod}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          onRefresh={refetch}
          loading={loading}
        />
      </div>

      {/* Summary */}
      {!loading && (
        <p className="text-xs sm:text-sm text-[var(--text-muted)] animate-fade-in">
          Total: <span className="text-[var(--text-secondary)] font-semibold">{totalCount.toLocaleString('id-ID')}</span> titik data
        </p>
      )}

      {/* History Chart */}
      <div className="animate-fade-in-up stagger-3">
        <HistoryChart logs={logs} loading={loading} />
      </div>

      {/* Data Table */}
      <div className="animate-fade-in-up stagger-4">
        <LogTable logs={logs} loading={loading} />
      </div>
    </div>
  );
}
