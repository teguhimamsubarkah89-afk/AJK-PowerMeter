// ============================================================
// Firebase Database Helpers — AJK PowerMeter Dashboard
// Subscribe realtime, fetch logs, update config
// ============================================================

import {
  ref,
  onValue,
  query,
  orderByChild,
  startAt,
  endAt,
  limitToLast,
  get,
  set,
  type Unsubscribe,
} from 'firebase/database';
import { database } from './config';
import {
  getRealtimePath,
  getLogsPath,
  getSettingsPath,
  getDashboardConfigPath,
} from '@/lib/constants';
import type { RealtimeData, LogEntry, LogEntryWithKey, DeviceSettings, DeviceInfo } from '@/types';

/**
 * Subscribe ke data real-time device
 * Listener akan dipanggil setiap kali data di /realtime berubah (~setiap 2 detik)
 * @returns Unsubscribe function
 */
export function subscribeRealtime(
  deviceId: string,
  callback: (data: RealtimeData | null) => void
): Unsubscribe {
  const dbRef = ref(database, getRealtimePath(deviceId));
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as RealtimeData);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('[Database] Error subscribing to realtime data:', error);
      callback(null);
    }
  );
}

/**
 * Fetch logs dari Firebase RTDB dengan filter waktu
 * @param deviceId Device ID
 * @param startTime Start timestamp (epoch ms)
 * @param endTime End timestamp (epoch ms)
 * @returns Array of LogEntryWithKey
 */
export async function fetchLogs(
  deviceId: string,
  startTime: number,
  endTime: number
): Promise<LogEntryWithKey[]> {
  const dbRef = ref(database, getLogsPath(deviceId));
  const logsQuery = query(
    dbRef,
    orderByChild('timestamp'),
    startAt(startTime),
    endAt(endTime)
  );

  try {
    const snapshot = await get(logsQuery);
    if (!snapshot.exists()) return [];

    const logs: LogEntryWithKey[] = [];
    snapshot.forEach((child) => {
      logs.push({
        key: child.key!,
        ...(child.val() as LogEntry),
      });
    });

    // Sort by timestamp ascending
    return logs.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('[Database] Error fetching logs:', error);
    return [];
  }
}

/**
 * Fetch N log terakhir (untuk mini trend chart)
 */
export async function fetchRecentLogs(
  deviceId: string,
  limit: number
): Promise<LogEntryWithKey[]> {
  const dbRef = ref(database, getLogsPath(deviceId));
  const logsQuery = query(dbRef, orderByChild('timestamp'), limitToLast(limit));

  try {
    const snapshot = await get(logsQuery);
    if (!snapshot.exists()) return [];

    const logs: LogEntryWithKey[] = [];
    snapshot.forEach((child) => {
      logs.push({
        key: child.key!,
        ...(child.val() as LogEntry),
      });
    });

    return logs.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error('[Database] Error fetching recent logs:', error);
    return [];
  }
}

/**
 * Fetch device settings (firmware info)
 */
export async function fetchDeviceSettings(
  deviceId: string
): Promise<DeviceSettings | null> {
  const dbRef = ref(database, getSettingsPath(deviceId));

  try {
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) return null;
    return snapshot.val() as DeviceSettings;
  } catch (error) {
    console.error('[Database] Error fetching device settings:', error);
    return null;
  }
}

/**
 * Fetch dashboard config (nama, lokasi — field yang diset dari dashboard)
 */
export async function fetchDashboardConfig(
  deviceId: string
): Promise<DeviceInfo | null> {
  const dbRef = ref(database, getDashboardConfigPath(deviceId));

  try {
    const snapshot = await get(dbRef);
    if (!snapshot.exists()) return null;
    return snapshot.val() as DeviceInfo;
  } catch (error) {
    console.error('[Database] Error fetching dashboard config:', error);
    return null;
  }
}

/**
 * Update dashboard config (nama, lokasi)
 */
export async function updateDashboardConfig(
  deviceId: string,
  data: Partial<DeviceInfo>
): Promise<void> {
  const dbRef = ref(database, getDashboardConfigPath(deviceId));
  await set(dbRef, data);
}

/**
 * Subscribe ke device settings (untuk mendeteksi update firmware)
 */
export function subscribeDeviceSettings(
  deviceId: string,
  callback: (settings: DeviceSettings | null) => void
): Unsubscribe {
  const dbRef = ref(database, getSettingsPath(deviceId));
  return onValue(
    dbRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as DeviceSettings);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('[Database] Error subscribing to settings:', error);
      callback(null);
    }
  );
}
