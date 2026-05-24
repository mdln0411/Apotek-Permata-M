/** Format tanggal/jam transaksi — zona WIB (Asia/Jakarta) */

const JAKARTA_TZ = 'Asia/Jakarta';

/** Jam/tanggal transaksi selesai untuk laporan admin. */
export function formatTransactionDateTime(
  iso?: string | null,
  fallbackFormatted?: string | null,
): string {
  const formatted = fallbackFormatted?.trim();
  if (formatted) return formatted;

  if (!iso) return 'Belum selesai';

  return formatOrderDateTime(iso, null);
}

export function formatOrderDateTime(
  iso?: string | null,
  fallbackFormatted?: string | null,
): string {
  const formatted = fallbackFormatted?.trim();
  if (formatted) return formatted;

  if (iso) {
    const date = new Date(iso);
    if (!Number.isNaN(date.getTime())) {
      const formatted = date.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: JAKARTA_TZ,
      });
      return `${formatted} WIB`;
    }
  }

  return '—';
}
