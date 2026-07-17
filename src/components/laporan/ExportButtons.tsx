// ============================================================
// ExportButtons Component — AJK PowerMeter Dashboard v2.0
// Premium export buttons with icon + loading state
// ============================================================

'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Loader2, Download } from 'lucide-react';
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
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      {/* Excel */}
      <button
        onClick={handleExportExcel}
        disabled={isDisabled || exportingExcel}
        className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold
          transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{
          minHeight: '44px',
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        {exportingExcel ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        Export Excel
        <Download className="w-3.5 h-3.5 opacity-50" />
      </button>

      {/* PDF */}
      <button
        onClick={handleExportPDF}
        disabled={isDisabled || exportingPDF}
        className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold
          transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{
          minHeight: '44px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        }}
      >
        {exportingPDF ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        Export PDF
        <Download className="w-3.5 h-3.5 opacity-50" />
      </button>
    </div>
  );
}
