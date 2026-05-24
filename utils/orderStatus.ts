/** Label & warna status pesanan — dipakai pasien & apoteker */

export function normalizeOrderStatus(status: string): string {
  return (status || '').toLowerCase().trim();
}

export function getOrderStatusLabel(status: string): string {
  const s = (status || '').toLowerCase().trim();
  const map: Record<string, string> = {
    menunggu_pembayaran: 'BELUM BAYAR',
    menunggu_konfirmasi: 'MENUNGGU KONFIRMASI',
    perlu_diproses: 'PERLU DIPROSES',
    sedang_diproses: 'DIPROSES',
    diproses: 'DIPROSES',
    processing: 'DIPROSES',
    dikirim: 'DIKIRIM',
    shipped: 'DIKIRIM',
    selesai: 'SELESAI',
    completed: 'SELESAI',
    dibatalkan: 'DIBATALKAN',
    cancelled: 'DIBATALKAN',
    dilaporkan: 'DILAPORKAN',
  };
  return map[s] || status.replace(/_/g, ' ').toUpperCase();
}

export function getOrderStatusColors(status: string): { bg: string; text: string } {
  const s = (status || '').toLowerCase().trim();
  if (['selesai', 'completed', 'valid'].includes(s)) return { bg: '#E8F5E9', text: '#2E8B57' };
  if (['dikirim', 'shipped'].includes(s)) return { bg: '#FFF3E0', text: '#EF6C00' };
  if (['dibatalkan', 'cancelled', 'dilaporkan', 'reported'].includes(s)) {
    return { bg: '#FFEBEE', text: '#D32F2F' };
  }
  if (['menunggu_pembayaran', 'menunggu_konfirmasi'].includes(s)) {
    return { bg: '#FFF3E0', text: '#F57C00' };
  }
  if (['perlu_diproses', 'sedang_diproses', 'diproses', 'processing'].includes(s)) {
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
    return orders.filter((o) => ['dikirim', 'shipped'].includes(normalizeOrderStatus(o.status)));
  }
  if (subTab === 'selesai') {
    return orders.filter((o) => ['selesai', 'completed'].includes(normalizeOrderStatus(o.status)));
  }
  if (subTab === 'dibatalkan') {
    return orders.filter((o) =>
      ['dibatalkan', 'cancelled', 'dilaporkan'].includes(normalizeOrderStatus(o.status)),
    );
  }
  // Dalam proses — belum dikirim/selesai/batal
  return orders.filter((o) => {
    const s = normalizeOrderStatus(o.status);
    return !['selesai', 'completed', 'dibatalkan', 'cancelled', 'dilaporkan', 'dikirim', 'shipped'].includes(s);
  });
}
