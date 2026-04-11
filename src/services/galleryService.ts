import { api } from './api';

export type GalleryMediaKind = 'IMAGE' | 'VIDEO';

export type GalleryMediaRow = {
  id: number;
  kind: GalleryMediaKind;
  title: string;
  src: string;
  poster?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export const getGalleryPublic = async () => {
  const res = await api.get<GalleryMediaRow[]>('/gallery');
  return res.data;
};

export const getGalleryManage = async () => {
  const res = await api.get<GalleryMediaRow[]>('/gallery/manage');
  return res.data;
};

export const createGalleryMediaFormData = async (formData: FormData) => {
  const res = await api.post<GalleryMediaRow>('/gallery', formData, {
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers['Content-Type'];
        }
        return data;
      },
    ],
  });
  return res.data;
};

export const updateGalleryMediaFormData = async (id: number, formData: FormData) => {
  const res = await api.patch<GalleryMediaRow>(`/gallery/${id}`, formData, {
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers['Content-Type'];
        }
        return data;
      },
    ],
  });
  return res.data;
};

export const deleteGalleryMedia = async (id: number) => {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
};

