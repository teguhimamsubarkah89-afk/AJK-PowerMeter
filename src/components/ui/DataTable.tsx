// ============================================================
// DataTable Component — AJK PowerMeter Dashboard v2.0
// Premium data table: sticky header, responsive scroll,
// alternating rows, sort indicators, mobile card-view
// ============================================================

'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Database } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  /** Hide on mobile (below sm breakpoint) */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  className?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Belum ada data',
  emptyIcon,
  className = '',
  stickyHeader = true,
  maxHeight,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-30" />;
    if (sortDirection === 'asc') return <ChevronUp className="w-3.5 h-3.5 text-blue-400" />;
    return <ChevronDown className="w-3.5 h-3.5 text-blue-400" />;
  };

  // ── Empty State ────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 rounded-xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
          {emptyIcon || <Database className="w-6 h-6 text-[var(--text-muted)] opacity-50" />}
        </div>
        <p className="text-sm font-medium text-[var(--text-muted)]">{emptyMessage}</p>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────
  return (
    <div
      className={`overflow-x-auto rounded-xl ${className}`}
      style={{
        border: '1px solid var(--glass-border)',
        background: 'var(--bg-card)',
        ...(maxHeight ? { maxHeight, overflowY: 'auto' } : {}),
      }}
    >
      <table className="w-full text-sm">
        <thead
          className={stickyHeader ? 'sticky top-0 z-10' : ''}
          style={{
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: stickyHeader ? 'blur(12px)' : undefined,
          }}
        >
          <tr
            style={{
              borderBottom: '1px solid var(--glass-border)',
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]
                  ${col.sortable ? 'cursor-pointer select-none hover:text-blue-400 transition-colors' : ''}
                  ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}
                  ${col.headerClassName || ''}`}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && getSortIcon(col.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              className="transition-colors duration-150 hover:bg-white/[0.03]"
              style={{
                borderBottom:
                  index < sortedData.length - 1
                    ? '1px solid rgba(255,255,255,0.04)'
                    : undefined,
                background:
                  index % 2 === 0
                    ? 'transparent'
                    : 'rgba(255,255,255,0.015)',
              }}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-[var(--text-primary)] whitespace-nowrap text-xs sm:text-sm
                    ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}
                    ${col.className || ''}`}
                >
                  {col.render
                    ? col.render(item)
                    : (item[col.key] as ReactNode) ?? '--'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
