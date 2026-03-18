import { api } from './api';

export type Product = {
  id?: number;
  category: string;
  name: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  stockLevel: number;
  image?: string | null;
  lowStockAlert?: number;
};

export const getProducts = async () => {
  const res = await api.get<Product[]>('/products');
  return res.data;
};

export const addProduct = async (product: Product) => {
  const res = await api.post<Product>('/products', product);
  return res.data;
};

export const updateProduct = async (id: number, product: Product) => {
  const res = await api.patch<Product>(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

