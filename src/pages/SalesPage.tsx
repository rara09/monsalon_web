import { useMemo, useState } from 'react';
import { DataTable, PageHeader, SaleFormModal, StatCard } from '../components';
import { useSales } from '../hooks/useSales';
import { CreditCard, HandCoins, Receipt, ShoppingBag } from 'lucide-react';

function formatMoney(value: number | string) {
  const n = Number(value ?? 0);
  return `${n.toLocaleString('fr-FR')} F`;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

const SalesPage = () => {
  const { sales, loading, refetch } = useSales();
  const [isOpen, setIsOpen] = useState(false);

  const totalSales = sales.length;
  const totalRevenue = sales.reduce(
    (sum, s) => sum + Number(s.totalAmount ?? 0),
    0,
  );
  const cashSales = sales.filter((s) => s.paymentMethod === 'Espèces').length;
  const cardSales = sales.filter((s) => s.paymentMethod === 'Carte').length;

  const topClient = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sales) {
      if (!s.client) continue;
      const name = `${s.client.firstName} ${s.client.lastName}`.trim();
      counts[name] = (counts[name] ?? 0) + 1;
    }
    const entries = Object.entries(counts);
    if (!entries.length) return null;
    entries.sort((a, b) => b[1] - a[1]);
    return { name: entries[0][0], count: entries[0][1] };
  }, [sales]);

  return (
    <section className='space-y-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <PageHeader
          title='Ventes'
          subtitle='Suivez vos ventes, moyens de paiement et clients.'
        />
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          className='inline-flex items-center justify-center rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'
        >
          Nouvelle vente
        </button>
      </div>

      <SaleFormModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        onSuccess={refetch}
      />

      <section className='grid gap-4 md:grid-cols-4'>
        <StatCard
          icon={<ShoppingBag className='h-5 w-5' />}
          label='Nombre de ventes'
          value={totalSales.toLocaleString('fr-FR')}
          iconWrapClassName='bg-indigo-100'
          iconClassName='text-indigo-600'
        />
        <StatCard
          icon={<Receipt className='h-5 w-5' />}
          label='Chiffre d’affaires'
          value={formatMoney(totalRevenue)}
          iconWrapClassName='bg-emerald-100'
          iconClassName='text-emerald-600'
        />
        <StatCard
          icon={<HandCoins className='h-5 w-5' />}
          label='Ventes espèces'
          value={cashSales.toLocaleString('fr-FR')}
          iconWrapClassName='bg-amber-100'
          iconClassName='text-amber-600'
        />
        <StatCard
          icon={<CreditCard className='h-5 w-5' />}
          label='Ventes carte'
          value={cardSales.toLocaleString('fr-FR')}
          iconWrapClassName='bg-fuchsia-100'
          iconClassName='text-fuchsia-600'
        />
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold tracking-tight text-slate-900'>
              Historique des ventes
            </h2>
            {topClient && (
              <p className='text-xs text-slate-500'>
                Meilleur client: <span className='font-medium'>{topClient.name}</span>{' '}
                ({topClient.count} ventes)
              </p>
            )}
          </div>
        </div>

        <DataTable
          caption='Historique des ventes'
          minWidthClassName='min-w-[780px]'
          columns={[
            { label: 'Date' },
            { label: 'Client' },
            { label: 'Articles' },
            { label: 'Paiement' },
            { label: 'Montant', align: 'right' },
          ]}
        >
          {loading ? (
            <tr>
              <td colSpan={5} className='px-4 py-6 text-slate-500'>
                Chargement…
              </td>
            </tr>
          ) : sales.length === 0 ? (
            <tr>
              <td colSpan={5} className='px-4 py-10 text-slate-500'>
                Aucune vente enregistrée pour le moment.
              </td>
            </tr>
          ) : (
            sales
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((sale) => {
                const clientName = sale.client
                  ? `${sale.client.firstName} ${sale.client.lastName}`.trim()
                  : 'Client de passage';
                const itemsLabel =
                  sale.items.length === 1
                    ? sale.items[0].product?.name ?? '1 article'
                    : `${sale.items.length} articles`;

                return (
                  <tr key={sale.id} className='hover:bg-slate-50/60'>
                    <td className='px-4 py-3 text-slate-600'>
                      {formatDate(sale.createdAt)}
                    </td>
                    <td className='px-4 py-3 text-slate-700'>{clientName}</td>
                    <td className='px-4 py-3 text-slate-600'>{itemsLabel}</td>
                    <td className='px-4 py-3 text-slate-600'>
                      {sale.paymentMethod}
                    </td>
                    <td className='px-4 py-3 text-right font-semibold text-slate-900'>
                      {formatMoney(sale.totalAmount)}
                    </td>
                  </tr>
                );
              })
          )}
        </DataTable>
      </section>
    </section>
  );
};

export default SalesPage;
