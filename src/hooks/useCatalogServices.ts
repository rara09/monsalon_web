import { useCallback, useEffect, useState } from 'react';
import {
  getCatalogServicesManage,
  type CatalogServiceRow,
} from '../services/catalogService';

export function useCatalogServices() {
  const [items, setItems] = useState<CatalogServiceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCatalogServicesManage();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, refetch };
}
