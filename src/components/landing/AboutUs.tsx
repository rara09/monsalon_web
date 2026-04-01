import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const gridImages = [
  '/img/about_us/hair_2.jpg',
  '/img/about_us/hair_3.jpg',
  '/img/about_us/makeup_1.jpg',
  '/img/about_us/esthetic_1.jpg',
];

const AboutUs = () => {
  return (
    <section id='experience' className='mx-auto max-w-6xl px-4 py-14 mt-14'>
      <div className='grid gap-8 md:grid-cols-2 md:items-start'>
        <div className='relative'>
          <div className='grid grid-cols-2 gap-3'>
            {gridImages.map((src, i) => (
              // <div
              //   key={i}
              //   className='aspect-square rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-rose-600'
              // >
              //   <div className='h-full w-full rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_45%)]' />
              // </div>
              <motion.img
                key={i}
                src={src}
                alt=''
                className='aspect-square rounded-3xl object-cover object-top shadow-sm ring-1 ring-white/10'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <div className='absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-rose-500/20 blur-2xl' />
        </div>

        <div className='space-y-4'>
          <div className='text-xs font-semibold uppercase tracking-wide text-rose-300'>
            MG BEAUTY
          </div>
          <h2 className='text-2xl font-semibold tracking-tight text-white'>
            Un institut de beauté à Abomey-Calavi
          </h2>
          <p className='text-sm text-white/70 leading-relaxed'>
            De la coiffure à l’épilation en passant par les soins du visage et
            l’onglerie, MG BEAUTY vous accueille dans une ambiance soignée. Notre
            équipe met son savoir-faire au service de votre style et de votre
            bien-être.
          </p>

          <div className='grid gap-3 sm:grid-cols-2'>
            {[
              {
                t: 'Écoute & conseils',
                d: 'On définit ensemble la prestation qui vous correspond.',
              },
              {
                t: 'Produits de qualité',
                d: 'Des formules adaptées à votre peau et à vos cheveux.',
              },
              {
                t: 'Horaires clairs',
                d: 'Des créneaux précis pour mieux organiser votre journée.',
              },
              {
                t: 'Résultats nets',
                d: 'Une finition soignée, du premier rendez-vous au suivi.',
              },
            ].map((item) => (
              <div
                key={item.t}
                className='rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'
              >
                <div className='text-sm font-semibold text-white'>{item.t}</div>
                <div className='mt-1 text-[11px] text-white/60'>{item.d}</div>
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-3 pt-2 sm:flex-row sm:items-center'>
            <Link to='/auth/login'>
              <span className='inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'>
                Prendre rendez-vous
              </span>
            </Link>
            <a
              href='#prestations'
              className='text-sm font-semibold text-white/70 hover:text-white'
            >
              Voir nos prestations →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
