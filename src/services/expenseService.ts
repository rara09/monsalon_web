import { api } from './api';

// Doit rester aligné avec ExpenseCategory côté backend (voir BACKEND_CONST.md)
export type ExpenseCategory =
  | 'Produits'
  | 'Eau'
  | 'Électricité'
  | 'Salaires'
  | 'Loyer'
  | 'Autre';

export type Expense = {
  id: number;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  notes?: string;
  receipt?: string;
  userId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateExpensePayload = {
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  notes?: string;
  receipt?: string;
  userId: number;
};

export const getExpenses = async () => {
  const res = await api.get<Expense[]>('/expenses');
  return res.data;
};

export const addExpense = async (payload: CreateExpensePayload) => {
  const res = await api.post<Expense>('/expenses', payload);
  return res.data;
};

export const updateExpense = async (id: number, payload: CreateExpensePayload) => {
  const res = await api.patch<Expense>(`/expenses/${id}`, payload);
  return res.data;
};

export const deleteExpense = async (id: number) => {
  await api.delete<void>(`/expenses/${id}`);
};


