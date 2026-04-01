import { Fragment, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDownIcon,
  LogOut,
  Search,
  Settings,
  TextAlignStart,
  UserCheck,
} from 'lucide-react';
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from '@headlessui/react';
import { useAuth } from '../../hooks/useAuth';
import BaseDropdown from '../ui/BaseDropdown';
import UserAvatar from '../ui/UserAvatar';
import MobileNavDrawer from '../ui/MobileNavDrawer';
import {
  getRealtimeSocket,
  disconnectRealtimeSocket,
} from '../../services/realtime';
import { useToast } from '../ui/ToastProvider';
import { useNotifications } from '../../hooks/useNotifications';

export default function AppTopbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const {
    items: notifications,
    unreadCount,
    loading: notificationsLoading,
    markAllRead,
    markRead,
    addIncoming,
    refetch: refetchNotifications,
  } = useNotifications();

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.readAt),
    [notifications],
  );

  useEffect(() => {
    if (!user) {
      disconnectRealtimeSocket();
      return;
    }

    const socket = getRealtimeSocket();

    const onNotificationCreated = (n: any) => {
      if (!n) return;
      addIncoming(n);
      toast('info', n?.title ? `${n.title} — ${n.body}` : String(n?.body ?? 'Notification'));
    };

    socket.on('notification.created', onNotificationCreated);

    return () => {
      socket.off('notification.created', onNotificationCreated);
    };
  }, [addIncoming, toast, user]);

  useEffect(() => {
    if (!user) return;
    void refetchNotifications();
  }, [refetchNotifications, user]);

  const displayName = useMemo(() => {
    if (!user) return undefined;
    if (user.firstName || user.lastName) {
      return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    }
    return undefined;
  }, [user]);

  return (
    <header className='sticky top-0 z-10 border-b border-slate-200 bg-white'>
      <div className='flex items-center gap-3 px-4 py-3'>
        <button
          type='button'
          className='inline-flex items-center justify-center rounded-2xl p-2 text-slate-500 hover:bg-slate-100 md:hidden'
          onClick={() => setMobileOpen(true)}
          aria-label='Ouvrir le menu'
        >
          <TextAlignStart className='h-5 w-5' />
        </button>

        <div className='flex-1'>
          <div className='flex max-w-xl items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-200 focus-within:ring-rose-300'>
            <Search className='h-4 w-4 text-slate-400' />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='w-full bg-transparent outline-none placeholder:text-slate-400'
              placeholder='Rechercher…'
            />
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-3'>
          <Popover className='relative'>
            {({ open }) => (
              <>
                <PopoverButton
                  className={[
                    'relative rounded-2xl bg-slate-50 p-2 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100',
                    open ? 'ring-rose-200' : '',
                  ].join(' ')}
                  aria-label='Notifications'
                >
                  <Bell className='h-5 w-5' />
                  {unreadCount > 0 ? (
                    <span className='absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white'>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </PopoverButton>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-150'
                  enterFrom='opacity-0 translate-y-1'
                  enterTo='opacity-100 translate-y-0'
                  leave='transition ease-in duration-120'
                  leaveFrom='opacity-100 translate-y-0'
                  leaveTo='opacity-0 translate-y-1'
                >
                  <PopoverPanel
                    anchor='bottom end'
                    className='z-50 mt-2 w-[min(92vw,380px)] rounded-md bg-white p-3 shadow-xl ring-1 ring-slate-200 focus:outline-none bg-linear-to-br from-rose-100 via-fuchsia-100 to-gray-200'
                  >
                    <div className='flex items-center justify-between px-2 py-1'>
                      <div className='text-sm font-semibold text-slate-900'>
                        Notifications
                      </div>
                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        className='text-[11px] font-semibold text-slate-600 hover:text-slate-900'
                          onClick={() => void markAllRead()}
                      >
                        Tout lire
                      </button>
                      <button
                        type='button'
                        className='text-[11px] font-semibold text-rose-600 hover:text-rose-700'
                        onClick={() => navigate('/appointments')}
                      >
                        Voir RDV
                      </button>
                    </div>
                    </div>

                    <div className='mt-2 space-y-2'>
                      {notificationsLoading ? (
                        <div className='rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 ring-1 ring-slate-200'>
                          Chargement…
                        </div>
                      ) : unreadNotifications.length === 0 ? (
                        <div className='rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 ring-1 ring-slate-200'>
                          Rien de nouveau pour le moment.
                        </div>
                      ) : (
                        unreadNotifications.slice(0, 6).map((n) => (
                          <button
                            key={n.id}
                            type='button'
                            onClick={() => {
                              if (!n.readAt) void markRead(n.id);
                              // UX simple: redirige vers une section probable
                              if (n.type === 'APPOINTMENT_CREATED')
                                navigate('/appointments');
                              else navigate('/dashboard');
                            }}
                            className='w-full rounded-2xl bg-white px-3 py-3 text-left ring-1 ring-slate-200 hover:bg-slate-50'
                          >
                            <div className='flex items-start justify-between gap-3'>
                              <div className='min-w-0'>
                                <div className='flex items-center gap-2'>
                                  {!n.readAt ? (
                                    <span className='mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-rose-500' />
                                  ) : (
                                    <span className='mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-slate-200' />
                                  )}
                                  <div className='truncate text-sm font-semibold text-slate-900'>
                                    {n.title}
                                  </div>
                                </div>
                                <div className='mt-1 line-clamp-2 text-sm text-slate-600'>
                                  {n.body}
                                </div>
                              </div>
                              <div className='flex-shrink-0 text-[11px] font-medium text-slate-400'>
                                {n.createdAt
                                  ? new Date(n.createdAt).toLocaleString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : ''}
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    <div className='mt-3 flex items-center justify-between px-2 pb-1'>
                      <div className='text-[11px] text-slate-400'>
                        {unreadCount} non lues
                      </div>
                      <button
                        type='button'
                        className='text-[11px] font-semibold text-slate-600 hover:text-slate-900'
                        onClick={() => navigate('/notifications')}
                      >
                        Tout voir →
                      </button>
                    </div>
                  </PopoverPanel>
                </Transition>
              </>
            )}
          </Popover>

          <button
            type='button'
            className='rounded-2xl bg-slate-50 p-2 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100'
            aria-label='Paramètres'
            onClick={() => navigate('/settings')}
          >
            <Settings className='h-5 w-5' />
          </button>

          <BaseDropdown
            btnChildren={
              <div className='flex items-center gap-2 rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer'>
                <UserAvatar name={displayName} email={user?.email} size='md' />
                <span className='hidden md:inline max-w-20 truncate'>
                  {displayName || user?.email || 'Utilisateur'}
                </span>
                <ChevronDownIcon
                  className='hidden md:inline h-3 w-3 text-slate-400'
                  aria-hidden='true'
                />
              </div>
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
                onClick: async () => {
                  await logout();
                  navigate('/auth/login', { replace: true });
                },
              },
            ]}
          />
        </div>
      </div>

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
