// import type { ReactNode } from 'react';
import { Footer, AppHeader } from '../components';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// type MainLayoutProps = {
//   children: ReactNode;
// };

export function MainLayout() {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to='/auth/login' replace />;
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <AppHeader />

      <main className='mx-auto max-w-6xl px-4 py-6 overflow-hidden'>
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
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
