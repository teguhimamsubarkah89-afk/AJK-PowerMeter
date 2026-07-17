// ============================================================
// FilterBar Component — AJK PowerMeter Dashboard v2.0
// Premium pill-style period selector + date range picker
// ============================================================

'use client';

import { useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import type { PeriodFilter, DateRange } from '@/types';

interface FilterBarProps {
  activePeriod: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
  customRange?: DateRange;
  onCustomRangeChange?: (range: DateRange) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

const periodOptions: { value: PeriodFilter; label: string }[] = [
  { value: 'hari', label: 'Hari Ini' },
  { value: 'minggu', label: '7 Hari' },
  { value: 'bulan', label: '30 Hari' },
  { value: 'tahun', label: '1 Tahun' },
  { value: 'semua', label: 'Semua' },
];

export function FilterBar({
  activePeriod, onPeriodChange, customRange, onCustomRangeChange, onRefresh, loading = false,
}: FilterBarProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleCustomApply = () => {
    if (fromDate && toDate && onCustomRangeChange) {
      onCustomRangeChange({ from: new Date(fromDate), to: new Date(toDate) });
      onPeriodChange('custom');
      setShowDatePicker(false);
    }
  };

  return (
    <div className="glass-card p-3 sm:p-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Period Buttons — scrollable on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-hide">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPeriodChange(opt.value)}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200"
              style={{
                minHeight: '38px',
                ...(activePeriod === opt.value
                  ? {
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                    }
                  : {
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                    }),
              }}
            >
              {opt.label}
            </button>
          ))}

          {/* Custom */}
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 transition-all duration-200"
            style={{
              minHeight: '38px',
              ...(activePeriod === 'custom'
                ? {
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                  }
                : {
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                  }),
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            Custom
          </button>
        </div>

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 disabled:opacity-50"
            style={{
              minHeight: '38px',
              color: 'var(--text-secondary)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        )}
      </div>

      {/* Date Picker Expanded */}
      {showDatePicker && (
        <div className="mt-3 pt-3 border-t border-[var(--border-color)] animate-fade-in-down">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs text-[var(--text-muted)] font-semibold">Dari</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/30"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  minHeight: '42px',
                }}
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs text-[var(--text-muted)] font-semibold">Sampai</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/30"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  minHeight: '42px',
                }}
              />
            </div>
            <button
              onClick={handleCustomApply}
              disabled={!fromDate || !toDate}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                minHeight: '42px',
              }}
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {activePeriod === 'custom' && customRange && (
        <p className="mt-2.5 text-xs text-[var(--text-muted)]">
          Menampilkan: {customRange.from.toLocaleDateString('id-ID')} — {customRange.to.toLocaleDateString('id-ID')}
        </p>
      )}
    </div>
  );
}
