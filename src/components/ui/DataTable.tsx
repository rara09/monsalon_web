import type { ReactNode } from 'react';

type Column = {
  label: string;
  align?: 'left' | 'right';
  className?: string;
};

type DataTableProps = {
  caption: string;
  columns: Column[];
  children: ReactNode;
  minWidthClassName?: string;
};

export default function DataTable({
  caption,
  columns,
  children,
  minWidthClassName = 'min-w-[860px]',
}: DataTableProps) {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-100 bg-white'>
      <div className='w-full overflow-x-auto'>
        <table className={`w-full ${minWidthClassName} table-auto border-collapse`}>
          <caption className='sr-only'>{caption}</caption>
          <thead className='bg-slate-100 text-xs font-semibold text-slate-500'>
            <tr className='text-left'>
              {columns.map((col, idx) => (
                <th
                  key={`${col.label}-${idx}`}
                  scope='col'
                  className={`px-4 py-3 ${col.align === 'right' ? 'text-right' : ''} ${
                    col.className ?? ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100 text-sm text-slate-700'>
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

