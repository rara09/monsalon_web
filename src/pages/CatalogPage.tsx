import { useState } from 'react';
import {
  BaseDropdown,
  DataTable,
  PageHeader,
  CatalogServiceFormModal,
} from '../components';
import { useCatalogServices } from '../hooks/useCatalogServices';
import { ClipboardList, Image, Pencil, Trash2 } from 'lucide-react';
import type { CatalogServiceRow } from '../services/catalogService';
import { deleteCatalogService } from '../services/catalogService';
import { useToast } from '../components/ui/ToastProvider';
import getImagePath from '../utils/helpers';

function formatMoney(value: number | string) {
  const n = Number(value ?? 0);
  return `${n.toLocaleString('fr-FR')} F`;
}

export default function CatalogPage() {
  const { items, loading, refetch } = useCatalogServices();
  const { toast, toastError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<CatalogServiceRow | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const activeCount = items.filter((i) => i.isActive).length;

  function openCreate() {
    setModalMode('create');
    setSelected(undefined);
    setIsOpen(true);
  }

  function openEdit(row: CatalogServiceRow) {
    setModalMode('edit');
    setSelected(row);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleDelete(row: CatalogServiceRow) {
    if (deletingId === row.id) return;
    const ok = window.confirm(
      `Supprimer « ${row.name} » du catalogue ? Cette action est irréversible.`,
    );
    if (!ok) return;

    setDeletingId(row.id);
    try {
      await deleteCatalogService(row.id);
      await refetch();
      toast('success', 'Ligne catalogue supprimée.');
    } catch (error) {
      toastError(error, 'Suppression impossible.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Catalogue'
        subtitle='Prestations proposées, tarifs et durées — affichées sur la page d’accueil lorsqu’elles sont actives.'
      />

      <CatalogServiceFormModal
        isOpen={isOpen}
        closeModal={closeModal}
        mode={modalMode}
        row={selected}
        onSuccess={refetch}
      />

      <section className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
            <ClipboardList className='h-4 w-4 text-rose-500' />
            Lignes catalogue
          </div>
          <div className='mt-2 text-2xl font-semibold text-slate-900'>
            {items.length}
          </div>
        </div>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Actives (site)
          </div>
          <div className='mt-2 text-2xl font-semibold text-emerald-700'>
            {activeCount}
          </div>
        </div>
      </section>

      <section className='space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-slate-600'>
            Les rendez-vous continuent d’utiliser l’onglet Prestations
            (historique). Le catalogue sert au tarif affiché au public.
          </p>
          <button
            type='button'
            onClick={openCreate}
            className='inline-flex shrink-0 items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'
          >
            Nouvelle ligne
          </button>
        </div>

        <DataTable
          caption='Catalogue des prestations'
          columns={[
            { label: 'Prestation' },
            { label: 'Type' },
            { label: 'Durée', align: 'right' },
            { label: 'Prix', align: 'right' },
            { label: 'Site' },
            { label: 'Actions', align: 'right' },
          ]}
          minWidthClassName='min-w-[800px]'
        >
          {loading ? (
            <tr>
              <td colSpan={6} className='px-4 py-6 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className='px-4 py-10 text-slate-500'>
                Aucune ligne. Ajoutez une prestation pour l’afficher sur
                l’accueil.
              </td>
            </tr>
          ) : (
            items.map((row) => (
              <tr key={row.id} className='hover:bg-slate-50/60'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200'>
                      {row.image ? (
                        <img
                          src={getImagePath(row.image)}
                          alt=''
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center text-slate-300'>
                          <Image className='h-5 w-5' />
                        </div>
                      )}
                    </div>
                    <div className='min-w-0'>
                      <div className='font-medium text-slate-900'>
                        {row.name}
                      </div>
                      {row.description ? (
                        <div className='mt-0.5 max-w-md truncate text-[11px] text-slate-500'>
                          {row.description}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className='px-4 py-3 text-slate-600'>{row.type}</td>
                <td className='px-4 py-3 text-right text-slate-700'>
                  {row.duration} min
                </td>
                <td className='px-4 py-3 text-right font-semibold text-slate-900'>
                  {formatMoney(row.amount)}
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      row.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {row.isActive ? 'Visible' : 'Masquée'}
                  </span>
                </td>
                <td className='px-4 py-3'>
                  <div className='flex justify-end'>
                    <BaseDropdown
                      items={[
                        {
                          label: 'Modifier',
                          icon: <Pencil className='h-4 w-4' />,
                          onClick: () => openEdit(row),
                        },
                        {
                          label: 'Supprimer',
                          icon: <Trash2 className='h-4 w-4' />,
                          onClick: () => void handleDelete(row),
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
