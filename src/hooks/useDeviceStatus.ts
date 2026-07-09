// ============================================================
// useDeviceStatus Hook — AJK PowerMeter Dashboard
// Deteksi online/offline berdasarkan timestamp terakhir
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { OFFLINE_THRESHOLD_MS } from '@/lib/constants';
import type { DeviceConnectionStatus, RealtimeData } from '@/types';

interface UseDeviceStatusReturn extends DeviceConnectionStatus {
  updateStatus: (data: RealtimeData | null, lastUpdated: Date | null) => void;
}

export function useDeviceStatus(): UseDeviceStatusReturn {
  const [status, setStatus] = useState<DeviceConnectionStatus>({
    isOnline: false,
    pzemStatus: 'UNKNOWN',
    lastSeen: null,
  });

  const updateStatus = useCallback(
    (data: RealtimeData | null, lastUpdated: Date | null) => {
      if (!data || !lastUpdated) {
        setStatus({ isOnline: false, pzemStatus: 'UNKNOWN', lastSeen: null });
        return;
      }

      const now = Date.now();
      const timeSinceUpdate = now - lastUpdated.getTime();
      const isOnline = timeSinceUpdate < OFFLINE_THRESHOLD_MS;

      setStatus({
        isOnline,
        pzemStatus: data.status || 'UNKNOWN',
        lastSeen: lastUpdated,
      });
    },
    []
  );

  // Periodic check: re-evaluate online status every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStatus((prev) => {
        if (!prev.lastSeen) return prev;
        const timeSinceUpdate = Date.now() - prev.lastSeen.getTime();
        const isOnline = timeSinceUpdate < OFFLINE_THRESHOLD_MS;
        if (isOnline !== prev.isOnline) {
          return { ...prev, isOnline };
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { ...status, updateStatus };
}
