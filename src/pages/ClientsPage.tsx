import { PageHeader } from '../components';

type Client = {
  id: number;
  initials: string;
  name: string;
  phone: string;
  lastService: string;
  vipStatus: 'VIP' | 'Standard';
  lastVisit: string;
};

const mockClients: Client[] = [
  {
    id: 1,
    initials: 'JD',
    name: 'Jean Dupont',
    phone: '06 12 34 56 78',
    lastService: 'Coupe Homme',
    vipStatus: 'VIP',
    lastVisit: 'Il y a 2 jours',
  },
  {
    id: 2,
    initials: 'MC',
    name: 'Marie Curie',
    phone: '07 89 45 12 36',
    lastService: 'Coloration',
    vipStatus: 'Standard',
    lastVisit: 'Il y a 1 semaine',
  },
  {
    id: 3,
    initials: 'LM',
    name: 'Lucas Martin',
    phone: '06 55 44 33 22',
    lastService: 'Barbe & Coupe',
    vipStatus: 'VIP',
    lastVisit: 'Hier',
  },
  {
    id: 4,
    initials: 'SM',
    name: 'Sophie Morel',
    phone: '06 01 02 03 04',
    lastService: 'Brushing',
    vipStatus: 'Standard',
    lastVisit: 'Il y a 3 semaines',
  },
  {
    id: 5,
    initials: 'PD',
    name: 'Pierre Durand',
    phone: '07 66 77 88 99',
    lastService: 'Soin Capillaire',
    vipStatus: 'Standard',
    lastVisit: 'Il y a 1 mois',
  },
];

export function ClientsPage() {
  return (
    <section className='space-y-8'>
      <PageHeader
        title='Gestion des clients'
        subtitle='Consultez, filtrez et gérez votre base de données clients.'
      />

      <section className='grid gap-4 md:grid-cols-3 xl:grid-cols-5'>
        <div className='col-span-1 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
            👥
          </div>
          <div>
            <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
              Total clients
            </p>
            <p className='text-xl font-semibold text-slate-900'>1,284</p>
          </div>
        </div>

        <div className='col-span-1 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-500'>
            ⭐
          </div>
          <div>
            <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
              Membres VIP
            </p>
            <p className='text-xl font-semibold text-slate-900'>142</p>
          </div>
        </div>

        <div className='col-span-1 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500'>
            ➕
          </div>
          <div>
            <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
              Ce mois
            </p>
            <p className='text-xl font-semibold text-slate-900'>+24</p>
          </div>
        </div>

        <div className='col-span-1 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500'>
            🔁
          </div>
          <div>
            <p className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
              Taux de retour
            </p>
            <p className='text-xl font-semibold text-slate-900'>84%</p>
          </div>
        </div>
      </section>

      <section className='space-y-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
            <button className='rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-600'>
              Tous
            </button>
            <button className='rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200'>
              Nouveaux
            </button>
            <button className='rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200'>
              Inactifs
            </button>
          </div>
          <div className='flex flex-wrap gap-2 text-xs'>
            <button className='rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200'>
              VIP
            </button>
            <button className='rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200'>
              Standard
            </button>
          </div>
        </div>

        <div className='overflow-hidden rounded-2xl border border-slate-100'>
          <div className='hidden bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto]'>
            <span>Nom du client</span>
            <span>Téléphone</span>
            <span>Dernier service</span>
            <span>Statut VIP</span>
            <span className='text-right'>Dernière visite</span>
          </div>

          <ul className='divide-y divide-slate-100'>
            {mockClients.map((client) => (
              <li
                key={client.id}
                className='grid items-center gap-3 px-4 py-3 text-sm text-slate-700 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto]'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-xs font-semibold text-rose-500'>
                    {client.initials}
                  </div>
                  <span className='font-medium'>{client.name}</span>
                </div>

                <span className='text-xs text-slate-500 sm:text-sm'>
                  {client.phone}
                </span>

                <span className='hidden text-xs text-slate-500 sm:block sm:text-sm'>
                  {client.lastService}
                </span>

                <span className='flex items-center gap-2'>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      client.vipStatus === 'VIP'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {client.vipStatus}
                  </span>
                </span>

                <div className='flex items-center justify-between gap-3 sm:justify-end'>
                  <span className='text-xs text-slate-400 sm:text-sm'>
                    {client.lastVisit}
                  </span>
                  <div className='flex items-center gap-2 text-slate-300'>
                    <button
                      className='hover:text-slate-500'
                      aria-label='Historique'
                    >
                      ⟳
                    </button>
                    <button
                      className='hover:text-slate-500'
                      aria-label='Éditer'
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='flex flex-col items-center justify-between gap-3 pt-2 text-xs text-slate-500 sm:flex-row'>
          <span>Affichage de 1 à 5 sur 1,284 clients</span>
          <div className='flex items-center gap-1'>
            <button className='flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white'>
              1
            </button>
            <button className='flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100'>
              2
            </button>
            <button className='flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100'>
              3
            </button>
            <span className='px-1'>…</span>
            <button className='flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100'>
              256
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
