import type { Client } from '../types/userType';
import { api } from './api';

export const getClients = async () => {
  const res = await api.get('/clients');
  return res.data;
};

export const addClient = async (client: Client) => {
  const res = await api.post('/clients', client);
  return res.data;
};

export const updateClient = async (id: number, client: Client) => {
  const res = await api.patch(`/clients/${id}`, client);
  return res.data;
};

export const deleteClient = async (id: number) => {
  const res = await api.delete(`/clients/${id}`);
  return res.data;
};
