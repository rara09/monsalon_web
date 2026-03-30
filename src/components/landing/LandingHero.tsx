import { Link } from 'react-router-dom';

const LandingHero = () => {
  return (
    <section className='relative overflow-hidden'>
      <div
        className='absolute inset-0'
        // style={{
        //   background:
        //     'radial-gradient(1200px circle at 70% 15%, rgba(236,72,153,0.22), transparent 55%), radial-gradient(900px circle at 20% 30%, rgba(124,58,237,0.16), transparent 52%), linear-gradient(180deg, #0f172a 0%, #0b1224 45%, #ffffff 100%)',
        // }}
        // style={{
        //   background: 'linear-gradient(180deg, #0f172a 0%, #0b1224 45%, #ffffff 100%), url(/img/makeup_woman.jpg)',
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'right',
        //   backgroundAttachment: 'fixed',
        // }}
        style={{
          background: `
    linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(11,18,36,0.6) 45%, rgba(255,255,255,0.3) 100%),
    url(/img/makeup_woman.jpg)
  `,
          backgroundSize: 'cover',
          backgroundPosition: 'right',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className='absolute -left-24 top-0 h-140 w-140 rounded-full bg-rose-500/30 blur-3xl' />

      <div className='relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-20'>
        <div className='space-y-5'>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15'>
            <span className='inline-flex h-2 w-2 rounded-full bg-rose-300' />
            Salon de coiffure et d'esthetique
          </div>

          <h1 className='text-4xl font-semibold tracking-tight text-white md:text-5xl'>
            Révélez votre beauté naturelle
          </h1>

          <p className='max-w-xl text-sm leading-relaxed text-white/75 md:text-base'>
            Un studio pensé pour sublimer vos cheveux et votre peau, avec des
            prestations personnalisées et un suivi soigné.
          </p>

          <div className='flex flex-wrap gap-2'>
            <Link to='/auth/login'>
              <span className='inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'>
                Prendre rendez-vous
              </span>
            </Link>
            <a
              href='#prestations'
              className='rounded-full border border-white/25 bg-white/5 px-5 py-2 text-sm font-semibold text-white/90 hover:bg-white/10'
            >
              Découvrir nos prestations
            </a>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-3 text-white/80 sm:grid-cols-4'>
            {[
              { k: '5+ ans', v: 'expérience' },
              { k: '100%', v: 'conseil sur mesure' },
              { k: '08:00-20:00', v: 'horaires studio' },
              { k: 'Pro', v: 'produits de qualités' },
            ].map((m) => (
              <div
                key={m.k}
                className='rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10'
              >
                <div className='text-sm font-semibold text-white'>{m.k}</div>
                <div className='text-[11px]'>{m.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className='hidden md:block relative'>
          <div className='aspect-4/3 w-full overflow-hidden rounded-3xl bg-linear-to-br from-rose-600 via-fuchsia-600 to-indigo-700 ring-1 ring-white/10 shadow-sm'>
            <div className='h-full w-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.28),transparent_40%),radial-gradient(circle_at_70%_55%,rgba(0,0,0,0.25),transparent_40%)]' />
            <img
              className='h-full w-full object-cover object-top'
              src='/img/makeup_woman.jpg'
            />
          </div>

          <div className='pointer-events-none absolute -bottom-6 -right-6 h-40 w-40 rounded-full bg-white/10 blur-2xl' />

          <div className='absolute left-4 top-4 rounded-2xl bg-white/10 p-3 text-white ring-1 ring-white/15'>
            <div className='flex items-center gap-2'>
              <span className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-500/70'>
                ✂
              </span>
              <div>
                <div className='text-xs font-semibold'>
                  {import.meta.env.VITE_APP_NAME}
                </div>
                <div className='text-[11px] text-white/70'>
                  Coiffure & esthétique
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default LandingHero;
