// ============================================================
// NotificationProvider — AJK PowerMeter Dashboard
// Client-side notification system (no backend changes)
// Auto-generates notifications from device status changes
// ============================================================

'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const MAX_NOTIFICATIONS = 20;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Seed with a welcome notification
    return [
      {
        id: 'welcome-' + Date.now(),
        title: 'Selamat Datang',
        message: 'Dashboard AJK PowerMeter siap digunakan.',
        type: 'info' as const,
        timestamp: new Date(),
        read: false,
      },
    ];
  });

  const addNotification = useCallback(
    (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: Notification = {
        ...n,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date(),
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev].slice(0, MAX_NOTIFICATIONS));
    },
    []
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead, markRead, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

// ── Hook: Auto-generate notifications from device status ──
export function useDeviceNotifications(isOnline: boolean, pzemStatus: string) {
  const { addNotification } = useNotifications();
  const prevOnline = useRef<boolean | null>(null);
  const prevPzem = useRef<string | null>(null);

  // Track online/offline transitions
  if (prevOnline.current !== null && prevOnline.current !== isOnline) {
    if (isOnline) {
      addNotification({
        title: 'Device Online',
        message: 'Perangkat berhasil terhubung dan mengirim data.',
        type: 'success',
      });
    } else {
      addNotification({
        title: 'Device Offline',
        message: 'Perangkat tidak mengirim data. Periksa koneksi.',
        type: 'error',
      });
    }
  }
  prevOnline.current = isOnline;

  // Track PZEM sensor status changes
  if (
    prevPzem.current !== null &&
    prevPzem.current !== pzemStatus &&
    pzemStatus !== 'UNKNOWN'
  ) {
    if (pzemStatus === 'OK') {
      addNotification({
        title: 'Sensor Terhubung',
        message: 'Sensor PZEM-004T berfungsi normal.',
        type: 'success',
      });
    } else {
      addNotification({
        title: 'Sensor Terputus',
        message: `Status sensor: ${pzemStatus}. Periksa kabel sensor.`,
        type: 'warning',
      });
    }
  }
  prevPzem.current = pzemStatus;
}
