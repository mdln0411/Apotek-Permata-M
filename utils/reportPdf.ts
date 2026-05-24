import type { ReportData } from '@/api/reportService';
import { formatTransactionDateTime } from '@/utils/dateTime';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

function formatRupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

function buildSummaryRows(data: ReportData): string {
  return data.summary
    .map(
      (c) => `
    <tr>
      <td>${c.label}</td>
      <td style="text-align:right;font-weight:bold">${c.value_formatted}</td>
      <td style="text-align:center;color:${c.trend === 'up' ? '#2E8B57' : '#D32F2F'}">${c.change_display}</td>
    </tr>`,
    )
    .join('');
}

function buildTransactionRows(data: ReportData): string {
  const rows = data.transactions.data;
  if (!rows.length) {
    return '<tr><td colspan="7" style="text-align:center;color:#999">Belum ada transaksi</td></tr>';
  }
  return rows
    .map(
      (t) => `
    <tr>
      <td>${t.order_number}</td>
      <td>${t.patient_name}</td>
      <td>${t.apoteker_name}</td>
      <td>${formatTransactionDateTime(t.transaction_at, t.transaction_at_formatted)}</td>
      <td>${t.payment_method}</td>
      <td>${t.order_status}</td>
      <td style="text-align:right">${t.total_formatted}</td>
    </tr>`,
    )
    .join('');
}

function buildBestSellerRows(data: ReportData): string {
  const chart = data.charts.best_sellers_bar;
  if (!chart.data.length) return '<tr><td colspan="3" style="text-align:center;color:#999">Belum ada data</td></tr>';
  return (
    chart.full_names
      ?.map(
        (name, i) =>
          `<tr><td>${i + 1}</td><td>${name}</td><td style="text-align:right">${chart.data[i]} unit</td></tr>`,
      )
      .join('') ?? ''
  );
}

export function buildReportHtml(data: ReportData): string {
  const printDate = new Date().toLocaleString('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }) + ' WIB';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; margin: 0; padding: 32px; background: #fff; }
    .header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #2E8B57; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { width: 56px; height: 56px; background: #E8F5E9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
    h1 { margin: 0; font-size: 22px; color: #1A2E1A; }
    .meta { font-size: 12px; color: #777; margin-top: 4px; }
    h2 { font-size: 15px; color: #2E8B57; border-left: 4px solid #2E8B57; padding-left: 10px; margin: 28px 0 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
    th { background: #F4F8F4; color: #555; font-weight: 700; padding: 8px 10px; text-align: left; border-bottom: 2px solid #E0E8E0; }
    td { padding: 7px 10px; border-bottom: 1px solid #F0F0F0; }
    tr:nth-child(even) td { background: #FAFAFA; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #EEE; padding-top: 16px; }
    .badge { display: inline-block; background: #E8F5E9; color: #2E8B57; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">💊</div>
    <div>
      <h1>Laporan Apotek Permata</h1>
      <div class="meta">Periode: ${data.date_from} — ${data.date_to} &nbsp;|&nbsp; Dicetak: ${printDate}</div>
    </div>
  </div>

  <h2>Ringkasan Statistik</h2>
  <table>
    <thead><tr><th>Metrik</th><th>Nilai</th><th>Perubahan</th></tr></thead>
    <tbody>${buildSummaryRows(data)}</tbody>
  </table>

  <h2>Produk Terlaris</h2>
  <table>
    <thead><tr><th>#</th><th>Produk</th><th>Terjual</th></tr></thead>
    <tbody>${buildBestSellerRows(data)}</tbody>
  </table>

  <h2>Statistik Pembayaran</h2>
  <table>
    <thead><tr><th>Metode</th><th>Jumlah</th><th>Pendapatan</th></tr></thead>
    <tbody>
      ${data.payment_stats.by_method
        .map(
          (p) =>
            `<tr><td>${p.label ?? p.method}</td><td>${p.count}</td><td style="text-align:right">${formatRupiah(p.revenue)}</td></tr>`,
        )
        .join('')}
    </tbody>
  </table>

  <h2>Aktivitas Apoteker</h2>
  <table>
    <thead><tr><th>Nama</th><th>Status</th><th>Diproses</th><th>Verifikasi Bayar</th></tr></thead>
    <tbody>
      ${
        data.pharmacist_activity.length
          ? data.pharmacist_activity
              .map(
                (a) =>
                  `<tr><td>${a.name}</td><td>${a.is_active ? '<span class="badge">Aktif</span>' : 'Nonaktif'}</td><td>${a.orders_processed}</td><td>${a.payments_verified}</td></tr>`,
              )
              .join('')
          : '<tr><td colspan="4" style="text-align:center;color:#999">Belum ada data</td></tr>'
      }
    </tbody>
  </table>

  <h2>Riwayat Transaksi</h2>
  <table>
    <thead>
      <tr>
        <th>No. Transaksi</th><th>Pasien</th><th>Apoteker</th>
        <th>Tanggal</th><th>Bayar</th><th>Status</th><th>Total</th>
      </tr>
    </thead>
    <tbody>${buildTransactionRows(data)}</tbody>
  </table>

  <div class="footer">
    Apotek Permata — Laporan Analytics Admin
  </div>
</body>
</html>`;
}

export async function exportReportPdf(data: ReportData): Promise<{ uri: string; shared: boolean }> {
  const html = buildReportHtml(data);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
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

export async function printReport(data: ReportData): Promise<void> {
  await Print.printAsync({ html: buildReportHtml(data) });
}
