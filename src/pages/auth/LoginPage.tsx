import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components';
import type { LoginData } from '../../types/authType';
import { useAuth } from '../../hooks/useAuth';
import { login, userFromAuthResponse } from '../../services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '../../schemas/loginSchema';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

const defaultValues: LoginData = {
  email: 'raoulgbadou2@gmail.com',
  password: '12345678',
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (formData: LoginForm) => {
    if (isSubmitting) return;
    try {
      const data = await login(formData);
      const user = userFromAuthResponse(data);
      setAuth(user);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error', error);
    }
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-5'
        method='POST'
      >
        <div className='space-y-1.5'>
          <label className='text-xs font-medium text-slate-700'>
            Email professionnel
          </label>
          <input
            type='text'
            {...register('email')}
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            placeholder='codjo@entreprise.com'
            required
          />
          {errors.email && (
            <p className='text-red-500 italic text-xs'>
              {errors.email.message}
            </p>
          )}
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
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='••••••••'
              required
              autoComplete='current-password'
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              className='absolute inset-y-0 right-2 flex items-center rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
              aria-label={
                showPassword
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              }
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' aria-hidden />
              ) : (
                <Eye className='h-4 w-4' aria-hidden />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-red-500 italic text-xs'>
              {errors.password.message}
            </p>
          )}
        </div>

        <div className='flex items-center gap-2 pt-1 text-[11px] text-slate-500'>
          <input
            type='checkbox'
            className='mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-rose-500 focus:ring-rose-400'
          />
          <span>Rester connecté sur cet appareil</span>
        </div>

        <div className='pt-2'>
          <Button
            type='submit'
            className='w-full justify-center cursor-pointer'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
