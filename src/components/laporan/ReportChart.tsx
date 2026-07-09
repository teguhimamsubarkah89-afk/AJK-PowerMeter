// ============================================================
// ReportChart Component — AJK PowerMeter Dashboard
// Bar chart konsumsi energi harian/bulanan + line overlay
// ============================================================

'use client';

import { useMemo, useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { aggregateByDay, aggregateByMonth } from '@/lib/utils/calculations';
import { formatNumber } from '@/lib/utils/formatters';
import { Skeleton } from '@/components/ui/Skeleton';
import type { LogEntryWithKey } from '@/types';

interface ReportChartProps {
  logs: LogEntryWithKey[];
  loading: boolean;
}

type AggMode = 'harian' | 'bulanan';

export function ReportChart({ logs, loading }: ReportChartProps) {
  const [mode, setMode] = useState<AggMode>('harian');

  const chartData = useMemo(() => {
    if (logs.length === 0) return [];
    return mode === 'harian' ? aggregateByDay(logs) : aggregateByMonth(logs);
  }, [logs, mode]);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-4 sm:p-6">
        <Skeleton variant="text" width={200} height={20} className="mb-4" />
        <Skeleton variant="rectangular" height={250} />
      </div>
    );
  }

  if (chartData.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          Grafik Konsumsi Energi
        </h3>
        <div className="flex gap-1.5">
          {(['harian', 'bulanan'] as AggMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200"
              style={
                mode === m
                  ? { background: '#2563eb', color: 'white', boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)' }
                  : { color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: 'clamp(220px, 30vw, 300px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" strokeOpacity={0.5} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              yAxisId="energy" orientation="left"
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              axisLine={false} tickLine={false}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: 'var(--text-muted)' } }}
            />
            <YAxis
              yAxisId="power" orientation="right"
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              axisLine={false} tickLine={false}
              label={{ value: 'W', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: 'var(--text-muted)' } }}
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
              formatter={(val, name) => {
                const numVal = Number(val ?? 0);
                const nameStr = String(name);
                if (nameStr === 'totalEnergy') return [`${formatNumber(numVal, 2)} kWh`, 'Energi'];
                if (nameStr === 'averagePower') return [`${formatNumber(numVal, 1)} W`, 'Rata-rata Daya'];
                return [numVal, nameStr];
              }}
            />
            <Legend
              formatter={(value) => {
                if (value === 'totalEnergy') return 'Energi (kWh)';
                if (value === 'averagePower') return 'Rata-rata Daya (W)';
                return value;
              }}
            />
            <Bar yAxisId="energy" dataKey="totalEnergy" fill="var(--color-violet)" fillOpacity={0.7} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Line yAxisId="power" type="monotone" dataKey="averagePower" stroke="var(--color-emerald)" strokeWidth={2} dot={{ r: 3, fill: 'var(--color-emerald)' }} activeDot={{ r: 5, strokeWidth: 0 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
