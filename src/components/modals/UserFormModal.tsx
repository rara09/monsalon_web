import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import {
  createUser,
  updateUser,
  USER_ROLE_OPTIONS,
  type UserRow,
} from '../../services/userService';

type Mode = 'create' | 'edit';

type FormState = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
};

export default function UserFormModal({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  user,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: Mode;
  user?: UserRow;
}) {
  const { toast, toastError } = useToast();
  const initialForm = useMemo<FormState>(
    () => ({
      email: user?.email ?? '',
      password: '',
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      role: user?.role ?? 'STAFF',
      isActive: user?.isActive ?? true,
    }),
    [user],
  );

  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const t = e.target;
    const { name, value } = t;
    if (t instanceof HTMLInputElement && t.type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: t.checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (mode === 'edit') {
        if (!user?.id) throw new Error('User id manquant');
        await updateUser(user.id, {
          email: form.email.trim(),
          password: form.password.trim() || undefined,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          role: form.role,
          isActive: form.isActive,
        });
        toast('success', 'Utilisateur mis à jour.');
      } else {
        await createUser({
          email: form.email.trim(),
          password: form.password,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          role: form.role,
          isActive: form.isActive,
        });
        toast('success', 'Utilisateur créé.');
      }
      closeModal();
      await onSuccess?.();
    } catch (error) {
      toastError(error, 'Impossible de sauvegarder l’utilisateur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={mode === 'edit' ? 'Modifier un utilisateur' : 'Créer un utilisateur'}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Nom</label>
            <input
              name='lastName'
              value={form.lastName}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              required
            />
          </div>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Prénom</label>
            <input
              name='firstName'
              value={form.firstName}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              required
            />
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-slate-700'>Email</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            required
          />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Rôle</label>
            <select
              name='role'
              value={form.role}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            >
              {USER_ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Mot de passe {mode === 'edit' ? '(optionnel)' : ''}
            </label>
            <input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              required={mode === 'create'}
              placeholder={mode === 'edit' ? 'Laisser vide pour ne pas changer' : ''}
            />
          </div>
        </div>

        <label className='flex cursor-pointer items-center gap-2 text-sm text-slate-700'>
          <input
            type='checkbox'
            name='isActive'
            checked={form.isActive}
            onChange={handleChange}
            className='rounded border-slate-300 text-rose-500 focus:ring-rose-400'
          />
          Compte actif
        </label>

        <div className='pt-1 mt-2 flex justify-end gap-2'>
          <Button type='button' variant='outline' onClick={closeModal}>
            Annuler
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}

