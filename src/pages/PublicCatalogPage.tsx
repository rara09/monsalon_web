import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  getCatalogServicesPublic,
  SERVICE_TYPE_OPTIONS,
  type CatalogServiceRow,
} from '../services/catalogService';
import getImagePath from '../utils/helpers';
import PublicJumbotron from '../components/public/PublicJumbotron';

function formatDurationLabel(minutes: number): string {
  if (minutes >= 60 && minutes % 60 === 0)
    return minutes === 60 ? '1 h' : `${minutes / 60} h`;
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} h ${m} min`;
  }
  return `${minutes} min`;
}

export default function PublicCatalogPage() {
  const [rows, setRows] = useState<CatalogServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getCatalogServicesPublic();
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) {
          setRows([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const types = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => s.add(r.type));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter && r.type !== typeFilter) return false;
      if (!q) return true;
      const blob = `${r.name} ${r.type} ${r.description ?? ''}`.toLowerCase();
      return blob.includes(q);
    });
  }, [rows, query, typeFilter]);

  return (
    <main className='pb-16'>
      <PublicJumbotron
        eyebrow='Catalogue'
        title='Toutes nos prestations'
        subtitle='Tarifs indicatifs et durées — les prestations affichées sont celles publiées sur le site. Réservez en ligne depuis la page d’accueil.'
        imageSrc='/img/slides/slider2.jpg'
      />

      <div className='mx-auto max-w-6xl px-4 pt-10'>
        <div className='mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative max-w-md flex-1'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40' />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Rechercher une prestation…'
              className='w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white outline-none ring-rose-400/20 placeholder:text-white/35 focus:border-rose-400/30'
            />
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-xs text-white/45'>Type :</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-rose-400/30'
            >
              <option value=''>Tous</option>
              {types.length > 0
                ? types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))
                : SERVICE_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className='mt-14 text-center text-sm text-white/50'>Chargement…</p>
        ) : error ? (
          <p className='mt-14 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-white/65'>
            Impossible de charger le catalogue pour le moment.
          </p>
        ) : filtered.length === 0 ? (
          <p className='mt-14 rounded-2xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center text-sm text-white/65'>
            Aucune prestation ne correspond à votre recherche.
          </p>
        ) : (
          <motion.ul
            className='mt-10 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {filtered.map((r, idx) => {
              const price = Number(r.amount);
              const duration = formatDurationLabel(Number(r.duration) || 60);
              return (
                <li key={r.id}>
                  <article className='group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-sm ring-1 ring-white/5 backdrop-blur transition hover:border-rose-400/25 hover:bg-white/[0.06]'>
                    <div
                      className={[
                        'relative h-32 overflow-hidden',
                        r.image
                          ? ''
                          : 'bg-gradient-to-br from-rose-300/30 via-fuchsia-400/15 to-indigo-500/20',
                      ].join(' ')}
                    >
                      {r.image ? (
                        <img
                          src={getImagePath(r.image)}
                          alt=''
                          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                        />
                      ) : null}
                      <div className='absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white ring-1 ring-white/15'>
                        {duration}
                      </div>
                    </div>
                    <div className='flex flex-1 flex-col p-3.5'>
                      <div className='flex items-start justify-between gap-2'>
                        <h2 className='text-sm font-semibold leading-snug text-white'>
                          {r.name}
                        </h2>
                        <span className='shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/55 ring-1 ring-white/10'>
                          {r.type}
                        </span>
                      </div>
                      {r.description?.trim() ? (
                        <p className='mt-2 line-clamp-2 text-[11px] leading-relaxed text-white/60'>
                          {r.description.trim()}
                        </p>
                      ) : (
                        <p className='mt-2 text-[11px] italic text-white/35'>
                          Pas de description.
                        </p>
                      )}
                      <div className='mt-auto flex items-end justify-between border-t border-white/10 pt-3'>
                        <span className='text-[10px] text-white/45'>
                          #{idx + 1}
                        </span>
                        <span className='text-base font-semibold text-rose-300'>
                          {price.toLocaleString('fr-FR')}{' '}
                          <span className='text-xs font-medium text-white/50'>
                            F
                          </span>
                        </span>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </motion.ul>
        )}

        <div className='mt-12 flex flex-wrap items-center justify-center gap-3'>
          <Link
            to='/#reservation'
            className='inline-flex items-center justify-center rounded-full bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
          >
            Réserver une prestation
          </Link>
          <Link
            to='/produits'
            className='inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10'
          >
            Voir les produits
          </Link>
        </div>
      </div>
    </main>
  );
}
