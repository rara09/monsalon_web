import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import {
  createCatalogServiceFormData,
  updateCatalogServiceFormData,
  SERVICE_TYPE_OPTIONS,
  type CatalogServiceRow,
} from '../../services/catalogService';
import getImagePath from '../../utils/helpers';

type FormState = {
  name: string;
  type: string;
  amount: number | '';
  duration: number | '';
  description: string;
  isActive: boolean;
  imageFile: File | null;
};

type Mode = 'create' | 'edit';

export default function CatalogServiceFormModal({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  row,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: Mode;
  row?: CatalogServiceRow;
}) {
  const { toast, toastError } = useToast();

  const initialForm = useMemo<FormState>(
    () => ({
      name: row?.name ?? '',
      type: row?.type ?? SERVICE_TYPE_OPTIONS[0],
      amount: row != null ? Number(row.amount) : '',
      duration: row?.duration ?? 60,
      description: row?.description ?? '',
      isActive: row?.isActive ?? true,
      imageFile: null,
    }),
    [row],
  );

  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const t = e.target;
    const { name, value } = t;
    if (t instanceof HTMLInputElement && t.type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: t.checked }));
      return;
    }
    if (name === 'amount' || name === 'duration') {
      setForm((prev) => ({
        ...prev,
        [name]: value === '' ? '' : Number(value),
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const amount = typeof form.amount === 'number' ? form.amount : 0;
    const duration =
      typeof form.duration === 'number' && form.duration > 0
        ? form.duration
        : 60;

    if (!form.name.trim()) {
      toast('error', 'Indiquez un nom de prestation.');
      return;
    }

    if (form.imageFile) {
      const maxBytes = 5_000_000;
      if (form.imageFile.size > maxBytes) {
        toast(
          'error',
          'Image trop lourde (max 5 Mo). Merci de choisir un fichier plus léger.',
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('type', form.type);
      formData.append('amount', String(amount));
      formData.append('duration', String(duration));
      formData.append('isActive', String(form.isActive));
      if (form.description.trim()) {
        formData.append('description', form.description.trim());
      }
      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      if (mode === 'edit' && row?.id != null) {
        await updateCatalogServiceFormData(row.id, formData);
        toast('success', 'Prestation catalogue mise à jour.');
      } else {
        await createCatalogServiceFormData(formData);
        toast('success', 'Prestation catalogue ajoutée.');
      }
      closeModal();
      await onSuccess?.();
    } catch (error) {
      toastError(error, 'Enregistrement impossible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={
        mode === 'edit'
          ? 'Modifier la prestation (catalogue)'
          : 'Nouvelle prestation (catalogue)'
      }
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='catalog-name'
            className='block text-xs font-semibold text-slate-600'
          >
            Nom
          </label>
          <input
            id='catalog-name'
            name='name'
            value={form.name}
            onChange={handleChange}
            className='mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-400'
            required
          />
        </div>

        <div>
          <label
            htmlFor='catalog-type'
            className='block text-xs font-semibold text-slate-600'
          >
            Type
          </label>
          <select
            id='catalog-type'
            name='type'
            value={form.type}
            onChange={handleChange}
            className='mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-400'
          >
            {SERVICE_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label
              htmlFor='catalog-amount'
              className='block text-xs font-semibold text-slate-600'
            >
              Prix (F CFA)
            </label>
            <input
              id='catalog-amount'
              name='amount'
              type='number'
              min={0}
              step={1}
              value={form.amount === '' ? '' : form.amount}
              onChange={handleChange}
              className='mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-400'
              required
            />
          </div>
          <div>
            <label
              htmlFor='catalog-duration'
              className='block text-xs font-semibold text-slate-600'
            >
              Durée (min)
            </label>
            <input
              id='catalog-duration'
              name='duration'
              type='number'
              min={1}
              step={1}
              value={form.duration === '' ? '' : form.duration}
              onChange={handleChange}
              className='mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-400'
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='catalog-description'
            className='block text-xs font-semibold text-slate-600'
          >
            Description (optionnel)
          </label>
          <textarea
            id='catalog-description'
            name='description'
            value={form.description}
            onChange={handleChange}
            rows={3}
            className='mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-rose-400'
          />
        </div>

        <div>
          <label className='block text-xs font-semibold text-slate-600'>
            Image (optionnel)
          </label>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            className='mt-1 w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 outline-none file:mr-2 file:rounded-lg file:border-none file:bg-rose-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white'
          />
          {form.imageFile ? (
            <p className='mt-1 text-[11px] text-slate-500'>
              Fichier sélectionné : {form.imageFile.name}
            </p>
          ) : null}
          {!form.imageFile && row?.image ? (
            <div className='mt-2 flex items-center gap-3'>
              <img
                src={getImagePath(row.image)}
                alt=''
                className='h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200'
              />
              <p className='text-[11px] text-slate-500'>
                Image actuelle conservée si vous ne choisissez pas de nouveau
                fichier.
              </p>
            </div>
          ) : null}
        </div>

        <label className='flex cursor-pointer items-center gap-2 text-sm text-slate-700'>
          <input
            type='checkbox'
            name='isActive'
            checked={form.isActive}
            onChange={handleChange}
            className='rounded border-slate-300 text-rose-500 focus:ring-rose-400'
          />
          Visible sur le site (catalogue public)
        </label>

        <div className='flex justify-end gap-2 pt-2'>
          <button
            type='button'
            onClick={closeModal}
            className='rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100'
          >
            Annuler
          </button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}
