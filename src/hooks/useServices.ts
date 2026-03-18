import { useCallback, useEffect, useState } from 'react';
import { getServices, type SalonService } from '../services/serviceService';

export function useServices() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { services, loading, refetch };
}

