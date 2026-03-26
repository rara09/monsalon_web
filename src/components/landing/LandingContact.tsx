export default function LandingContact() {
  return (
    <section id='contact' className='relative overflow-hidden bg-rose-500'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(0,0,0,0.18),transparent_45%)]' />
      <div className='absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-white/15 blur-3xl' />
      <div className='absolute -right-24 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl' />

      <div className='relative mx-auto max-w-6xl px-4 py-14 text-white'>
        <div className='grid gap-8 md:grid-cols-2 md:items-start'>
          <div className='space-y-3'>
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-100'>
              Contact
            </div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              On papote ?
            </h2>
            <p className='text-sm leading-relaxed text-rose-100/90'>
              Une question, une demande spéciale, ou juste envie de dire bonjour :
              écrivez-nous. Réponse rapide, ton friendly.
            </p>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {[
                { t: 'Horaires', d: 'Lun–Sam • 08:00–20:00' },
                { t: 'Téléphone', d: '+229 00 00 00 00' },
                { t: 'Adresse', d: 'Cotonou, Bénin' },
                { t: 'RDV', d: 'En ligne en quelques clics' },
              ].map((item) => (
                <div
                  key={item.t}
                  className='rounded-3xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur'
                >
                  <div className='text-sm font-semibold'>{item.t}</div>
                  <div className='mt-1 text-[11px] text-rose-50/90'>
                    {item.d}
                  </div>
                </div>
              ))}
            </div>

            <div className='pt-3 text-sm text-rose-100/90'>
              Astuce : pour réserver, connectez-vous et allez sur{' '}
              <a href='/appointments' className='font-semibold text-white underline underline-offset-4 hover:text-rose-50'>
                le calendrier RDV
              </a>
              .
            </div>
          </div>

          <div className='rounded-3xl bg-white p-6 text-slate-900 shadow-sm ring-1 ring-white/30'>
            <div className='mb-4'>
              <div className='text-sm font-semibold'>Envoyer un message</div>
              <div className='mt-1 text-[11px] text-slate-500'>
                (Formulaire “light” côté UI — branchement API possible ensuite.)
              </div>
            </div>

            <form className='space-y-3' onSubmit={(e) => e.preventDefault()}>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-slate-700'>
                    Nom
                  </label>
                  <input
                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                    placeholder='Ex: Awa'
                    required
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-slate-700'>
                    Email
                  </label>
                  <input
                    type='email'
                    className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                    placeholder='awa@email.com'
                    required
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-slate-700'>
                  Message
                </label>
                <textarea
                  rows={4}
                  className='w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                  placeholder='Dites-nous tout (promis, on lit).'
                  required
                />
              </div>

              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2'>
                <div className='text-[11px] text-slate-500'>
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
