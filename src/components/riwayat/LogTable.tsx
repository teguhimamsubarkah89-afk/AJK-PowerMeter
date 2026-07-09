// ============================================================
// LogTable Component — AJK PowerMeter Dashboard
// Tabel data historis dengan sorting dan pagination (responsive)
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Database } from 'lucide-react';
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

  const getSortIndicator = (key: string) => {
    if (sortKey !== key) return '↕';
    return sortAsc ? '↑' : '↓';
  };

  const columns = [
    { key: 'timestamp', label: 'Waktu', shortLabel: 'Waktu', format: (v: number) => formatDateTime(v) },
    { key: 'voltage', label: 'Tegangan (V)', shortLabel: 'V', format: (v: number) => formatNumber(v, 1) },
    { key: 'current', label: 'Arus (A)', shortLabel: 'A', format: (v: number) => formatNumber(v, 2) },
    { key: 'power', label: 'Daya (W)', shortLabel: 'W', format: (v: number) => formatNumber(v, 1) },
    { key: 'energy', label: 'Energi (Wh)', shortLabel: 'Wh', format: (v: number) => formatNumber(v, 0) },
    { key: 'frequency', label: 'Frekuensi (Hz)', shortLabel: 'Hz', format: (v: number) => formatNumber(v, 1) },
    { key: 'pf', label: 'PF', shortLabel: 'PF', format: (v: number) => formatNumber(v, 2) },
  ];

  if (loading) {
    return (
      <div className="glass-thick rounded-3xl p-4 sm:p-6 gradient-border">
        <div className="animate-shimmer h-[300px] rounded-xl" style={{ background: 'var(--bg-card-hover)' }} />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="glass-thick rounded-3xl p-6 gradient-border">
        <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
          <Database className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">Belum ada data log untuk periode ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-thick gradient-border rounded-3xl overflow-hidden p-1">
      {/* Table wrapper — scrollable on mobile */}
      <div className="overflow-x-auto rounded-2xl bg-[#0a0e1a]/40">
        <table className="w-full text-sm" style={{ minWidth: '600px' }}>
          <thead>
            <tr className="border-b border-[var(--glass-border)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-3 sm:px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="hidden sm:inline">{col.label}</span>
                  <span className="sm:hidden">{col.shortLabel}</span>
                  {' '}
                  <span className="opacity-50">{getSortIndicator(col.key)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log, index) => (
              <tr
                key={log.key}
                className="border-b border-[var(--glass-border)] transition-colors"
                style={{ background: index % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = index % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent'; }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 sm:px-4 py-2.5 whitespace-nowrap font-mono text-xs"
                    style={{ color: 'var(--text-primary)' }}
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
        <div className="flex items-center justify-between px-4 py-4 border-t border-[var(--glass-border)]">
          <p className="text-[10px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
            {page * LOG_PAGE_SIZE + 1}–{Math.min((page + 1) * LOG_PAGE_SIZE, logs.length)} dari {logs.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg disabled:opacity-30 transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-2" style={{ color: 'var(--text-secondary)' }}>
              {page + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg disabled:opacity-30 transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
