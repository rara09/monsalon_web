import type { ReactNode } from 'react';
import { AppLogo } from '../components';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
};

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { token } = useAuth();
  const location = useLocation();

  if (token) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-rose-50 via-white to-slate-50 text-slate-900'>
      {/* <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white font-semibold">
            ✂
          </div>
          <span className="text-sm font-semibold tracking-tight">Mon Salon Pro</span>
        </div>
        <nav className="hidden gap-6 text-xs font-medium text-slate-500 sm:flex">
          <button className="hover:text-slate-900">Accueil</button>
          <button className="hover:text-slate-900">Fonctionnalités</button>
          <button className="hover:text-slate-900">Tarifs</button>
        </nav>
        <Link
          to="/auth/login"
          className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600"
        >
          Se connecter
        </Link>
      </header> */}

      <main className='mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-4 md:flex-row md:items-center md:pt-5 overflow-hidden'>
        <section className='flex-1 space-y-6 rounded-3xl p-6 md:p-8'>
          {/* <span className='inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600'>
            Édition 2024
          </span> */}
          <div className='space-y-3'>
            <h1 className='text-3xl font-semibold leading-tight tracking-tight md:text-4xl'>
              Rejoignez le futur de votre salon.
            </h1>
            <p className='text-sm text-slate-600 md:text-base'>
              Centralisez vos rendez-vous, clients et ventes dans une seule
              plateforme intuitive pensée pour les salons de coiffure et
              d&apos;esthétique.
            </p>
          </div>
          <ul className='space-y-3 text-sm text-slate-700'>
            <li className='flex gap-3'>
              <span className='mt-1 h-7 w-7 rounded-full bg-rose-100 text-center text-sm leading-7 text-rose-600'>
                🎟
              </span>
              <div>
                <p className='font-medium'>Badge numérique instantané</p>
                <p className='text-xs text-slate-500'>
                  Accédez à votre tableau de bord sécurisé dès
                  l&apos;inscription.
                </p>
              </div>
            </li>
            <li className='flex gap-3'>
              <span className='mt-1 h-7 w-7 rounded-full bg-rose-100 text-center text-sm leading-7 text-rose-600'>
                🤝
              </span>
              <div>
                <p className='font-medium'>Networking intelligent</p>
                <p className='text-xs text-slate-500'>
                  Suivez vos clients fidèles et stimulez leur retour au salon.
                </p>
              </div>
            </li>
          </ul>

          <div className='hidden md:block overflow-hidden rounded-2xl bg-slate-900 text-slate-50'>
            <div className="h-36 w-full bg-[url('https://images.pexels.com/photos/3993447/pexels-photo-3993447.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center" />
            <p className='px-4 py-3 text-[11px] text-slate-300'>
              &quot;L&apos;outil indispensable pour simplifier la gestion de mon
              salon et mieux suivre mes clientes.&quot;
            </p>
          </div>
        </section>

        <section className='flex-1'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={location.key ?? location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className='will-change-transform'
              style={{ opacity: 0 }}
            >
              <div className='rounded-3xl bg-white p-6 shadow-lg md:p-8'>
                <div className='flex w-full justify-center mb-5'>
                  <AppLogo />
                </div>
                <div className='mb-6 space-y-1'>
                  <h2 className='text-xl font-semibold tracking-tight md:text-2xl'>
                    {title}
                  </h2>
                  {subtitle && (
                    <p className='text-xs text-slate-500 md:text-sm'>
                      {subtitle}
                    </p>
                  )}
                </div>
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <footer className='border-t border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-[11px] text-slate-400'>
          <span>© 2026 Mon Salon. Tous droits réservés.</span>
          <div className='hidden gap-4 md:flex'>
            <button className='hover:text-slate-600'>Aide</button>
            <button className='hover:text-slate-600'>Contact</button>
            <button className='hover:text-slate-600'>Mentions légales</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
