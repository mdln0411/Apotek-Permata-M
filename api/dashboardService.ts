import axiosClient from './axiosClient';

export interface DashboardStat {
  label: string;
  value: string;
  raw_value: number;
  icon: string;
  color: string;
  iconColor: string;
}

export interface DashboardChart {
  labels: string[];
  data: number[];
}

export interface BestSellerItem {
  id: string;
  name: string;
  sold: string;
  income: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  chart: DashboardChart;
  best_sellers: BestSellerItem[];
}

export interface DashboardResponse {
  status: string;
  data: DashboardData;
}

/**
 * Fetch Administrative Dashboard stats, weekly sales chart, and best sellers
 */
export const getAdminDashboardStats = async (): Promise<DashboardResponse> => {
  const response = await axiosClient.get('/api/admin/dashboard/stats');
  return response.data;
};
