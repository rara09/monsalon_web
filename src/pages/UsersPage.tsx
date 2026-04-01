import { useMemo, useState } from 'react';
import { BaseDropdown, DataTable, PageHeader, UserFormModal } from '../components';
import { useUsers } from '../hooks/useUsers';
import type { UserRow } from '../services/userService';
import { deleteUser } from '../services/userService';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { useToast } from '../components/ui/ToastProvider';

export default function UsersPage() {
  const { toast, toastError } = useToast();
  const { items, loading, refetch } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<UserRow | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((u) => u.isActive).length;
    const staff = items.filter((u) => u.role === 'STAFF').length;
    const admins = items.filter((u) => u.role === 'ADMIN').length;
    return { total, active, staff, admins };
  }, [items]);

  function openCreate() {
    setMode('create');
    setSelected(undefined);
    setIsOpen(true);
  }

  function openEdit(u: UserRow) {
    setMode('edit');
    setSelected(u);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleDelete(u: UserRow) {
    if (deletingId === u.id) return;
    const ok = window.confirm(
      `Supprimer l’utilisateur "${u.firstName} ${u.lastName}" (${u.email}) ?`,
    );
    if (!ok) return;
    setDeletingId(u.id);
    try {
      await deleteUser(u.id);
      await refetch();
      toast('success', 'Utilisateur supprimé.');
    } catch (error) {
      toastError(error, 'Suppression impossible.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Utilisateurs'
        subtitle='Gestion des comptes (admin / staff / client).'
      />

      <UserFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={mode}
        user={selected}
        onSuccess={refetch}
      />

      <section className='grid gap-4 md:grid-cols-4'>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Total
          </div>
          <div className='mt-2 text-2xl font-semibold text-slate-900'>
            {stats.total}
          </div>
        </div>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Actifs
          </div>
          <div className='mt-2 text-2xl font-semibold text-emerald-700'>
            {stats.active}
          </div>
        </div>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Staff
          </div>
          <div className='mt-2 text-2xl font-semibold text-slate-900'>
            {stats.staff}
          </div>
        </div>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Admin
          </div>
          <div className='mt-2 text-2xl font-semibold text-slate-900'>
            {stats.admins}
          </div>
        </div>
      </section>

      <section className='space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-slate-600'>
            Seuls les admins peuvent créer/modifier des comptes.
          </p>
          <button
            type='button'
            onClick={openCreate}
            className='inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'
          >
            <UserPlus className='h-4 w-4' />
            Nouvel utilisateur
          </button>
        </div>

        <DataTable
          caption='Liste des utilisateurs'
          columns={[
            { label: 'Nom' },
            { label: 'Email' },
            { label: 'Rôle' },
            { label: 'Statut' },
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
                Aucun utilisateur.
              </td>
            </tr>
          ) : (
            items.map((u) => (
              <tr key={u.id} className='hover:bg-slate-50/60'>
                <td className='px-4 py-3 font-medium text-slate-900'>
                  {u.firstName} {u.lastName}
                </td>
                <td className='px-4 py-3 text-slate-600'>{u.email}</td>
                <td className='px-4 py-3'>
                  <span className='inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700'>
                    {u.role}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      u.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {u.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <div className='flex justify-end'>
                    <BaseDropdown
                      items={[
                        {
                          label: 'Modifier',
                          icon: <Pencil className='h-4 w-4' />,
                          onClick: () => openEdit(u),
                        },
                        {
                          label: deletingId === u.id ? 'Suppression…' : 'Supprimer',
                          icon: <Trash2 className='h-4 w-4' />,
                          onClick: () => void handleDelete(u),
                        },
                      ]}
                      btnChildren={null}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </section>
    </section>
  );
}

