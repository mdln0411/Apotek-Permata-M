import {
  fetchReportForPdfExport,
  type ReportData,
  type ReportFilters,
} from '@/api/reportService';
import { formatTransactionDateTime } from '@/utils/dateTime';
import { getOrderStatusLabel } from '@/utils/orderStatus';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

const A4_WIDTH_PT = 595;
const A4_HEIGHT_PT = 842;

function formatRupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

function escapeHtml(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function periodLabel(period: string): string {
  const map: Record<string, string> = {
    today: 'Hari Ini',
    week: 'Minggu Ini',
    month: 'Bulan Ini',
    year: 'Tahun Ini',
    custom: 'Periode Kustom',
  };
  return map[period] ?? period;
}

function buildSummaryRows(data: ReportData): string {
  return data.summary
    .map(
      (c) => `
    <tr>
      <td>${escapeHtml(c.label)}</td>
      <td class="num">${escapeHtml(c.value_formatted)}</td>
      <td class="center trend-${c.trend}">${escapeHtml(c.change_display)}</td>
    </tr>`,
    )
    .join('');
}

function buildBestSellerRows(data: ReportData): string {
  const chart = data.charts.best_sellers_bar;
  if (!chart.data.length) {
    return '<tr><td colspan="3" class="empty">Belum ada data</td></tr>';
  }
  const names = chart.full_names ?? chart.labels;
  return names
    .map(
      (name, i) =>
        `<tr>
          <td class="center">${i + 1}</td>
          <td>${escapeHtml(name)}</td>
          <td class="num">${chart.data[i]} unit</td>
        </tr>`,
    )
    .join('');
}

function buildOrderStatsRows(data: ReportData): string {
  if (!data.order_stats.length) {
    return '<tr><td colspan="2" class="empty">Belum ada data</td></tr>';
  }
  return data.order_stats
    .map(
      (s) =>
        `<tr><td>${escapeHtml(getOrderStatusLabel(s.status))}</td><td class="num">${s.count}</td></tr>`,
    )
    .join('');
}

function buildPaymentRows(data: ReportData): string {
  if (!data.payment_stats.by_method.length) {
    return '<tr><td colspan="3" class="empty">Belum ada data</td></tr>';
  }
  return data.payment_stats.by_method
    .map(
      (p) =>
        `<tr>
          <td>${escapeHtml(p.label ?? p.method)}</td>
          <td class="num">${p.count}</td>
          <td class="num">${formatRupiah(p.revenue)}</td>
        </tr>`,
    )
    .join('');
}

function buildPharmacistRows(data: ReportData): string {
  if (!data.pharmacist_activity.length) {
    return '<tr><td colspan="4" class="empty">Belum ada data</td></tr>';
  }
  return data.pharmacist_activity
    .map(
      (a) =>
        `<tr>
          <td>${escapeHtml(a.name)}</td>
          <td class="center">${a.is_active ? '<span class="badge">Aktif</span>' : 'Nonaktif'}</td>
          <td class="num">${a.orders_processed}</td>
          <td class="num">${a.payments_verified}</td>
        </tr>`,
    )
    .join('');
}

function buildMonthlyRevenueRows(data: ReportData): string {
  const chart = data.charts.monthly_revenue;
  if (!chart.data.length) {
    return '<tr><td colspan="2" class="empty">Belum ada data</td></tr>';
  }
  return chart.labels
    .map(
      (label, i) =>
        `<tr><td>${escapeHtml(label)}</td><td class="num">${formatRupiah(chart.data[i])}</td></tr>`,
    )
    .join('');
}

function buildWeeklyTransactionRows(data: ReportData): string {
  const chart = data.charts.weekly_transactions_area;
  if (!chart.data.length) {
    return '<tr><td colspan="2" class="empty">Belum ada data</td></tr>';
  }
  return chart.labels
    .map(
      (label, i) =>
        `<tr><td>${escapeHtml(label)}</td><td class="num">${chart.data[i]} transaksi</td></tr>`,
    )
    .join('');
}

function buildTransactionRows(data: ReportData): string {
  const rows = data.transactions.data;
  if (!rows.length) {
    return '<tr><td colspan="6" class="empty">Belum ada transaksi</td></tr>';
  }
  return rows
    .map(
      (t) => `
    <tr>
      <td class="mono">${escapeHtml(t.order_number)}</td>
      <td>
        <strong>${escapeHtml(t.patient_name)}</strong><br/>
        <span class="muted">${escapeHtml(t.apoteker_name)}</span>
      </td>
      <td>${escapeHtml(formatTransactionDateTime(t.transaction_at, t.transaction_at_formatted))}</td>
      <td>${escapeHtml(t.payment_method)}</td>
      <td class="num">${escapeHtml(t.total_formatted)}</td>
      <td class="center status">${escapeHtml(getOrderStatusLabel(t.order_status))}</td>
    </tr>`,
    )
    .join('');
}

const PRINT_STYLES = `
  @page { size: A4; margin: 18mm 14mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10pt;
    color: #1a2e1a;
    line-height: 1.45;
    background: #fff;
  }
  .doc { width: 100%; max-width: ${A4_WIDTH_PT}pt; margin: 0 auto; padding: 0 4pt; }
  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; border-bottom: 3pt solid #2e8b57; padding-bottom: 14pt; }
  .header-table td { vertical-align: middle; padding: 0; border: none; }
  .brand-mark {
    width: 48pt; height: 48pt; background: #e8f5e9; border-radius: 10pt;
    text-align: center; font-size: 22pt; font-weight: bold; color: #2e8b57; line-height: 48pt;
  }
  h1 { margin: 0 0 4pt; font-size: 18pt; color: #1a2e1a; font-weight: 700; }
  .meta { font-size: 9pt; color: #5a6a5a; }
  .meta strong { color: #333; }
  h2 {
    font-size: 11pt; color: #2e8b57; font-weight: 700;
    margin: 20pt 0 8pt; padding: 6pt 0 6pt 10pt;
    border-left: 4pt solid #2e8b57; background: #f4f8f4;
    page-break-after: avoid;
  }
  h3 { font-size: 10pt; color: #444; margin: 12pt 0 6pt; font-weight: 700; page-break-after: avoid; }
  .section { margin-bottom: 14pt; page-break-inside: avoid; }
  .section-wide { page-break-inside: auto; }
  table.data {
    width: 100%; border-collapse: collapse; font-size: 9pt; margin-bottom: 6pt;
    table-layout: fixed;
  }
  table.data th {
    background: #2e8b57; color: #fff; font-weight: 700;
    padding: 7pt 6pt; text-align: left; border: 1pt solid #267349;
    word-wrap: break-word;
  }
  table.data td {
    padding: 6pt; border: 1pt solid #e0e8e0; vertical-align: top;
    word-wrap: break-word; overflow-wrap: break-word;
  }
  table.data tr:nth-child(even) td { background: #fafcfa; }
  table.data .empty { text-align: center; color: #888; font-style: italic; }
  table.data .num { text-align: right; font-weight: 600; white-space: nowrap; }
  table.data .center { text-align: center; }
  table.data .mono { font-family: Courier, monospace; font-size: 8pt; }
  table.data .muted { font-size: 8pt; color: #666; }
  table.data .status { font-size: 8pt; font-weight: 600; }
  .trend-up { color: #2e8b57; font-weight: 600; }
  .trend-down { color: #c62828; font-weight: 600; }
  .badge {
    display: inline-block; background: #e8f5e9; color: #2e8b57;
    padding: 2pt 6pt; border-radius: 8pt; font-size: 8pt; font-weight: 700;
  }
  .kpi-row { width: 100%; border-collapse: separate; border-spacing: 8pt 0; margin-bottom: 12pt; }
  .kpi-row td {
    width: 33.33%; background: #f4f8f4; border: 1pt solid #d8e8d8;
    border-radius: 8pt; padding: 10pt; text-align: center; vertical-align: top;
  }
  .kpi-label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.5pt; }
  .kpi-value { font-size: 14pt; font-weight: 700; color: #2e8b57; margin-top: 4pt; }
  .two-col { width: 100%; border-collapse: separate; border-spacing: 10pt 0; }
  .two-col > tbody > tr > td { width: 50%; vertical-align: top; padding: 0; border: none; }
  .note { font-size: 8pt; color: #777; margin-top: 4pt; font-style: italic; }
  .footer {
    margin-top: 24pt; padding-top: 12pt; border-top: 1pt solid #ddd;
    text-align: center; font-size: 8pt; color: #999;
    page-break-inside: avoid;
  }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
`;

export function buildReportHtml(data: ReportData): string {
  const printDate =
    new Date().toLocaleString('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Jakarta',
    }) + ' WIB';

  const txTotal = data.transactions.pagination.total;
  const txShown = data.transactions.data.length;

  const userStats = data.user_stats;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Laporan Apotek Permata</title>
  <style>${PRINT_STYLES}</style>
</head>
<body>
  <div class="doc">
    <table class="header-table">
      <tr>
        <td style="width:56pt"><div class="brand-mark">AP</div></td>
        <td>
          <h1>Laporan Apotek Permata</h1>
          <div class="meta">
            <strong>Periode:</strong> ${escapeHtml(periodLabel(data.period))}
            (${escapeHtml(data.date_from)} — ${escapeHtml(data.date_to)})<br/>
            <strong>Dicetak:</strong> ${escapeHtml(printDate)}
          </div>
        </td>
      </tr>
    </table>

    <table class="kpi-row">
      <tr>
        <td>
          <div class="kpi-label">Total Pasien</div>
          <div class="kpi-value">${userStats.total}</div>
        </td>
        <td>
          <div class="kpi-label">Pasien Baru (Bulan Ini)</div>
          <div class="kpi-value">${userStats.new_this_month}</div>
        </td>
        <td>
          <div class="kpi-label">Apoteker Aktif</div>
          <div class="kpi-value">${userStats.active_pharmacists}</div>
        </td>
      </tr>
    </table>

    <div class="section">
      <h2>1. Ringkasan Statistik</h2>
      <table class="data">
        <colgroup>
          <col style="width:42%"/><col style="width:33%"/><col style="width:25%"/>
        </colgroup>
        <thead><tr><th>Metrik</th><th>Nilai</th><th>Perubahan</th></tr></thead>
        <tbody>${buildSummaryRows(data)}</tbody>
      </table>
    </div>

    <div class="section">
      <table class="two-col">
        <tr>
          <td>
            <h2 style="margin-top:0">2. Statistik Pesanan</h2>
            <table class="data">
              <thead><tr><th>Status</th><th>Jumlah</th></tr></thead>
              <tbody>${buildOrderStatsRows(data)}</tbody>
            </table>
          </td>
          <td>
            <h2 style="margin-top:0">3. Statistik Pembayaran</h2>
            <table class="data">
              <colgroup><col style="width:40%"/><col style="width:20%"/><col style="width:40%"/></colgroup>
              <thead><tr><th>Metode</th><th>Jumlah</th><th>Pendapatan</th></tr></thead>
              <tbody>${buildPaymentRows(data)}</tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h2>4. Produk Terlaris</h2>
      <table class="data">
        <colgroup><col style="width:8%"/><col style="width:62%"/><col style="width:30%"/></colgroup>
        <thead><tr><th>#</th><th>Produk</th><th>Terjual</th></tr></thead>
        <tbody>${buildBestSellerRows(data)}</tbody>
      </table>
    </div>

    <div class="section">
      <h2>5. Aktivitas Apoteker</h2>
      <table class="data">
        <colgroup>
          <col style="width:35%"/><col style="width:18%"/>
          <col style="width:23%"/><col style="width:24%"/>
        </colgroup>
        <thead>
          <tr><th>Nama</th><th>Status</th><th>Diproses</th><th>Verifikasi Bayar</th></tr>
        </thead>
        <tbody>${buildPharmacistRows(data)}</tbody>
      </table>
    </div>

    <div class="section">
      <table class="two-col">
        <tr>
          <td>
            <h2 style="margin-top:0">6. Pendapatan Bulanan</h2>
            <table class="data">
              <thead><tr><th>Bulan</th><th>Pendapatan</th></tr></thead>
              <tbody>${buildMonthlyRevenueRows(data)}</tbody>
            </table>
          </td>
          <td>
            <h2 style="margin-top:0">7. Transaksi Mingguan</h2>
            <table class="data">
              <thead><tr><th>Minggu</th><th>Jumlah</th></tr></thead>
              <tbody>${buildWeeklyTransactionRows(data)}</tbody>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <div class="section section-wide">
      <h2>8. Riwayat Transaksi</h2>
      <p class="note">Waktu = pesanan selesai (WIB). Menampilkan ${txShown} dari ${txTotal} transaksi.</p>
      <table class="data">
        <colgroup>
          <col style="width:14%"/><col style="width:26%"/><col style="width:18%"/>
          <col style="width:12%"/><col style="width:14%"/><col style="width:16%"/>
        </colgroup>
        <thead>
          <tr>
            <th>No. Transaksi</th>
            <th>Pasien / Apoteker</th>
            <th>Waktu Selesai</th>
            <th>Bayar</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>${buildTransactionRows(data)}</tbody>
      </table>
    </div>

    <div class="footer">
      Apotek Permata — Laporan Analytics Admin · Dokumen ini dihasilkan secara otomatis
    </div>
  </div>
</body>
</html>`;
}

export async function exportReportPdf(
  data: ReportData,
  filters: ReportFilters = {},
): Promise<{ uri: string; shared: boolean }> {
  const fullData =
    data.transactions.pagination.last_page > 1 ||
    data.transactions.data.length < data.transactions.pagination.total
      ? await fetchReportForPdfExport(filters)
      : data;

  const html = buildReportHtml(fullData);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
    width: A4_WIDTH_PT,
    height: A4_HEIGHT_PT,
    margins: { top: 50, bottom: 50, left: 40, right: 40 },
  });

  let shared = false;
  if (Platform.OS !== 'web' && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Simpan Laporan Apotek Permata',
      UTI: 'com.adobe.pdf',
    });
    shared = true;
  }

  return { uri, shared };
}

export async function printReport(data: ReportData, filters: ReportFilters = {}): Promise<void> {
  const fullData =
    data.transactions.pagination.last_page > 1 ||
    data.transactions.data.length < data.transactions.pagination.total
      ? await fetchReportForPdfExport(filters)
      : data;

  await Print.printAsync({
    html: buildReportHtml(fullData),
    width: A4_WIDTH_PT,
    height: A4_HEIGHT_PT,
    margins: { top: 50, bottom: 50, left: 40, right: 40 },
  });
}
