import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getProducts, type Product } from '../services/productService';
import getImagePath, { formatPrice } from '../utils/helpers';
import PublicJumbotron from '../components/public/PublicJumbotron';

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
      return category || '—';
  }
}

export default function PublicProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getProducts();
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) {
          setProducts([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => s.add(p.category || 'Other'));
    return Array.from(s).sort();
  }, [products]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category && (p.category || 'Other') !== category) return false;
      if (!q) return true;
      const blob = `${p.name} ${p.description ?? ''} ${p.category}`.toLowerCase();
      return blob.includes(q);
    });
  }, [products, query, category]);

  return (
    <main className='pb-16'>
      <PublicJumbotron
        eyebrow='Boutique'
        title='Tous nos produits'
        subtitle='Sélection disponible au salon. Demandez conseil lors de votre rendez-vous pour choisir ce qui vous convient.'
        imageSrc='/img/slides/slider1.jpg'
      />

      <div className='mx-auto max-w-6xl px-4 pt-10'>
        <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative max-w-md flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40' />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Rechercher un produit…'
              className='w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none ring-rose-400/20 placeholder:text-white/35 focus:border-rose-400/30'
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs text-white/45'>Catégorie :</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-rose-400/30'
            >
              <option value=''>Toutes</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className='mt-14 text-center text-sm text-white/50'>Chargement…</p>
        ) : error ? (
          <p className='mt-14 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-white/65'>
            Impossible de charger les produits pour le moment.
          </p>
        ) : filtered.length === 0 ? (
          <p className='mt-14 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-white/65'>
            Aucun produit ne correspond à votre recherche.
          </p>
        ) : (
          <motion.ul
            className='mt-10 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {filtered.map((prod) => (
              <li key={prod.id ?? prod.name}>
                <article className='group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-4 ring-1 ring-white/5 backdrop-blur transition hover:border-rose-400/25'>
                  <div className='relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-rose-200/20 via-orange-200/10 to-amber-100/10'>
                    <motion.img
                      src={getImagePath(prod.image || '')}
                      alt={prod.name}
                      className='h-full w-full object-cover object-top p-2'
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                  <div className='mt-4 flex flex-1 flex-col text-center'>
                    <span className='text-[10px] font-semibold uppercase tracking-wide text-rose-300/90'>
                      {categoryLabel(prod.category)}
                    </span>
                    <h2 className='mt-1 text-sm font-semibold text-white'>
                      {prod.name}
                    </h2>
                    {prod.description ? (
                      <p className='mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/55'>
                        {prod.description}
                      </p>
                    ) : null}
                    <p className='mt-auto pt-3 text-base font-semibold text-rose-300'>
                      {formatPrice(prod.sellingPrice)}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </motion.ul>
        )}

        <div className='mt-12 flex flex-wrap items-center justify-center gap-3'>
          <Link
            to='/#reservation'
            className='inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
          >
            Prendre rendez-vous
          </Link>
          <Link
            to='/catalogue'
            className='inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10'
          >
            Voir le catalogue prestations
          </Link>
        </div>
      </div>
    </main>
  );
}
