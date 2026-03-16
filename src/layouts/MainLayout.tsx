// import type { ReactNode } from 'react';
import { Footer, AppHeader } from '../components';
import { Outlet } from 'react-router-dom';

// type MainLayoutProps = {
//   children: ReactNode;
// };

export function MainLayout() {
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
