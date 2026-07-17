// ============================================================
// Skeleton Component — AJK PowerMeter Dashboard v2.0
// Premium loading skeleton with wave shimmer & glass background
// ============================================================

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const baseStyles =
    'relative overflow-hidden rounded isolate';

  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? 40 : '100%'),
    height:
      height ||
      (variant === 'circular' ? 40 : variant === 'card' ? 160 : undefined),
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.04)',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    >
      {/* Wave shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.06) 60%, transparent)',
        }}
      />
    </div>
  );
}

/**
 * Skeleton untuk MetricCard v2.0 — matching glass-card layout
 */
export function MetricCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-card)] p-5 sm:p-6 min-w-0"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 4px 24px -8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top accent line shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-30">
        <Skeleton variant="text" height={2} />
      </div>

      {/* Header: label + icon */}
      <div className="flex items-start justify-between mb-4">
        <Skeleton variant="text" width={80} height={14} />
        <Skeleton variant="rectangular" width={36} height={36} className="rounded-xl" />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5 mb-4">
        <Skeleton variant="text" width={120} height={36} />
        <Skeleton variant="text" width={24} height={14} />
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5">
        <Skeleton variant="text" width={14} height={14} className="rounded" />
        <Skeleton variant="text" width={48} height={14} />
      </div>
    </div>
  );
}

/**
 * Skeleton untuk tabel data — matching premium table style
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: '1px solid var(--glass-border)',
        background: 'var(--bg-card)',
      }}
    >
      {/* Table header skeleton */}
      <div
        className="flex gap-4 px-4 py-3"
        style={{
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <Skeleton variant="text" width={60} height={12} />
        <Skeleton variant="text" width={80} height={12} />
        <Skeleton variant="text" width={60} height={12} />
        <Skeleton variant="text" width={60} height={12} />
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 px-4 py-3.5 items-center"
          style={{
            borderBottom:
              i < rows - 1 ? '1px solid var(--glass-border)' : undefined,
            background:
              i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
            animationDelay: `${i * 80}ms`,
          }}
        >
          <Skeleton variant="text" width={70} height={14} />
          <Skeleton variant="text" width={90} height={14} />
          <Skeleton variant="text" width={60} height={14} />
          <Skeleton variant="text" width={50} height={14} />
        </div>
      ))}
    </div>
  );
}
