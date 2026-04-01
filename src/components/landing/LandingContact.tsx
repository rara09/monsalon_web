export default function LandingContact() {
  return (
    <section id='contact' className='relative overflow-hidden bg-slate-950'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.18),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(168,85,247,0.14),transparent_45%)]' />
      <div className='absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl' />
      <div className='absolute -right-24 top-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl' />

      <div className='relative mx-auto max-w-6xl px-4 py-14 text-white'>
        <div className='grid gap-8 md:grid-cols-2 md:items-start'>
          <div className='space-y-3'>
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-300'>
              Contact
            </div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Parlons de votre projet beauté
            </h2>
            <p className='text-sm leading-relaxed text-white/70'>
              Une question sur nos prestations, un créneau particulier ou un
              message avant votre rendez-vous : écrivez-nous. Réponse rapide par
              message ou téléphone.
            </p>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {[
                { t: 'Horaires', d: 'Lun–Sam • 08:00–20:00' },
                {
                  t: 'WhatsApp / Téléphone',
                  d: '+229 01 52 04 01 83',
                },
                {
                  t: 'Adresse',
                  d: 'Abomey-Calavi — Arconville',
                },
                { t: 'RDV', d: 'En ligne en quelques clics' },
              ].map((item) => (
                <div
                  key={item.t}
                  className='rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'
                >
                  <div className='text-sm font-semibold'>{item.t}</div>
                  <div className='mt-1 text-[11px] text-white/60'>
                    {item.d}
                  </div>
                </div>
              ))}
            </div>

            <div className='pt-3 text-sm text-white/70'>
              Pour réserver : connectez-vous puis ouvrez{' '}
              <a
                href='/appointments'
                className='font-semibold text-white underline underline-offset-4 hover:text-rose-200'
              >
                le calendrier des rendez-vous
              </a>
              .
            </div>
          </div>

          <div className='rounded-3xl bg-white/5 p-6 text-white shadow-sm ring-1 ring-white/10 backdrop-blur'>
            <div className='mb-4'>
              <div className='text-sm font-semibold'>Envoyer un message</div>
              <div className='mt-1 text-[11px] text-white/50'>
                (Formulaire “light” côté UI — branchement API possible ensuite.)
              </div>
            </div>

            <form className='space-y-3' onSubmit={(e) => e.preventDefault()}>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    Nom
                  </label>
                  <input
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                    placeholder='Ex: Awa'
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    Email
                  </label>
                  <input
                    type='email'
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                    placeholder='awa@email.com'
                    required
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-white/70'>
                  Message
                </label>
                <textarea
                  rows={4}
                  className='w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                  placeholder='Dites-nous tout (promis, on lit).'
                  required
                />
              </div>

              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2'>
                <div className='text-[11px] text-white/50'>
                  En envoyant, vous acceptez d’être recontacté.
                </div>
                <button
                  type='submit'
                  className='inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
                >
                  Envoyer ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
