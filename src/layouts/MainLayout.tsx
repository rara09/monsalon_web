import type { ReactNode } from 'react';
import { Footer } from '../components';
import { Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import AppSidebar from '../components/layout/AppSidebar';
import AppTopbar from '../components/layout/AppTopbar';

type MainLayoutProps = {
  children: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500'>
        Chargement…
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/auth/login' replace />;
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <div className='flex min-h-screen'>
        <AppSidebar />

        <div className='flex min-w-0 flex-1 flex-col'>
          <AppTopbar />

          <main className='min-w-0 flex-1 px-4 py-6 overflow-hidden'>
            <div className='mx-auto w-full max-w-6xl'>
              <AnimatePresence mode='wait'>
                <motion.div
                  // `location.key` change à chaque navigation (plus fiable que pathname).
                  key={location.key ?? location.pathname}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className='will-change-transform'
                  // Force l'opacité à 0 dès le premier paint pour éviter le "flash".
                  style={{ opacity: 0 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <div className='px-4'>
            <div className='mx-auto w-full max-w-6xl'>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
