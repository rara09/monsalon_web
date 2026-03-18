import { useMemo, useState } from 'react';
import {
  BaseDropdown,
  DataTable,
  PageHeader,
  Pagination,
  StatCard,
} from '../components';
import { useServices } from '../hooks/useServices';
import ServiceFormModal from '../components/modals/ServiceFormModal';
import { Pencil, Scissors, Trash2, Wand2 } from 'lucide-react';
import { deleteService, type SalonService } from '../services/serviceService';
import { useToast } from '../components/ui/ToastProvider';

const PAGE_SIZE = 10;

function formatMoney(value: number) {
  return `${value.toLocaleString('fr-FR')} F`;
}

const ServicesPage = () => {
  const { toast, toastError } = useToast();
  const { services, loading, refetch } = useServices();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedService, setSelectedService] = useState<
    SalonService | undefined
  >();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const totalItems = services.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndexExclusive = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pagedServices = services.slice(startIndex, endIndexExclusive);

  function closeModal() {
    setIsOpen(false);
  }

  function openCreateModal() {
    setModalMode('create');
    setSelectedService(undefined);
    setIsOpen(true);
  }

  function openEditModal(service: SalonService) {
    setModalMode('edit');
    setSelectedService(service);
    setIsOpen(true);
  }

  async function handleDelete(service: SalonService) {
    if (!service.id) return;
    if (deletingId === service.id) return;

    const ok = window.confirm(
      `Supprimer la prestation "${service.name}" ? Cette action est irréversible.`,
    );
    if (!ok) return;

    setDeletingId(service.id);
    try {
      await deleteService(service.id);
      await refetch();
      toast('success', 'Prestation supprimée avec succès.');
    } catch (error) {
      toastError(error, 'Impossible de supprimer la prestation.');
    } finally {
      setDeletingId(null);
    }
  }

  const { totalRevenue, haircutCount } = useMemo(() => {
    const totalRevenue = services.reduce(
      (sum, s) => sum + Number(s.amount ?? 0),
      0,
    );
    const haircutCount = services.filter((s) => s.type === 'Coupe').length;
    return { totalRevenue, haircutCount };
  }, [services]);

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Prestations'
        subtitle='Gérez vos prestations de coiffure et de beauté.'
      />

      <ServiceFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={modalMode}
        service={selectedService}
        onSuccess={refetch}
      />

      <section className='grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
        <StatCard
          icon={<Scissors className='h-5 w-5' />}
          label='Nombre de prestations'
          value={totalItems.toLocaleString('fr-FR')}
          iconWrapClassName='bg-indigo-100'
          iconClassName='text-indigo-600'
        />

        <StatCard
          icon={<Wand2 className='h-5 w-5' />}
          label='Prestations coupe'
          value={haircutCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-fuchsia-100'
          iconClassName='text-fuchsia-600'
        />

        <StatCard
          icon={<Scissors className='h-5 w-5 rotate-45' />}
          label='Tarif moyen'
          value={
            totalItems === 0
              ? '—'
              : formatMoney(Math.round(totalRevenue / Math.max(1, totalItems)))
          }
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-600'
        />

        <StatCard
          icon={<Scissors className='h-5 w-5' />}
          label='Total catalogue'
          value={formatMoney(totalRevenue)}
          iconWrapClassName='bg-rose-100'
          iconClassName='text-rose-600'
        />
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
            <div className='hidden max-w-xs flex-1 items-center rounded-full bg-slate-50 px-3 py-2 text-xs text-slate-400 ring-1 ring-slate-200 focus-within:ring-rose-400 md:flex'>
              <span className='mr-2'>🔍</span>
              <input
                className='w-full min-w-0 bg-transparent outline-none placeholder:text-slate-400'
                placeholder='Rechercher une prestation...'
              />
            </div>
          </div>
          <div className='flex flex-wrap gap-2 text-xs'>
            <button
              onClick={openCreateModal}
              type='button'
              className='hidden rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 sm:inline-flex cursor-pointer'
            >
              Nouvelle prestation
            </button>
          </div>
        </div>

        <DataTable
          caption='Liste des prestations'
          columns={[
            { label: 'Nom' },
            { label: 'Type' },
            { label: 'Tarif', align: 'right' },
            { label: 'Actions', align: 'right' },
          ]}
        >
          {loading ? (
            <tr>
              <td colSpan={4} className='px-4 py-6 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : totalItems === 0 ? (
            <tr>
              <td colSpan={4} className='px-4 py-10 text-slate-500'>
                Aucune prestation pour le moment.
              </td>
            </tr>
          ) : (
            pagedServices.map((service) => (
              <tr
                key={service.id ?? service.name}
                className='hover:bg-slate-50/60'
              >
                <td className='px-4 py-3 font-medium text-slate-900'>
                  {service.name}
                </td>
                <td className='px-4 py-3 text-slate-600'>{service.type}</td>
                <td className='px-4 py-3 text-right font-semibold text-slate-900'>
                  {formatMoney(Number(service.amount ?? 0))}
                </td>
                <td className='px-4 py-3'>
                  <div className='flex items-center justify-end gap-2 text-slate-300'>
                    <BaseDropdown
                      items={[
                        {
                          label: 'Modifier',
                          icon: <Pencil className='h-4 w-4' />,
                          onClick: () => openEditModal(service),
                        },
                        {
                          label: 'Supprimer',
                          icon: <Trash2 className='h-4 w-4' />,
                          onClick: () => void handleDelete(service),
                        },
                      ]}
                      btnChildren={null}
                    ></BaseDropdown>
                  </div>
                </td>
              </tr>
            ))
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

export default ServicesPage;
