// ============================================================
// LogTable Component — AJK PowerMeter Dashboard v2.0
// Premium data table with sticky header, sort, pagination
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Database, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatDateTime, formatNumber } from '@/lib/utils/formatters';
import { LOG_PAGE_SIZE } from '@/lib/constants';
import type { LogEntryWithKey } from '@/types';

interface LogTableProps {
  logs: LogEntryWithKey[];
  loading?: boolean;
}

export function LogTable({ logs, loading }: LogTableProps) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => {
      const aVal = a[sortKey as keyof LogEntryWithKey];
      const bVal = b[sortKey as keyof LogEntryWithKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [logs, sortKey, sortAsc]);

  const totalPages = Math.ceil(sortedLogs.length / LOG_PAGE_SIZE);
  const paginatedLogs = sortedLogs.slice(page * LOG_PAGE_SIZE, (page + 1) * LOG_PAGE_SIZE);

  const handleSort = (key: string) => {
    if (sortKey === key) { setSortAsc(!sortAsc); } else { setSortKey(key); setSortAsc(true); }
    setPage(0);
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortAsc
      ? <ArrowUp className="w-3 h-3 text-blue-400" />
      : <ArrowDown className="w-3 h-3 text-blue-400" />;
  };

  const columns = [
    { key: 'timestamp', label: 'Waktu', shortLabel: 'Waktu', format: (v: number) => formatDateTime(v), align: 'left' as const },
    { key: 'voltage', label: 'Tegangan (V)', shortLabel: 'V', format: (v: number) => formatNumber(v, 1), align: 'right' as const },
    { key: 'current', label: 'Arus (A)', shortLabel: 'A', format: (v: number) => formatNumber(v, 2), align: 'right' as const },
    { key: 'power', label: 'Daya (W)', shortLabel: 'W', format: (v: number) => formatNumber(v, 1), align: 'right' as const },
    { key: 'energy', label: 'Energi (Wh)', shortLabel: 'Wh', format: (v: number) => formatNumber(v, 0), align: 'right' as const },
    { key: 'frequency', label: 'Frekuensi (Hz)', shortLabel: 'Hz', format: (v: number) => formatNumber(v, 1), align: 'right' as const },
    { key: 'pf', label: 'PF', shortLabel: 'PF', format: (v: number) => formatNumber(v, 2), align: 'right' as const },
  ];

  if (loading) {
    return (
      <div className="glass-card p-4 sm:p-6">
        <div className="animate-shimmer h-[300px] rounded-xl" style={{ background: 'var(--bg-card-hover)' }} />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="glass-card p-6">
        <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
          <Database className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm font-medium">Belum ada data log untuk periode ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      {/* Table wrapper — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: '640px' }}>
          <thead>
            <tr className="border-b border-[var(--glass-border)]" style={{ background: 'rgba(255,255,255,0.02)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 sm:px-4 py-3.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors hover:text-[var(--text-secondary)] sticky top-0"
                  style={{
                    color: sortKey === col.key ? 'var(--text-primary)' : 'var(--text-muted)',
                    textAlign: col.align,
                    background: 'inherit',
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    <span className="hidden sm:inline">{col.label}</span>
                    <span className="sm:hidden">{col.shortLabel}</span>
                    {getSortIcon(col.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, index) => (
              <tr
                key={log.key}
                className="border-b border-[var(--glass-border)] transition-colors duration-150 hover:bg-white/[0.03]"
                style={{
                  background: index % 2 === 1 ? 'rgba(255,255,255,0.012)' : 'transparent',
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 sm:px-4 py-3 whitespace-nowrap font-mono text-xs"
                    style={{
                      color: 'var(--text-primary)',
                      textAlign: col.align,
                    }}
                  >
                    {col.format(log[col.key as keyof LogEntryWithKey] as number)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3.5 border-t border-[var(--glass-border)]">
          <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
            {page * LOG_PAGE_SIZE + 1}–{Math.min((page + 1) * LOG_PAGE_SIZE, logs.length)} dari {logs.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-2 rounded-lg disabled:opacity-30 transition-all hover:bg-white/5"
              style={{ color: 'var(--text-muted)', minWidth: '36px', minHeight: '36px' }}
            >
              <ChevronLeft className="w-4 h-4 mx-auto" />
            </button>
            <span className="text-xs font-semibold px-3 tabular-nums" style={{ color: 'var(--text-secondary)' }}>
              {page + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg disabled:opacity-30 transition-all hover:bg-white/5"
              style={{ color: 'var(--text-muted)', minWidth: '36px', minHeight: '36px' }}
            >
              <ChevronRight className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
