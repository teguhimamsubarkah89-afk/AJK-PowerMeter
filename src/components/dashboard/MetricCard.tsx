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
      className={`glass-thick gradient-border p-6 hover-lift animate-fade-in-up stagger-${staggerIndex + 1} min-w-0 relative overflow-hidden group`}
      style={{
        animationFillMode: 'forwards',
      }}
      role="group"
      aria-label={`${label} metric card`}
    >
      {/* Background Glow */}
      <div 
        className="absolute -inset-1 opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <span className="text-xs font-bold text-[var(--text-muted)] tracking-widest uppercase">
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
      <div className="flex items-baseline gap-2 mb-3 relative z-10">
        <span
          className={`text-4xl lg:text-5xl font-black tracking-tighter text-white tabular-nums drop-shadow-md ${isAnimating ? 'animate-count-up' : ''}`}
          aria-live="polite"
        >
          {displayValue}
        </span>
        <span className="text-sm lg:text-base font-bold text-[var(--text-secondary)]">
          {unit}
        </span>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-2 text-xs font-bold relative z-10" style={{ color: trendConfig[trend].color }}>
        <div className="p-1 rounded-full bg-white/5">
          {trendConfig[trend].icon}
        </div>
        <span className="tracking-wide">{trendConfig[trend].label}</span>
      </div>

      {/* Accent line bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
    </div>
  );
}
