import type { ReportTransaction } from '@/api/reportService';
import type { AdminOrderRecord } from '@/api/adminOrderService';
import { formatOrderDateTime } from '@/utils/dateTime';

function formatRupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

function paymentLabel(order: AdminOrderRecord): string {
  if (order.payment_method?.trim()) {
    return order.payment_method.trim();
  }
  if (order.notes?.trim()) {
    return order.notes.trim();
  }
  return '—';
}

/** Map pesanan admin ke baris riwayat transaksi — selaras dengan Daftar Transaksi. */
export function mapOrderToReportTransaction(order: AdminOrderRecord): ReportTransaction {
  const items = (order.items ?? []).map((item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    const subtotal = Number(item.subtotal) || price * qty;
    return {
      name: item.medicine?.name ?? item.name ?? 'Obat',
      quantity: qty,
      price,
      subtotal,
    };
  });

  const total = Number(order.total_price) || 0;
  const apoteker = order.processedBy?.name ?? order.processed_by?.name ?? 'Tim Apotek';
  const isCompleted = ['selesai', 'completed'].includes(
    String(order.status || '').toLowerCase(),
  );
  const completedAt = order.completed_at ?? null;

  return {
    id: order.id,
    order_number: order.order_number,
    patient_name: order.user?.name ?? '—',
    apoteker_name: apoteker,
    created_at: order.created_at,
    created_at_formatted: formatOrderDateTime(order.created_at),
    transaction_at: isCompleted ? (completedAt ?? order.updated_at ?? null) : null,
    transaction_at_formatted: null,
    total,
    total_formatted: formatRupiah(total),
    payment_method: paymentLabel(order),
    payment_status: order.payment_status ?? 'pending',
    order_status: order.status,
    item_count: items.length,
    items,
  };
}
