// ============================================================
// useRealtimeData Hook — AJK PowerMeter Dashboard
// Subscribe ke /realtime node Firebase RTDB
// ============================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { subscribeRealtime } from '@/lib/firebase/database';
import { useAppStore } from '@/stores/useAppStore';
import type { RealtimeData } from '@/types';

interface UseRealtimeDataReturn {
  data: RealtimeData | null;
  previousData: RealtimeData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useRealtimeData(): UseRealtimeDataReturn {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [previousData, setPreviousData] = useState<RealtimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const activeDeviceId = useAppStore((s) => s.activeDeviceId);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // reset first-load flag when device changes
    isFirstLoad.current = true;

    const unsubscribe = subscribeRealtime(activeDeviceId, (realtimeData) => {
      if (realtimeData) {
        setData((prev) => {
          if (prev) setPreviousData(prev);
          return realtimeData;
        });
        setLastUpdated(new Date());
        setError(null);
      } else {
        if (!isFirstLoad.current) {
          setError('Tidak dapat membaca data dari Firebase.');
        }
      }
      setLoading(false);
      isFirstLoad.current = false;
    });

    return () => unsubscribe();
  }, [activeDeviceId]);

  return { data, previousData, loading, error, lastUpdated };
}
