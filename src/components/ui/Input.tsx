// ============================================================
// Input Component — AJK PowerMeter Dashboard
// Form input dengan label, error state, dan icon
// ============================================================

import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

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
            className="block text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 rounded-xl 
              bg-[var(--bg-input)] border text-sm
              text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
              focus:outline-none focus:ring-2 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error
                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                : 'border-[var(--border-color)] focus:border-blue-500/50 focus:ring-blue-500/20'
              }
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400 mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
