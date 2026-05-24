/** Pesanan ambil di apotek (tanpa pengiriman). */
export function isPickupOrder(order: { shipping_address?: string | null }): boolean {
  return order.shipping_address === 'Ambil di Apotek';
}

/** Bayar di tempat / COD — pembayaran dicatat saat pasien jemput. */
export function isCodOrder(order: {
  payment_method?: string | null;
  notes?: string | null;
}): boolean {
  const method = (order.payment_method || '').toLowerCase();
  const notes = (order.notes || '').toLowerCase();
  return (
    method.includes('cod') ||
    method.includes('bayar di apotek') ||
    notes.includes('bayar di apotek (cod)') ||
    notes.includes('pembayaran: bayar di apotek')
  );
}
