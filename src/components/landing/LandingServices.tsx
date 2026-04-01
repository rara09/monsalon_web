import { useEffect, useState } from 'react';
import { getCatalogServicesPublic } from '../../services/catalogService';
import getImagePath from '../../utils/helpers';
import { motion } from 'framer-motion';

const prestationsFallback = [
  {
    title: 'Coiffure et tresses',
    durationLabel: '1 h',
    description:
      'Coupes, poses et entretien de coiffures et tresses adaptées à votre style.',
    price: 8000,
    typeLabel: undefined as string | undefined,
  },
  {
    title: 'Soins du visage',
    durationLabel: '45 min',
    description:
      'Soins ciblés pour hydrater, purifier et illuminer votre peau.',
    price: 6500,
    typeLabel: undefined as string | undefined,
  },
  {
    title: 'Pédicure',
    durationLabel: '45 min',
    description:
      'Beauté des pieds, soin des ongles et pose vernis pour des pieds nets.',
    price: 5500,
    typeLabel: undefined as string | undefined,
  },
  {
    title: 'Manicure',
    durationLabel: '40 min',
    description:
      'Soin des mains, mise en forme des ongles et finition soignée.',
    price: 5000,
    typeLabel: undefined as string | undefined,
  },
  {
    title: 'Maquillage professionnel',
    durationLabel: '1 h',
    description:
      'Look du jour ou événement : un maquillage net, durable et sur mesure.',
    price: 12000,
    typeLabel: undefined as string | undefined,
  },
  {
    title: 'Épilation',
    durationLabel: '30 min',
    description:
      'Épilation douce et précise pour une peau lisse en toute confiance.',
    price: 4500,
    typeLabel: undefined as string | undefined,
  },
];

function formatDurationLabel(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0)
    return minutes === 60 ? '1 h' : `${minutes / 60} h`;
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} h ${m} min`;
  }
  return `${minutes} min`;
}

type CardItem = {
  title: string;
  durationLabel: string;
  description: string;
  price: number;
  typeLabel?: string;
  image?: string | null;
};

const MAX_LANDING_SERVICES = 3;

const LandingServices = () => {
  const [items, setItems] = useState<CardItem[]>(prestationsFallback);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await getCatalogServicesPublic();
        if (cancelled) return;
        setFromApi(true);
        if (!rows.length) {
          setItems([]);
          return;
        }
        setItems(
          rows.map((r) => ({
            title: r.name,
            durationLabel: formatDurationLabel(Number(r.duration) || 60),
            description: r.description?.trim() || ' ',
            price: Number(r.amount),
            typeLabel: r.type,
            image: r.image,
          })),
        );
      } catch {
        /* garde le contenu statique si l’API n’est pas joignable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = items.slice(0, MAX_LANDING_SERVICES);

  return (
    <section id='prestations' className='mx-auto max-w-6xl px-4 py-14'>
      <div className='mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div className='text-xs font-semibold uppercase tracking-wide text-rose-300'>
            Prestations MG BEAUTY
          </div>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight text-white'>
            Coiffure, esthétique & onglerie
          </h2>
        </div>
        <div className='text-end'>
          <a
            href='/auth/login'
            className='text-rose-300 font-semibold hover:underline text-sm'
          >
            Voir tout
          </a>
          <p className='max-w-md text-sm text-white/70'>
            Choisissez votre soin et réservez en quelques minutes.
          </p>
        </div>
      </div>

      {items.length === 0 && fromApi ? (
        <p className='rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-white/70'>
          Les tarifs du catalogue seront affichés dès que des prestations
          actives auront été ajoutées dans l’espace pro.
        </p>
      ) : (
        <motion.div
          className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {visibleItems.map((p, idx) => (
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              key={`${p.title}-${idx}`}
              className='relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm backdrop-blur'
            >
              <div className='absolute flex items-center right-4 top-4 h-6 text-white/80 w-auto rounded-2xl bg-black/35 text-sm px-3 ring-1 ring-white/10'>
                À partir de{' '}
                <span className='text-rose-300 font-semibold'>
                  {p.price.toLocaleString('fr-FR')} F
                </span>
              </div>
              <div
                className={[
                  'h-64 overflow-hidden rounded-2xl',
                  p.image
                    ? ''
                    : 'bg-linear-to-br from-rose-200 via-fuchsia-200 to-indigo-200',
                ].join(' ')}
              >
                {p.image ? (
                  <img
                    src={getImagePath(p.image)}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                ) : null}
              </div>

              <div className='mt-4 px-3 flex items-start justify-between gap-4'>
                <div className='space-y-1'>
                  <div className='text-sm font-semibold text-white'>
                    {p.title}
                  </div>
                  {p.typeLabel ? (
                    <div className='text-[11px] font-medium text-white/60'>
                      {p.typeLabel}
                    </div>
                  ) : null}
                </div>
                <div className='rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10'>
                  #{idx + 1}
                </div>
              </div>

              <p className='mt-3 px-3 text-sm text-white/70'>{p.description}</p>

              <div className='my-5 px-3 flex items-center justify-between'>
                <a
                  href='/auth/login'
                  className='text-xs font-semibold text-white/70 hover:text-white'
                >
                  Durée → {p.durationLabel}
                </a>
                <span className='inline-flex items-center gap-2 text-xs font-semibold text-rose-300'>
                  <span className='h-2 w-2 rounded-full bg-rose-500' />
                  Prendre RDV
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default LandingServices;
