import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import {
  X,
  LayoutDashboard,
  Bell,
  UserCog,
  Scissors,
  ShoppingBag,
  Users,
  Boxes,
  Wallet,
  Receipt,
  CalendarClock,
  ClipboardList,
  Images,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/users', label: 'Utilisateurs', icon: UserCog },
  { to: '/services', label: 'Prestations', icon: Scissors },
  { to: '/catalog', label: 'Catalogue', icon: ClipboardList },
  { to: '/gallery', label: 'Galerie', icon: Images },
  { to: '/sales', label: 'Ventes', icon: ShoppingBag },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/appointments', label: 'Rendez-vous', icon: CalendarClock },
  { to: '/stock', label: 'Stock', icon: Boxes },
  { to: '/debts', label: 'Dettes', icon: Wallet },
  { to: '/expenses', label: 'Dépenses', icon: Receipt },
];

export default function MobileNavDrawer({ open, onClose }: MobileNavDrawerProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as='div' className='relative z-40 md:hidden' onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-200'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-150'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/40 backdrop-blur-xs' />
        </TransitionChild>

        <div className='fixed inset-0 flex'>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='-translate-x-full'
            enterTo='translate-x-0'
            leave='ease-in duration-150'
            leaveFrom='translate-x-0'
            leaveTo='-translate-x-full'
          >
            <DialogPanel className='relative flex w-72 max-w-full flex-col bg-white px-4 pb-6 pt-4 shadow-xl'>
              <div className='mb-4 flex items-center justify-between'>
                <span className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                  Navigation
                </span>
                <button
                  type='button'
                  onClick={onClose}
                  className='rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              <nav className='space-y-1 text-sm'>
                {links.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-xl px-3 py-2.5',
                        'text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      ].join(' ')
                    }
                  >
                    <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400'>
                      <Icon className='h-4 w-4' />
                    </span>
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

