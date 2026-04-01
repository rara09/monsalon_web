import { api } from './api';

export type CatalogServiceRow = {
  id: number;
  name: string;
  type: string;
  amount: number | string;
  duration: number;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export const getCatalogServicesPublic = () =>
  api.get<CatalogServiceRow[]>('/catalog/services').then((r) => r.data);

export const getCatalogServicesManage = () =>
  api.get<CatalogServiceRow[]>('/catalog/services/manage').then((r) => r.data);

/** POST multipart — champ fichier `image` optionnel */
export const createCatalogServiceFormData = (formData: FormData) =>
  api.post<CatalogServiceRow>('/catalog/services', formData, {
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers['Content-Type'];
        }
        return data;
      },
    ],
  }).then((r) => r.data);

/** PATCH multipart — `image` optionnel ; sans fichier, l’image existante est conservée */
export const updateCatalogServiceFormData = (id: number, formData: FormData) =>
  api.patch<CatalogServiceRow>(`/catalog/services/${id}`, formData, {
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData) {
          delete headers['Content-Type'];
        }
        return data;
      },
    ],
  }).then((r) => r.data);

export const deleteCatalogService = (id: number) =>
  api.delete(`/catalog/services/${id}`);

export const SERVICE_TYPE_OPTIONS = [
  'Nattes',
  'Tresses',
  'Tissage',
  'Coupe',
  'Coloration',
  'Onglerie',
  'Autre',
] as const;

export type ServiceTypeOption = (typeof SERVICE_TYPE_OPTIONS)[number];
