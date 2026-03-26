const testimonials = [
  {
    name: 'Awa K.',
    role: 'Cliente fidèle',
    rating: 5,
    quote:
      'Accueil chaleureux, résultat impeccable. Et en plus on ressort avec le sourire.',
  },
  {
    name: 'Sarah D.',
    role: 'Première visite',
    rating: 5,
    quote:
      'J’ai adoré le diagnostic rapide et les conseils. Tout est clair, simple et pro.',
  },
  {
    name: 'Nadine M.',
    role: 'Coloration',
    rating: 5,
    quote:
      'Couleur parfaitement réussie, timing respecté. Studio au top, ambiance légère.',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className='flex items-center gap-0.5' aria-label={`${count} sur 5`}>
      {Array.from({ length: 5 }, (_, idx) => (
        <span
          key={idx}
          className={`text-sm ${idx < count ? 'text-amber-400' : 'text-slate-200'}`}
          aria-hidden='true'
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function LandingTestimonials() {
  return (
    <section className='relative overflow-hidden'>
      <div className='absolute -left-24 top-10 h-60 w-60 rounded-full bg-rose-500/10 blur-3xl' />
      <div className='absolute -right-24 top-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl' />

      <div className='mx-auto max-w-6xl px-4 py-14'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-600'>
              Témoignages
            </div>
            <h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-900'>
              Elles sont venues… elles ont aimé.
            </h2>
          </div>
          <p className='max-w-md text-sm text-slate-600'>
            Une ambiance joyeuse, des résultats nets, et des rendez-vous qui se
            passent sans stress.
          </p>
        </div>

        <div className='mt-8 grid gap-4 md:grid-cols-3'>
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className='rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0'>
                  <figcaption className='text-sm font-semibold text-slate-900'>
                    {t.name}
                  </figcaption>
                  <div className='text-[11px] font-medium text-slate-500'>
                    {t.role}
                  </div>
                </div>
                <Stars count={t.rating} />
              </div>

              <blockquote className='mt-4 text-sm leading-relaxed text-slate-700'>
                “{t.quote}”
              </blockquote>

              <div className='mt-5 flex items-center justify-between'>
                <span className='inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-100'>
                  <span className='h-2 w-2 rounded-full bg-rose-500' />
                  Avis vérifié
                </span>
                <span className='text-[11px] text-slate-400'>Merci</span>
              </div>
            </figure>
          ))}
        </div>

        <div className='mt-10 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-1'>
              <div className='text-sm font-semibold text-slate-900'>
                Vous avez aimé votre passage ?
              </div>
              <div className='text-sm text-slate-600'>
                Laissez un petit mot, ça nous booste (et ça fait plaisir).
              </div>
            </div>
            <a
              href='#contact'
              className='inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
            >
              Nous écrire
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
