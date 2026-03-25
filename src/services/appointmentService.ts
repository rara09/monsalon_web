import { api } from './api';
import type {
  Appointment,
  CreateAppointmentPayload,
  AppointmentStatus,
  UpdateAppointmentStatusPayload,
} from '../types/appointmentType';

export const getAppointments = async () => {
  const res = await api.get<Appointment[]>('/appointments');
  return res.data;
};

export const addAppointment = async (payload: CreateAppointmentPayload) => {
  const res = await api.post<Appointment>('/appointments', payload);
  return res.data;
};

export const updateAppointmentStatus = async (
  id: number,
  payload: UpdateAppointmentStatusPayload,
) => {
  const res = await api.patch<Appointment>(`/appointments/${id}/status`, payload);
  return res.data;
};

// Convenience helper used by UI dropdowns
export const requestAppointmentStatus = async (
  id: number,
  status: AppointmentStatus,
) => {
  return updateAppointmentStatus(id, { status });
};

