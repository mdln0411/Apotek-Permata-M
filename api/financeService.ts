import axiosClient from './axiosClient';

export interface FinanceSummary {
  total_revenue: number;
  total_revenue_formatted: string;
  total_orders: number;
  total_customers: number;
  total_items: number;
  today_revenue: number;
  today_revenue_formatted: string;
  growth: {
    percent: number;
    display: string;
    revenue_this_week: number;
    revenue_last_week: number;
  };
  chart: {
    labels: string[];
    data: number[];
  };
  best_sellers: Array<{
    id: string;
    name: string;
    qty: number;
    sold: string;
    income: string;
  }>;
  recent_orders: any[];
}

export const getFinanceSummary = async () => {
  const response = await axiosClient.get<{ status: string; data: FinanceSummary }>(
    '/api/finance/summary'
  );
  return response.data;
};

/** Total per pesanan — sama dengan perhitungan backend & halaman keuangan apoteker */
export function getOrderGrandTotal(order: {
  total_amount?: number | string | null;
  total_price?: number | string | null;
  shipping_address?: string | null;
}): number {
  const base = Number(order.total_amount ?? order.total_price ?? 0);
  const isDelivery =
    Boolean(order.shipping_address) && order.shipping_address !== 'Ambil di Apotek';
  return base + 2000 + (isDelivery ? 10000 : 0);
}
