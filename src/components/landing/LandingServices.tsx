const prestations = [
  {
    title: 'Coupe & Forme',
    duration: '45 min',
    description: 'Une coupe sur mesure, adaptée à votre style.',
    price: 6625,
  },
  {
    title: 'Soin Visage',
    duration: '30 min',
    description: 'Hydratation, éclat et confort immédiat.',
    price: 4050,
  },
  {
    title: 'Coloration',
    duration: '1h30',
    description: 'Reflets naturels et finition professionnelle.',
    price: 10500,
  },
];

const LandingServices = () => {
  return (
    <section id='prestations' className='mx-auto max-w-6xl px-4 py-14'>
      <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div className='text-xs font-semibold uppercase tracking-wide text-rose-600'>
            Nos prestations
          </div>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight'>
            Des rendez-vous pensés pour vous
          </h2>
        </div>
        <div className='text-end'>
          <a
            href='/auth/login'
            className='text-rose-500 font-semibold hover:underline text-sm'
          >
            Voir tout
          </a>
          <p className='max-w-md text-sm text-slate-600'>
            Choisissez une prestation, puis ajustez votre rendez-vous en 2
            minutes.
          </p>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {prestations.map((p, idx) => (
          <div
            key={p.title}
            className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
          >
            <div className='absolute right-0 top-0 h-6 text-slate-500 w-auto rounded-bl-2xl bg-rose-50 text-sm px-3'>
              À partir de{' '}
              <span className='text-rose-500 font-semibold'>{p.price} F</span>
            </div>
            <div className='h-64 rounded-2xl bg-linear-to-br from-rose-200 via-fuchsia-200 to-indigo-200' />

            <div className='mt-4 px-3 flex items-start justify-between gap-4'>
              <div className='space-y-1'>
                <div className='text-sm font-semibold text-slate-900'>
                  {p.title}
                </div>
                {/* <div className='text-[11px] font-medium text-slate-500'>
                  {p.duration}
                </div> */}
              </div>
              <div className='rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600'>
                #{idx + 1}
              </div>
            </div>

            <p className='mt-3 px-3 text-sm text-slate-600'>{p.description}</p>

            <div className='my-5 px-3 flex items-center justify-between'>
              <a
                href='/auth/login'
                className='text-xs font-semibold text-slate-600 hover:text-slate-900'
              >
                Durée → {p.duration}
              </a>
              <span className='inline-flex items-center gap-2 text-xs font-semibold text-rose-600'>
                <span className='h-2 w-2 rounded-full bg-rose-500' />
                Prendre RDV
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingServices;
