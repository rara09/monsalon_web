import { PageHeader } from '../components';

const DashboardPage = () => {
  return (
    <section className='space-y-8'>
      <PageHeader
        title='Tableau de bord'
        subtitle="Vue d'ensemble de votre salon : performances, rendez-vous et plus encore."
      />
    </section>
  );
};

export default DashboardPage;
