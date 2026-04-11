import { useCallback, useEffect, useState } from 'react';
import { getGalleryManage, type GalleryMediaRow } from '../services/galleryService';

export function useGalleryMediaManage() {
  const [items, setItems] = useState<GalleryMediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGalleryManage();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, loading, refetch };
}

