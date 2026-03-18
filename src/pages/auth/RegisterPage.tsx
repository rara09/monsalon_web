import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components';
import type { RegisterData } from '../../types/authType';
import { register } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  registerSchema,
  type RegisterForm,
} from '../../schemas/registerSchema';

const defaultValues: RegisterData = {
  email: 'raoulgbadou2@gmail.com',
  password: '12345678',
  firstName: 'R',
  lastName: 'G',
};

export default function RegisterPage() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (formData: RegisterForm) => {
    if (isSubmitting) return;

    try {
      const data = await register(formData as RegisterData);
      const { access_token, ...user } = data;

      setAuth(access_token, user);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Register error', error);
    }
  };

  return (
    <AuthLayout
      title='Créer votre compte'
      subtitle={
        <>
          Vous avez déjà un compte ?{' '}
          <Link
            to='/auth/login'
            className='font-medium text-rose-500 hover:text-rose-600'
          >
            Connectez-vous ici
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4'
        method='POST'
      >
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Nom</label>
            <input
              type='text'
              {...formRegister('lastName')}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Dupont'
              required
            />
            {errors.lastName && (
              <p className='text-red-500 italic text-xs'>
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Prénom</label>
            <input
              type='text'
              {...formRegister('firstName')}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Jean'
              required
            />
            {errors.firstName && (
              <p className='text-red-500 italic text-xs'>
                {errors.firstName.message}
              </p>
            )}
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-slate-700'>
            Email professionnel
          </label>
          <input
            type='email'
            {...formRegister('email')}
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            placeholder='jean.dupont@entreprise.com'
            required
          />
          {errors.email && (
            <p className='text-red-500 italic text-xs'>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-slate-700'>
            Mot de passe
          </label>
          <div className='relative'>
            <input
              type='password'
              {...formRegister('password')}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='••••••••'
              minLength={6}
              required
            />
            <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-rose-400'>
              ⦿⦿⦿
            </span>
          </div>
          {errors.password && (
            <p className='text-red-500 italic text-xs'>
              {errors.password.message}
            </p>
          )}
          <div className='flex items-center justify-between text-[11px]'>
            <span className='text-rose-500'>Mot de passe sécurisé</span>
            <div className='flex flex-1 items-center gap-1 pl-3'>
              <span className='h-1 flex-1 rounded-full bg-rose-400' />
              <span className='h-1 flex-1 rounded-full bg-rose-300' />
              <span className='h-1 flex-1 rounded-full bg-rose-200' />
            </div>
          </div>
        </div>

        {/* <div className='space-y-1.5'>
          <label className='text-xs font-medium text-slate-700'>
            Secteur d&apos;activité
          </label>
          <select
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            defaultValue=''
          >
            <option value='' disabled>
              Sélectionnez un secteur
            </option>
            <option>Salon de coiffure</option>
            <option>Institut de beauté</option>
            <option>Barber shop</option>
            <option>SPA / Bien-être</option>
          </select>
        </div> */}

        <div className='flex items-start gap-2 pt-1 text-[11px] text-slate-500'>
          <input
            type='checkbox'
            className='mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-rose-500 focus:ring-rose-400'
            required
          />
          <span>
            J&apos;accepte les{' '}
            <button type='button' className='font-medium text-rose-500'>
              conditions générales
            </button>{' '}
            et la{' '}
            <button type='button' className='font-medium text-rose-500'>
              politique de confidentialité
            </button>
            .
          </span>
        </div>

        <div className='pt-1'>
          <Button
            type='submit'
            className='w-full justify-center'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Inscription en cours…' : "S'inscrire maintenant"}
          </Button>
        </div>

        <div className='flex items-center gap-3 pt-3 text-[11px] text-slate-400'>
          <div className='h-px flex-1 bg-slate-200' />
          <span>OU CONTINUER AVEC</span>
          <div className='h-px flex-1 bg-slate-200' />
        </div>

        <div className='grid grid-cols-2 gap-3 text-xs'>
          <button className='flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50'>
            <span>G</span> Google
          </button>
          <button className='flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50'>
            <span>f</span> Facebook
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
