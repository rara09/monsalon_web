import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { addClient, updateClient } from '../../services/clientService';
import type { Client } from '../../types/userType';
import { useToast } from '../ui/ToastProvider';

type ClientFormData = {
  firstName: string;
  lastName: string;
  phone: string;
};

type ClientFormModalMode = 'create' | 'edit';

const ClientFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  client,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: ClientFormModalMode;
  client?: Client;
}) => {
  const { toast, toastError } = useToast();
  const initialForm = useMemo<ClientFormData>(
    () => ({
      firstName: client?.firstName ?? '',
      lastName: client?.lastName ?? '',
      phone: client?.phone ?? '',
    }),
    [client?.firstName, client?.lastName, client?.phone],
  );

  const [form, setForm] = useState<ClientFormData>(initialForm);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (mode === 'edit') {
        if (!client?.id) throw new Error('Client id manquant pour la mise à jour');
        await updateClient(client.id, form);
        toast('success', 'Client mis à jour avec succès.');
      } else {
        await addClient(form);
        toast('success', 'Client ajouté avec succès.');
      }
      await onSuccess?.();
      closeModal();
      setForm({ firstName: '', lastName: '', phone: '' });
    } catch (error) {
      toastError(error, "Impossible d'enregistrer le client.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <BaseModal
      title={mode === 'edit' ? 'Modifier le client' : 'Ajouter un nouveau client'}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Nom</label>
              <input
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                placeholder='Dupont'
                required
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Prénom
              </label>
              <input
                name='firstName'
                value={form.firstName}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                placeholder='Jean'
                required
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Téléphone
            </label>
            <input
              type='tel'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='06 12 34 56 78'
              required
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

export default ClientFormModal;
