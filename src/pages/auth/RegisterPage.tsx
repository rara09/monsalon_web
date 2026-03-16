import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Button } from '../../components';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const defaultValues: RegisterForm = {
  email: 'raoulgbadou2@gmail.com',
  password: '12345678',
  firstName: 'R',
  lastName: 'G',
};

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(defaultValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: brancher sur POST /api/auth/register
    // via axios par ex: axios.post('/api/auth/register', form)
    // Pour l'instant, on log seulement.
    // eslint-disable-next-line no-console
    console.log('Register payload', form);
  };

  return (
    <AuthLayout
      title="Créer votre compte"
      subtitle={
        <>
          Vous avez déjà un compte ?{' '}
          <Link to="/auth/login" className="font-medium text-rose-500 hover:text-rose-600">
            Connectez-vous ici
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Prénom
            </label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring"
              placeholder="Jean"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">
              Nom
            </label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg:white focus:ring"
              placeholder="Dupont"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">
            Email professionnel
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring"
            placeholder="jean.dupont@entreprise.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 pr-10 text-sm outline-none ring-rose-100 focus:bg-white focus:ring"
              placeholder="••••••••"
              minLength={8}
              required
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-rose-400">
              ⦿⦿⦿
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-rose-500">Mot de passe sécurisé</span>
            <div className="flex flex-1 items-center gap-1 pl-3">
              <span className="h-1 flex-1 rounded-full bg-rose-400" />
              <span className="h-1 flex-1 rounded-full bg-rose-300" />
              <span className="h-1 flex-1 rounded-full bg-rose-200" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">
            Secteur d&apos;activité
          </label>
          <select
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring"
            defaultValue=""
          >
            <option value="" disabled>
              Sélectionnez un secteur
            </option>
            <option>Salon de coiffure</option>
            <option>Institut de beauté</option>
            <option>Barber shop</option>
            <option>SPA / Bien-être</option>
          </select>
        </div>

        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-500">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-rose-500 focus:ring-rose-400"
            required
          />
          <span>
            J&apos;accepte les{' '}
            <button type="button" className="font-medium text-rose-500">
              conditions générales
            </button>{' '}
            et la{' '}
            <button type="button" className="font-medium text-rose-500">
              politique de confidentialité
            </button>
            .
          </span>
        </div>

        <div className="pt-1">
          <Button type="submit" className="w-full justify-center">
            S&apos;inscrire maintenant
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-3 text-[11px] text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span>OU CONTINUER AVEC</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">
            <span>G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">
            <span>f</span> Facebook
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}

