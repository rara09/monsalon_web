import type { LoginData, RegisterData } from '../types/authType';
import { api } from './api';

export const login = async (loginData: LoginData) => {
  const res = await api.post('/auth/login', loginData);

  return res.data;
};

export const register = async (registerData: RegisterData) => {
  const res = await api.post('/auth/register', registerData);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
