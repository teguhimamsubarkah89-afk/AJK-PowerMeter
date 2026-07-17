// ============================================================
// RealtimeGrid Component — AJK PowerMeter Dashboard v2.0
// Responsive grid layout for 6 metric cards
// ============================================================

'use client';

import { MetricCard } from './MetricCard';
import { MetricCardSkeleton } from '@/components/ui/Skeleton';
import { METRIC_CONFIGS } from '@/lib/constants';
import type { RealtimeData } from '@/types';

interface RealtimeGridProps {
  data: RealtimeData | null;
  previousData: RealtimeData | null;
  loading: boolean;
}

export function RealtimeGrid({ data, previousData, loading }: RealtimeGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
      {METRIC_CONFIGS.map((config, index) => (
        <MetricCard
          key={config.key}
          label={config.label}
          value={data ? data[config.key] : null}
          previousValue={previousData ? previousData[config.key] : null}
          unit={config.unit}
          iconName={config.icon}
          color={config.color}
          decimals={config.decimals}
          metricKey={config.key}
          staggerIndex={index}
        />
      ))}
    </div>
  );
}
