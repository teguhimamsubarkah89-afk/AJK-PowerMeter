// ============================================================
// useLogData Hook — AJK PowerMeter Dashboard
// Fetch data dari /logs Firebase dengan filter waktu
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchLogs } from '@/lib/firebase/database';
import { useAppStore } from '@/stores/useAppStore';
import type { LogEntryWithKey, PeriodFilter, DateRange } from '@/types';

interface UseLogDataReturn {
  logs: LogEntryWithKey[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

/**
 * Hitung start/end timestamp berdasarkan period filter
 */
function getDateRange(period: PeriodFilter, customRange?: DateRange): { start: number; end: number } {
  const now = new Date();
  const end = now.getTime();

  switch (period) {
    case 'hari': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { start: start.getTime(), end };
    }
    case 'minggu': {
      const start = new Date(now);
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { start: start.getTime(), end };
    }
    case 'bulan': {
      const start = new Date(now);
      start.setMonth(start.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      return { start: start.getTime(), end };
    }
    case 'tahun': {
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      return { start: start.getTime(), end };
    }
    case 'custom': {
      if (customRange) {
        const startDate = new Date(customRange.from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(customRange.to);
        endDate.setHours(23, 59, 59, 999);
        return { start: startDate.getTime(), end: endDate.getTime() };
      }
      // fallback ke hari ini
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      return { start: start.getTime(), end };
    }
    case 'semua': {
      // 1 tahun kebelakang sebagai limit
      const start = new Date(now);
      start.setFullYear(start.getFullYear() - 1);
      return { start: start.getTime(), end };
    }
    default:
      return { start: 0, end };
  }
}

export function useLogData(
  period: PeriodFilter,
  customRange?: DateRange
): UseLogDataReturn {
  const [logs, setLogs] = useState<LogEntryWithKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeDeviceId = useAppStore((s) => s.activeDeviceId);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { start, end } = getDateRange(period, customRange);
      const data = await fetchLogs(activeDeviceId, start, end);
      setLogs(data);
    } catch (err) {
      console.error('[useLogData] Error:', err);
      setError('Gagal memuat data riwayat.');
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [activeDeviceId, period, customRange]);

  useEffect(() => {
    // Defer loadData to avoid synchronous setState inside effect
    Promise.resolve().then(loadData);
  }, [loadData]);

  return {
    logs,
    loading,
    error,
    totalCount: logs.length,
    refetch: loadData,
  };
}
