import type { ReportTransaction } from '@/api/reportService';
import axiosClient from './axiosClient';
import { mapOrderToReportTransaction } from '@/utils/mapOrderTransaction';

export type AdminOrderRecord = {
  id: number;
  order_number: string;
  status: string;
  total_price: number | string;
  payment_method?: string | null;
  payment_status?: string | null;
  created_at: string;
  updated_at?: string;
  completed_at?: string | null;
  notes?: string | null;
  user?: { name?: string } | null;
  processed_by?: { name?: string } | null;
  processedBy?: { name?: string } | null;
  items?: Array<{
    name?: string;
    quantity?: number;
    price?: number;
    subtotal?: number;
    medicine?: { name?: string } | null;
  }>;
};

/** Sumber data sama dengan halaman Daftar Transaksi (`/api/admin/orders`). */
export async function getAdminOrderList(): Promise<AdminOrderRecord[]> {
  const response = await axiosClient.get<{ status: string; data: AdminOrderRecord[] }>(
    '/api/admin/orders',
  );
  return response.data.data ?? [];
}

export async function getAdminTransactionHistory(): Promise<ReportTransaction[]> {
  const orders = await getAdminOrderList();
  return orders.map(mapOrderToReportTransaction);
}
