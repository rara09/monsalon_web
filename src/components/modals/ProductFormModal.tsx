import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import {
  addProductFormData,
  updateProductFormData,
  type Product,
} from '../../services/productService';
import { useToast } from '../ui/ToastProvider';

type ProductFormData = {
  name: string;
  category: string;
  description: string;
  costPrice: number | '';
  sellingPrice: number | '';
  stockLevel: number | '';
  lowStockThreshold: number | '';
  imageFile: File | null;
};

type ProductFormModalMode = 'create' | 'edit';

const ProductFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
  mode = 'create',
  product,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  mode?: ProductFormModalMode;
  product?: Product;
}) => {
  const { toast, toastError } = useToast();

  const initialForm = useMemo<ProductFormData>(
    () => ({
      name: product?.name ?? '',
      category: product?.category ?? 'Hair',
      description: product?.description ?? '',
      costPrice: product?.costPrice ?? '',
      sellingPrice: product?.sellingPrice ?? '',
      stockLevel: product?.stockLevel ?? '',
      lowStockThreshold: product?.lowStockThreshold ?? 3,
      imageFile: null,
    }),
    [
      product?.category,
      product?.costPrice,
      product?.description,
      product?.lowStockThreshold,
      product?.name,
      product?.sellingPrice,
      product?.stockLevel,
    ],
  );

  const [form, setForm] = useState<ProductFormData>(initialForm);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'costPrice' ||
        name === 'sellingPrice' ||
        name === 'stockLevel' ||
        name === 'lowStockThreshold'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (form.imageFile) {
        const maxBytes = 5_000_000; // ~5MB (multer côté serveur)
        if (form.imageFile.size > maxBytes) {
          throw new Error(
            'Image trop lourde (max 5MB). Merci de choisir une image plus légère.',
          );
        }
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append(
        'costPrice',
        String(typeof form.costPrice === 'number' ? form.costPrice : 0),
      );
      formData.append(
        'sellingPrice',
        String(typeof form.sellingPrice === 'number' ? form.sellingPrice : 0),
      );
      formData.append(
        'stockLevel',
        String(typeof form.stockLevel === 'number' ? form.stockLevel : 0),
      );
      if (form.description.trim()) {
        formData.append('description', form.description.trim());
      }
      if (typeof form.lowStockThreshold === 'number') {
        formData.append('lowStockThreshold', String(form.lowStockThreshold));
      }
      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      if (mode === 'edit') {
        if (!product?.id)
          throw new Error('Product id manquant pour la mise à jour');
        await updateProductFormData(product.id, formData);
        toast('success', 'Produit mis à jour avec succès.');
      } else {
        await addProductFormData(formData);
        toast('success', 'Produit ajouté avec succès.');
      }

      await onSuccess?.();
      closeModal();
      setForm(initialForm);
    } catch (error) {
      toastError(error, "Impossible d'enregistrer le produit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title={mode === 'edit' ? 'Modifier le produit' : 'Ajouter un produit'}
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='grid gap-4 sm:grid-cols-2'>
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
                <option value='Hair'>Cheveux</option>
                <option value='Nails'>Ongles</option>
                <option value='Aesthetics'>Esthétique</option>
                <option value='Other'>Autres</option>
              </select>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Nom du produit
              </label>
              <input
                name='name'
                value={form.name}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                placeholder='InstaSnap Mini Retro'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Prix de vente
              </label>
              <div className='relative'>
                <input
                  type='number'
                  min={0}
                  step={5}
                  name='sellingPrice'
                  value={form.sellingPrice}
                  onChange={handleChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                  placeholder='7900'
                  required
                />
                <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400'>
                  F
                </span>
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Prix d&apos;achat
              </label>
              <div className='relative'>
                <input
                  type='number'
                  min={0}
                  step={5}
                  name='costPrice'
                  value={form.costPrice}
                  onChange={handleChange}
                  className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                  placeholder='6000'
                />
                <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400'>
                  F
                </span>
              </div>
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>
              Description
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={3}
              className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Shampooing doux pour cheveux fins'
            />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Stock
              </label>
              <input
                type='number'
                min={0}
                step={1}
                name='stockLevel'
                value={form.stockLevel}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                placeholder='10'
                required
              />
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Seuil stock faible
              </label>
              <input
                type='number'
                min={0}
                step={1}
                name='lowStockThreshold'
                value={form.lowStockThreshold}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                placeholder='5'
              />
            </div>
            <div className='w-full space-y-1.5 sm:col-span-2'>
              <label className='text-xs font-medium text-slate-700'>
                Image (fichier)
              </label>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='w-full rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 outline-none ring-rose-100 file:mr-2 file:rounded-md file:border-none file:bg-rose-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-slate-400 focus:bg-white focus:ring'
              />
              {form.imageFile && (
                <p className='pt-1 text-[11px] text-slate-500'>
                  Fichier sélectionné : {form.imageFile.name}
                </p>
              )}
              {!form.imageFile && product?.image && (
                <p className='pt-1 text-[11px] text-slate-500'>
                  Image actuelle conservée.
                </p>
              )}
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

export default ProductFormModal;
