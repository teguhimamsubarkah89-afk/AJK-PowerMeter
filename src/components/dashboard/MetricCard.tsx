// ============================================================
// MetricCard Component — AJK PowerMeter Dashboard v2.0
// Premium glass card with animated counter, trend, and accent glow
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

  // State for animated value
  const [displayValue, setDisplayValue] = useState<number | null>(value);
  const prevTargetRef = useRef<number | null>(value);

  // Smooth number transition
  useEffect(() => {
    if (value === null) {
      setDisplayValue(null);
      prevTargetRef.current = null;
      return;
    }

    if (prevTargetRef.current === null) {
      setDisplayValue(value);
      prevTargetRef.current = value;
      return;
    }

    if (prevTargetRef.current === value) return;

    const startValue = displayValue !== null ? displayValue : value;
    const endValue = value;
    const duration = 500;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    requestAnimationFrame(step);
    prevTargetRef.current = value;
  }, [value]);

  const formattedDisplayValue = displayValue === null ? '--' : formatMetricValue(displayValue, metricKey, decimals);

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
      className={`relative overflow-hidden rounded-[var(--radius-card)] p-5 sm:p-6 hover-lift animate-fade-in-up stagger-${staggerIndex + 1} min-w-0 group cursor-default`}
      style={{
        animationFillMode: 'forwards',
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 4px 24px -8px rgba(0,0,0,0.3)',
      }}
      role="group"
      aria-label={`${label} metric card`}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${accentColor}12, transparent 70%)`,
        }}
      />

      {/* Header: Label + Icon */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <span className="text-[11px] sm:text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase mt-1">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
          style={{
            backgroundColor: `${accentColor}15`,
            boxShadow: `0 0 0 rgba(0,0,0,0)`,
          }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: accentColor }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-4 relative z-10">
        <span
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)] tabular-nums leading-none"
          aria-live="polite"
        >
          {formattedDisplayValue}
        </span>
        <span className="text-sm font-semibold text-[var(--text-muted)]">
          {unit}
        </span>
      </div>

      {/* Trend */}
      <div
        className="flex items-center gap-1.5 text-xs font-semibold relative z-10"
        style={{ color: trendConfig[trend].color }}
      >
        {trendConfig[trend].icon}
        <span className="tracking-wide">{trendConfig[trend].label}</span>
      </div>
    </div>
  );
}
