import { useState } from 'react';
import { PageHeader, useToast } from '../components';

const SettingsPage = () => {
  const { toast, toastError } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toastError(
        new Error('Le mot de passe doit contenir au moins 6 caractères.'),
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toastError(new Error('Les mots de passe ne correspondent pas.'));
      return;
    }

    toast(
      'info',
      'Le changement de mot de passe sera connecté à l’API ultérieurement.',
    );
  };

  return (
    <section className='space-y-8'>
      <PageHeader
        title='Paramètres du compte'
        subtitle='Gérez la sécurité de votre compte et vos préférences.'
      />

      <section className='rounded-2xl bg-white p-4 shadow-sm sm:p-6'>
        <h2 className='mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500'>
          Sécurité
        </h2>

        <form
          onSubmit={handleSubmit}
          className='grid gap-4 sm:max-w-xl'
          noValidate
        >
          <div className='grid gap-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              Mot de passe actuel
            </label>
            <input
              type='password'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-rose-400 focus:border-rose-400 focus:ring-1'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder='Votre mot de passe actuel'
            />
          </div>

          <div className='grid gap-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              Nouveau mot de passe
            </label>
            <input
              type='password'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-rose-400 focus:border-rose-400 focus:ring-1'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Au moins 6 caractères'
            />
          </div>

          <div className='grid gap-1.5'>
            <label className='text-sm font-medium text-slate-700'>
              Confirmation du mot de passe
            </label>
            <input
              type='password'
              className='w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-rose-400 focus:border-rose-400 focus:ring-1'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Répétez le nouveau mot de passe'
            />
          </div>

          <div className='pt-2'>
            <button
              type='submit'
              className='inline-flex items-center rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600'
            >
              Mettre à jour le mot de passe
            </button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default SettingsPage;
