import { Link } from 'react-router-dom';

const products = [
  { name: 'Huile Signature', price: 2400, note: 'Brillance instantanée' },
  { name: 'Soin Réparateur', price: 1800, note: 'Anti-frizz' },
  { name: 'Bougie Parfumée', price: 2600, note: 'Ambiance studio' },
  { name: 'Crème Visage', price: 2200, note: 'Peaux sensibles' },
];

function formatPrice(value: number) {
  return `${value.toLocaleString('fr-FR')} F CFA`;
}

const LandingProducts = () => {
  return (
    <section id='produits' className='bg-slate-50'>
      <div className='mx-auto max-w-6xl px-4 py-14'>
        <div className='mb-8'>
          <div className='flex justify-between'>
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-600'>
              nos produits
            </div>
            <a
              href='/auth/login'
              className='text-rose-500 font-semibold hover:underline text-sm'
            >
              Voir tout
            </a>
          </div>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
            Les essentiels du salon
          </h2>
        </div>

        <div className='grid gap-4 md:grid-cols-4'>
          {products.map((prod) => (
            <div
              key={prod.name}
              className='rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200'
            >
              <div className='h-40 rounded-2xl bg-linear-to-br from-rose-200 via-orange-200 to-yellow-100' />
              <div className='mt-4 space-y-1'>
                <div className='text-sm font-semibold'>{prod.name}</div>
                <div className='text-[11px] text-slate-500'>{prod.note}</div>
                <div className='text-sm font-semibold text-slate-900'>
                  {formatPrice(prod.price)}
                </div>
              </div>
              <div className='mt-4 flex items-center justify-between text-xs'>
                <span className='font-semibold text-rose-600'>Best-seller</span>
                <span className='text-slate-500'>Sans engagement</span>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-slate-600'>
            Vous souhaitez un conseil produit ? Réservez votre rendez-vous et
            repartez avec une recommandation adaptée.
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
