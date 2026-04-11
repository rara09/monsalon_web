import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { AppLogo } from '../ui';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LANDING_NAV_ITEMS,
  landingAnchorHref,
  reservationHref,
} from './landingNav';

type LandingMobileNavProps = {
  close: () => void;
  pathname: string;
};

const LandingMobileNav = ({ close, pathname }: LandingMobileNavProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-60 lg:hidden'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.button
          type='button'
          className='absolute inset-0 bg-black/70'
          aria-label='Fermer le menu'
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        />

        <motion.div
          className='relative flex h-full w-full flex-col bg-black/70 text-white backdrop-blur'
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <div className='flex items-center justify-between px-6 py-6'>
            <div className='text-white **:text-white'>
              <AppLogo />
            </div>
            <button
              type='button'
              onClick={close}
              className='inline-flex items-center justify-center rounded-full bg-white/5 p-2 ring-1 ring-white/15 hover:bg-white/10'
              aria-label='Fermer'
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          <div className='flex flex-1 flex-col items-center justify-center px-6 text-center'>
            <nav className='space-y-3'>
              {LANDING_NAV_ITEMS.map((item) => {
                const isActive = 'to' in item && pathname === item.to;
                if ('to' in item) {
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={close}
                      className={[
                        'block text-3xl font-semibold tracking-tight text-white/90 transition-colors hover:text-rose-300',
                        isActive ? 'text-rose-300' : '',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.label}
                    href={landingAnchorHref(pathname, item.hash)}
                    onClick={close}
                    className='block text-3xl font-semibold tracking-tight text-white/90 transition-colors hover:text-rose-300'
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className='mt-12 w-full max-w-sm space-y-3'>
              <Link
                to='/auth/login'
                onClick={close}
                className='inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-base font-semibold text-white hover:bg-white/10'
              >
                Se connecter
              </Link>
              <a
                href={reservationHref(pathname)}
                onClick={close}
                className='inline-flex w-full items-center justify-center rounded-2xl bg-rose-500 px-5 py-4 text-base font-semibold text-white shadow-sm hover:bg-rose-600'
              >
                Prendre RDV
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LandingMobileNav;
