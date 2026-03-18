export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export type Client = {
  id?: number;
  firstName: string;
  lastName: string;
  phone: string;
  // Champs optionnels selon l'API (permet stats réelles quand disponibles)
  createdAt?: string;
  isVip?: boolean;
  vipStatus?: 'VIP' | 'Standard';
  visitsCount?: number;
};
