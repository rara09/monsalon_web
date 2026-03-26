import { Link } from 'react-router-dom';
import { AppLogo } from '../ui';

const LandingFooter = () => {
  return (
    <footer className='border-t border-slate-200 bg-white'>
      <div className='mx-auto max-w-6xl px-4 py-10 text-xs text-slate-500'>
        <div className='flex flex-col gap-6 md:flex-row md:items-start md:justify-between'>
          <div>
            <AppLogo />
            <p className='mt-2 max-w-sm'>
              Un système de gestion de salon pensé pour le confort de vos
              clients.
            </p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2'>
            <div className='space-y-2'>
              <div className='font-semibold text-slate-700'>Liens</div>
              <div className='space-y-1'>
                <a className='block hover:text-slate-900' href='#prestations'>
                  Prestations
                </a>
                <a className='block hover:text-slate-900' href='#produits'>
                  Produits
                </a>
                <a className='block hover:text-slate-900' href='#experience'>
                  Expérience
                </a>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='font-semibold text-slate-700'>Accès</div>
              <div className='space-y-1'>
                <Link className='block hover:text-slate-900' to='/auth/login'>
                  Se connecter
                </Link>
                <Link
                  className='block hover:text-slate-900'
                  to='/auth/register'
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 flex flex-wrap gap-3 items-center justify-between'>
          <span>© 2026 Belya Studio. Tous droits réservés.</span>
          <span className='text-[11px]'>
            Mentions légales • Confidentialité
          </span>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
