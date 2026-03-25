import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const logoutUser = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };
  return (
    <footer className='mt-8 border-t border-slate-200 bg-white'>
      <div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-slate-400 sm:flex-row'>
        <span>© 2026 Système de Gestion de Salon. Tous droits réservés.</span>
        <div className='flex flex-wrap justify-center gap-4'>
          <button className='hover:text-slate-600'>
            Conditions d&apos;utilisation
          </button>
          <button className='hover:text-slate-600'>Support technique</button>
          <button className='hover:text-slate-600'>Paramètres</button>
          <button onClick={logoutUser} className='hover:text-slate-600'>
            Déconnexion
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
