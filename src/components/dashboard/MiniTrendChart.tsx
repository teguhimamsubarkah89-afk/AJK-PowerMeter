// ============================================================
// MiniTrendChart Component — AJK PowerMeter Dashboard v2.0
// Premium area chart with touch-friendly metric selector
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
      <div className="glass-card p-5 sm:p-7 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={120} height={32} />
        </div>
        <Skeleton variant="rectangular" height={220} />
      </div>
    );
  }

  return (
    <div className="glass-card p-5 sm:p-7 animate-fade-in relative overflow-hidden">
      {/* Decorative accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-40"
        style={{ background: `linear-gradient(90deg, transparent, ${chartColor}, transparent)` }}
      />

      {/* Header */}
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
              Tren 30 Menit Terakhir
            </h3>
            <p className="text-xs font-medium text-[var(--text-muted)] mt-1">
              {logs.length} titik data · auto-refresh setiap menit
            </p>
          </div>
        </div>

        {/* Metric Selector — scrollable, touch-friendly */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
          {METRIC_CONFIGS.map((m) => {
            const isActive = selectedMetric === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setSelectedMetric(m.key)}
                className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex-shrink-0 relative overflow-hidden"
                style={{
                  minHeight: '36px',
                  ...(isActive
                    ? {
                        backgroundColor: CHART_COLORS[m.key],
                        color: 'white',
                        boxShadow: `0 4px 16px ${CHART_COLORS[m.key]}50`,
                        transform: 'translateY(-1px)',
                      }
                    : {
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border-color)',
                      }),
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[220px] text-sm font-medium text-[var(--text-muted)] rounded-xl border border-[var(--border-color)] bg-white/[0.02]">
          Belum ada data log. Data akan muncul setelah 30 menit.
        </div>
      ) : (
        <div className="w-full mt-2" style={{ height: 'clamp(200px, 30vw, 300px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--glass-border)"
                strokeOpacity={0.5}
                strokeDasharray="6 6"
              />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-muted)', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={50}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(10, 15, 30, 0.92)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '12px 16px',
                }}
                itemStyle={{
                  fontWeight: 700,
                  fontSize: '14px',
                  marginTop: '4px',
                }}
                labelStyle={{
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 500,
                  marginBottom: '4px',
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
                strokeWidth={2.5}
                fill={`url(#gradient-${selectedMetric})`}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: '#fff',
                  fill: chartColor,
                  style: { filter: `drop-shadow(0 0 4px ${chartColor})` },
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
