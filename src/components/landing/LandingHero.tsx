import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const LandingHero = () => {
  const slides = useMemo(
    () => [
      {
        id: 's1',
        image: '/img/about_us/esthetic_1.jpg',
        eyebrow: 'Institut de beauté',
        title: 'MG BEAUTY — votre beauté, notre passion.',
        subtitle:
          'Coiffure et tresses, soins du visage, manucure, pédicure, maquillage professionnel et épilation. Un lieu d’exception à Abomey-Calavi.',
        ctaLabel: 'Nous découvrir',
        ctaHref: '#experience',
      },
      {
        id: 's2',
        image: '/img/slides/slider2.jpg',
        eyebrow: 'Prestations',
        title: 'Des soins complets, des rendez-vous simples.',
        subtitle:
          'Parcourez notre catalogue : tarifs clairs, durées affichées, réservation en ligne en quelques clics.',
        ctaLabel: 'Voir les prestations',
        ctaHref: '#prestations',
      },
      {
        id: 's3',
        image: '/img/slides/slider3.jpg',
        eyebrow: 'Boutique',
        title: 'Prolongez l’effet salon à la maison.',
        subtitle:
          'Les produits que nous utilisons et recommandons pour entretenir votre style entre deux visites.',
        ctaLabel: 'Voir les produits',
        ctaHref: '#produits',
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const active = slides[index] ?? slides[0];

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, [paused, slides.length]);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  return (
    <section
      className='relative h-screen overflow-hidden'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slider */}
      <div className='absolute inset-0'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={active.id}
            className='absolute inset-0'
            initial={{ opacity: 0.5, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 1.01 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              backgroundImage: `url(${active.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Dark overlay to make white text pop */}
        <div className='absolute inset-0 bg-black/55' />

        {/* Subtle vignette */}
        <div className='absolute inset-0 bg-radial-[ellipse_at_center] from-white/0 via-black/0 to-black/40' />
      </div>

      <div className='absolute z-50 w-full top-1/2 transform -translate-y-1/2 flex items-center gap-2'>
        <button
          type='button'
          onClick={prev}
          className='inline-flex absolute left-0 items-center justify-center rounded-full text-white transition cursor-pointer'
          aria-label='Slide précédent'
        >
          <ChevronLeft strokeWidth={0.25} className='w-20 h-20' />
        </button>
        <button
          type='button'
          onClick={next}
          className='inline-flex absolute right-0 z-50 items-center justify-center rounded-full text-white transition cursor-pointer'
          aria-label='Slide suivant'
        >
          <ChevronRight strokeWidth={0.25} className='h-20 w-20' />
        </button>
      </div>

      {/* Content */}
      <div className='relative h-full flex flex-col justify-center mx-auto max-w-6xl px-4 pb-16 pt-28 md:pb-24 md:pt-36'>
        <div className='flex justify-center items-center gap-10 md:grid-cols-12'>
          <div className='md:col-span-8 max-w-2xl text-center'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={`${active.id}-text`}
                initial='hidden'
                animate='show'
                exit='hidden'
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.55,
                      ease: 'easeOut',
                      staggerChildren: 0.08,
                    },
                  },
                }}
                className='space-y-5'
              >
                {/* <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className='inline-flex justify-center items-center gap-2 rounded-full bg-black/35 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur'
                >
                  <span className='inline-flex h-2 w-2 rounded-full bg-rose-400' />
                  {active.eyebrow}
                </motion.div> */}

                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.8,
                        ease: 'easeOut',
                      },
                    },
                  }}
                  className='text-4xl text-center font-semibold tracking-tight text-white md:text-6xl'
                >
                  {active.title}
                </motion.h1>

                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.5,
                        duration: 0.8,
                        ease: 'easeOut',
                      },
                    },
                  }}
                  className='max-w-2xl text-center text-sm leading-relaxed text-white/80 md:text-base'
                >
                  {active.subtitle}
                </motion.p>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: 0.8,
                        duration: 0.8,
                      },
                    },
                  }}
                  className='flex flex-wrap justify-center items-center gap-2 mt-5'
                >
                  <a
                    href={active.ctaHref}
                    className='inline-flex items-center justify-center rounded-sm bg-rose-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
                  >
                    {active.ctaLabel}
                  </a>
                  <Link
                    to='/auth/login'
                    className='inline-flex items-center justify-center rounded-sm border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10'
                  >
                    Prendre RDV
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right controls / dots */}
          {/* <div className='md:col-span-4 md:justify-self-end'>
            <div className='flex items-center justify-between gap-3 md:flex-col md:items-end md:justify-start'>
              <div className='flex items-center gap-2 md:mt-6'>
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type='button'
                    onClick={() => setIndex(i)}
                    aria-label={`Aller au slide ${i + 1}`}
                    className={[
                      'h-2.5 w-2.5 rounded-full ring-1 ring-white/25 transition-all',
                      i === index
                        ? 'bg-rose-500 scale-110'
                        : 'bg-white/35 hover:bg-white/55',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
