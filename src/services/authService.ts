import type { LoginData, RegisterData } from '../types/authType';
import { api } from './api';

export { userFromAuthResponse } from '../utils/authResponse';

export const login = async (loginData: LoginData) => {
  const res = await api.post('/auth/login', loginData);

  return res.data;
};

export const register = async (registerData: RegisterData) => {
  const res = await api.post('/auth/register', registerData);

  return res.data;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');

  return res.data;
};

export const me = async () => {
  const res = await api.get('/auth/me');

  return res.data;
};
