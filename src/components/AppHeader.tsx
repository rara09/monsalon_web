import {
  ChevronDownIcon,
  LogOut,
  Settings,
  TextAlignStart,
  UserCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import {
  AppLogo,
  NavItem,
  BaseDropdown,
  UserAvatar,
  MobileNavDrawer,
} from './ui';

const AppHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName} ${user.lastName}`.trim()
      : undefined;

  return (
    <header className='border-b border-slate-200 bg-white'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 gap-3 md:gap-8'>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            className='inline-flex items-center justify-center rounded-full p-1.5 text-slate-500 hover:bg-slate-100 md:hidden'
            onClick={() => setMobileOpen(true)}
          >
            <TextAlignStart className='h-5 w-5' />
          </button>
          <AppLogo />
        </div>

        <nav className='hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex'>
          <NavItem to='/'>Tableau de bord</NavItem>
          <NavItem to='/services'>Prestations</NavItem>
          <NavItem to='/sales'>Ventes</NavItem>
          <NavItem to='/clients'>Clients</NavItem>
          <NavItem to='/stock'>Stock</NavItem>
          <NavItem to='/debts'>Dettes</NavItem>
          <NavItem to='/expenses'>Dépenses</NavItem>
        </nav>

        <div className='flex items-center justify-end gap-2 md:gap-3'>
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

          <BaseDropdown
            btnChildren={
              <button
                type='button'
                className='flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer'
              >
                <UserAvatar name={displayName} email={user?.email} size='md' />
                <span className='hidden md:inline max-w-20 truncate'>
                  {displayName || user?.email || 'Utilisateur'}
                </span>
                <ChevronDownIcon
                  className='hidden md:inline h-3 w-3 text-slate-400'
                  aria-hidden='true'
                />
              </button>
            }
            items={[
              {
                label: 'Mon Profil',
                icon: <UserCheck className='h-4 w-4' />,
                onClick: () => navigate('/profile'),
              },
              {
                label: 'Paramètres',
                icon: <Settings className='h-4 w-4' />,
                onClick: () => navigate('/settings'),
              },
              {
                label: 'Déconnexion',
                icon: <LogOut className='h-4 w-4' />,
                onClick: () => {
                  logout();
                  navigate('/auth/login');
                },
              },
            ]}
          />
          {/* <button className='flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700'>
            US
          </button> */}
        </div>
      </div>

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
};

export default AppHeader;
