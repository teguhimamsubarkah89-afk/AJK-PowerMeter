// ============================================================
// DataTable Component — AJK PowerMeter Dashboard
// Tabel data dengan sorting, responsive scroll, alternating rows
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
  stickyHeader = false,
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
    if (sortKey !== key) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    if (sortDirection === 'asc') return <ChevronUp className="w-3.5 h-3.5" />;
    return <ChevronDown className="w-3.5 h-3.5" />;
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
        {emptyIcon || <Database className="w-12 h-12 mb-3 opacity-30" />}
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-x-auto rounded-xl border border-[var(--border-color)] ${className}`}
      style={maxHeight ? { maxHeight, overflowY: 'auto' } : undefined}
    >
      <table className="w-full text-sm">
        <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
          <tr className="bg-[var(--bg-card)] border-b border-[var(--border-color)]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]
                  ${col.sortable ? 'cursor-pointer select-none hover:text-[var(--text-secondary)] transition-colors' : ''}
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
              className={`border-b border-[var(--border-color)] transition-colors hover:bg-[var(--bg-card-hover)]
                ${index % 2 === 0 ? 'bg-[var(--bg-secondary)]' : 'bg-[var(--bg-card)]'}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-[var(--text-primary)] whitespace-nowrap ${col.className || ''}`}
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
