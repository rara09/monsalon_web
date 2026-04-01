import { DataTable, PageHeader } from '../components';
import { useNotifications } from '../hooks/useNotifications';
import { CheckCheck, CheckCircle2, RefreshCcw } from 'lucide-react';

function formatDateTime(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const { items, loading, unreadCount, refetch, markAllRead, markRead } =
    useNotifications();

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Notifications'
        subtitle='Historique des notifications et statut de lecture.'
      />

      <section className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <span className='font-semibold text-slate-900'>
            {items.length.toLocaleString('fr-FR')}
          </span>
          <span>au total</span>
          {unreadCount > 0 ? (
            <span className='ml-2 inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-rose-100'>
              {unreadCount} non lues
            </span>
          ) : (
            <span className='ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100'>
              <CheckCircle2 className='h-4 w-4' />
              Tout est lu
            </span>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <button
            type='button'
            onClick={() => void refetch()}
            className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
          >
            <RefreshCcw className='h-4 w-4' />
            Rafraîchir
          </button>
          <button
            type='button'
            onClick={() => void markAllRead()}
            className='inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'
            disabled={items.length === 0 || unreadCount === 0}
          >
            <CheckCheck className='h-4 w-4' />
            Marquer tout comme lu
          </button>
        </div>
      </section>

      <section className='space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <DataTable
          caption='Liste des notifications'
          columns={[
            { label: 'Statut' },
            { label: 'Titre' },
            { label: 'Message' },
            { label: 'Créée le', align: 'right' },
            { label: 'Actions', align: 'right' },
          ]}
          minWidthClassName='min-w-[920px]'
        >
          {loading ? (
            <tr>
              <td colSpan={5} className='px-4 py-8 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5} className='px-4 py-10 text-slate-500'>
                Aucune notification.
              </td>
            </tr>
          ) : (
            items.map((n) => {
              const isUnread = !n.readAt;
              return (
                <tr key={n.id} className='hover:bg-slate-50/60'>
                  <td className='px-4 py-3'>
                    <span
                      className={[
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        isUnread
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-slate-100 text-slate-500',
                      ].join(' ')}
                    >
                      {isUnread ? 'Non lue' : 'Lue'}
                    </span>
                  </td>
                  <td className='px-4 py-3 font-semibold text-slate-900'>
                    {n.title}
                  </td>
                  <td className='px-4 py-3 text-slate-600'>{n.body}</td>
                  <td className='px-4 py-3 text-right text-[13px] text-slate-500'>
                    {formatDateTime(n.createdAt)}
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <button
                      type='button'
                      disabled={!isUnread}
                      onClick={() => void markRead(n.id)}
                      className='inline-flex items-center justify-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50'
                    >
                      Marquer lu
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </DataTable>
      </section>
    </section>
  );
}
