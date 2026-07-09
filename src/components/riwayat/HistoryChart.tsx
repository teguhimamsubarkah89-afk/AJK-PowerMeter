// ============================================================
// HistoryChart Component — AJK PowerMeter Dashboard
// Full history line chart with multi-series toggle
// ============================================================

'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Brush, Legend,
} from 'recharts';
import { METRIC_CONFIGS, CHART_COLORS } from '@/lib/constants';
import { formatChartTime, formatMetricValue } from '@/lib/utils/formatters';
import type { LogEntryWithKey, MetricType } from '@/types';

interface HistoryChartProps {
  logs: LogEntryWithKey[];
  loading?: boolean;
}

export function HistoryChart({ logs, loading }: HistoryChartProps) {
  const [activeMetrics, setActiveMetrics] = useState<MetricType[]>(['power', 'voltage']);

  const toggleMetric = (metric: MetricType) => {
    setActiveMetrics((prev) => {
      if (prev.includes(metric)) {
        if (prev.length === 1) return prev;
        return prev.filter((m) => m !== metric);
      }
      return [...prev, metric];
    });
  };

  const chartData = useMemo(
    () => logs.map((log) => ({
      time: log.timestamp,
      timeLabel: formatChartTime(log.timestamp),
      voltage: log.voltage, current: log.current,
      power: log.power, energy: log.energy,
      frequency: log.frequency, pf: log.pf,
    })),
    [logs]
  );

  if (loading) {
    return (
      <div className="glass-thick gradient-border rounded-3xl p-4 sm:p-6">
        <div className="animate-shimmer h-[280px] rounded-xl" style={{ background: 'var(--bg-card-hover)' }} />
      </div>
    );
  }

  if (logs.length === 0) return null;

  return (
    <div className="glass-thick gradient-border rounded-3xl p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">
          Grafik Riwayat
        </h3>

        {/* Metric Toggle — scrollable */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-hide">
          {METRIC_CONFIGS.map((m) => {
            const isActive = activeMetrics.includes(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200"
                style={
                  isActive
                    ? { backgroundColor: CHART_COLORS[m.key], color: 'white', border: '1px solid transparent' }
                    : { color: 'var(--text-muted)', background: 'transparent', border: '1px solid var(--border-color)' }
                }
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: 'clamp(220px, 35vw, 350px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} />
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
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--text-primary)',
                padding: '8px 12px',
              }}
              labelFormatter={(label) => `Waktu: ${label}`}
              formatter={(val, name) => {
                const numVal = Number(val ?? 0);
                const nameStr = String(name);
                const config = METRIC_CONFIGS.find((m) => m.key === nameStr);
                return [
                  `${formatMetricValue(numVal, nameStr, config?.decimals)} ${config?.unit || ''}`,
                  config?.label || nameStr,
                ];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => {
                const config = METRIC_CONFIGS.find((m) => m.key === value);
                return config?.label || value;
              }}
            />
            {chartData.length > 50 && (
              <Brush
                dataKey="timeLabel" height={25}
                stroke="var(--border-color)" fill="var(--bg-card)"
                travellerWidth={8}
              />
            )}
            {activeMetrics.map((metric) => (
              <Line
                key={metric} type="monotone" dataKey={metric}
                stroke={CHART_COLORS[metric]} strokeWidth={2}
                dot={false} activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
