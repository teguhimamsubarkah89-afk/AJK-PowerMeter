// ============================================================
// Modal Component — AJK PowerMeter Dashboard v2.0
// Premium modal: glass backdrop, scale-in animation, mobile fullscreen
// ============================================================

'use client';

import { type ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Glass Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px) saturate(120%)',
          WebkitBackdropFilter: 'blur(8px) saturate(120%)',
        }}
        onClick={onClose}
      />

      {/* Modal Content — Scale-in + Mobile fullscreen bottom sheet */}
      <div
        className={`
          relative z-10 w-full ${sizeStyles[size]}
          rounded-t-2xl sm:rounded-2xl
          animate-modal-enter
        `}
        style={{
          background: 'rgba(15, 20, 35, 0.95)',
          backdropFilter: 'blur(24px) saturate(130%)',
          WebkitBackdropFilter: 'blur(24px) saturate(130%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow:
            '0 32px 64px -16px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Top handle for mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/10" />
        </div>

        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-6 pb-2">
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                {title}
              </h3>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/[0.06] transition-all duration-200 active:scale-90 ml-auto"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
