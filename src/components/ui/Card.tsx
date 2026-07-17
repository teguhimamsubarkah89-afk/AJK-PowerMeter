// ============================================================
// Card Component — AJK PowerMeter Dashboard v2.0
// Premium card with glass variants, border glow, hover effects
// ============================================================

import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'metric' | 'elevated';
  glow?: 'amber' | 'blue' | 'emerald' | 'violet' | 'cyan' | 'orange';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  accentTop?: string;
}

const glowColors: Record<string, string> = {
  amber: '#f59e0b',
  blue: '#3b82f6',
  emerald: '#10b981',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  orange: '#f97316',
};

export function Card({
  children,
  variant = 'default',
  glow,
  hover = false,
  padding = 'md',
  accentTop,
  className = '',
  style,
  ...props
}: CardProps) {
  const baseStyles =
    'relative overflow-hidden rounded-2xl transition-all duration-300';

  const variantStyles = {
    default: 'bg-[var(--bg-card)] border border-[var(--border-color)]',
    glass: 'glass-card',
    metric: 'glass-card gradient-border',
    elevated:
      'bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl shadow-black/20',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hoverStyles = hover
    ? 'hover-lift cursor-pointer hover:border-[var(--border-hover)]'
    : '';

  const glowColor = glow ? glowColors[glow] : undefined;

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(glowColor
      ? {
          boxShadow: `0 0 20px -6px ${glowColor}20, inset 0 1px 0 ${glowColor}08`,
          borderColor: `${glowColor}20`,
        }
      : {}),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      style={combinedStyle}
      {...props}
    >
      {/* Optional top accent line */}
      {accentTop && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentTop}, transparent)`,
          }}
        />
      )}

      {/* Glow hover overlay */}
      {glow && glowColor && (
        <div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 120%, ${glowColor}08, transparent 70%)`,
          }}
        />
      )}

      {children}
    </div>
  );
}
