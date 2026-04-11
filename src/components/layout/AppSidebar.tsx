import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scissors,
  CalendarClock,
  // Bell,
  ShoppingBag,
  Users,
  UserCog,
  Boxes,
  Wallet,
  Receipt,
  ClipboardList,
  Images,
} from 'lucide-react';
import AppLogo from '../ui/AppLogo';

const links = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  // { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/appointments', label: 'Rendez-vous', icon: CalendarClock },
  { to: '/services', label: 'Prestations', icon: Scissors },
  { to: '/catalog', label: 'Catalogue', icon: ClipboardList },
  { to: '/gallery', label: 'Galerie', icon: Images },
  { to: '/sales', label: 'Ventes', icon: ShoppingBag },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/stock', label: 'Stock', icon: Boxes },
  { to: '/debts', label: 'Dettes', icon: Wallet },
  { to: '/expenses', label: 'Dépenses', icon: Receipt },
  { to: '/users', label: 'Utilisateurs', icon: UserCog },
];

export default function AppSidebar() {
  return (
    <aside className='sticky top-0 hidden h-screen md:flex md:w-64 md:flex-col md:border-r md:border-slate-200 md:bg-white overflow-y-auto'>
      <div className='px-4 pt-2'>
        <AppLogo />
      </div>

      <nav className='min-h-0 flex-1 px-3 py-2'>
        <div className='space-y-1 overflow-y-auto pr-1'>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')
              }
            >
              <span
                className={[
                  'inline-flex h-7 w-7 items-center justify-center rounded-2xl transition-colors',
                  'ring-1',
                ].join(' ')}
              >
                <Icon className='h-4 w-4' />
              </span>
              <span className='truncate'>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* <div className='px-4 pb-4'>
        <div className='rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-200'>
          <div className='text-[11px] font-semibold uppercase tracking-wide text-slate-500'>
            État système
          </div>
          <div className='mt-2 flex items-center gap-2 text-[11px] text-slate-600'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            Synchronisation active
          </div>
        </div>
      </div> */}
    </aside>
  );
}
