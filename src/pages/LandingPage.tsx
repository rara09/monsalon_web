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
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <LandingHeader />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='relative'
      >
        <LandingHero />
      </motion.div>

      {/* Experience */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <AboutUs />
      </motion.div>

      {/* Prestations */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <LandingServices />
      </motion.div>

      {/* Produits */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
      >
        <LandingProducts />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
      >
        <LandingTestimonials />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <LandingContact />
      </motion.div>

      {/* Newsletter / CTA */}
      {/* <motion.section
        className='bg-rose-500 text-white'
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className='mx-auto max-w-6xl px-4 py-12'>
          <div className='grid gap-6 md:grid-cols-2 md:items-center'>
            <motion.div
              className='space-y-2'
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <div className='text-xs font-semibold uppercase tracking-wide text-rose-100'>
                Restez connecté
              </div>
              <h2 className='text-2xl font-semibold tracking-tight'>
                Promos & rappels de rendez-vous
              </h2>
              <p className='text-sm text-rose-100/90'>
                Pas de spam. Juste l’essentiel pour ne rien manquer.
              </p>
            </motion.div>

            <motion.form
              className='flex flex-col gap-2 sm:flex-row'
              onSubmit={(e) => e.preventDefault()}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
            >
              <motion.input
                type='email'
                className='w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm outline-none ring-rose-200 placeholder:text-rose-100/70'
                placeholder='Votre email'
                required
                whileFocus={{ boxShadow: '0 0 0 2px rgba(251, 113, 133, 0.6)' }}
              />
              <motion.button
                type='submit'
                className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50'
                whileHover={{ scale: 1.04, translateY: -1 }}
                whileTap={{ scale: 0.98, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                Je m&apos;inscris
              </motion.button>
            </motion.form>
          </div>
        </div>
      </motion.section> */}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <LandingFooter />
      </motion.div>
    </div>
  );
}
