import { api } from './api';

export type NotificationRow = {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  readAt?: string | null;
  createdAt: string;
};

export const getNotifications = async () => {
  const res = await api.get<NotificationRow[]>('/notifications');
  return res.data;
};

export const markNotificationRead = async (id: number) => {
  const res = await api.patch<NotificationRow>(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.patch('/notifications/read-all');
  return res.data;
};

