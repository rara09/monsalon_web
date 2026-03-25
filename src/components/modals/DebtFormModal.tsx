import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import { useClients } from '../../hooks/useClients';
import { useServices } from '../../hooks/useServices';
import { useSales } from '../../hooks/useSales';
import {
  addDebt,
  updateDebt,
  type CreateDebtPayload,
  type Debt,
} from '../../services/debtService';

type DebtFormData = {
  totalAmount: number | '';
  clientId: string;
  serviceId: string;
  saleId: string;
  dueDate: string;
  notes: string;
};

type DebtFormModalMode = 'create' | 'edit';

const DebtFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  debt,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: DebtFormModalMode;
  debt?: Debt;
}) => {
  const { toast, toastError } = useToast();
  const { clients } = useClients();
  const { services } = useServices();
  const { sales } = useSales();

  const initialForm = useMemo<DebtFormData>(
    () => ({
      totalAmount: debt?.totalAmount ?? '',
      clientId: debt?.clientId ? String(debt.clientId) : '',
      serviceId: debt?.serviceId ? String(debt.serviceId) : '',
      saleId: debt?.saleId ? String(debt.saleId) : '',
      dueDate: debt?.dueDate ? debt.dueDate : new Date().toDateString(),
      notes: debt?.notes ?? '',
    }),
    [
      debt?.clientId,
      debt?.dueDate,
      debt?.notes,
      debt?.saleId,
      debt?.serviceId,
      debt?.totalAmount,
    ],
  );

  const [form, setForm] = useState<DebtFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'totalAmount' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: CreateDebtPayload = {
        totalAmount:
          typeof form.totalAmount === 'number' ? form.totalAmount : 0,
        clientId: Number(form.clientId),
        serviceId: form.serviceId ? Number(form.serviceId) : undefined,
        saleId: form.saleId ? Number(form.saleId) : undefined,
        dueDate: form.dueDate,
        notes: form.notes || undefined,
      };
      console.log(payload);

      if (mode === 'edit') {
        if (!debt?.id) throw new Error('Debt id manquant pour la mise à jour');
        await updateDebt(debt.id, payload);
        toast('success', 'Dette mise à jour avec succès.');
      } else {
        await addDebt(payload);
        toast('success', 'Dette ajoutée avec succès.');
      }

      await onSuccess?.();
      closeModal();
      setForm(initialForm);
    } catch (error) {
      toastError(error, "Impossible d'enregistrer la dette.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={
        mode === 'edit' ? 'Modifier la dette' : 'Ajouter une nouvelle dette'
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Client
              </label>
              <select
                name='clientId'
                value={form.clientId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              >
                <option value=''>Sélectionnez un client</option>
                {clients.map((c) => (
                  <option
                    key={c.id ?? `${c.firstName}-${c.lastName}`}
                    value={c.id}
                  >
                    {`${c.firstName} ${c.lastName}`.trim()}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Montant total
              </label>
              <div className='relative'>
                <input
                  type='number'
                  min={0}
                  step={1}
                  name='totalAmount'
                  value={form.totalAmount}
                  onChange={handleChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                  placeholder='2500'
                  required
                />
                <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400'>
                  F
                </span>
              </div>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Liée à une prestation
              </label>
              <select
                name='serviceId'
                value={form.serviceId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              >
                <option value=''>Aucune</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Liée à une vente
              </label>
              <select
                name='saleId'
                value={form.saleId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              >
                <option value=''>Aucune</option>
                {sales.map((s) => (
                  <option key={s.id} value={s.id}>
                    Vente #{s.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Échéance
              </label>
              <input
                type='date'
                name='dueDate'
                value={form.dueDate}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Notes</label>
            <textarea
              name='notes'
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Détails supplémentaires sur la dette...'
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

export default DebtFormModal;
