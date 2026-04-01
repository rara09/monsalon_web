import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import getImagePath, { formatPrice } from '../../utils/helpers';
import { motion } from 'framer-motion';

// const products = [
//   { name: 'Huile Signature', price: 2400, note: 'Brillance instantanée' },
//   { name: 'Soin Réparateur', price: 1800, note: 'Anti-frizz' },
//   { name: 'Bougie Parfumée', price: 2600, note: 'Ambiance studio' },
//   { name: 'Crème Visage', price: 2200, note: 'Peaux sensibles' },
// ];

const MAX_LANDING_PRODUCTS = 8;

const LandingProducts = () => {
  const { products, loading } = useProducts();
  const visibleProducts = products.slice(0, MAX_LANDING_PRODUCTS);

  return (
    <section id='produits' className='bg-transparent'>
      <div className='mx-auto max-w-6xl px-4 py-14'>
        <div className='mb-8'>
          <div className='flex justify-between'>
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-300'>
              Produits
            </div>
            <a
              href='/auth/login'
              className='text-rose-300 font-semibold hover:underline text-sm'
            >
              Voir tout
            </a>
          </div>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight text-white'>
            Les essentiels recommandés par MG BEAUTY
          </h2>
        </div>

        <div className='grid gap-4 md:grid-cols-4'>
          {loading ? (
            <div className='col-span-4 text-center text-white/60'>
              Chargement...
            </div>
          ) : (
            visibleProducts.map((prod) => (
              <div
                key={prod.id ?? prod.name}
                className='rounded-3xl bg-white/5 p-5 shadow-sm ring-1 ring-white/10 backdrop-blur'
              >
                <div className='h-54 rounded-2xl bg-linear-to-br from-rose-200 via-orange-200 to-yellow-100'>
                  <motion.img
                    src={getImagePath(prod.image || '')}
                    alt={prod.name}
                    className='h-full w-full object-cover object-top p-3'
                    whileHover={{ scale: 1.15 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className='mt-4 space-y-1 text-center'>
                  <div className='text-sm font-semibold text-white'>{prod.name}</div>
                  <div className='text-[11px] text-white/60'>
                    {prod.description}
                  </div>
                  <div className='text-sm font-semibold text-rose-300'>
                    {formatPrice(prod.sellingPrice)}
                  </div>
                </div>
                {/* <div className='mt-4 flex items-center justify-between text-xs'>
                <span className='font-semibold text-rose-600'>Best-seller</span>
                <span className='text-slate-500'>Sans engagement</span>
              </div> */}
              </div>
            ))
          )}
        </div>

        <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-white/70'>
            Besoin d’un avis sur vos soins capillaires ou votre routine beauté ?
            Prenez rendez-vous : nous vous orientons vers les produits qui vous
            conviennent.
          </p>
          <Link to='/auth/login'>
            <span className='inline-flex w-fit items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'>
              Réserver un rendez-vous
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingProducts;
