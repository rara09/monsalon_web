import { useMemo, useState } from 'react';
import {
  BaseDropdown,
  DataTable,
  PageHeader,
  Pagination,
  StatCard,
} from '../components';
import ClientFormModal from '../components/modals/ClientFormModal';
import { useClients } from '../hooks/useClients';
import { Pencil, RefreshCw, Star, Trash2, UserPlus, Users } from 'lucide-react';
import { deleteClient } from '../services/clientService';
import type { Client } from '../types/userType';
import { useToast } from '../components/ui/ToastProvider';

const PAGE_SIZE = 10;

export function ClientsPage() {
  const { toast, toastError } = useToast();
  const { clients, loading, refetch } = useClients();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalItems = clients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndexExclusive = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pagedClients = clients.slice(startIndex, endIndexExclusive);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setModalMode('create');
    setSelectedClient(undefined);
    setIsOpen(true);
  }

  function openEditModal(client: Client) {
    setModalMode('edit');
    setSelectedClient(client);
    setIsOpen(true);
  }

  async function handleDelete(client: Client) {
    if (!client.id) return;
    if (deletingId === client.id) return;

    const fullName = `${client.firstName ?? ''} ${
      client.lastName ?? ''
    }`.trim();
    const ok = window.confirm(
      `Supprimer le client ${fullName || ''} ? Cette action est irréversible.`,
    );
    if (!ok) return;

    setDeletingId(client.id);
    try {
      await deleteClient(client.id);
      await refetch();
      toast('success', 'Client supprimé avec succès.');
    } catch (error) {
      toastError(error, 'Impossible de supprimer le client.');
    } finally {
      setDeletingId(null);
    }
  }

  // Pagination UI is delegated to <Pagination />

  const { totalClients, vipClients, newThisMonth, returnRate } = useMemo(() => {
    const totalClients = totalItems;
    const vipClients = clients.filter(
      (c) => c.isVip === true || c.vipStatus === 'VIP',
    ).length;

    const newThisMonth = clients.filter((c) => {
      if (!c.createdAt) return false;
      const d = new Date(c.createdAt);
      if (Number.isNaN(d.getTime())) return false;
      const now = new Date();
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    }).length;

    const returnRate =
      totalClients === 0
        ? 0
        : Math.round(
            (clients.filter((c) => (c.visitsCount ?? 0) > 1).length /
              totalClients) *
              100,
          );

    return { totalClients, vipClients, newThisMonth, returnRate };
  }, [clients, totalItems]);

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Gestion des clients'
        subtitle='Consultez, filtrez et gérez votre base de données clients.'
      />

      <ClientFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={modalMode}
        client={selectedClient}
        onSuccess={async () => {
          await refetch();
          setPage(1);
        }}
      />

      <section className='grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
        <StatCard
          icon={<Users className='h-5 w-5' />}
          label='Total clients'
          value={totalClients.toLocaleString('fr-FR')}
          iconWrapClassName='bg-indigo-100'
          iconClassName='text-indigo-600'
        />

        <StatCard
          icon={<Star className='h-5 w-5' />}
          label='Membres VIP'
          value={vipClients.toLocaleString('fr-FR')}
          iconWrapClassName='bg-rose-100'
          iconClassName='text-rose-500'
        />

        <StatCard
          icon={<UserPlus className='h-5 w-5' />}
          label='Ce mois'
          value={`+${newThisMonth.toLocaleString('fr-FR')}`}
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-500'
        />

        <StatCard
          icon={<RefreshCw className='h-5 w-5' />}
          label='Taux de retour'
          value={`${returnRate}%`}
          iconWrapClassName='bg-amber-100'
          iconClassName='text-amber-500'
        />
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
            <div className='hidden max-w-xs flex-1 items-center rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-200 focus-within:ring-rose-400 md:flex'>
              <span className='mr-2'>🔍</span>
              <input
                className='w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400'
                placeholder='Rechercher un client...'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-2 text-xs'>
            <button
              onClick={openModal}
              className='hidden rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 sm:inline-flex cursor-pointer'
            >
              Nouveau Client
            </button>
          </div>
        </div>

        <DataTable
          caption='Liste des clients'
          columns={[
            { label: 'Nom du client' },
            { label: 'Téléphone' },
            { label: 'Dernier service' },
            { label: 'Statut VIP' },
            { label: 'Dernière visite', align: 'right' },
            { label: 'Actions', align: 'right' },
          ]}
        >
          {loading ? (
            <tr>
              <td colSpan={6} className='px-4 py-6 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : totalItems === 0 ? (
            <tr>
              <td colSpan={6} className='px-4 py-10 text-slate-500'>
                Aucun client pour le moment.
              </td>
            </tr>
          ) : (
            pagedClients.map((client) => {
              const fullName = `${client.firstName ?? ''} ${
                client.lastName ?? ''
              }`.trim();
              const initials =
                `${client.firstName?.[0] ?? ''}${client.lastName?.[0] ?? ''}`
                  .toUpperCase()
                  .trim() || 'CL';

              return (
                <tr
                  key={
                    client.id ??
                    `${client.firstName}-${client.lastName}-${client.phone}`
                  }
                  className='hover:bg-slate-50/60'
                >
                  <td className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-500'>
                        {initials}
                      </div>
                      <span className='font-medium'>
                        {fullName || 'Client'}
                      </span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-slate-500'>{client.phone}</td>
                  <td className='px-4 py-3 text-slate-500'>{'—'}</td>
                  <td className='px-4 py-3'>
                    <span className='inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600'>
                      Standard
                    </span>
                  </td>
                  <td className='px-4 py-3 text-right text-slate-400'>{'—'}</td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-2 text-slate-300'>
                      <BaseDropdown
                        items={[
                          {
                            label: 'Voir l’historique',
                            icon: <RefreshCw className='h-4 w-4' />,
                            onClick: () => {
                              // TODO: historique client
                            },
                          },
                          {
                            label: 'Éditer le client',
                            icon: <Pencil className='h-4 w-4' />,
                            onClick: () => {
                              openEditModal(client);
                            },
                          },
                          {
                            label: 'Supprimer le client',
                            icon: <Trash2 className='h-4 w-4' />,
                            onClick: () => {
                              void handleDelete(client);
                            },
                          },
                        ]}
                        btnChildren={null}
                      ></BaseDropdown>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </DataTable>

        <Pagination
          page={page}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          disabled={loading}
        />
      </section>
    </section>
  );
}
