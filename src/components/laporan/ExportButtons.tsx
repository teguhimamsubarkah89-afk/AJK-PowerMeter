// ============================================================
// ExportButtons Component — AJK PowerMeter Dashboard
// Tombol Export Excel + PDF dengan loading state
// ============================================================

'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { exportToExcel, exportToPDF } from '@/lib/utils/export';
import toast from 'react-hot-toast';
import type { LogEntryWithKey, ReportSummary } from '@/types';

interface ExportButtonsProps {
  logs: LogEntryWithKey[];
  summary: ReportSummary | null;
  disabled?: boolean;
}

export function ExportButtons({ logs, summary, disabled }: ExportButtonsProps) {
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const isDisabled = disabled || !summary || logs.length === 0;

  const handleExportExcel = async () => {
    if (!summary) return;
    setExportingExcel(true);
    try {
      await exportToExcel(logs, summary);
      toast.success('File Excel berhasil diunduh!');
    } catch (err) {
      console.error('[Export] Excel error:', err);
      toast.error('Gagal mengexport Excel.');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPDF = async () => {
    if (!summary) return;
    setExportingPDF(true);
    try {
      await exportToPDF(logs, summary);
      toast.success('File PDF berhasil diunduh!');
    } catch (err) {
      console.error('[Export] PDF error:', err);
      toast.error('Gagal mengexport PDF.');
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Excel */}
      <button
        onClick={handleExportExcel}
        disabled={isDisabled || exportingExcel}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          bg-emerald-600/15 text-emerald-400 border border-emerald-500/20
          hover:bg-emerald-600/25 hover:border-emerald-500/30
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200"
      >
        {exportingExcel ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        Export Excel
      </button>

      {/* PDF */}
      <button
        onClick={handleExportPDF}
        disabled={isDisabled || exportingPDF}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          bg-red-600/15 text-red-400 border border-red-500/20
          hover:bg-red-600/25 hover:border-red-500/30
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200"
      >
        {exportingPDF ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Export PDF
      </button>
    </div>
  );
}
