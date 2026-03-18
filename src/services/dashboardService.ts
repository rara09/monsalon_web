import { api } from './api';

export type DashboardActivity = {
  type: string;
  id: number;
  name: string;
  amount: string;
  date: string;
  client: string;
};

export type DashboardStats = {
  totalRevenue: number;
  servicesCount: number;
  productSales: number;
  clientDebts: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  recentActivities: DashboardActivity[];
};

export const getDashboardStats = async (
  period: 'day' | 'week' | 'month' | 'year' = 'day',
) => {
  const res = await api.get<DashboardStats>(`/dashboard/stats`, {
    params: { period },
  });
  return res.data;
};

