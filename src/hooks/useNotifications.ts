import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from '../services/notificationService';

export function useNotifications() {
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = useMemo(
    () => items.filter((n) => !n.readAt).length,
    [items],
  );

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: number) => {
    const updated = await markNotificationRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setItems((prev) =>
      prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() })),
    );
  }, []);

  const addIncoming = useCallback((row: NotificationRow) => {
    setItems((prev) => [row, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, unreadCount, refetch, markRead, markAllRead, addIncoming };
}

