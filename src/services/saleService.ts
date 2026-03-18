import { api } from './api';

export type SaleItem = {
  id?: number;
  saleId?: number;
  productId: number;
  quantity: number;
  unitPrice: number | string;
  totalPrice?: number | string;
  product?: {
    id: number;
    name: string;
    category: string;
    sellingPrice: string;
  };
};

export type Sale = {
  id: number;
  totalAmount: string;
  paymentMethod: string;
  userId: number | null;
  clientId: number | null;
  createdAt: string;
  updatedAt: string;
  user: unknown;
  client: { id: number; firstName: string; lastName: string } | null;
  items: SaleItem[];
};

export type CreateSalePayload = {
  paymentMethod: string;
  clientId: number | null;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
};

export const getSales = async () => {
  const res = await api.get<Sale[]>('/sales');
  return res.data;
};

export const addSale = async (payload: CreateSalePayload) => {
  const res = await api.post<Sale>('/sales', payload);
  return res.data;
};

