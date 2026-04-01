import {
  BaseDropdown,
  DataTable,
  PageHeader,
  ProductFormModal,
  StatCard,
} from '../components';
import { useProducts } from '../hooks/useProducts';
import {
  Boxes,
  Package2,
  Pencil,
  ShoppingBasket,
  TriangleAlert,
  Trash2,
} from 'lucide-react';
import type { Product } from '../services/productService';
import { deleteProduct } from '../services/productService';
import { useState } from 'react';
import { useToast } from '../components/ui/ToastProvider';
import getImagePath from '../utils/helpers';

function formatMoney(value: number | string) {
  const n = Number(value ?? 0);
  return `${n.toLocaleString('fr-FR')} F`;
}

function categoryLabel(category?: string) {
  switch (category) {
    case 'Hair':
      return 'Cheveux';
    case 'Nails':
      return 'Ongles';
    case 'Aesthetics':
      return 'Esthétique';
    case 'Other':
      return 'Autres';
    default:
      return category || 'Catégorie';
  }
}

const StockPage = () => {
  const { products, loading, refetch } = useProducts();
  const { toast, toastError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stockLevel ?? 0),
    0,
  );
  const lowStockCount = products.filter((p) => {
    const threshold = Number(p.lowStockThreshold ?? 3);
    return (
      Number(p.stockLevel ?? 0) > 0 && Number(p.stockLevel ?? 0) <= threshold
    );
  }).length;
  const outOfStockCount = products.filter(
    (p) => Number(p.stockLevel ?? 0) === 0,
  ).length;

  function openCreateModal() {
    setModalMode('create');
    setSelectedProduct(undefined);
    setIsOpen(true);
  }

  function openEditModal(product: Product) {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleDelete(product: Product) {
    if (!product.id) return;
    if (deletingId === product.id) return;

    const ok = window.confirm(
      `Supprimer le produit "${product.name}" ? Cette action est irréversible.`,
    );
    if (!ok) return;

    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
      await refetch();
      toast('success', 'Produit supprimé avec succès.');
    } catch (error) {
      toastError(error, 'Impossible de supprimer le produit.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Stock'
        subtitle='Gestion de votre stock : produits, quantités et disponibilité.'
      />

      <ProductFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={modalMode}
        product={selectedProduct}
        onSuccess={refetch}
      />

      <section className='grid gap-4 md:grid-cols-4'>
        <StatCard
          icon={<Package2 className='h-5 w-5' />}
          label='Produits'
          value={totalProducts.toLocaleString('fr-FR')}
          iconWrapClassName='bg-indigo-100'
          iconClassName='text-indigo-600'
        />
        <StatCard
          icon={<Boxes className='h-5 w-5' />}
          label='Quantité totale'
          value={totalStock.toLocaleString('fr-FR')}
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-600'
        />
        <StatCard
          icon={<TriangleAlert className='h-5 w-5' />}
          label='Stock faible'
          value={lowStockCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-amber-100'
          iconClassName='text-amber-600'
        />
        <StatCard
          icon={<ShoppingBasket className='h-5 w-5' />}
          label='Ruptures'
          value={outOfStockCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-rose-100'
          iconClassName='text-rose-600'
        />
      </section>

      <section className='space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='space-y-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-wrap gap-2'>
              <div className='hidden max-w-xs flex-1 items-center rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-200 focus-within:ring-rose-400 md:flex'>
                <span className='mr-2'>🔍</span>
                <input
                  className='w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400'
                  placeholder='Rechercher un produit...'
                />
              </div>
            </div>
            <button
              type='button'
              onClick={openCreateModal}
              className='inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'
            >
              Nouveau produit
            </button>
          </div>

          <DataTable
            caption='Liste des produits'
            columns={[
              { label: 'Produit' },
              { label: 'Catégorie' },
              { label: 'Stock', align: 'right' },
              { label: 'Statut' },
              { label: 'Prix', align: 'right' },
              { label: 'Actions', align: 'right' },
            ]}
            minWidthClassName='min-w-[920px]'
          >
            {loading ? (
              <tr>
                <td colSpan={6} className='px-4 py-6 text-slate-500'>
                  Chargement…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-4 py-10 text-slate-500'>
                  Aucun produit pour le moment.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stock = Number(product.stockLevel ?? 0);
                const threshold = Number(product.lowStockThreshold ?? 3);
                const isOut = stock === 0;
                const isLow = !isOut && stock <= threshold;
                const statusLabel = isOut
                  ? 'À commander'
                  : isLow
                    ? 'Prévoir réassort'
                    : 'OK';

                const statusClass = isOut
                  ? 'bg-rose-50 text-rose-600'
                  : isLow
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-emerald-50 text-emerald-700';

                return (
                  <tr
                    key={product.id ?? product.name}
                    className='hover:bg-slate-50/60'
                  >
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200'>
                          {product.image ? (
                            <img
                              src={getImagePath(product.image)}
                              alt={product.name}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center text-slate-300'>
                              <Package2 className='h-5 w-5' />
                            </div>
                          )}
                        </div>
                        <div className='min-w-0'>
                          <div className='truncate font-medium text-slate-900'>
                            {product.name}
                          </div>
                          <div className='truncate text-[11px] text-slate-500'>
                            {product.description || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className='px-4 py-3 text-slate-600'>
                      {categoryLabel(product.category)}
                    </td>

                    <td className='px-4 py-3 text-right'>
                      <span
                        className={`font-semibold ${
                          isOut
                            ? 'text-rose-600'
                            : isLow
                              ? 'text-amber-700'
                              : 'text-slate-900'
                        }`}
                      >
                        {stock.toLocaleString('fr-FR')}
                      </span>
                    </td>

                    <td className='px-4 py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
                      >
                        {statusLabel}
                      </span>
                    </td>

                    <td className='px-4 py-3 text-right font-semibold text-slate-900'>
                      {formatMoney(product.sellingPrice)}
                    </td>

                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end'>
                        <BaseDropdown
                          items={[
                            {
                              label: 'Modifier',
                              icon: <Pencil className='h-4 w-4' />,
                              onClick: () => openEditModal(product),
                            },
                            {
                              label: 'Supprimer',
                              icon: <Trash2 className='h-4 w-4' />,
                              onClick: () => void handleDelete(product),
                            },
                          ]}
                          btnChildren={null}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </DataTable>
        </div>
      </section>
    </section>
  );
};

export default StockPage;
