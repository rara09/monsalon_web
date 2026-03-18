import { useEffect, useMemo } from 'react';

type PaginationProps = {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export default function Pagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) onPageChange(safePage);
  }, [onPageChange, page, safePage]);

  const startIndex = (safePage - 1) * pageSize;
  const endIndexExclusive = Math.min(startIndex + pageSize, totalItems);
  const startDisplay = totalItems === 0 ? 0 : startIndex + 1;
  const endDisplay = endIndexExclusive;

  const items = useMemo(() => {
    const res: Array<number | '…'> = [];
    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p += 1) res.push(p);
      return res;
    }

    const left = Math.max(2, safePage - 1);
    const right = Math.min(totalPages - 1, safePage + 1);

    res.push(1);
    if (left > 2) res.push('…');
    for (let p = left; p <= right; p += 1) res.push(p);
    if (right < totalPages - 1) res.push('…');
    res.push(totalPages);
    return res;
  }, [safePage, totalPages]);

  return (
    <div className='flex flex-col items-center justify-between gap-3 pt-2 text-xs text-slate-500 sm:flex-row'>
      <span>
        Affichage de {startDisplay} à {endDisplay} sur {totalItems} éléments
      </span>
      <div className='flex items-center gap-1'>
        <button
          type='button'
          className='flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent'
          onClick={() => onPageChange(Math.max(1, safePage - 1))}
          disabled={disabled || safePage <= 1 || totalItems === 0}
          aria-label='Page précédente'
        >
          ‹
        </button>

        {items.map((item, idx) =>
          item === '…' ? (
            <span key={`ellipsis-${idx}`} className='px-1 text-slate-400'>
              …
            </span>
          ) : (
            <button
              type='button'
              key={item}
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                item === safePage
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
              onClick={() => onPageChange(item)}
              disabled={disabled}
              aria-current={item === safePage ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}

        <button
          type='button'
          className='flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent'
          onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
          disabled={disabled || safePage >= totalPages || totalItems === 0}
          aria-label='Page suivante'
        >
          ›
        </button>
      </div>
    </div>
  );
}

