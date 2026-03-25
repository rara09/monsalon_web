import { useCallback, useEffect, useState } from 'react';
import { getAppointments } from '../services/appointmentService';
import type { Appointment } from '../types/appointmentType';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAppointments();
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { appointments, loading, refetch };
}

