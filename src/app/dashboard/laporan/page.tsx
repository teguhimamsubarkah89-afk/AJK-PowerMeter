// ============================================================
// Halaman Laporan — AJK PowerMeter Dashboard v2.0
// Filter + ReportSummary + ReportChart + ExportButtons
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { FileText } from 'lucide-react';
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
    <div className="space-y-5 pb-6">
      {/* Page Header */}
      <div className="animate-fade-in-up stagger-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.12)' }}>
            <FileText className="w-4 h-4 text-violet-400" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">Laporan</h1>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] ml-11">
          Ringkasan dan analisis konsumsi energi listrik.
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

      {/* Summary Cards */}
      <div className="animate-fade-in-up stagger-3">
        <ReportSummary summary={summary} loading={loading} />
      </div>

      {/* Period Info */}
      {summary && !loading && (
        <div className="text-xs text-[var(--text-muted)] animate-fade-in">
          Periode: {formatDate(summary.periodStart)} — {formatDate(summary.periodEnd)} ·{' '}
          {summary.dataPointCount.toLocaleString('id-ID')} titik data
        </div>
      )}

      {/* Chart */}
      <div className="animate-fade-in-up stagger-4">
        <ReportChart logs={logs} loading={loading} />
      </div>

      {/* Export Section */}
      <div className="glass-card p-5 animate-fade-in-up stagger-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
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
