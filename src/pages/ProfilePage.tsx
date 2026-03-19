import { useState } from 'react';
import { PageHeader, useToast } from '../components';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast(
      'info',
      "Les informations de profil ne sont pas encore reliées à l'API.",
    );
  };

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Mon profil'
        subtitle='Consultez et mettez à jour vos informations personnelles.'
      />

      <section className='rounded-2xl bg-white p-4 shadow-sm sm:p-6'>
        <form
          onSubmit={handleSubmit}
          className='grid gap-4 sm:max-w-xl'
          noValidate
        >
          <div className='grid gap-1.5'>
            <label className='text-sm font-medium text-slate-700'>Prénom</label>
            <input
              type='text'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-rose-400 focus:border-rose-400 focus:ring-1'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Votre prénom'
            />
          </div>

          <div className='grid gap-1.5'>
            <label className='text-sm font-medium text-slate-700'>Nom</label>
            <input
              type='text'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-rose-400 focus:border-rose-400 focus:ring-1'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Votre nom'
            />
          </div>

          <div className='grid gap-1.5'>
            <label className='text-sm font-medium text-slate-700'>Email</label>
            <input
              type='email'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-rose-400 focus:border-rose-400 focus:ring-1'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='vous@exemple.com'
            />
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              className='inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
            >
              Enregistrer
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default ProfilePage;
