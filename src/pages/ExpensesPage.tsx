import { useMemo, useState } from 'react';
import {
  BaseDropdown,
  DataTable,
  ExpenseFormModal,
  PageHeader,
  Pagination,
  StatCard,
} from '../components';
import { useExpenses } from '../hooks/useExpenses';
import { deleteExpense, type Expense } from '../services/expenseService';
import { useToast } from '../components/ui/ToastProvider';
import { AlertCircle, CreditCard, Receipt, Trash2 } from 'lucide-react';

const PAGE_SIZE = 10;

function formatMoney(value: number) {
  return `${value.toLocaleString('fr-FR')} F`;
}

const ExpensesPage = () => {
  const { toast, toastError } = useToast();
  const { expenses, loading, refetch } = useExpenses();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalItems = expenses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndexExclusive = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pagedExpenses = expenses.slice(startIndex, endIndexExclusive);

  function closeModal() {
    setIsOpen(false);
  }

  function openCreateModal() {
    setModalMode('create');
    setSelectedExpense(undefined);
    setIsOpen(true);
  }

  function openEditModal(expense: Expense) {
    setModalMode('edit');
    setSelectedExpense(expense);
    setIsOpen(true);
  }

  async function handleDelete(expense: Expense) {
    if (!expense.id) return;
    if (deletingId === expense.id) return;

    const date = expense.expenseDate
      ? new Date(expense.expenseDate).toLocaleDateString('fr-FR')
      : '';
    const ok = window.confirm(
      `Supprimer la dépense de ${formatMoney(expense.amount)} du ${date} ? Cette action est irréversible.`,
    );
    if (!ok) return;

    setDeletingId(expense.id);
    try {
      await deleteExpense(expense.id);
      await refetch();
      toast('success', 'Dépense supprimée avec succès.');
    } catch (error) {
      toastError(error, 'Impossible de supprimer la dépense.');
    } finally {
      setDeletingId(null);
    }
  }

  const {
    totalAmount,
    rentAmount,
    salaryAmount,
    productsAmount,
    waterAmount,
    electricityAmount,
  } = useMemo(() => {
    let totalAmount = 0;
    let rentAmount = 0;
    let salaryAmount = 0;
    let productsAmount = 0;
    let waterAmount = 0;
    let electricityAmount = 0;
    let otherAmount = 0;

    expenses.forEach((e) => {
      totalAmount += e.amount ?? 0;
      if (e.category === 'Loyer') rentAmount += e.amount ?? 0;
      else if (e.category === 'Salaires') salaryAmount += e.amount ?? 0;
      else if (e.category === 'Produits') productsAmount += e.amount ?? 0;
      else if (e.category === 'Eau') waterAmount += e.amount ?? 0;
      else if (e.category === 'Électricité') electricityAmount += e.amount ?? 0;
      else otherAmount += e.amount ?? 0;
    });

    return {
      totalAmount,
      rentAmount,
      salaryAmount,
      productsAmount,
      waterAmount,
      electricityAmount,
      otherAmount,
    };
  }, [expenses]);

  const currentUserId = 1; // TODO: connecter avec l'user authentifié quand dispo

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Dépenses'
        subtitle='Suivez vos sorties d’argent par catégorie.'
      />

      <ExpenseFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={modalMode}
        expense={selectedExpense}
        userId={currentUserId}
        onSuccess={async () => {
          await refetch();
          setPage(1);
        }}
      />

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          icon={<CreditCard className='h-5 w-5' />}
          label='Total dépenses'
          value={formatMoney(totalAmount)}
          iconWrapClassName='bg-rose-100'
          iconClassName='text-rose-500'
        />

        <StatCard
          icon={<AlertCircle className='h-5 w-5' />}
          label='Loyer'
          value={formatMoney(rentAmount)}
          iconWrapClassName='bg-indigo-100'
          iconClassName='text-indigo-600'
        />

        <StatCard
          icon={<AlertCircle className='h-5 w-5' />}
          label='Salaires'
          value={formatMoney(salaryAmount)}
          iconWrapClassName='bg-amber-100'
          iconClassName='text-amber-500'
        />

        <StatCard
          icon={<AlertCircle className='h-5 w-5' />}
          label='Produits'
          value={formatMoney(productsAmount)}
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-500'
        />
        <StatCard
          icon={<AlertCircle className='h-5 w-5' />}
          label='Eau & électricité'
          value={formatMoney(waterAmount + electricityAmount)}
          iconWrapClassName='bg-sky-100'
          iconClassName='text-sky-500'
        />
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
            <div className='hidden max-w-xs flex-1 items-center rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-200 focus-within:ring-rose-400 md:flex'>
              <span className='mr-2'>🔍</span>
              <input
                className='w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400'
                placeholder='Rechercher une dépense (catégorie, notes)...'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-2 text-xs'>
            <button
              onClick={openCreateModal}
              type='button'
              className='hidden rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 sm:inline-flex cursor-pointer'
            >
              Nouvelle dépense
            </button>
          </div>
        </div>

        <DataTable
          caption='Liste des dépenses'
          columns={[
            { label: 'Date' },
            { label: 'Catégorie' },
            { label: 'Montant', align: 'right' },
            { label: 'Reçu', className: 'hidden sm:table-cell' },
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
                Aucune dépense enregistrée pour le moment.
              </td>
            </tr>
          ) : (
            pagedExpenses.map((expense) => {
              const date = expense.expenseDate
                ? new Date(expense.expenseDate).toLocaleString('fr-FR')
                : '—';

              return (
                <tr key={expense.id} className='hover:bg-slate-50/60'>
                  <td className='px-4 py-3 text-slate-600'>{date}</td>
                  <td className='px-4 py-3 text-slate-600'>
                    {expense.category || '—'}
                  </td>
                  <td className='px-4 py-3 text-right font-semibold text-slate-900'>
                    {formatMoney(expense.amount)}
                  </td>
                  <td className='hidden px-4 py-3 text-slate-500 sm:table-cell'>
                    {expense.receipt ? (
                      <span className='inline-flex items-center gap-1 text-xs text-slate-600'>
                        <Receipt className='h-3 w-3' />
                        {expense.receipt}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className='hidden px-4 py-3 text-slate-400 sm:table-cell'>
                    {expense.notes || '—'}
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end gap-2 text-slate-300'>
                      <BaseDropdown
                        items={[
                          {
                            label: 'Modifier',
                            icon: <AlertCircle className='h-4 w-4' />,
                            onClick: () => openEditModal(expense),
                          },
                          {
                            label: 'Supprimer',
                            icon: <Trash2 className='h-4 w-4' />,
                            onClick: () => void handleDelete(expense),
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

export default ExpensesPage;
