import { api } from './api';

export type SalonService = {
  id?: number;
  name: string;
  type: string;
  amount: number;
  paymentMethod?: string;
  serviceDate?: string;
  clientId?: number;
};

export const getServices = async () => {
  const res = await api.get<SalonService[]>('/services');
  return res.data;
};

export const addService = async (service: SalonService) => {
  const res = await api.post<SalonService>('/services', service);
  return res.data;
};

export const updateService = async (id: number, service: SalonService) => {
  const res = await api.patch<SalonService>(`/services/${id}`, service);
  return res.data;
};

export const deleteService = async (id: number) => {
  const res = await api.delete(`/services/${id}`);
  return res.data;
};

