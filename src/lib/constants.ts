// ============================================================
// Constants — AJK PowerMeter Dashboard
// Path Firebase RTDB, konfigurasi, dan konstanta global
// ============================================================

import type { MetricConfig } from '@/types';

// ── Firebase RTDB Paths ──────────────────────────────────────
/**
 * Base path di Firebase RTDB
 * Struktur: /powermonitor/devices/{deviceId}/...
 */
export const FIREBASE_BASE_PATH = 'powermonitor/devices';

/**
 * Membuat path lengkap ke node Firebase
 */
export const getDevicePath = (deviceId: string) => 
  `${FIREBASE_BASE_PATH}/${deviceId}`;

export const getRealtimePath = (deviceId: string) => 
  `${getDevicePath(deviceId)}/realtime`;

export const getLogsPath = (deviceId: string) => 
  `${getDevicePath(deviceId)}/logs`;

export const getSettingsPath = (deviceId: string) => 
  `${getDevicePath(deviceId)}/settings`;

export const getDashboardConfigPath = (deviceId: string) => 
  `${getDevicePath(deviceId)}/dashboard_config`;

// ── Default Device ───────────────────────────────────────────
/**
 * Default device ID (MAC address hex 12 karakter)
 * Ubah sesuai device fisik yang digunakan
 */
export const DEFAULT_DEVICE_ID = process.env.NEXT_PUBLIC_DEFAULT_DEVICE_ID || 'XXXXXXXXXXXX';

// ── Interval & Threshold ─────────────────────────────────────
/**
 * Threshold untuk deteksi device offline (dalam milidetik)
 * Jika tidak ada update selama ini, device dianggap offline
 * Firmware push realtime setiap 2 detik, jadi 10 detik = 5x miss
 */
export const OFFLINE_THRESHOLD_MS = 10_000; // 10 detik

/**
 * Interval firmware (referensi, tidak diubah dari dashboard)
 */
export const FIRMWARE_INTERVALS = {
  REALTIME_MS: 2_000,   // 2 detik
  LOG_MS: 60_000,        // 60 detik (1 menit)
  SETTINGS_MS: 300_000,  // 5 menit
} as const;

// ── Tarif PLN ────────────────────────────────────────────────
/**
 * Tarif listrik PLN per kWh (dalam Rupiah)
 * Default: golongan R-1/TR 2200 VA (tarif 2024)
 * Bisa diubah dari halaman Pengaturan
 */
export const DEFAULT_TARIFF_PER_KWH = 1_444.70; // Rp/kWh

// ── Metric Configurations ────────────────────────────────────
export const METRIC_CONFIGS: MetricConfig[] = [
  {
    key: 'voltage',
    label: 'Tegangan',
    unit: 'V',
    icon: 'Zap',
    color: 'amber',
    decimals: 1,
  },
  {
    key: 'current',
    label: 'Arus',
    unit: 'A',
    icon: 'Plug',
    color: 'blue',
    decimals: 2,
  },
  {
    key: 'power',
    label: 'Daya',
    unit: 'W',
    icon: 'Lightbulb',
    color: 'emerald',
    decimals: 1,
  },
  {
    key: 'energy',
    label: 'Energi',
    unit: 'Wh',
    icon: 'Battery',
    color: 'violet',
    decimals: 0,
  },
  {
    key: 'frequency',
    label: 'Frekuensi',
    unit: 'Hz',
    icon: 'Activity',
    color: 'cyan',
    decimals: 1,
  },
  {
    key: 'pf',
    label: 'Power Factor',
    unit: '',
    icon: 'Gauge',
    color: 'orange',
    decimals: 2,
  },
];

// ── UI Constants ─────────────────────────────────────────────
export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 80;
export const TOPBAR_HEIGHT = 64;

// ── Pagination ───────────────────────────────────────────────
export const LOG_PAGE_SIZE = 50; // Jumlah log per halaman

// ── Chart ────────────────────────────────────────────────────
export const MINI_TREND_DATA_POINTS = 30; // 30 titik data = 30 menit terakhir
export const CHART_COLORS = {
  voltage: '#f59e0b',   // amber-500
  current: '#3b82f6',   // blue-500
  power: '#10b981',     // emerald-500
  energy: '#8b5cf6',    // violet-500
  frequency: '#06b6d4', // cyan-500
  pf: '#f97316',        // orange-500
} as const;
