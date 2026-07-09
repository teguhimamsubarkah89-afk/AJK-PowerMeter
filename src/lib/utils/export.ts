// ============================================================
// Export Utilities — AJK PowerMeter Dashboard
// Export data ke Excel (SheetJS) dan PDF (jsPDF)
// ============================================================

import type { LogEntryWithKey, ReportSummary } from '@/types';
import { formatDateTime, formatNumber, formatCurrency } from '@/lib/utils/formatters';

/**
 * Export data log ke file Excel (.xlsx)
 * Sheet 1: Data mentah
 * Sheet 2: Ringkasan
 */
export async function exportToExcel(
  logs: LogEntryWithKey[],
  summary: ReportSummary,
  filename: string = 'Laporan_AJK_PowerMeter'
): Promise<void> {
  // Dynamic import (xlsx cukup besar, hanya load saat butuh)
  const XLSX = await import('xlsx');

  // Sheet 1: Data Mentah
  const rawData = logs.map((log) => ({
    'Waktu': formatDateTime(log.timestamp),
    'Tegangan (V)': formatNumber(log.voltage, 1),
    'Arus (A)': formatNumber(log.current, 2),
    'Daya (W)': formatNumber(log.power, 1),
    'Energi (Wh)': formatNumber(log.energy, 0),
    'Frekuensi (Hz)': formatNumber(log.frequency, 1),
    'Power Factor': formatNumber(log.pf, 2),
    'Status': log.status,
  }));

  const ws1 = XLSX.utils.json_to_sheet(rawData);

  // Set column widths
  ws1['!cols'] = [
    { wch: 22 }, // Waktu
    { wch: 14 }, // Tegangan
    { wch: 12 }, // Arus
    { wch: 12 }, // Daya
    { wch: 14 }, // Energi
    { wch: 16 }, // Frekuensi
    { wch: 14 }, // PF
    { wch: 10 }, // Status
  ];

  // Sheet 2: Ringkasan
  const summaryData = [
    { 'Parameter': 'Periode Mulai', 'Nilai': formatDateTime(summary.periodStart.getTime()) },
    { 'Parameter': 'Periode Akhir', 'Nilai': formatDateTime(summary.periodEnd.getTime()) },
    { 'Parameter': 'Jumlah Data', 'Nilai': String(summary.dataPointCount) },
    { 'Parameter': '', 'Nilai': '' },
    { 'Parameter': 'Total Energi (kWh)', 'Nilai': formatNumber(summary.totalEnergy, 2) },
    { 'Parameter': 'Rata-rata Daya (W)', 'Nilai': formatNumber(summary.averagePower, 1) },
    { 'Parameter': 'Puncak Beban (W)', 'Nilai': formatNumber(summary.peakLoad, 1) },
    { 'Parameter': 'Rata-rata Tegangan (V)', 'Nilai': formatNumber(summary.averageVoltage, 1) },
    { 'Parameter': 'Rata-rata Arus (A)', 'Nilai': formatNumber(summary.averageCurrent, 2) },
    { 'Parameter': 'Rata-rata PF', 'Nilai': formatNumber(summary.averagePF, 2) },
    { 'Parameter': '', 'Nilai': '' },
    { 'Parameter': 'Estimasi Biaya (Rp)', 'Nilai': formatCurrency(summary.estimatedCost) },
  ];

  const ws2 = XLSX.utils.json_to_sheet(summaryData);
  ws2['!cols'] = [{ wch: 28 }, { wch: 24 }];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, 'Data Mentah');
  XLSX.utils.book_append_sheet(wb, ws2, 'Ringkasan');

  // Generate & download
  const dateStr = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
  XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
}

/**
 * Export data ke file PDF
 * Header: Logo + judul
 * Body: Tabel data
 * Footer: Ringkasan + tanggal cetak
 */
export async function exportToPDF(
  logs: LogEntryWithKey[],
  summary: ReportSummary,
  filename: string = 'Laporan_AJK_PowerMeter'
): Promise<void> {
  // Dynamic imports
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Header ──
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('AJK PowerMeter — Laporan Monitoring Kelistrikan', pageWidth / 2, 15, {
    align: 'center',
  });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('PT. Adi Joyo Kusumo — R&D Division', pageWidth / 2, 21, {
    align: 'center',
  });

  // Periode
  doc.setFontSize(9);
  doc.text(
    `Periode: ${formatDateTime(summary.periodStart.getTime())} — ${formatDateTime(summary.periodEnd.getTime())}`,
    pageWidth / 2,
    27,
    { align: 'center' }
  );

  // ── Ringkasan ──
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan', 14, 35);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryLines = [
    `Total Energi: ${formatNumber(summary.totalEnergy, 2)} kWh`,
    `Rata-rata Daya: ${formatNumber(summary.averagePower, 1)} W`,
    `Puncak Beban: ${formatNumber(summary.peakLoad, 1)} W`,
    `Estimasi Biaya: ${formatCurrency(summary.estimatedCost)}`,
    `Jumlah Data: ${summary.dataPointCount} titik`,
  ];

  let yPos = 40;
  for (const line of summaryLines) {
    doc.text(line, 14, yPos);
    yPos += 5;
  }

  // ── Tabel Data ──
  const tableData = logs.map((log) => [
    formatDateTime(log.timestamp),
    formatNumber(log.voltage, 1),
    formatNumber(log.current, 2),
    formatNumber(log.power, 1),
    formatNumber(log.energy, 0),
    formatNumber(log.frequency, 1),
    formatNumber(log.pf, 2),
  ]);

  autoTable(doc, {
    startY: yPos + 3,
    head: [['Waktu', 'V', 'A', 'W', 'Wh', 'Hz', 'PF']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // blue-500
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  });

  // ── Footer ──
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Dicetak: ${new Date().toLocaleString('id-ID')} | Halaman ${i} / ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  // Save
  const dateStr = new Date().toLocaleDateString('id-ID').replace(/\//g, '-');
  doc.save(`${filename}_${dateStr}.pdf`);
}
