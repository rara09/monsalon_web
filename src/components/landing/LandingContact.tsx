import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../ui/ToastProvider';
import { getCatalogServicesPublic } from '../../services/catalogService';
import { createPublicAppointment } from '../../services/publicAppointmentService';

type CatalogOption = {
  id: number;
  name: string;
  duration?: number;
};

function toTimeLabel(hhmm: string) {
  return hhmm;
}

function buildTimeOptions() {
  // 08:00 -> 19:30 by 30 min steps (end time is computed server-side)
  const out: string[] = [];
  for (let h = 8; h <= 19; h += 1) {
    out.push(`${String(h).padStart(2, '0')}:00`);
    out.push(`${String(h).padStart(2, '0')}:30`);
  }
  return out;
}

const TIME_OPTIONS = buildTimeOptions();

export default function LandingContact() {
  const { toast, toastError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [services, setServices] = useState<CatalogOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    serviceId: 0,
    date: '',
    startTime: '10:00',
    notes: '',
  });

  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingServices(true);
      try {
        const rows = await getCatalogServicesPublic();
        if (cancelled) return;
        const opts = rows
          .filter((r) => r.isActive !== false)
          .map((r) => ({
            id: r.id,
            name: r.name,
            duration: Number(r.duration) || undefined,
          }));
        setServices(opts);
        setForm((prev) => ({
          ...prev,
          serviceId: prev.serviceId || opts[0]?.id || 0,
          date: prev.date || today,
        }));
      } catch (e) {
        // fallback minimal: allow submit without selecting a catalog service
        setServices([]);
        setForm((prev) => ({ ...prev, date: prev.date || today }));
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [today]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!form.serviceId) {
      toast('error', 'Choisissez une prestation.');
      return;
    }
    setSubmitting(true);
    try {
      await createPublicAppointment({
        serviceId: form.serviceId,
        date: form.date,
        startTime: form.startTime,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email?.trim() ? form.email.trim() : undefined,
        notes: form.notes?.trim() ? form.notes.trim() : undefined,
      });
      toast('success', 'Votre demande de rendez-vous a été envoyée.');
      setForm((prev) => ({
        ...prev,
        notes: '',
      }));
    } catch (error) {
      toastError(error, 'Réservation impossible.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id='contact' className='relative overflow-hidden bg-slate-950'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,63,94,0.18),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(168,85,247,0.14),transparent_45%)]' />
      <div className='absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl' />
      <div className='absolute -right-24 top-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl' />

      <div className='relative mx-auto max-w-6xl px-4 py-14 text-white'>
        <div className='grid gap-8 md:grid-cols-2 md:items-start'>
          <div className='space-y-3'>
            <div className='text-xs font-semibold uppercase tracking-wide text-rose-300'>
              Contact
            </div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Parlons de votre projet beauté
            </h2>
            <p className='text-sm leading-relaxed text-white/70'>
              Une question sur nos prestations, un créneau particulier ou un
              message avant votre rendez-vous : écrivez-nous. Réponse rapide par
              message ou téléphone.
            </p>

            <div className='mt-6 grid gap-3 sm:grid-cols-2'>
              {[
                { t: 'Horaires', d: 'Lun–Sam • 08:00–20:00' },
                {
                  t: 'WhatsApp / Téléphone',
                  d: '+229 01 52 04 01 83',
                },
                {
                  t: 'Adresse',
                  d: 'Abomey-Calavi — Arconville',
                },
                { t: 'RDV', d: 'En ligne en quelques clics' },
              ].map((item) => (
                <div
                  key={item.t}
                  className='rounded-3xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur'
                >
                  <div className='text-sm font-semibold'>{item.t}</div>
                  <div className='mt-1 text-[11px] text-white/60'>
                    {item.d}
                  </div>
                </div>
              ))}
            </div>

            <div className='pt-3 text-sm text-white/70'>
              Pour réserver sans compte : remplissez le formulaire{' '}
              <a
                href='#reservation'
                className='font-semibold text-white underline underline-offset-4 hover:text-rose-200'
              >
                juste à droite
              </a>
              .
            </div>
          </div>

          <div
            id='reservation'
            className='rounded-3xl bg-white/5 p-6 text-white shadow-sm ring-1 ring-white/10 backdrop-blur'
          >
            <div className='mb-4'>
              <div className='text-sm font-semibold'>Réserver sans se connecter</div>
              <div className='mt-1 text-[11px] text-white/50'>
                (Nous vous recontactons pour confirmer le créneau.)
              </div>
            </div>

            <form className='space-y-3' onSubmit={onSubmit}>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    Prénom
                  </label>
                  <input
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                    placeholder='Ex: Awa'
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    Nom
                  </label>
                  <input
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                    placeholder='Ex: K.'
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    WhatsApp / Téléphone
                  </label>
                  <input
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                    placeholder='+229 01 52 04 01 83'
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    Email (optionnel)
                  </label>
                  <input
                    type='email'
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                    placeholder='awa@email.com'
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-xs font-medium text-white/70'>
                    Prestation
                  </label>
                  <select
                    className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 focus:border-rose-300/30'
                    value={form.serviceId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, serviceId: Number(e.target.value) }))
                    }
                    disabled={loadingServices}
                    required
                  >
                    {loadingServices ? (
                      <option value={0}>Chargement…</option>
                    ) : services.length === 0 ? (
                      <option value={0}>Aucune prestation</option>
                    ) : (
                      services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-medium text-white/70'>
                      Date
                    </label>
                    <input
                      type='date'
                      className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                      required
                      value={form.date}
                      min={today}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, date: e.target.value }))
                      }
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <label className='text-xs font-medium text-white/70'>
                      Heure
                    </label>
                    <select
                      className='w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 focus:border-rose-300/30'
                      value={form.startTime}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, startTime: e.target.value }))
                      }
                      required
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {toTimeLabel(t)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-xs font-medium text-white/70'>
                  Message (optionnel)
                </label>
                <textarea
                  rows={4}
                  className='w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-rose-300/30 placeholder:text-white/40 focus:border-rose-300/30'
                  placeholder='Ex: je préfère un créneau le matin…'
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                />
              </div>

              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2'>
                <div className='text-[11px] text-white/50'>
                  En envoyant, vous acceptez d’être recontacté pour confirmer.
                </div>
                <button
                  type='submit'
                  disabled={submitting}
                  className='inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 disabled:opacity-60'
                >
                  {submitting ? 'Envoi…' : 'Réserver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
