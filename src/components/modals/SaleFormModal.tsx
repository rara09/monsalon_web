import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import { useClients } from '../../hooks/useClients';
import { useProducts } from '../../hooks/useProducts';
import { addSale, type CreateSalePayload } from '../../services/saleService';

type SaleFormItem = {
  productId: string;
  quantity: number | '';
  unitPrice: number | '';
};

type SaleFormData = {
  paymentMethod: string;
  clientId: string;
  items: SaleFormItem[];
};

const emptyItem: SaleFormItem = {
  productId: '',
  quantity: 1,
  unitPrice: '',
};

const SaleFormModal = ({
  isOpen,
  closeModal,
  onSuccess,
}: {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
}) => {
  const { toast, toastError } = useToast();
  const { clients } = useClients();
  const { products } = useProducts();

  const initialForm = useMemo<SaleFormData>(
    () => ({
      paymentMethod: 'Espèces',
      clientId: '',
      items: [emptyItem],
    }),
    [],
  );

  const [form, setForm] = useState<SaleFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const handleItemChange = (
    index: number,
    field: keyof SaleFormItem,
    value: string,
  ) => {
    setForm((prev) => {
      const next = [...prev.items];
      const item = { ...next[index] };
      if (field === 'quantity' || field === 'unitPrice') {
        (item as any)[field] = value === '' ? '' : Number(value);
      } else {
        (item as any)[field] = value;
        if (field === 'productId') {
          const p = products.find((prod) => String(prod.id) === value);
          if (p) {
            item.unitPrice =
              item.unitPrice === '' ? Number(p.sellingPrice ?? 0) : item.unitPrice;
          }
        }
      }
      next[index] = item;
      return { ...prev, items: next };
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem] }));
  };

  const removeItemRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length === 1 ? prev.items : prev.items.filter((_, i) => i !== index),
    }));
  };

  const totalAmount = form.items.reduce((sum, it) => {
    const q = typeof it.quantity === 'number' ? it.quantity : 0;
    const u = typeof it.unitPrice === 'number' ? it.unitPrice : 0;
    return sum + q * u;
  }, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: CreateSalePayload = {
        paymentMethod: form.paymentMethod,
        clientId: form.clientId ? Number(form.clientId) : null,
        items: form.items
          .filter((it) => it.productId && it.quantity && it.unitPrice)
          .map((it) => ({
            productId: Number(it.productId),
            quantity:
              typeof it.quantity === 'number' ? it.quantity : Number(it.quantity),
            unitPrice:
              typeof it.unitPrice === 'number' ? it.unitPrice : Number(it.unitPrice),
          })),
      };

      await addSale(payload);
      toast('success', 'Vente enregistrée avec succès.');
      await onSuccess?.();
      closeModal();
      setForm(initialForm);
    } catch (error) {
      toastError(error, "Impossible d'enregistrer la vente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title='Nouvelle vente'
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Moyen de paiement
              </label>
              <select
                name='paymentMethod'
                value={form.paymentMethod}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              >
                <option value='Espèces'>Espèces</option>
                <option value='Carte'>Carte</option>
                <option value='Mobile Money'>Mobile Money</option>
              </select>
            </div>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Client (optionnel)
              </label>
              <select
                name='clientId'
                value={form.clientId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              >
                <option value=''>Client de passage</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {`${c.firstName} ${c.lastName}`.trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Articles
              </p>
              <Button
                type='button'
                variant='outline'
                className='h-7 px-2 text-xs'
                onClick={addItemRow}
              >
                Ajouter un article
              </Button>
            </div>

            <div className='space-y-3'>
              {form.items.map((item, index) => (
                <div
                  key={index}
                  className='grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]'
                >
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, 'productId', e.target.value)
                    }
                    className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none ring-rose-100 focus:ring'
                    required
                  >
                    <option value=''>Sélectionner un produit</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type='number'
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', e.target.value)
                    }
                    className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none ring-rose-100 focus:ring'
                    placeholder='Qté'
                    required
                  />
                  <input
                    type='number'
                    min={0}
                    step={100}
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, 'unitPrice', e.target.value)
                    }
                    className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none ring-rose-100 focus:ring'
                    placeholder='Prix'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => removeItemRow(index)}
                    className='text-xs text-rose-500 hover:text-rose-600'
                  >
                    Suppr.
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='flex items-center justify-between border-t border-slate-200 pt-3 text-sm'>
            <span className='text-slate-600'>Total</span>
            <span className='text-lg font-semibold text-slate-900'>
              {totalAmount.toLocaleString('fr-FR')} F
            </span>
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
              {isSubmitting ? 'Enregistrement…' : 'Enregistrer la vente'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default SaleFormModal;

