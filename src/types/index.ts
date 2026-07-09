// ============================================================
// TypeScript Interfaces — AJK PowerMeter Dashboard
// Berdasarkan skema Firebase RTDB dari firmware ESP32
// ============================================================

/**
 * Data real-time dari node `/powermonitor/devices/{deviceId}/realtime`
 * Di-overwrite setiap 2 detik oleh firmware (FIREBASE_REALTIME_INTERVAL_MS)
 */
export interface RealtimeData {
  voltage: number;      // Tegangan (V)
  current: number;      // Arus (A)
  power: number;        // Daya (W)
  energy: number;       // Energi (Wh)
  frequency: number;    // Frekuensi (Hz)
  pf: number;           // Power Factor (0-1)
  status: string;       // Status sensor PZEM: "OK" | "ERROR"
  ip: string;           // IP address device
  local_time: string;   // Waktu lokal device
}

/**
 * Entry log historis dari node `/powermonitor/devices/{deviceId}/logs`
 * Di-append setiap 60 detik oleh firmware (FIREBASE_LOG_INTERVAL_MS)
 * Key auto-generate oleh Firebase pushJSON
 */
export interface LogEntry {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  pf: number;
  status: string;
  ip: string;
  local_time: string;
  timestamp: number;    // Epoch milliseconds
}

/**
 * LogEntry dengan Firebase key (setelah di-fetch)
 */
export interface LogEntryWithKey extends LogEntry {
  key: string;          // Firebase auto-generated push key
}

/**
 * Settings device dari node `/powermonitor/devices/{deviceId}/settings`
 * Di-merge/update setiap 5 menit oleh firmware (FIREBASE_SETTINGS_INTERVAL_MS)
 * Satu arah: device → cloud (firmware tidak membaca balik)
 */
export interface DeviceSettings {
  device_id: string;    // MAC address hex 12 karakter
  firmware: string;     // Versi firmware
  ip: string;           // IP address
  mac: string;          // MAC address
}

/**
 * Info tambahan device yang disimpan oleh dashboard
 * Disimpan di node `/powermonitor/devices/{deviceId}/dashboard_config`
 */
export interface DeviceInfo {
  name: string;         // Nama alat (custom, set dari dashboard)
  location: string;     // Lokasi alat (custom, set dari dashboard)
}

/**
 * User dashboard (Firebase Auth)
 * Akun terpisah dari akun device di firmware
 */
export interface DashboardUser {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
}

/**
 * Role user dashboard
 */
export type UserRole = 'admin' | 'operator';

/**
 * Status koneksi device (dihitung di dashboard)
 */
export interface DeviceConnectionStatus {
  isOnline: boolean;        // Berdasarkan timestamp terakhir vs waktu sekarang
  pzemStatus: string;       // Status sensor PZEM dari field `status`
  lastSeen: Date | null;    // Waktu terakhir data diterima
}

/**
 * Filter periode untuk halaman Riwayat & Laporan
 */
export type PeriodFilter = 'hari' | 'minggu' | 'bulan' | 'tahun' | 'semua' | 'custom';

/**
 * Date range untuk filter custom
 */
export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Ringkasan laporan (hasil agregasi)
 */
export interface ReportSummary {
  totalEnergy: number;      // Total kWh
  averagePower: number;     // Rata-rata daya (W)
  peakLoad: number;         // Puncak beban (W tertinggi)
  averageVoltage: number;   // Rata-rata tegangan (V)
  averageCurrent: number;   // Rata-rata arus (A)
  averagePF: number;        // Rata-rata power factor
  estimatedCost: number;    // Estimasi biaya (Rp)
  dataPointCount: number;   // Jumlah titik data
  periodStart: Date;
  periodEnd: Date;
}

/**
 * Data agregasi harian/bulanan untuk grafik laporan
 */
export interface AggregatedData {
  label: string;            // Label periode (e.g., "Sen 07/07", "Juli 2026")
  date: Date;
  totalEnergy: number;      // kWh
  averagePower: number;     // W
  peakPower: number;        // W
  dataPoints: number;
}

/**
 * Metric type untuk chart selector
 */
export type MetricType = 'voltage' | 'current' | 'power' | 'energy' | 'frequency' | 'pf';

/**
 * Konfigurasi metric card
 */
export interface MetricConfig {
  key: MetricType;
  label: string;
  unit: string;
  icon: string;           // Lucide icon name
  color: string;          // CSS color class/variable
  decimals: number;       // Jumlah desimal untuk display
}
