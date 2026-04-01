import { api } from './api';

export type UserRow = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  isActive: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive?: boolean;
  avatar?: string;
};

export const getUsers = async () => {
  const res = await api.get<UserRow[]>('/users');
  return res.data;
};

export const createUser = async (payload: CreateUserPayload) => {
  const res = await api.post<UserRow>('/users', payload);
  return res.data;
};

export const updateUser = async (
  id: number,
  payload: Partial<CreateUserPayload>,
) => {
  const res = await api.patch<UserRow>(`/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const USER_ROLE_OPTIONS = ['ADMIN', 'STAFF', 'CLIENT'] as const;

