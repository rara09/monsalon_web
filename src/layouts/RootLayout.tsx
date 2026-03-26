import { Outlet, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import LandingPage from '../pages/LandingPage';

/**
 * Racine : page d’accueil publique sur `/`.
 * Toutes les autres routes (`/dashboard`, `/clients`, …) passent par `MainLayout` (auth).
 */
export default function RootLayout() {
  const location = useLocation();
  if (location.pathname === '/') {
    return <LandingPage />;
  }
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
