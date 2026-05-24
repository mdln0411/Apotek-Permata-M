import axiosClient from './axiosClient';

export type ReportPeriod = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface ReportFilters {
  period?: ReportPeriod;
  date_from?: string;
  date_to?: string;
  apoteker_id?: string | number;
  payment_method?: string;
  status?: string;
  search?: string;
  sort?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface ReportMetricCard {
  key: string;
  label: string;
  value: number;
  value_formatted: string;
  icon: string;
  icon_color: string;
  bg_color: string;
  today: number;
  today_formatted: string;
  week: number;
  week_formatted: string;
  month: number;
  month_formatted: string;
  change_percent: number;
  change_display: string;
  trend: 'up' | 'down';
}

export interface ReportChartData {
  labels: string[];
  data: number[];
  colors?: string[];
  full_names?: string[];
}

export interface ReportTransaction {
  id: number;
  order_number: string;
  patient_name: string;
  apoteker_name: string;
  created_at: string;
  created_at_formatted: string;
  total: number;
  total_formatted: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  item_count: number;
  items: Array<{ name: string; quantity: number; price: number; subtotal: number }>;
}

export interface ReportData {
  period: string;
  date_from: string;
  date_to: string;
  summary: ReportMetricCard[];
  charts: {
    revenue_line: ReportChartData;
    best_sellers_bar: ReportChartData;
    order_status_pie: ReportChartData;
    weekly_transactions_area: ReportChartData;
    monthly_revenue: ReportChartData;
  };
  pharmacist_activity: Array<{
    id: number;
    name: string;
    is_active: boolean;
    orders_processed: number;
    payments_verified: number;
  }>;
  payment_stats: {
    by_method: Array<{ method: string; label?: string; count: number; revenue: number }>;
    by_status: Array<{ status: string; label: string; count: number }>;
  };
  order_stats: Array<{ status: string; count: number }>;
  user_stats: {
    total: number;
    new_this_month: number;
    active_pharmacists: number;
    total_admins: number;
  };
  transactions: {
    data: ReportTransaction[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
  filter_options: {
    apotekers: Array<{ id: number; name: string }>;
    payment_methods: Array<{ value: string; label: string }>;
    statuses: Array<{ value: string; label: string }>;
    periods: Array<{ value: string; label: string }>;
  };
  generated_at: string;
}

export const getAdminReports = async (filters: ReportFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '' && val !== null) {
      params.append(key, String(val));
    }
  });
  const qs = params.toString();
  const response = await axiosClient.get<{ status: string; data: ReportData }>(
    `/api/admin/reports${qs ? `?${qs}` : ''}`,
  );
  return response.data;
};
