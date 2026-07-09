// ============================================================
// Formatters — AJK PowerMeter Dashboard
// Utility functions untuk format angka, tanggal, dan satuan
// ============================================================

/**
 * Format angka dengan jumlah desimal tertentu
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) return '--';
  return value.toFixed(decimals);
}

/**
 * Format angka dengan separator ribuan (format Indonesia)
 * Contoh: 1234567.89 → "1.234.567,89"
 */
export function formatNumberID(value: number, decimals: number = 0): string {
  if (value === null || value === undefined || isNaN(value)) return '--';
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format mata uang Rupiah
 * Contoh: 1500000 → "Rp 1.500.000"
 */
export function formatCurrency(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return 'Rp --';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format energi ke kWh
 * Input dalam Wh, output string kWh
 */
export function formatEnergy(wh: number): string {
  if (wh === null || wh === undefined || isNaN(wh)) return '--';
  const kwh = wh / 1000;
  if (kwh < 1) return `${formatNumber(wh, 0)} Wh`;
  return `${formatNumber(kwh, 2)} kWh`;
}

/**
 * Format timestamp (epoch ms) ke string tanggal Indonesia
 * Contoh: "08/07/2026 22:15:30"
 */
export function formatDateTime(timestamp: number): string {
  if (!timestamp) return '--';
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format timestamp ke tanggal saja
 * Contoh: "08/07/2026"
 */
export function formatDate(timestamp: number | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format timestamp ke waktu saja
 * Contoh: "22:15:30"
 */
export function formatTime(timestamp: number | Date): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/**
 * Format timestamp ke label chart pendek
 * Contoh: "22:15"
 */
export function formatChartTime(timestamp: number): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Format label hari untuk chart
 * Contoh: "Sen 07/07"
 */
export function formatChartDay(date: Date): string {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const day = days[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  return `${day} ${dd}/${mm}`;
}

/**
 * Format label bulan untuk chart
 * Contoh: "Juli 2026"
 */
export function formatChartMonth(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format "waktu lalu" relatif
 * Contoh: "3 detik lalu", "2 menit lalu"
 */
export function formatTimeAgo(timestamp: number | Date): string {
  const now = Date.now();
  const time = timestamp instanceof Date ? timestamp.getTime() : timestamp;
  const diff = now - time;

  if (diff < 0) return 'baru saja';
  
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'baru saja';
  if (seconds < 60) return `${seconds} detik lalu`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  
  const years = Math.floor(months / 12);
  return `${years} tahun lalu`;
}

/**
 * Format metric value berdasarkan tipe
 */
export function formatMetricValue(
  value: number, 
  metricKey: string, 
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) return '--';
  
  switch (metricKey) {
    case 'energy':
      return formatNumber(value, 0);
    case 'pf':
      return formatNumber(value, 2);
    default:
      return formatNumber(value, decimals);
  }
}
