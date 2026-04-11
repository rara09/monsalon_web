import { useMemo, useState } from 'react';
import { BaseDropdown, DataTable, PageHeader } from '../components';
import { useToast } from '../components/ui/ToastProvider';
import { useGalleryMediaManage } from '../hooks/useGalleryMediaManage';
import type { GalleryMediaRow, GalleryMediaKind } from '../services/galleryService';
import {
  createGalleryMediaFormData,
  deleteGalleryMedia,
  updateGalleryMediaFormData,
} from '../services/galleryService';
import getImagePath from '../utils/helpers';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type FormState = {
  kind: GalleryMediaKind;
  title: string;
  isActive: boolean;
  sortOrder: number;
  src: string; // url externe optionnelle
  file: File | null;
  poster: File | null;
};

function kindLabel(kind: GalleryMediaKind) {
  return kind === 'VIDEO' ? 'Vidéo' : 'Image';
}

export default function GalleryPage() {
  const { toast, toastError } = useToast();
  const { items, loading, refetch } = useGalleryMediaManage();

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<GalleryMediaRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    kind: 'IMAGE',
    title: '',
    isActive: true,
    sortOrder: 0,
    src: '',
    file: null,
    poster: null,
  });

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((i) => i.isActive).length;
    const videos = items.filter((i) => i.kind === 'VIDEO').length;
    return { total, active, videos };
  }, [items]);

  function openCreate() {
    setMode('create');
    setSelected(null);
    setForm({
      kind: 'IMAGE',
      title: '',
      isActive: true,
      sortOrder: 0,
      src: '',
      file: null,
      poster: null,
    });
    setIsOpen(true);
  }

  function openEdit(row: GalleryMediaRow) {
    setMode('edit');
    setSelected(row);
    setForm({
      kind: row.kind,
      title: row.title,
      isActive: row.isActive,
      sortOrder: Number(row.sortOrder ?? 0),
      src: row.src.startsWith('/uploads/') ? '' : row.src,
      file: null,
      poster: null,
    });
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  async function onSave() {
    if (saving) return;
    if (!form.title.trim()) {
      toast('error', 'Le titre est requis.');
      return;
    }
    if (!form.file && !form.src.trim() && mode === 'create') {
      toast('error', 'Ajoutez un fichier ou une URL.');
      return;
    }
    if (form.kind === 'VIDEO' && !form.file && mode === 'create') {
      toast('error', 'Pour une vidéo, uploadez un fichier (mp4/webm).');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('kind', form.kind);
      fd.append('title', form.title.trim());
      fd.append('isActive', String(form.isActive));
      fd.append('sortOrder', String(form.sortOrder || 0));
      if (form.src.trim()) fd.append('src', form.src.trim());
      if (form.file) fd.append('file', form.file);
      if (form.poster) fd.append('poster', form.poster);

      if (mode === 'create') {
        await createGalleryMediaFormData(fd);
        toast('success', 'Media ajouté.');
      } else if (selected) {
        await updateGalleryMediaFormData(selected.id, fd);
        toast('success', 'Media modifié.');
      }

      close();
      await refetch();
    } catch (error) {
      toastError(error, 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(row: GalleryMediaRow) {
    if (deletingId === row.id) return;
    const ok = window.confirm(`Supprimer « ${row.title} » ?`);
    if (!ok) return;
    setDeletingId(row.id);
    try {
      await deleteGalleryMedia(row.id);
      await refetch();
      toast('success', 'Media supprimé.');
    } catch (error) {
      toastError(error, 'Suppression impossible.');
    } finally {
      setDeletingId(null);
    }
  }

  function previewUrl(row: GalleryMediaRow) {
    if (row.kind === 'VIDEO') return row.poster ? getImagePath(row.poster) : '';
    return row.src.startsWith('/uploads/') ? getImagePath(row.src) : row.src;
  }

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Galerie'
        subtitle='Ajoutez, modifiez et publiez les médias affichés sur le landing.'
      />

      <section className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Médias
          </div>
          <div className='mt-2 text-2xl font-semibold text-slate-900'>
            {stats.total}
          </div>
        </div>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Actifs (site)
          </div>
          <div className='mt-2 text-2xl font-semibold text-emerald-700'>
            {stats.active}
          </div>
        </div>
        <div className='rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200'>
          <div className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
            Vidéos
          </div>
          <div className='mt-2 text-2xl font-semibold text-slate-900'>
            {stats.videos}
          </div>
        </div>
      </section>

      <section className='space-y-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-sm text-slate-600'>
            Ordre : `sortOrder` croissant. Vous pouvez désactiver un média sans le supprimer.
          </p>
          <button
            type='button'
            onClick={openCreate}
            className='inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'
          >
            <Plus className='h-4 w-4' />
            Nouveau média
          </button>
        </div>

        {/* Modal simple inline */}
        {isOpen ? (
          <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div>
                <div className='text-sm font-semibold text-slate-900'>
                  {mode === 'create' ? 'Ajouter' : 'Modifier'} un média
                </div>
                <div className='text-xs text-slate-500'>
                  Image : upload ou URL. Vidéo : upload + poster optionnel.
                </div>
              </div>
              <button
                type='button'
                onClick={close}
                className='rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              >
                Fermer
              </button>
            </div>

            <div className='mt-4 grid gap-3 md:grid-cols-2'>
              <label className='space-y-1'>
                <span className='text-xs font-semibold text-slate-600'>Type</span>
                <select
                  className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300'
                  value={form.kind}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kind: e.target.value as GalleryMediaKind }))
                  }
                >
                  <option value='IMAGE'>Image</option>
                  <option value='VIDEO'>Vidéo</option>
                </select>
              </label>

              <label className='space-y-1'>
                <span className='text-xs font-semibold text-slate-600'>Titre</span>
                <input
                  className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300'
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </label>

              <label className='space-y-1'>
                <span className='text-xs font-semibold text-slate-600'>
                  Fichier ({form.kind === 'VIDEO' ? 'vidéo' : 'image'})
                </span>
                <input
                  type='file'
                  accept={form.kind === 'VIDEO' ? 'video/*' : 'image/*'}
                  className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm'
                  onChange={(e) =>
                    setForm((p) => ({ ...p, file: e.target.files?.[0] ?? null }))
                  }
                />
              </label>

              <label className='space-y-1'>
                <span className='text-xs font-semibold text-slate-600'>
                  URL externe (optionnel)
                </span>
                <input
                  placeholder='https://...'
                  className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300'
                  value={form.src}
                  onChange={(e) => setForm((p) => ({ ...p, src: e.target.value }))}
                />
              </label>

              <label className='space-y-1'>
                <span className='text-xs font-semibold text-slate-600'>
                  Poster (optionnel, vidéo)
                </span>
                <input
                  type='file'
                  accept='image/*'
                  className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm'
                  onChange={(e) =>
                    setForm((p) => ({ ...p, poster: e.target.files?.[0] ?? null }))
                  }
                  disabled={form.kind !== 'VIDEO'}
                />
              </label>

              <label className='space-y-1'>
                <span className='text-xs font-semibold text-slate-600'>Ordre</span>
                <input
                  type='number'
                  className='w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300'
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))
                  }
                />
              </label>

              <label className='flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm'>
                <input
                  type='checkbox'
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
                Publier sur le site
              </label>
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <button
                type='button'
                onClick={onSave}
                disabled={saving}
                className='rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600 disabled:opacity-60'
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        ) : null}

        <DataTable
          caption='Médias galerie'
          columns={[
            { label: 'Preview' },
            { label: 'Titre' },
            { label: 'Type' },
            { label: 'Actif' },
            { label: 'Ordre', align: 'right' },
            { label: 'Actions', align: 'right' },
          ]}
          minWidthClassName='min-w-[980px]'
        >
          {loading ? (
            <tr>
              <td colSpan={6} className='px-4 py-10 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className='px-4 py-10 text-slate-500'>
                Aucun média.
              </td>
            </tr>
          ) : (
            items.map((row) => (
              <tr key={row.id} className='hover:bg-slate-50/60'>
                <td className='px-4 py-3'>
                  <div className='h-10 w-14 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200'>
                    {previewUrl(row) ? (
                      <img
                        src={previewUrl(row)}
                        alt=''
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                </td>
                <td className='px-4 py-3 font-semibold text-slate-900'>
                  {row.title}
                </td>
                <td className='px-4 py-3 text-slate-600'>{kindLabel(row.kind)}</td>
                <td className='px-4 py-3'>
                  <span
                    className={[
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      row.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500',
                    ].join(' ')}
                  >
                    {row.isActive ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className='px-4 py-3 text-right text-slate-600'>
                  {row.sortOrder}
                </td>
                <td className='px-4 py-3 text-right'>
                  <div className='flex justify-end'>
                    <BaseDropdown
                      items={[
                        {
                          label: 'Modifier',
                          icon: <Pencil className='h-4 w-4' />,
                          onClick: () => openEdit(row),
                        },
                        {
                          label: deletingId === row.id ? 'Suppression…' : 'Supprimer',
                          icon: <Trash2 className='h-4 w-4' />,
                          onClick: () => void onDelete(row),
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

