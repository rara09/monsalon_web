import { Link } from 'react-router-dom';
import { AppLogo } from '../ui';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import LandingMobileNav from './LandingMobileNav';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const navItems: { label: string; href: string; active?: boolean }[] = [
  { label: 'Accueil', href: '#', active: true },
  { label: 'À propos', href: '#experience', active: false },
  { label: 'Prestations', href: '#prestations', active: false },
  { label: 'Produits', href: '#produits', active: false },
  { label: 'Contact', href: '#contact', active: false },
];

const LandingHeader = () => {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const { user } = useAuth();

  function close() {
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className='fixed inset-x-0 top-0 z-50'>
      <div className=''>
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={[
            'flex items-center justify-between gap-4 bg-black/35 px-4 py-3 backdrop-blur ring-1 ring-white/10 transition-[border-radius,margin,background-color] duration-200',
            stuck
              ? 'rounded-none bg-black/45'
              : 'mt-4 rounded-full mx-auto max-w-6xl px-4',
          ].join(' ')}
        >
          <div className='flex items-center justify-between max-w-6xl mx-auto w-full px-4'>
            <div className='text-white **:text-white'>
              <AppLogo />
            </div>

            <nav className='hidden items-center gap-6 text-sm font-semibold text-white/80 lg:flex'>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={[
                    'relative py-2 transition-colors hover:text-rose-500',
                    item.active ? 'text-rose-500' : '',
                  ].join(' ')}
                >
                  {item.label}
                  {/* <span
                  className={[
                    'absolute -bottom-1 left-0 h-0.5 w-full rounded-full',
                    item.active ? 'bg-rose-500' : 'bg-transparent',
                  ].join(' ')}
                /> */}
                </a>
              ))}
            </nav>

            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => setOpen(true)}
                className='inline-flex items-center justify-center rounded-full bg-white/5 p-2 text-white ring-1 ring-white/15 hover:bg-white/10 lg:hidden'
                aria-label='Ouvrir le menu'
              >
                <Menu className='h-5 w-5' />
              </button>
              <Link
                to='/auth/login'
                className='hidden lg:inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10'
              >
                {user ? 'Mon compte' : 'Se connecter'}
              </Link>
              <Link
                to='/auth/login'
                className='hidden lg:inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
              >
                Prendre RDV
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {open ? <LandingMobileNav close={close} navItems={navItems} /> : null}
    </header>
  );
};

export default LandingHeader;
