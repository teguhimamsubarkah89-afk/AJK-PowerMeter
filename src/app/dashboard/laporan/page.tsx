// ============================================================
// Halaman Laporan — AJK PowerMeter Dashboard
// Filter + ReportSummary + ReportChart + ExportButtons
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { FilterBar } from '@/components/riwayat/FilterBar';
import { ReportSummary } from '@/components/laporan/ReportSummary';
import { ReportChart } from '@/components/laporan/ReportChart';
import { ExportButtons } from '@/components/laporan/ExportButtons';
import { useLogData } from '@/hooks/useLogData';
import { useAppStore } from '@/stores/useAppStore';
import { calculateReportSummary } from '@/lib/utils/calculations';
import { formatDate } from '@/lib/utils/formatters';
import type { PeriodFilter, DateRange } from '@/types';

export default function LaporanPage() {
  const [period, setPeriod] = useState<PeriodFilter>('bulan');
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const tariffPerKwh = useAppStore((s) => s.tariffPerKwh);

  const { logs, loading, refetch } = useLogData(period, customRange);

  // Calculate summary
  const summary = useMemo(() => {
    if (logs.length === 0) return null;
    return calculateReportSummary(logs, tariffPerKwh);
  }, [logs, tariffPerKwh]);

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

      {/* Summary Cards */}
      <ReportSummary summary={summary} loading={loading} />

      {/* Period Info */}
      {summary && !loading && (
        <div className="text-xs text-[var(--text-muted)] animate-fade-in">
          Periode: {formatDate(summary.periodStart)} — {formatDate(summary.periodEnd)} ·{' '}
          {summary.dataPointCount.toLocaleString('id-ID')} titik data
        </div>
      )}

      {/* Chart */}
      <ReportChart logs={logs} loading={loading} />

      {/* Export Buttons */}
      <div className="glass rounded-2xl p-5 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Unduh Laporan
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Export data ke format Excel atau PDF
            </p>
          </div>
          <ExportButtons logs={logs} summary={summary} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
