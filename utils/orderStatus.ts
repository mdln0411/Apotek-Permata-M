/** Label & warna status pesanan — dipakai pasien & apoteker */

export function normalizeOrderStatus(status: string): string {
  return (status || '').toLowerCase().trim();
}

export function getOrderStatusLabel(status: string): string {
  const s = normalizeToApiOrderStatus(status);
  const map: Record<string, string> = {
    menunggu_pembayaran: 'BELUM BAYAR',
    menunggu_konfirmasi: 'MENUNGGU VERIFIKASI',
    perlu_diproses: 'PERLU DIPROSES',
    sedang_diproses: 'SEDANG DIPROSES',
    dikirim: 'SEDANG DIKIRIM',
    selesai: 'SELESAI',
    dibatalkan: 'DIBATALKAN',
    dilaporkan: 'DILAPORKAN',
  };
  return map[s] || (status || '').replace(/_/g, ' ').toUpperCase();
}

export function getOrderStatusColors(status: string): { bg: string; text: string } {
  const s = normalizeToApiOrderStatus(status);
  if (s === 'selesai') return { bg: '#E8F5E9', text: '#2E8B57' };
  if (s === 'dikirim') return { bg: '#FFF3E0', text: '#EF6C00' };
  if (['dibatalkan', 'dilaporkan'].includes(s)) {
    return { bg: '#FFEBEE', text: '#D32F2F' };
  }
  if (['menunggu_pembayaran', 'menunggu_konfirmasi'].includes(s)) {
    return { bg: '#FFF3E0', text: '#F57C00' };
  }
  if (['perlu_diproses', 'sedang_diproses'].includes(s)) {
    return { bg: '#E3F2FD', text: '#1976D2' };
  }
  return { bg: '#F5F5F5', text: '#666' };
}

export type OrderSubTab = 'semua' | 'pending' | 'dikirim' | 'selesai' | 'dibatalkan';

/** Opsi status untuk admin — nilai harus sama dengan validasi backend */
export const ADMIN_ORDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'menunggu_pembayaran', label: 'Menunggu Pembayaran' },
  { value: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi' },
  { value: 'perlu_diproses', label: 'Perlu Diproses' },
  { value: 'sedang_diproses', label: 'Sedang Diproses' },
  { value: 'dikirim', label: 'Dikirim' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dilaporkan', label: 'Dilaporkan' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
];

/** Normalisasi status lama / alias ke slug API */
export function normalizeToApiOrderStatus(status: string): string {
  const s = normalizeOrderStatus(status);
  const alias: Record<string, string> = {
    pending: 'menunggu_pembayaran',
    menunggu: 'menunggu_pembayaran',
    diproses: 'sedang_diproses',
    processing: 'sedang_diproses',
    completed: 'selesai',
    cancelled: 'dibatalkan',
    shipped: 'dikirim',
  };
  return alias[s] || s;
}

export function getOrderStatusOptionLabel(status: string): string {
  const api = normalizeToApiOrderStatus(status);
  const found = ADMIN_ORDER_STATUS_OPTIONS.find((o) => o.value === api);
  if (found) return found.label;
  return getOrderStatusLabel(status);
}

export function filterOrdersBySubTab<T extends { status: string }>(
  orders: T[],
  subTab: OrderSubTab,
): T[] {
  if (subTab === 'semua') return orders;
  if (subTab === 'dikirim') {
    return orders.filter((o) => normalizeToApiOrderStatus(o.status) === 'dikirim');
  }
  if (subTab === 'selesai') {
    return orders.filter((o) => normalizeToApiOrderStatus(o.status) === 'selesai');
  }
  if (subTab === 'dibatalkan') {
    return orders.filter((o) =>
      ['dibatalkan', 'dilaporkan'].includes(normalizeToApiOrderStatus(o.status)),
    );
  }
  // Dalam proses — belum dikirim/selesai/batal
  return orders.filter((o) => {
    const s = normalizeToApiOrderStatus(o.status);
    return !['selesai', 'dibatalkan', 'dilaporkan', 'dikirim'].includes(s);
  });
}
