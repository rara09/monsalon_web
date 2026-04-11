import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type PublicJumbotronProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  imageSrc: string;
};

export default function PublicJumbotron({
  eyebrow,
  title,
  subtitle,
  imageSrc,
}: PublicJumbotronProps) {
  return (
    <section className='relative w-full overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-hidden
      />
      <div
        className='absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-rose-950/70'
        aria-hidden
      />
      <div
        className='absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(244,63,94,0.18),transparent_55%)]'
        aria-hidden
      />

      {/* padding-top pour compenser le header fixed */} 
      <div className='relative min-h-[52vh] pt-24 sm:pt-28 md:min-h-[56vh]'>
        <div className='mx-auto max-w-6xl px-4 pb-10 sm:pb-14'>
          <div className='mt-10 max-w-3xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.22em] text-rose-200'>
              {eyebrow}
            </p>
            <h1 className='mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl'>
              {title}
            </h1>
            {subtitle ? (
              <p className='mt-3 max-w-2xl text-sm leading-relaxed text-white/70'>
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        <div className='absolute bottom-6 right-6 sm:bottom-8 sm:right-10'>
          <Link
            to='/'
            className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 text-sm font-semibold text-white/90 shadow-lg backdrop-blur transition hover:bg-black/55 hover:text-rose-100'
          >
            <ArrowLeft className='h-4 w-4' />
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </section>
  );
}

