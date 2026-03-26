import {
  AboutUs,
  LandingContact,
  LandingFooter,
  LandingHeader,
  LandingHero,
  LandingProducts,
  LandingServices,
  LandingTestimonials,
} from '../components';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-white text-slate-900'>
      <LandingHeader />

      <LandingHero />

      {/* Prestations */}
      <LandingServices />

      {/* Produits */}
      <LandingProducts />

      {/* Experience */}
      <AboutUs />

      <LandingTestimonials />

      <LandingContact />

      {/* Newsletter / CTA */}
      <section className='bg-rose-500 text-white'>
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <div className='grid gap-6 md:grid-cols-2 md:items-center'>
            <div className='space-y-2'>
              <div className='text-xs font-semibold uppercase tracking-wide text-rose-100'>
                Restez connecté
              </div>
              <h2 className='text-2xl font-semibold tracking-tight'>
                Promos & rappels de rendez-vous
              </h2>
              <p className='text-sm text-rose-100/90'>
                Pas de spam. Juste l’essentiel pour ne rien manquer.
              </p>
            </div>

            <form
              className='flex flex-col gap-2 sm:flex-row'
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type='email'
                className='w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm outline-none ring-rose-200 placeholder:text-rose-100/70'
                placeholder='Votre email'
                required
              />
              <button
                type='submit'
                className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50'
              >
                Je m&apos;inscris
              </button>
            </form>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
