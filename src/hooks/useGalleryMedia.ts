import { useCallback, useEffect, useMemo, useState } from 'react';
import { getGalleryPublic, type GalleryMediaRow } from '../services/galleryService';

export function useGalleryMedia() {
  const [items, setItems] = useState<GalleryMediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGalleryPublic();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const hasAny = useMemo(() => items.length > 0, [items.length]);

  return { items, loading, hasAny, refetch };
}

