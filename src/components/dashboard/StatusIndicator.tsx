// ============================================================
// StatusIndicator Component — AJK PowerMeter Dashboard
// Online/Offline device status + PZEM sensor status
// ============================================================

'use client';

import { Wifi, WifiOff, Cpu, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo } from '@/lib/utils/formatters';

interface StatusIndicatorProps {
  isOnline: boolean;
  pzemStatus: string;
  lastSeen: Date | null;
  ip?: string;
  localTime?: string;
}

export function StatusIndicator({
  isOnline, pzemStatus, lastSeen, ip, localTime,
}: StatusIndicatorProps) {
  const isPzemOk = pzemStatus === 'OK';

  return (
    <div className="glass rounded-2xl p-4 sm:p-5 animate-fade-in">
      {/* Row 1: Status badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant={isOnline ? 'success' : 'danger'} dot pulse={isOnline} size="md">
          <span className="flex items-center gap-1.5">
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </Badge>

        <Badge
          variant={isPzemOk ? 'success' : pzemStatus === 'UNKNOWN' ? 'default' : 'danger'}
          dot size="md"
        >
          <span className="flex items-center gap-1.5">
            {isPzemOk ? <Cpu className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            Sensor: {pzemStatus}
          </span>
        </Badge>
      </div>

      {/* Row 2: Additional info — wraps cleanly */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--text-muted)]">
        {ip && (
          <span>IP: <span className="text-[var(--text-secondary)] font-mono">{ip}</span></span>
        )}
        {localTime && (
          <span className="hidden sm:inline">
            Waktu device: <span className="text-[var(--text-secondary)] font-mono">{localTime}</span>
          </span>
        )}
        {lastSeen && (
          <span>Update: <span className="text-[var(--text-secondary)]">{formatTimeAgo(lastSeen)}</span></span>
        )}
      </div>
    </div>
  );
}
