// ============================================================
// Badge Component — AJK PowerMeter Dashboard
// Status badge (online/offline/error) dengan pulse animation
// ============================================================

import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  pulse?: boolean;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  pulse = false,
  size = 'sm',
  dot = false,
  className = '',
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    danger: 'bg-red-500/15 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    default: 'bg-[var(--bg-card-hover)] text-[var(--text-secondary)] border-[var(--border-color)]',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    danger: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    default: 'bg-[var(--text-muted)]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${dotColors[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
