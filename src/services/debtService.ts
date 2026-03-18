import { api } from './api';

export type Debt = {
  id: number;
  totalAmount: number;
  clientId: number;
  serviceId?: number;
  saleId?: number;
  dueDate: string;
  notes?: string;
  status?: 'IMPAYÉ' | 'PARTIEL' | 'PAYÉ';
  createdAt?: string;
  updatedAt?: string;
  client?: { id: number; firstName: string; lastName: string };
};

export type CreateDebtPayload = {
  totalAmount: number;
  clientId: number;
  serviceId?: number;
  saleId?: number;
  dueDate: string;
  notes?: string;
};

export const getDebts = async () => {
  const res = await api.get<Debt[]>('/debts');
  return res.data;
};

export const addDebt = async (payload: CreateDebtPayload) => {
  const res = await api.post<Debt>('/debts', payload);
  return res.data;
};

export const updateDebt = async (id: number, payload: CreateDebtPayload) => {
  const res = await api.patch<Debt>(`/debts/${id}`, payload);
  return res.data;
};

export const deleteDebt = async (id: number) => {
  await api.delete<void>(`/debts/${id}`);
};


