import { useEffect, useState } from 'react';
import { getClients } from '../services/clientService';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClients()
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  return { clients, loading };
}
