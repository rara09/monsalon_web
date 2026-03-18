import type { ReactNode } from 'react';

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  iconClassName?: string;
  iconWrapClassName?: string;
};

export default function StatCard({
  icon,
  label,
  value,
  iconClassName = 'text-slate-600',
  iconWrapClassName = 'bg-slate-100',
}: StatCardProps) {
  return (
    <div className='col-span-1 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm'>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${iconWrapClassName} ${iconClassName}`}
        aria-hidden='true'
      >
        {icon}
      </div>
      <div>
        <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
          {label}
        </p>
        <p className='text-xl font-semibold text-slate-900'>{value}</p>
      </div>
    </div>
  );
}

