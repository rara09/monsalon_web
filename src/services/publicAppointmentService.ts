import { api } from './api';

export type CreatePublicAppointmentPayload = {
  serviceId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
};

export const createPublicAppointment = async (
  payload: CreatePublicAppointmentPayload,
) => {
  const res = await api.post('/public/appointments', payload);
  return res.data as unknown;
};

