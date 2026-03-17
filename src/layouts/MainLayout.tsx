// import type { ReactNode } from 'react';
import { Footer, AppHeader } from '../components';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// type MainLayoutProps = {
//   children: ReactNode;
// };

export function MainLayout() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to='/auth/login' replace />;
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
      <AppHeader />

      <main className='mx-auto max-w-6xl px-4 py-6'>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
