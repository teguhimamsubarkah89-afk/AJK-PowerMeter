// ============================================================
// MetricCard Component — AJK PowerMeter Dashboard
// Kartu individual untuk setiap metric (V, A, W, dll)
// ============================================================

'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Zap, Plug, Lightbulb, Battery, Activity, Gauge,
  TrendingUp, TrendingDown, Minus,
  type LucideIcon,
} from 'lucide-react';
import { formatMetricValue } from '@/lib/utils/formatters';

const iconMap: Record<string, LucideIcon> = { Zap, Plug, Lightbulb, Battery, Activity, Gauge };

interface MetricCardProps {
  label: string;
  value: number | null;
  previousValue?: number | null;
  unit: string;
  iconName: string;
  color: string;
  decimals: number;
  metricKey: string;
  staggerIndex?: number;
}

export function MetricCard({
  label, value, previousValue, unit, iconName, color, decimals, metricKey, staggerIndex = 0,
}: MetricCardProps) {
  const Icon = iconMap[iconName] || Zap;
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef<number | null>(null);

  const displayValue = value === null || value === undefined ? '--' : formatMetricValue(value, metricKey, decimals);

  useEffect(() => {
    // Trigger a short animation when value changes
    if (prevValueRef.current !== null && prevValueRef.current !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
    prevValueRef.current = value;
  }, [value]);

  const getTrend = () => {
    if (value === null || previousValue === null || previousValue === undefined) return 'neutral';
    if (value > previousValue) return 'up';
    if (value < previousValue) return 'down';
    return 'neutral';
  };

  const trend = getTrend();
  const trendConfig = {
    up: { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Naik', color: '#10b981' },
    down: { icon: <TrendingDown className="w-3.5 h-3.5" />, label: 'Turun', color: '#ef4444' },
    neutral: { icon: <Minus className="w-3.5 h-3.5" />, label: 'Stabil', color: 'var(--text-muted)' },
  };

  const colorVars: Record<string, string> = {
    amber: '#f59e0b', blue: '#3b82f6', emerald: '#10b981',
    violet: '#8b5cf6', cyan: '#06b6d4', orange: '#f97316',
  };
  const accentColor = colorVars[color] || colorVars.blue;

  return (
    <div
      className={`glass gradient-border rounded-2xl p-5 hover-lift opacity-0 animate-fade-in-up stagger-${staggerIndex + 1} min-w-0`}
      style={{
        animationFillMode: 'forwards',
        boxShadow: `0 0 20px ${accentColor}15, inset 0 1px 0 ${accentColor}10`,
      }}
      role="group"
      aria-label={`${label} metric card`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-[var(--text-secondary)] tracking-wide">
          {label}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accentColor}18` }}
        >
          <Icon className="w-5 h-5" style={{ color: accentColor }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className={`metric-value leading-none text-[var(--text-primary)] tracking-tight tabular-nums ${isAnimating ? 'animate-count-up' : ''}`}
          aria-live="polite"
        >
          {displayValue}
        </span>
        <span className="text-sm text-[var(--text-muted)] font-semibold">
          {unit}
        </span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: trendConfig[trend].color }}>
        {trendConfig[trend].icon}
        <span>{trendConfig[trend].label}</span>
      </div>

      {/* Accent line */}
      <div
        className="mt-4 h-[2px] rounded-full"
        style={{ background: `linear-gradient(to right, ${accentColor}50, transparent)` }}
      />
    </div>
  );
}
