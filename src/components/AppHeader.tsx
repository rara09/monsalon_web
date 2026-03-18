import AppLogo from './ui/AppLogo';
import NavItem from './ui/NavItem';

const AppHeader = () => {
  return (
    <header className='border-b border-slate-200 bg-white'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 gap-8'>
        <AppLogo />

        <nav className='hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex'>
          <NavItem to='/'>Tableau de bord</NavItem>
          <NavItem to='/services'>Prestations</NavItem>
          <NavItem to='/sales'>Ventes</NavItem>
          <NavItem to='/clients'>Clients</NavItem>
          <NavItem to='/stock'>Stock</NavItem>
          <NavItem to='/debts'>Dettes</NavItem>
          <NavItem to='/expenses'>Dépenses</NavItem>

          {/* <Link
            to='/'
            className='border-b-3 border-transparent hover:text-slate-900 py-6'
          >
            Tableau de bord
          </Link>
          <Link
            to='/prestations'
            className='border-b-3 border-transparent hover:text-slate-900 py-6'
          >
            Prestations
          </Link>
          <Link
            to='/clients'
            className='border-b-3 border-rose-500 text-slate-900 py-6'
          >
            Clients
          </Link>
          <Link
            to='/inventaire'
            className='border-b-3 border-transparent hover:text-slate-900 py-6'
          >
            Inventaire
          </Link>
          <Link
            to='/dettes'
            className='border-b-3 border-transparent hover:text-slate-900 py-6'
          >
            Dettes
          </Link>
          <Link
            to='/depenses'
            className='border-b-3 border-transparent hover:text-slate-900 py-6'
          >
            Dépenses
          </Link> */}
        </nav>

        <div className='flex items-center justify-end gap-3'>
          {/* <div className='hidden max-w-xs flex-1 items-center rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-200 focus-within:ring-rose-400 md:flex'>
            <span className='mr-2'>🔍</span>
            <input
              className='w-full bg-transparent outline-none placeholder:text-slate-400'
              placeholder='Rechercher un client...'
            />
          </div> */}
          {/* <button className='hidden rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 sm:inline-flex'>
            Nouveau Client
          </button> */}
          <button className='flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700'>
            US
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
