// ============================================================
// Card Component — AJK PowerMeter Dashboard
// Reusable card container dengan variants
// ============================================================

import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'metric';
  glow?: 'amber' | 'blue' | 'emerald' | 'violet' | 'cyan' | 'orange';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  glow,
  hover = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variantStyles = {
    default: 'bg-[var(--bg-card)] border border-[var(--border-color)]',
    glass: 'glass',
    metric: 'glass gradient-border',
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover ? 'hover-lift cursor-pointer hover:border-[var(--border-hover)]' : '';
  const glowStyles = glow ? `glow-${glow}` : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
