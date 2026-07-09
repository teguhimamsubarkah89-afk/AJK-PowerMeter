// ============================================================
// Calculations — AJK PowerMeter Dashboard
// Fungsi agregasi: total energi, rata-rata, puncak, biaya
// ============================================================

import type { LogEntryWithKey, ReportSummary, AggregatedData } from '@/types';
import { DEFAULT_TARIFF_PER_KWH } from '@/lib/constants';
import { formatChartDay, formatChartMonth } from '@/lib/utils/formatters';

/**
 * Hitung total energi dari data log (dalam kWh)
 * Energi di log dalam satuan Wh
 */
export function calculateTotalEnergy(logs: LogEntryWithKey[]): number {
  if (logs.length === 0) return 0;

  // Ambil energi terakhir dikurangi energi pertama
  // Jika energi reset (lebih kecil), jumlahkan increment per interval
  let totalWh = 0;
  for (let i = 1; i < logs.length; i++) {
    const diff = logs[i].energy - logs[i - 1].energy;
    if (diff >= 0) {
      totalWh += diff;
    }
    // Jika negatif (reset), abaikan interval ini
  }

  return totalWh / 1000; // Convert ke kWh
}

/**
 * Hitung rata-rata daya (W)
 */
export function calculateAveragePower(logs: LogEntryWithKey[]): number {
  if (logs.length === 0) return 0;
  const sum = logs.reduce((acc, log) => acc + log.power, 0);
  return sum / logs.length;
}

/**
 * Hitung puncak beban (W tertinggi)
 */
export function calculatePeakLoad(logs: LogEntryWithKey[]): number {
  if (logs.length === 0) return 0;
  return Math.max(...logs.map((log) => log.power));
}

/**
 * Hitung estimasi biaya listrik
 */
export function calculateEnergyCost(kWh: number, tariff: number = DEFAULT_TARIFF_PER_KWH): number {
  return kWh * tariff;
}

/**
 * Hitung ringkasan laporan lengkap
 */
export function calculateReportSummary(
  logs: LogEntryWithKey[],
  tariff: number = DEFAULT_TARIFF_PER_KWH
): ReportSummary {
  if (logs.length === 0) {
    return {
      totalEnergy: 0,
      averagePower: 0,
      peakLoad: 0,
      averageVoltage: 0,
      averageCurrent: 0,
      averagePF: 0,
      estimatedCost: 0,
      dataPointCount: 0,
      periodStart: new Date(),
      periodEnd: new Date(),
    };
  }

  const totalEnergy = calculateTotalEnergy(logs);
  const averagePower = calculateAveragePower(logs);
  const peakLoad = calculatePeakLoad(logs);
  const averageVoltage = logs.reduce((a, l) => a + l.voltage, 0) / logs.length;
  const averageCurrent = logs.reduce((a, l) => a + l.current, 0) / logs.length;
  const averagePF = logs.reduce((a, l) => a + l.pf, 0) / logs.length;
  const estimatedCost = calculateEnergyCost(totalEnergy, tariff);

  return {
    totalEnergy,
    averagePower,
    peakLoad,
    averageVoltage,
    averageCurrent,
    averagePF,
    estimatedCost,
    dataPointCount: logs.length,
    periodStart: new Date(logs[0].timestamp),
    periodEnd: new Date(logs[logs.length - 1].timestamp),
  };
}

/**
 * Agregasi data per hari
 */
export function aggregateByDay(logs: LogEntryWithKey[]): AggregatedData[] {
  if (logs.length === 0) return [];

  const groups = new Map<string, LogEntryWithKey[]>();

  for (const log of logs) {
    const date = new Date(log.timestamp);
    const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    if (!groups.has(dayKey)) {
      groups.set(dayKey, []);
    }
    groups.get(dayKey)!.push(log);
  }

  return Array.from(groups.entries()).map(([key, dayLogs]) => {
    const date = new Date(key);
    return {
      label: formatChartDay(date),
      date,
      totalEnergy: calculateTotalEnergy(dayLogs),
      averagePower: calculateAveragePower(dayLogs),
      peakPower: calculatePeakLoad(dayLogs),
      dataPoints: dayLogs.length,
    };
  });
}

/**
 * Agregasi data per bulan
 */
export function aggregateByMonth(logs: LogEntryWithKey[]): AggregatedData[] {
  if (logs.length === 0) return [];

  const groups = new Map<string, LogEntryWithKey[]>();

  for (const log of logs) {
    const date = new Date(log.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    groups.get(monthKey)!.push(log);
  }

  return Array.from(groups.entries()).map(([key, monthLogs]) => {
    const [y, m] = key.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return {
      label: formatChartMonth(date),
      date,
      totalEnergy: calculateTotalEnergy(monthLogs),
      averagePower: calculateAveragePower(monthLogs),
      peakPower: calculatePeakLoad(monthLogs),
      dataPoints: monthLogs.length,
    };
  });
}
