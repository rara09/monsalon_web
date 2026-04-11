import { motion } from 'framer-motion';
import {
  Hand,
  Palette,
  Scissors,
  Sparkles,
  SunMedium,
  Venus,
} from 'lucide-react';

const pillars = [
  {
    icon: Scissors,
    title: 'Coiffure femme',
    text: 'Coupes, couleurs, poses et entretien de coiffures adaptées à votre morphologie.',
  },
  {
    icon: Venus,
    title: 'Coiffure homme',
    text: 'Taille, barbe et finitions nettes pour un look soigné au quotidien.',
  },
  {
    icon: Hand,
    title: 'Onglerie',
    text: 'Manucure, pédicure et poses pour des mains et des pieds impeccables.',
  },
  {
    icon: Sparkles,
    title: 'Soins visage',
    text: 'Soins ciblés pour hydrater, purifier et redonner de l’éclat à votre peau.',
  },
  {
    icon: Palette,
    title: 'Maquillage',
    text: 'Maquillage du jour ou événement : fini net, tenue et mise en valeur.',
  },
  {
    icon: SunMedium,
    title: 'Épilation',
    text: 'Techniques douces pour une peau lisse, en toute confiance.',
  },
] as const;

export default function LandingInstituteServices() {
  return (
    <section
      id='nos-services'
      className='relative overflow-hidden border-y border-white/5 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950'
    >
      <div className='pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-rose-500/10 blur-3xl' />
      <div className='pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl' />

      <div className='relative mx-auto max-w-6xl px-4 py-16 md:py-20'>
        <div className='mx-auto max-w-2xl text-center'>
          <div className='text-xs font-semibold uppercase tracking-[0.2em] text-rose-300'>
            Nos services
          </div>
          <h2 className='mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl'>
            L’offre MG BEAUTY, par univers
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-white/65'>
            Une vision globale de la beauté : chaque univers est pris en charge par
            des gestes et des produits adaptés — avant de passer aux tarifs et à la
            réservation dans la section suivante.
          </p>
        </div>

        <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {pillars.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className='group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm ring-1 ring-white/5 backdrop-blur transition hover:border-rose-400/25 hover:bg-white/[0.05]'
              >
                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/25 to-fuchsia-500/10 text-rose-200 ring-1 ring-rose-400/20 transition group-hover:from-rose-500/35'>
                    <Icon className='h-6 w-6' strokeWidth={1.5} />
                  </div>
                  <div className='min-w-0'>
                    <h3 className='text-base font-semibold text-white'>
                      {item.title}
                    </h3>
                    <p className='mt-2 text-sm leading-relaxed text-white/60'>
                      {item.text}
                    </p>
                  </div>
                </div>
                <div className='pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-rose-500/5 blur-2xl transition group-hover:bg-rose-500/10' />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
