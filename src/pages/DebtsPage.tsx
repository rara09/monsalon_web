import { useEffect, useMemo, useState } from 'react';
import {
  BaseDropdown,
  DataTable,
  PageHeader,
  Pagination,
  StatCard,
} from '../components';
import { deleteDebt, getDebts, type Debt } from '../services/debtService';
import { useToast } from '../components/ui/ToastProvider';
import { AlertCircle, CalendarClock, CreditCard, Trash2, Users } from 'lucide-react';
import DebtFormModal from '../components/modals/DebtFormModal';

const PAGE_SIZE = 10;

const DebtsPage = () => {
  const { toast, toastError } = useToast();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDebt, setSelectedDebt] = useState<Debt | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await getDebts();
      setDebts(data);
    } catch (error) {
      toastError(error, 'Impossible de charger les dettes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalItems = debts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndexExclusive = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pagedDebts = debts.slice(startIndex, endIndexExclusive);

  const { totalAmount, unpaidCount, paidCount, overdueCount } =
    useMemo(() => {
      const now = new Date();
      let totalAmount = 0;
      let unpaidCount = 0;
      let paidCount = 0;
      let overdueCount = 0;

      debts.forEach((d) => {
        totalAmount += d.totalAmount ?? 0;

        if (d.status === 'PAYÉ') paidCount += 1;
        else unpaidCount += 1;

        if (d.status !== 'PAYÉ' && d.dueDate) {
          const due = new Date(d.dueDate);
          if (!Number.isNaN(due.getTime()) && due < now) {
            overdueCount += 1;
          }
        }
      });

      return { totalAmount, unpaidCount, paidCount, overdueCount };
    }, [debts]);

  function closeModal() {
    setIsOpen(false);
  }

  function openCreateModal() {
    setModalMode('create');
    setSelectedDebt(undefined);
    setIsOpen(true);
  }

  function openEditModal(debt: Debt) {
    setModalMode('edit');
    setSelectedDebt(debt);
    setIsOpen(true);
  }

  async function handleDelete(debt: Debt) {
    if (!debt.id) return;
    if (deletingId === debt.id) return;

    const clientName = `${debt.client?.firstName ?? ''} ${
      debt.client?.lastName ?? ''
    }`.trim();
    const ok = window.confirm(
      `Supprimer la dette du client ${clientName || `#${debt.clientId}`} ? Cette action est irréversible.`,
    );
    if (!ok) return;

    setDeletingId(debt.id);
    try {
      await deleteDebt(debt.id);
      await refetch();
      toast('success', 'Dette supprimée avec succès.');
    } catch (error) {
      toastError(error, 'Impossible de supprimer la dette.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Gestion des dettes'
        subtitle='Suivez les montants dus, les échéances et les règlements.'
      />

      <DebtFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={modalMode}
        debt={selectedDebt}
        onSuccess={async () => {
          await refetch();
          setPage(1);
        }}
      />

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          icon={<CreditCard className='h-5 w-5' />}
          label='Montant total dû'
          value={totalAmount.toLocaleString('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
          iconWrapClassName='bg-rose-100'
          iconClassName='text-rose-500'
        />

        <StatCard
          icon={<Users className='h-5 w-5' />}
          label='Dettes impayées'
          value={unpaidCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-amber-100'
          iconClassName='text-amber-500'
        />

        <StatCard
          icon={<AlertCircle className='h-5 w-5' />}
          label='Dettes en retard'
          value={overdueCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-red-100'
          iconClassName='text-red-500'
        />

        <StatCard
          icon={<CalendarClock className='h-5 w-5' />}
          label='Dettes soldées'
          value={paidCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-500'
        />
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
            <div className='hidden max-w-xs flex-1 items-center rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-200 focus-within:ring-rose-400 md:flex'>
              <span className='mr-2'>🔍</span>
              <input
                className='w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400'
                placeholder='Rechercher une dette (client, note)...'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-2 text-xs'>
            <button
              onClick={openCreateModal}
              type='button'
              className='hidden rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 sm:inline-flex cursor-pointer'
            >
              Nouvelle dette
            </button>
          </div>
        </div>

        <DataTable
          caption='Liste des dettes'
          columns={[
            { label: 'Client' },
            { label: 'Montant dû' },
            { label: 'Échéance' },
            { label: 'Statut' },
            { label: 'Notes', className: 'hidden sm:table-cell' },
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
                Aucune dette enregistrée pour le moment.
              </td>
            </tr>
          ) : (
            pagedDebts.map((debt) => {
              const clientName = `${debt.client?.firstName ?? ''} ${
                debt.client?.lastName ?? ''
              }`.trim() || `Client #${debt.clientId}`;

              const dueDate = debt.dueDate
                ? new Date(debt.dueDate)
                : undefined;

              const dueDateLabel =
                dueDate && !Number.isNaN(dueDate.getTime())
                  ? dueDate.toLocaleDateString('fr-FR')
                  : '—';

              const status = debt.status ?? 'IMPAYÉ';

              const statusColor =
                status === 'PAYÉ'
                  ? 'bg-emerald-100 text-emerald-700'
                  : status === 'PARTIEL'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700';

              return (
                <tr key={debt.id} className='hover:bg-slate-50/60'>
                  <td className='px-4 py-3'>
                    <span className='font-medium'>{clientName}</span>
                  </td>
                  <td className='px-4 py-3 text-slate-600'>
                    {debt.totalAmount.toLocaleString('fr-FR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{' '}
                    F
                  </td>
                  <td className='px-4 py-3 text-slate-500'>{dueDateLabel}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className='hidden px-4 py-3 text-slate-400 sm:table-cell'>
                    {debt.notes || '—'}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-2 text-slate-300'>
                      <BaseDropdown
                        items={[
                          {
                            label: 'Modifier',
                            icon: <CalendarClock className='h-4 w-4' />,
                            onClick: () => openEditModal(debt),
                          },
                          {
                            label: 'Supprimer',
                            icon: <Trash2 className='h-4 w-4' />,
                            onClick: () => void handleDelete(debt),
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
};

export default DebtsPage;
