import { Link } from 'react-router-dom';
import { AppLogo } from '../ui';

const navItems: { label: string; href: string; active?: boolean }[] = [
  { label: 'Accueil', href: '#', active: true },
  { label: 'Catalogue', href: '#prestations', active: false },
  { label: 'Nos produits', href: '#produits', active: false },
  { label: 'À propos', href: '#experience', active: false },
  { label: 'Contact', href: '#contact', active: false },
];

const LandingHeader = () => {
  // const [isActive, setIsActive] = useState<boolean>(false);
  return (
    <header className='sticky top-0 z-40 bg-white/80 backdrop-blur'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 gap-4'>
        <AppLogo />

        <nav className='hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex'>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`border-b-3 hover:text-rose-500 py-6 ${item.active ? 'border-rose-500 text-rose-500' : 'border-transparent'}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className='flex items-center gap-2'>
          <Link
            to='/auth/login'
            className='inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500 hover:text-slate-50'
          >
            Se connecter
          </Link>
          <Link
            to='/auth/login'
            className='inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
          >
            Prendre RDV
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
