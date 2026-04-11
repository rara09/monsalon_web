import { Outlet } from 'react-router-dom';
import LandingFooter from '../components/landing/LandingFooter';
import LandingHeader from '../components/landing/LandingHeader';

/** Pages vitrine (catalogue / produits) : même en-tête et pied que le landing. */
export default function PublicSiteLayout() {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <LandingHeader />
      <Outlet />
      <LandingFooter />
    </div>
  );
}
