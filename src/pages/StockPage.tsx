import {
  BaseDropdown,
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<
    'all' | 'in' | 'out'
  >('all');

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stockLevel ?? 0),
    0,
  );
  const lowStockCount = products.filter((p) => {
    const threshold = p.lowStockAlert ?? 3;
    return (
      Number(p.stockLevel ?? 0) > 0 && Number(p.stockLevel ?? 0) <= threshold
    );
  }).length;
  const outOfStockCount = products.filter(
    (p) => Number(p.stockLevel ?? 0) === 0,
  ).length;

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean) as string[]),
  );

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

  const filteredProducts = products.filter((p) => {
    const stock = Number(p.stockLevel ?? 0);
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (availabilityFilter === 'in' && stock <= 0) return false;
    if (availabilityFilter === 'out' && stock > 0) return false;
    return true;
  });

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
        <div className='flex flex-col gap-4 lg:flex-row'>
          <aside className='w-full space-y-4 rounded-2xl bg-slate-50 p-4 lg:w-64'>
            {/* <h2 className='text-sm font-semibold text-slate-900'>Filtres</h2> */}

            <div className='space-y-2'>
              <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                Catégories
              </p>
              <button
                type='button'
                onClick={() => setCategoryFilter('all')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${
                  categoryFilter === 'all'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Tous les produits</span>
                <span className='text-xs opacity-80'>
                  {totalProducts.toLocaleString('fr-FR')}
                </span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type='button'
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${
                    categoryFilter === cat
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{categoryLabel(cat)}</span>
                </button>
              ))}
            </div>

            <div className='space-y-2'>
              <p className='text-[11px] font-semibold uppercase tracking-wide text-slate-400'>
                Disponibilité
              </p>
              <label className='flex items-center gap-2 text-xs text-slate-700'>
                <input
                  type='radio'
                  name='availability'
                  className='h-3.5 w-3.5 accent-rose-500'
                  checked={availabilityFilter === 'all'}
                  onChange={() => setAvailabilityFilter('all')}
                />
                Tous
              </label>
              <label className='flex items-center gap-2 text-xs text-slate-700'>
                <input
                  type='radio'
                  name='availability'
                  className='h-3.5 w-3.5 accent-rose-500'
                  checked={availabilityFilter === 'in'}
                  onChange={() => setAvailabilityFilter('in')}
                />
                En stock
              </label>
              <label className='flex items-center gap-2 text-xs text-slate-700'>
                <input
                  type='radio'
                  name='availability'
                  className='h-3.5 w-3.5 accent-rose-500'
                  checked={availabilityFilter === 'out'}
                  onChange={() => setAvailabilityFilter('out')}
                />
                Rupture
              </label>
            </div>
          </aside>

          <div className='flex-1 space-y-4'>
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

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {loading ? (
                <div className='col-span-full px-2 py-6 text-sm text-slate-500'>
                  Chargement…
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className='col-span-full px-2 py-10 text-sm text-slate-500'>
                  Aucun produit ne correspond aux filtres sélectionnés.
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const stock = Number(product.stockLevel ?? 0);
                  const threshold = product.lowStockAlert ?? 3;
                  const isOut = stock === 0;
                  const isLow = !isOut && stock <= threshold;

                  return (
                    <article
                      key={product.id ?? product.name}
                      className='flex h-full flex-col rounded-2xl border border-slate-100 bg-slate-50/80 shadow-sm'
                    >
                      <div className='relative h-40 w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50'>
                        {product.image ? (
                          <img
                            src={getImagePath(product.image)}
                            alt={product.name}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-slate-300'>
                            <Package2 className='h-10 w-10' />
                          </div>
                        )}
                        {isOut && (
                          <span className='absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white'>
                            Rupture
                          </span>
                        )}
                        {isLow && !isOut && (
                          <span className='absolute left-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white'>
                            Stock faible
                          </span>
                        )}
                      </div>

                      <div className='flex flex-1 flex-col gap-2 px-4 py-3'>
                        <p className='text-[11px] font-semibold uppercase tracking-wide text-rose-500'>
                          {categoryLabel(product.category) || 'Produit'}
                        </p>
                        <h3 className='line-clamp-2 text-sm font-semibold text-slate-900'>
                          {product.name}
                        </h3>

                        <div className='mt-1 flex items-center justify-between text-xs'>
                          <span className='text-slate-500'>
                            {stock > 0 ? `En stock : ${stock}` : 'Épuisé'}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              isOut
                                ? 'bg-rose-50 text-rose-600'
                                : isLow
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isOut
                              ? 'À commander'
                              : isLow
                                ? 'Prévoir réassort'
                                : 'OK'}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm'>
                        <span className='font-semibold text-slate-900'>
                          {formatMoney(product.sellingPrice)}
                        </span>
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
                    </article>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default StockPage;
