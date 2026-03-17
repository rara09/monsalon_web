import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components';
import type { LoginData, SubmitHandler } from '../../types/authType';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../services/authService';

const defaultValues: LoginData = {
  email: 'raoulgbadou@gmail.com',
  password: '12345678',
};

export default function LoginPage() {
  const [form, setForm] = useState<LoginData>(defaultValues);
  const { login: setAuth } = useAuth();
  // const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: SubmitHandler = async (e) => {
    // setLoading(true);
    e.preventDefault();
    try {
      const data = await login(form);
      const { access_token, ...user } = data;

      setAuth(access_token, user);
      return <Navigate to='/' replace />;
    } catch (error) {
      console.error('Login error', error);
    }
    // setLoading(false);
  };

  return (
    <AuthLayout
      title='Connexion à votre espace'
      subtitle={
        <>
          Vous n&apos;avez pas encore de compte ?{' '}
          <Link
            to='/auth/register'
            className='font-medium text-rose-500 hover:text-rose-600'
          >
            Créez un compte
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className='space-y-5' method='POST'>
        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-slate-700'>
            Email professionnel
          </label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            placeholder='jean.dupont@entreprise.com'
            required
          />
        </div>

        <div className='space-y-1.5'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-slate-700'>
              Mot de passe
            </label>
            <button
              type='button'
              className='text-[11px] font-medium text-rose-500 hover:text-rose-600'
            >
              Mot de passe oublié ?
            </button>
          </div>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            placeholder='••••••••'
            required
          />
        </div>

        <div className='flex items-center gap-2 pt-1 text-[11px] text-slate-500'>
          <input
            type='checkbox'
            className='mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-rose-500 focus:ring-rose-400'
          />
          <span>Rester connecté sur cet appareil</span>
        </div>

        <div className='pt-2'>
          <Button type='submit' className='w-full justify-center'>
            Se connecter
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
