import { useCallback, useEffect, useState } from 'react';
import { getExpenses, type Expense } from '../services/expenseService';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { expenses, loading, refetch };
}

