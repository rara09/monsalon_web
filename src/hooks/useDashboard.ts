import { useCallback, useEffect, useState } from 'react';
import {
  getDashboardStats,
  type DashboardStats,
} from '../services/dashboardService';

export type DashboardPeriod = 'day' | 'week' | 'month' | 'year';

export function useDashboard(initialPeriod: DashboardPeriod = 'day') {
  const [period, setPeriod] = useState<DashboardPeriod>(initialPeriod);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(
    async (overridePeriod?: DashboardPeriod) => {
      const current = overridePeriod ?? period;
      setLoading(true);
      try {
        const data = await getDashboardStats(current);
        setStats(data);
      } finally {
        setLoading(false);
      }
    },
    [period],
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    period,
    setPeriod,
    stats,
    loading,
    refetch,
  };
}

