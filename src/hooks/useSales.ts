import { useCallback, useEffect, useState } from 'react';
import { getSales, type Sale } from '../services/saleService';

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSales();
      setSales(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { sales, loading, refetch };
}

