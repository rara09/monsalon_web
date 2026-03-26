import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <section id='experience' className='mx-auto max-w-6xl px-4 py-14'>
      <div className='grid gap-8 md:grid-cols-2 md:items-center'>
        <div className='relative'>
          <div className='grid grid-cols-2 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='aspect-square rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-rose-600'
              >
                <div className='h-full w-full rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_45%)]' />
              </div>
            ))}
          </div>

          <div className='absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-rose-500/20 blur-2xl' />
        </div>

        <div className='space-y-4'>
          <div className='text-xs font-semibold uppercase tracking-wide text-rose-600'>
            L&apos;expérience
          </div>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Un studio élégant, des soins vraiment personnalisés
          </h2>
          <p className='text-sm text-slate-600 leading-relaxed'>
            De la prise de rendez-vous au suivi après la prestation, notre
            promesse est simple : vous faire gagner du temps et vous offrir une
            expérience premium.
          </p>

          <div className='grid gap-3 sm:grid-cols-2'>
            {[
              {
                t: 'Diagnostic rapide',
                d: 'On cible vos besoins dès le départ.',
              },
              {
                t: 'Produits sélectionnés',
                d: 'Des formules adaptées à vos attentes.',
              },
              {
                t: 'Durées maîtrisées',
                d: 'Pour planifier sereinement votre journée.',
              },
              {
                t: 'Résultats visibles',
                d: 'Une finition soignée, du premier coup.',
              },
            ].map((item) => (
              <div
                key={item.t}
                className='rounded-2xl bg-white p-4 ring-1 ring-slate-200'
              >
                <div className='text-sm font-semibold'>{item.t}</div>
                <div className='mt-1 text-[11px] text-slate-500'>{item.d}</div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-3 pt-2 sm:flex-row sm:items-center'>
            <Link to='/auth/login'>
              <span className='inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'>
                Démarrer
              </span>
            </Link>
            <a
              href='#prestations'
              className='text-sm font-semibold text-slate-600 hover:text-slate-900'
            >
              Voir les prestations →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
