import { Link, Navigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components';
import type { LoginData } from '../../types/authType';
import { useAuth } from '../../hooks/useAuth';
import { login } from '../../services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '../../schemas/loginSchema';
import { useForm } from 'react-hook-form';

const defaultValues: LoginData = {
  email: 'raoulgbadou@gmail.com',
  password: '12345678',
};

export default function LoginPage() {
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const { login: setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmit = async (formData: LoginForm) => {
    // e.preventDefault();
    if (isSubmitting) return;

    // setIsSubmitting(true);
    try {
      const data = await login(formData);
      const { access_token, ...user } = data;

      setAuth(access_token, user);
      return <Navigate to='/' replace />;
    } catch (error) {
      console.error('Login error', error);
    } finally {
      // setIsSubmitting(false);
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
          <input
            type='password'
            {...register('password')}
            className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
            placeholder='••••••••'
            required
          />
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
