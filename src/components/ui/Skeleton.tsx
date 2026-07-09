// ============================================================
// Skeleton Component — AJK PowerMeter Dashboard
// Loading skeleton dengan shimmer animation
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
  const baseStyles = 'animate-shimmer bg-[var(--bg-card-hover)] rounded';

  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? 40 : '100%'),
    height: height || (variant === 'circular' ? 40 : variant === 'card' ? 160 : undefined),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
}

/**
 * Skeleton untuk MetricCard di dashboard
 */
export function MetricCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="circular" width={36} height={36} />
      </div>
      <Skeleton variant="text" width={120} height={32} />
      <Skeleton variant="text" width={60} />
    </div>
  );
}

/**
 * Skeleton untuk tabel data
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <Skeleton variant="rectangular" height={40} />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={48} />
      ))}
    </div>
  );
}
