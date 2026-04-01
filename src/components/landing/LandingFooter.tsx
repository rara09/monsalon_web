import { Link } from 'react-router-dom';
import { AppLogo } from '../ui';
import { ChevronUp, Facebook, Linkedin, Twitter, Youtube } from 'lucide-react';

const SOCIAL = [
  {
    label: 'X (Twitter)',
    href: '#',
    icon: Twitter,
  },
  {
    label: 'Facebook',
    href: '#',
    icon: Facebook,
  },
  {
    label: 'YouTube',
    href: '#',
    icon: Youtube,
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: Linkedin,
  },
] as const;

/** Image de fond du footer (public/). */
const FOOTER_BG_IMAGE = '/img/about_us/slider_4.jpg';

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const LandingFooter = () => {
  return (
    <footer className='relative overflow-hidden text-white'>
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${FOOTER_BG_IMAGE})` }}
        aria-hidden
      />
      {/* Voile : noir + rosé pour lisibilité sans “trou noir” */}
      <div
        className='pointer-events-none absolute inset-0 bg-linear-to-b from-black/75 via-rose-950/70 to-black/80'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_100%,rgba(0,0,0,0.5),transparent_55%)]'
        aria-hidden
      />

      <div className='relative z-10 mx-auto max-w-3xl px-4 py-16 text-center sm:py-20'>
        <div className='flex justify-center py-2'>
          <div className='text-white [&_span]:text-white'>
            <AppLogo />
          </div>
        </div>

        <div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
          {SOCIAL.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className='inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-400 text-rose-400 transition hover:bg-rose-400/10 hover:text-rose-300'
            >
              <Icon className='h-5 w-5' strokeWidth={1.75} />
            </a>
          ))}
        </div>

        <p className='mt-12 text-sm text-white/70'>
          ©{' '}
          <Link
            to='/'
            className='font-medium text-rose-400 underline decoration-rose-400/80 underline-offset-2 transition hover:text-rose-300'
          >
            MG BEAUTY
          </Link>
          , tous droits réservés.
        </p>
        <p className='mt-2 text-sm text-white/70'>
          <Link
            to='/auth/login'
            className='text-rose-400 underline decoration-rose-400/80 underline-offset-2 transition hover:text-rose-300'
          >
            Connexion
          </Link>
          {' · '}
          <Link
            to='/auth/register'
            className='text-rose-400 underline decoration-rose-400/80 underline-offset-2 transition hover:text-rose-300'
          >
            Inscription
          </Link>
          {' · '}
          <a
            href='#mentions-legales'
            className='text-rose-400 underline decoration-rose-400/80 underline-offset-2 transition hover:text-rose-300'
          >
            Mentions légales
          </a>
        </p>
      </div>

      <button
        type='button'
        onClick={scrollToTop}
        aria-label='Retour en haut de la page'
        className='fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-400 text-rose-400 shadow-lg transition hover:bg-rose-400/10 hover:text-rose-300'
      >
        <ChevronUp className='h-6 w-6' strokeWidth={2.25} />
      </button>
    </footer>
  );
};

export default LandingFooter;
