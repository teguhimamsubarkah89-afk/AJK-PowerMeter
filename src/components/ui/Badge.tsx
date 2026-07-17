// ============================================================
// Badge Component — AJK PowerMeter Dashboard v2.0
// Status badge with glow effects and pulse animation
// ============================================================

import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  pulse?: boolean;
  size?: 'sm' | 'md';
  dot?: boolean;
  glow?: boolean;
  className?: string;
}

const variantConfig = {
  success: {
    bg: 'rgba(16,185,129,0.12)',
    text: '#34d399',
    border: 'rgba(16,185,129,0.18)',
    dot: '#34d399',
    shadow: 'rgba(16,185,129,0.15)',
  },
  danger: {
    bg: 'rgba(239,68,68,0.12)',
    text: '#f87171',
    border: 'rgba(239,68,68,0.18)',
    dot: '#f87171',
    shadow: 'rgba(239,68,68,0.15)',
  },
  warning: {
    bg: 'rgba(245,158,11,0.12)',
    text: '#fbbf24',
    border: 'rgba(245,158,11,0.18)',
    dot: '#fbbf24',
    shadow: 'rgba(245,158,11,0.15)',
  },
  info: {
    bg: 'rgba(59,130,246,0.12)',
    text: '#60a5fa',
    border: 'rgba(59,130,246,0.18)',
    dot: '#60a5fa',
    shadow: 'rgba(59,130,246,0.15)',
  },
  default: {
    bg: 'rgba(255,255,255,0.04)',
    text: 'var(--text-secondary)',
    border: 'var(--border-color)',
    dot: 'var(--text-muted)',
    shadow: 'transparent',
  },
};

export function Badge({
  children,
  variant = 'default',
  pulse = false,
  size = 'sm',
  dot = false,
  glow = false,
  className = '',
}: BadgeProps) {
  const config = variantConfig[variant];

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide transition-all duration-300 ${sizeStyles[size]} ${className}`}
      style={{
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        boxShadow: glow ? `0 0 12px ${config.shadow}` : undefined,
      }}
    >
      {dot && (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {pulse && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
              style={{ backgroundColor: config.dot }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: config.dot }}
          />
        </span>
      )}
      {children}
    </span>
  );
}
