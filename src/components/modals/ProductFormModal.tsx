import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import {
  addProduct,
  updateProduct,
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
  imageDataUrl: string;
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

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Impossible de lire le fichier image'));
      reader.readAsDataURL(file);
    });

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
      imageDataUrl: '',
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
    setForm((prev) => ({ ...prev, imageFile: file, imageDataUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let image: string | null | undefined = product?.image ?? undefined;

      if (form.imageFile) {
        // Backend expects a string. We store the image as a Data URL (base64).
        // Keep it reasonably small to avoid huge JSON payloads.
        const maxBytes = 2_000_000; // ~2MB
        if (form.imageFile.size > maxBytes) {
          throw new Error(
            "Image trop lourde (max 2MB). Merci de choisir une image plus légère.",
          );
        }
        const dataUrl = await fileToDataUrl(form.imageFile);
        image = dataUrl || undefined;
      }

      const payload: Product = {
        category: form.category,
        name: form.name,
        description: form.description || undefined,
        costPrice: typeof form.costPrice === 'number' ? form.costPrice : 0,
        sellingPrice:
          typeof form.sellingPrice === 'number' ? form.sellingPrice : 0,
        stockLevel: typeof form.stockLevel === 'number' ? form.stockLevel : 0,
        lowStockThreshold:
          typeof form.lowStockThreshold === 'number'
            ? form.lowStockThreshold
            : undefined,
        image,
      };

      console.log(payload);

      if (mode === 'edit') {
        if (!product?.id)
          throw new Error('Product id manquant pour la mise à jour');
        await updateProduct(product.id, payload);
        toast('success', 'Produit mis à jour avec succès.');
      } else {
        await addProduct(payload);
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
