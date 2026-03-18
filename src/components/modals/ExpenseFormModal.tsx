import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import {
  addExpense,
  updateExpense,
  type CreateExpensePayload,
  type Expense,
  type ExpenseCategory,
} from '../../services/expenseService';

type ExpenseFormData = {
  amount: number | '';
  category: ExpenseCategory | '';
  expenseDate: string;
  notes: string;
  receipt: string;
};

type ExpenseFormModalMode = 'create' | 'edit';

const ExpenseFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  expense,
  userId,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: ExpenseFormModalMode;
  expense?: Expense;
  userId: number;
}) => {
  const { toast, toastError } = useToast();

  const initialForm = useMemo<ExpenseFormData>(
    () => ({
      amount: expense?.amount ?? '',
      category: expense?.category ?? '',
      expenseDate: expense?.expenseDate
        ? expense.expenseDate.slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      notes: expense?.notes ?? '',
      receipt: expense?.receipt ?? '',
    }),
    [expense?.amount, expense?.category, expense?.expenseDate, expense?.notes, expense?.receipt],
  );

  const [form, setForm] = useState<ExpenseFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'amount'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: CreateExpensePayload = {
        amount: typeof form.amount === 'number' ? form.amount : 0,
        category: (form.category || 'Autre') as ExpenseCategory,
        expenseDate: new Date(form.expenseDate).toISOString(),
        notes: form.notes || undefined,
        receipt: form.receipt || undefined,
        userId,
      };

      if (mode === 'edit') {
        if (!expense?.id)
          throw new Error('Expense id manquant pour la mise à jour');
        await updateExpense(expense.id, payload);
        toast('success', 'Dépense mise à jour avec succès.');
      } else {
        await addExpense(payload);
        toast('success', 'Dépense ajoutée avec succès.');
      }

      await onSuccess?.();
      closeModal();
      setForm(initialForm);
    } catch (error) {
      toastError(error, "Impossible d'enregistrer la dépense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={mode === 'edit' ? 'Modifier la dépense' : 'Ajouter une dépense'}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Montant
              </label>
              <div className='relative'>
                <input
                  type='number'
                  min={0}
                  step={1}
                  name='amount'
                  value={form.amount}
                  onChange={handleChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                  placeholder='10000'
                  required
                />
                <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400'>
                  F
                </span>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Catégorie
              </label>
              <select
                name='category'
                value={form.category}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              >
                <option value='' disabled>
                  Sélectionnez une catégorie
                </option>
                <option value='Produits'>Produits</option>
                <option value='Eau'>Eau</option>
                <option value='Électricité'>Électricité</option>
                <option value='Salaires'>Salaires</option>
                <option value='Loyer'>Loyer</option>
                <option value='Autre'>Autre</option>
              </select>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Date &amp; heure
              </label>
              <input
                type='datetime-local'
                name='expenseDate'
                value={form.expenseDate}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Référence du reçu (optionnel)
              </label>
              <input
                type='text'
                name='receipt'
                value={form.receipt}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                placeholder='N° de reçu ou référence'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Notes
            </label>
            <textarea
              name='notes'
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Détails supplémentaires sur la dépense...'
            />
          </div>

          <div className='pt-1 mt-2 flex justify-end gap-2'>
            <Button
              type='button'
              className='justify-center'
              variant='outline'
              onClick={closeModal}
            >
              Annuler
            </Button>
            <Button
              type='submit'
              className='justify-center'
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Chargement…'
                : mode === 'edit'
                  ? 'Mettre à jour'
                  : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default ExpenseFormModal;

