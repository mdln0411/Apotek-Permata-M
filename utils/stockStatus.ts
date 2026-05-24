/** Label & filter stok obat — admin & apoteker */

export type StockFilterTab = 'semua' | 'habis' | 'menipis' | 'tersedia';

export function normalizeStock(stock: number | string): number {
  const n = Number(stock);
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
}

export function isStockHabis(stock: number | string): boolean {
  return normalizeStock(stock) === 0;
}

export function isStockMenipis(stock: number | string): boolean {
  const s = normalizeStock(stock);
  return s > 0 && s < 10;
}

export function getStockStatusLabel(stock: number | string): 'Habis' | 'Menipis' | 'Tersedia' {
  if (isStockHabis(stock)) return 'Habis';
  if (isStockMenipis(stock)) return 'Menipis';
  return 'Tersedia';
}

export function getStockCounts<T extends { stock: number | string }>(
  medicines: T[] | null | undefined,
) {
  const list = Array.isArray(medicines) ? medicines : [];
  const habis = list.filter((m) => isStockHabis(m.stock)).length;
  const menipis = list.filter((m) => isStockMenipis(m.stock)).length;
  const tersedia = list.filter((m) => normalizeStock(m.stock) >= 10).length;
  return { habis, menipis, tersedia, total: list.length };
}

export function formatStockAlertSummary(habis: number, menipis: number): string {
  const parts: string[] = [];
  if (habis > 0) parts.push(`${habis} Habis`);
  if (menipis > 0) parts.push(`${menipis} Menipis`);
  return parts.join(', ');
}

export function matchesStockFilter(
  stock: number | string,
  filter: StockFilterTab,
): boolean {
  if (filter === 'habis') return isStockHabis(stock);
  if (filter === 'menipis') return isStockMenipis(stock);
  if (filter === 'tersedia') return normalizeStock(stock) >= 10;
  return true;
}
