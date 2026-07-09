// ============================================================
// MiniTrendChart Component — AJK PowerMeter Dashboard
// Line chart tren 30 menit terakhir (Recharts)
// ============================================================

'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { fetchRecentLogs } from '@/lib/firebase/database';
import { useAppStore } from '@/stores/useAppStore';
import { MINI_TREND_DATA_POINTS, CHART_COLORS, METRIC_CONFIGS } from '@/lib/constants';
import { formatChartTime, formatMetricValue } from '@/lib/utils/formatters';
import { Skeleton } from '@/components/ui/Skeleton';
import type { LogEntryWithKey, MetricType } from '@/types';

export function MiniTrendChart() {
  const [logs, setLogs] = useState<LogEntryWithKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('power');
  const activeDeviceId = useAppStore((s) => s.activeDeviceId);

  useEffect(() => {
    let isCancelled = false;
    async function loadLogs() {
      setLoading(true);
      const data = await fetchRecentLogs(activeDeviceId, MINI_TREND_DATA_POINTS);
      if (!isCancelled) { setLogs(data); setLoading(false); }
    }
    loadLogs();
    const interval = setInterval(loadLogs, 60_000);
    return () => { isCancelled = true; clearInterval(interval); };
  }, [activeDeviceId]);

  const chartData = useMemo(
    () => logs.map((log) => ({
      time: log.timestamp,
      timeLabel: formatChartTime(log.timestamp),
      value: log[selectedMetric],
    })),
    [logs, selectedMetric]
  );

  const metricConfig = METRIC_CONFIGS.find((m) => m.key === selectedMetric);
  const chartColor = CHART_COLORS[selectedMetric] || CHART_COLORS.power;

  if (loading) {
    return (
      <div className="glass-thick gradient-border rounded-3xl p-5 sm:p-7 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={120} height={32} />
        </div>
        <Skeleton variant="rectangular" height={220} />
      </div>
    );
  }

  return (
    <div className="glass-thick gradient-border rounded-2xl p-5 sm:p-7 animate-fade-in relative z-0">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Tren 30 Menit Terakhir
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {logs.length} titik data · auto-refresh setiap menit
            </p>
          </div>
        </div>

        {/* Metric Selector — scrollable horizontal on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {METRIC_CONFIGS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={
                selectedMetric === m.key
                  ? { backgroundColor: CHART_COLORS[m.key], color: 'white', boxShadow: `0 2px 8px ${CHART_COLORS[m.key]}40` }
                  : { color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-sm text-[var(--text-muted)]">
          Belum ada data log. Data akan muncul setelah 30 menit.
        </div>
      ) : (
        <div className="w-full" style={{ height: 'clamp(180px, 30vw, 250px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--glass-border)" strokeOpacity={0.5} strokeDasharray="4 4" />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false} tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false} tickLine={false}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(17, 24, 39, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'white',
                  padding: '12px 16px',
                }}
                labelFormatter={(label) => `Waktu: ${label}`}
                formatter={(val) => {
                  const numVal = Number(val ?? 0);
                  return [
                    `${formatMetricValue(numVal, selectedMetric, metricConfig?.decimals)} ${metricConfig?.unit || ''}`,
                    metricConfig?.label || '',
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${selectedMetric})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: chartColor }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
