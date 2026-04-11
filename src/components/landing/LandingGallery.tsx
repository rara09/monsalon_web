import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import getImagePath from '../../utils/helpers';
import { useGalleryMedia } from '../../hooks/useGalleryMedia';
import type { GalleryMediaRow } from '../../services/galleryService';

type GalleryItem = Pick<GalleryMediaRow, 'kind' | 'src' | 'title' | 'poster'> & {
  id?: number;
};

const FALLBACK: GalleryItem[] = [
  { kind: 'IMAGE', src: '/img/about_us/hair_2.jpg', title: 'Coiffure & mise en forme' },
  { kind: 'IMAGE', src: '/img/about_us/esthetic_1.jpg', title: 'Soins & détente' },
  { kind: 'IMAGE', src: '/img/about_us/makeup_1.jpg', title: 'Maquillage' },
  { kind: 'IMAGE', src: '/img/about_us/tresse_2.jpg', title: 'Tresses & styles' },
  { kind: 'IMAGE', src: '/img/slides/slider1.jpg', title: 'Ambiance salon' },
];

function resolveMediaSrc(src: string): string {
  // Uploads backend: /uploads/... => API baseURL
  if (src.startsWith('/uploads/')) return getImagePath(src);
  // Public assets: /img/... => served by Vite
  return src;
}

function resolvePoster(poster?: string | null): string | undefined {
  if (!poster) return undefined;
  return resolveMediaSrc(poster);
}

/** Distance signée minimale entre la slide i et l’index actif (boucle → défilement infini visuel). */
function circularOffset(i: number, active: number, len: number): number {
  if (len <= 1) return 0;
  let diff = i - active;
  while (diff > len / 2) diff -= len;
  while (diff < -len / 2) diff += len;
  return diff;
}

export default function LandingGallery() {
  const { items: apiItems } = useGalleryMedia();
  const items: GalleryItem[] = useMemo(
    () => (apiItems.length ? apiItems : FALLBACK),
    [apiItems],
  );
  const [index, setIndex] = useState(0);
  const len = items.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + len) % len);
    },
    [len],
  );

  const active = items[index]!;

  return (
    <section
      id='galerie'
      className='relative overflow-hidden bg-slate-950 py-16 md:py-20'
    >
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(244,63,94,0.12),transparent_50%)]' />

      <div className='relative mx-auto max-w-6xl px-4'>
        <div className='text-center'>
          <div className='text-xs font-semibold uppercase tracking-[0.25em] text-rose-300'>
            Galerie
          </div>
          <h2 className='mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl'>
            Quelques réalisations
          </h2>
          <p className='mt-2 text-sm text-white/60'>
            Faites défiler avec les flèches ou en touchant les volets latéraux.
          </p>
        </div>

        <div className='relative mt-12' style={{ perspective: '1400px' }}>
          <div className='relative flex min-h-[min(72vw,520px)] items-center justify-center md:min-h-[420px]'>
            {items.map((item, i) => {
              const offset = circularOffset(i, index, len);
              const abs = Math.abs(offset);
              if (abs > 2) return null;

              const rotateY = offset * -18;
              const z = -abs * 80;
              const scale = 1 - abs * 0.08;
              const opacity = abs === 0 ? 1 : 0.35;

              return (
                <motion.div
                  key={String(item.id ?? item.src)}
                  initial={false}
                  animate={{
                    rotateY,
                    z,
                    scale,
                    opacity,
                    x: offset * 72,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 32,
                  }}
                  className='absolute w-[min(92vw,560px)] cursor-pointer'
                  style={{
                    transformStyle: 'preserve-3d',
                    zIndex: 10 - abs,
                  }}
                  onClick={() => {
                    if (offset < 0) go(-1);
                    if (offset > 0) go(1);
                  }}
                >
                  <div
                    className={[
                      'relative overflow-hidden rounded-[1.35rem] p-[1px]',
                      abs === 0
                        ? 'bg-gradient-to-br from-rose-300/70 via-fuchsia-400/30 to-white/10 shadow-[0_28px_80px_-24px_rgba(0,0,0,0.85)]'
                        : 'bg-white/10',
                    ].join(' ')}
                  >
                    <div className='overflow-hidden rounded-[1.3rem] bg-black/40 ring-1 ring-white/10'>
                      {item.kind === 'VIDEO' ? (
                        <video
                          className='aspect-[4/3] w-full object-cover md:aspect-[16/10]'
                          src={resolveMediaSrc(item.src)}
                          poster={resolvePoster(item.poster)}
                          muted
                          playsInline
                          loop
                          autoPlay
                        />
                      ) : (
                        <img
                          src={resolveMediaSrc(item.src)}
                          alt=''
                          className='aspect-[4/3] w-full object-cover md:aspect-[16/10]'
                          loading='lazy'
                        />
                      )}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent' />
                      <div className='absolute bottom-0 left-0 right-0 px-5 pb-14 pt-10 md:pb-16'>
                        <p className='text-sm font-medium text-white/95'>
                          {item.title}
                        </p>
                        <p className='mt-0.5 text-[11px] text-white/50'>
                          MG BEAUTY
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Navigation : bas centre, sur l’image */}
            <div className='pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center px-4 md:bottom-6'>
              <div className='pointer-events-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-2 py-1.5 shadow-lg backdrop-blur-md'>
                <button
                  type='button'
                  onClick={() => go(-1)}
                  className='inline-flex h-10 w-10 items-center justify-center rounded-full text-white/95 transition hover:bg-white/10'
                  aria-label='Image précédente'
                >
                  <ChevronLeft className='h-5 w-5' />
                </button>
                <span className='min-w-[3.5rem] text-center text-[11px] font-medium tabular-nums text-white/70'>
                  {String(index + 1).padStart(2, '0')} /{' '}
                  {String(len).padStart(2, '0')}
                </span>
                <button
                  type='button'
                  onClick={() => go(1)}
                  className='inline-flex h-10 w-10 items-center justify-center rounded-full text-rose-100 transition hover:bg-rose-500/25'
                  aria-label='Image suivante'
                >
                  <ChevronRight className='h-5 w-5' />
                </button>
              </div>
            </div>
          </div>

          <div className='mx-auto mt-8 max-w-md'>
            <div className='h-px w-full rounded-full bg-white/10'>
              <div
                className='h-full rounded-full bg-gradient-to-r from-rose-400/90 to-fuchsia-400/80 transition-[width] duration-300 ease-out'
                style={{ width: `${((index + 1) / len) * 100}%` }}
              />
            </div>
            <p className='mt-2 text-center text-[10px] font-medium uppercase tracking-widest text-white/35'>
              {active.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
