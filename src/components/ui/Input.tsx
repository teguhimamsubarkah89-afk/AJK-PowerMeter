// ============================================================
// Input Component — AJK PowerMeter Dashboard v2.0
// Premium input with focus glow, responsive sizing, error state
// ============================================================

import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helperText, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-semibold text-[var(--text-secondary)] tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors group-focus-within:text-blue-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl 
              bg-[var(--bg-input)] border text-sm
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[44px]
              ${error
                ? 'border-red-500/50 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12),0_0_16px_rgba(239,68,68,0.08)]'
                : 'border-[var(--border-color)] focus:border-blue-500/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12),0_0_16px_rgba(59,130,246,0.08)]'
              }
              hover:border-[var(--border-hover)]
              ${className}`}
            {...props}
          />

          {/* Focus glow overlay */}
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: error
                ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.04), transparent 70%)'
                : 'radial-gradient(ellipse at center, rgba(59,130,246,0.04), transparent 70%)',
            }}
          />
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-xs text-red-400 mt-1 font-medium">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
