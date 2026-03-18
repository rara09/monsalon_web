import { DataTable, PageHeader, StatCard } from '../components';
import { useDashboard } from '../hooks/useDashboard';
import {
  BadgeEuro,
  CreditCard,
  HandCoins,
  Receipt,
  Scissors,
  TrendingUp,
} from 'lucide-react';

function formatMoney(value: number) {
  return `${value.toLocaleString('fr-FR')} F`;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

const DashboardPage = () => {
  const { stats, loading, period, setPeriod } = useDashboard('day');

  const totalRevenue = stats?.totalRevenue ?? 0;
  const servicesCount = stats?.servicesCount ?? 0;
  const productSales = stats?.productSales ?? 0;
  const clientDebts = stats?.clientDebts ?? 0;
  const expenses = stats?.expenses ?? 0;
  const profit = stats?.profit ?? 0;
  const profitMargin = stats?.profitMargin ?? 0;
  const activities = stats?.recentActivities ?? [];

  return (
    <section className='space-y-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <PageHeader
          title='Tableau de bord'
          subtitle="Vue d'ensemble de votre salon : performances, rendez-vous et plus encore."
        />
        <div className='flex flex-wrap gap-2 text-xs'>
          {[
            { id: 'day', label: 'Jour' },
            { id: 'week', label: 'Semaine' },
            { id: 'month', label: 'Mois' },
            { id: 'year', label: 'Année' },
          ].map((p) => (
            <button
              key={p.id}
              type='button'
              onClick={() => setPeriod(p.id as any)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                period === p.id
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <section className='grid gap-4 md:grid-cols-3 xl:grid-cols-4'>
        <div className='md:col-span-3 xl:col-span-4'>
          <div className='rounded-3xl bg-gradient-to-br from-[#2a1022] via-[#3a1830] to-[#1c0c18] p-6 text-white shadow-sm'>
            <p className='text-sm text-rose-200'>Chiffre d&apos;affaires total</p>
            <div className='mt-3 flex flex-wrap items-end justify-between gap-4'>
              <p className='text-4xl font-semibold tracking-tight'>
                {formatMoney(totalRevenue)}
              </p>
              <div className='rounded-2xl bg-white/10 px-4 py-2 text-sm text-rose-100 ring-1 ring-white/15'>
                <span className='font-semibold text-white'>
                  {profitMargin.toLocaleString('fr-FR')}%
                </span>{' '}
                marge
              </div>
            </div>
            <p className='mt-2 text-xs text-white/60'>
              {loading ? 'Chargement…' : 'Données en temps réel selon la période.'}
            </p>
          </div>
        </div>

        <StatCard
          icon={<Scissors className='h-5 w-5' />}
          label='Coiffures'
          value={servicesCount.toLocaleString('fr-FR')}
          iconWrapClassName='bg-indigo-100'
          iconClassName='text-indigo-600'
        />

        <StatCard
          icon={<CreditCard className='h-5 w-5' />}
          label='Ventes produits'
          value={productSales.toLocaleString('fr-FR')}
          iconWrapClassName='bg-fuchsia-100'
          iconClassName='text-fuchsia-600'
        />

        <StatCard
          icon={<HandCoins className='h-5 w-5' />}
          label='Dettes clients'
          value={formatMoney(clientDebts)}
          iconWrapClassName='bg-amber-100'
          iconClassName='text-amber-600'
        />

        <StatCard
          icon={<Receipt className='h-5 w-5' />}
          label='Dépenses'
          value={formatMoney(expenses)}
          iconWrapClassName='bg-rose-100'
          iconClassName='text-rose-600'
        />

        <StatCard
          icon={<TrendingUp className='h-5 w-5' />}
          label='Bénéfice'
          value={formatMoney(profit)}
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-600'
        />

        <StatCard
          icon={<BadgeEuro className='h-5 w-5' />}
          label='Marge'
          value={`${profitMargin.toLocaleString('fr-FR')}%`}
          iconWrapClassName='bg-sky-100'
          iconClassName='text-sky-600'
        />
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold tracking-tight text-slate-900'>
            Activité récente
          </h2>
          <button
            type='button'
            className='text-sm font-semibold text-rose-500 hover:text-rose-600'
          >
            Voir tout
          </button>
        </div>

        <DataTable
          caption='Activité récente'
          minWidthClassName='min-w-[760px]'
          columns={[
            { label: 'Type' },
            { label: 'Nom' },
            { label: 'Client' },
            { label: 'Date', align: 'right' },
            { label: 'Montant', align: 'right' },
          ]}
        >
          {loading ? (
            <tr>
              <td colSpan={5} className='px-4 py-6 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : activities.length === 0 ? (
            <tr>
              <td colSpan={5} className='px-4 py-10 text-slate-500'>
                Aucune activité récente.
              </td>
            </tr>
          ) : (
            activities.slice(0, 8).map((a) => (
              <tr key={`${a.type}-${a.id}-${a.date}`} className='hover:bg-slate-50/60'>
                <td className='px-4 py-3 text-slate-500'>{a.type}</td>
                <td className='px-4 py-3 font-medium text-slate-900'>{a.name}</td>
                <td className='px-4 py-3 text-slate-600'>{a.client}</td>
                <td className='px-4 py-3 text-right text-slate-500'>
                  {formatDate(a.date)}
                </td>
                <td className='px-4 py-3 text-right font-semibold text-slate-900'>
                  {formatMoney(Number(a.amount))}
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </section>
    </section>
  );
};

export default DashboardPage;
