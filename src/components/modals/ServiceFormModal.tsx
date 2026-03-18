import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import {
  addService,
  updateService,
  type SalonService,
} from '../../services/serviceService';
import { useToast } from '../ui/ToastProvider';
import { useClients } from '../../hooks/useClients';

type ServiceFormData = {
  name: string;
  type: string;
  amount: number | '';
  paymentMethod: string;
  serviceDate: string;
  clientId: string;
};

type ServiceFormModalMode = 'create' | 'edit';

const ServiceFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  service,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: ServiceFormModalMode;
  service?: SalonService;
}) => {
  const { toast, toastError } = useToast();
  const { clients } = useClients();

  const initialForm = useMemo<ServiceFormData>(
    () => ({
      name: service?.name ?? '',
      type: service?.type ?? '',
      amount: service?.amount ?? '',
      paymentMethod: service?.paymentMethod ?? 'Espèces',
      serviceDate: service?.serviceDate
        ? service.serviceDate.slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      clientId: service?.clientId ? String(service.clientId) : '',
    }),
    [
      service?.amount,
      service?.clientId,
      service?.name,
      service?.paymentMethod,
      service?.serviceDate,
      service?.type,
    ],
  );

  const [form, setForm] = useState<ServiceFormData>(initialForm);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: SalonService = {
        name: form.name,
        type: form.type,
        amount: typeof form.amount === 'number' ? form.amount : 0,
        paymentMethod: form.paymentMethod,
        serviceDate: new Date(form.serviceDate).toISOString(),
        clientId: form.clientId ? Number(form.clientId) : undefined,
      };

      if (mode === 'edit') {
        if (!service?.id)
          throw new Error('Service id manquant pour la mise à jour');
        await updateService(service.id, payload);
        toast('success', 'Prestation mise à jour avec succès.');
      } else {
        await addService(payload);
        toast('success', 'Prestation ajoutée avec succès.');
      }

      await onSuccess?.();
      closeModal();
      setForm(initialForm);
    } catch (error) {
      toastError(error, "Impossible d'enregistrer la prestation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={
        mode === 'edit' ? 'Modifier la prestation' : 'Ajouter une prestation'
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Nom de la prestation
            </label>
            <input
              name='name'
              value={form.name}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Coupe Homme'
              required
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Type</label>
            <select
              name='type'
              value={form.type}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              required
            >
              <option value='' disabled>
                Sélectionnez un type
              </option>
              <option value='Coupe'>Coupe</option>
              <option value='Coloration'>Coloration</option>
              <option value='Soin'>Soin</option>
              <option value='Brushing'>Brushing</option>
              <option value='Autre'>Autre</option>
            </select>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Tarif</label>
            <div className='relative'>
              <input
                type='number'
                min={0}
                step={1}
                name='amount'
                value={form.amount}
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

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Moyen de paiement
            </label>
            <select
              name='paymentMethod'
              value={form.paymentMethod}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              required
            >
              <option value='Espèces'>Espèces</option>
              <option value='Carte'>Carte</option>
              <option value='Mobile Money'>Mobile Money</option>
              <option value='Autre'>Autre</option>
            </select>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Date &amp; heure
              </label>
              <input
                type='datetime-local'
                name='serviceDate'
                value={form.serviceDate}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Client
              </label>
              <select
                name='clientId'
                value={form.clientId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              >
                <option value=''>Aucun client</option>
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

export default ServiceFormModal;
