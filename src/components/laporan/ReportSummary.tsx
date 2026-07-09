// ============================================================
// ReportSummary Component — AJK PowerMeter Dashboard
// Kartu agregasi: Total Energi, Rata-rata Daya, Puncak, Biaya
// ============================================================

'use client';

import { Battery, Activity, TrendingUp, Banknote } from 'lucide-react';
import { formatNumber, formatCurrency } from '@/lib/utils/formatters';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ReportSummary as ReportSummaryType } from '@/types';

interface ReportSummaryProps {
  summary: ReportSummaryType | null;
  loading: boolean;
}

export function ReportSummary({ summary, loading }: ReportSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-4 sm:p-5 space-y-3">
            <Skeleton variant="text" width={80} />
            <Skeleton variant="text" width={120} height={28} />
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    { label: 'Total Energi', value: `${formatNumber(summary.totalEnergy, 2)} kWh`, icon: Battery, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Rata-rata Daya', value: `${formatNumber(summary.averagePower, 1)} W`, icon: Activity, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Puncak Beban', value: `${formatNumber(summary.peakLoad, 1)} W`, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Estimasi Biaya', value: formatCurrency(summary.estimatedCost), icon: Banknote, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`glass rounded-2xl p-4 sm:p-5 hover-lift opacity-0 animate-fade-in-up stagger-${index + 1}`}
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] sm:text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {card.label}
              </span>
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.bg }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-lg sm:text-2xl font-bold tabular-nums truncate" style={{ color: 'var(--text-primary)' }}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
