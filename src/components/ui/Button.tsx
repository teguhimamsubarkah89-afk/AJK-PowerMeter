// ============================================================
// Button Component — AJK PowerMeter Dashboard v2.0
// Premium button with ripple effect, gradient variants, glow
// ============================================================

'use client';

import { type ReactNode, type ButtonHTMLAttributes, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient' | 'outline-glow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  // ── Ripple Effect ──────────────────────────────────────────
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;

      const btn = btnRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');

        ripple.className = 'btn-ripple';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        btn.appendChild(ripple);

        ripple.addEventListener('animationend', () => ripple.remove());
      }

      onClick?.(e);
    },
    [disabled, loading, onClick],
  );

  // ── Styles ──────────────────────────────────────────────
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl ' +
    'transition-all duration-200 overflow-hidden select-none ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] ' +
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
    'active:scale-[0.97]';

  const variantStyles: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-blue-600 to-blue-500 text-white ' +
      'hover:from-blue-500 hover:to-blue-400 focus-visible:ring-blue-500/40 ' +
      'shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:shadow-xl',
    secondary:
      'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] ' +
      'hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] ' +
      'focus-visible:ring-[var(--border-hover)]',
    ghost:
      'bg-transparent text-[var(--text-secondary)] ' +
      'hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] ' +
      'focus-visible:ring-[var(--border-color)]',
    danger:
      'bg-gradient-to-r from-red-600 to-red-500 text-white ' +
      'hover:from-red-500 hover:to-red-400 focus-visible:ring-red-500/40 ' +
      'shadow-lg shadow-red-600/25 hover:shadow-red-500/40 hover:shadow-xl',
    gradient:
      'bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-500 text-white ' +
      'hover:from-blue-500 hover:via-violet-500 hover:to-fuchsia-400 ' +
      'focus-visible:ring-violet-500/40 shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40',
    'outline-glow':
      'bg-transparent border border-blue-500/40 text-blue-400 ' +
      'hover:bg-blue-500/10 hover:border-blue-400/60 hover:text-blue-300 ' +
      'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] ' +
      'focus-visible:ring-blue-500/30',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'text-xs px-3 py-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2.5 min-h-[40px]',
    lg: 'text-base px-6 py-3 min-h-[48px]',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={btnRef}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">{icon}</span>
      ) : null}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
