import { useEffect, useMemo, useState } from 'react';
import BaseModal from './BaseModal';
import Button from '../ui/Button';
import { useToast } from '../ui/ToastProvider';
import { useClients } from '../../hooks/useClients';
import { useServices } from '../../hooks/useServices';
import { addAppointment } from '../../services/appointmentService';

type AppointmentFormData = {
  clientId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  notes: string;
};

function toISODateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type AppointmentFormModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess?: () => void | Promise<void>;
  prefillDate?: string;
  prefillStartTime?: string;
};

export default function AppointmentFormModal({
  isOpen,
  closeModal,
  onSuccess,
  prefillDate,
  prefillStartTime,
}: AppointmentFormModalProps) {
  const { toast, toastError } = useToast();
  const { clients } = useClients();
  const { services } = useServices();

  const initialForm = useMemo<AppointmentFormData>(() => {
    const todayISO = toISODateLocal(new Date());
    const firstClientId = clients[0]?.id ? String(clients[0].id) : '';
    const firstServiceId = services[0]?.id ? String(services[0].id) : '';

    return {
      clientId: firstClientId,
      serviceId: firstServiceId,
      date: prefillDate || todayISO,
      startTime: prefillStartTime || '10:00',
      notes: '',
    };
  }, [clients, prefillDate, prefillStartTime, services]);

  const [form, setForm] = useState<AppointmentFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [initialForm, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit =
    form.clientId.trim().length > 0 &&
    form.serviceId.trim().length > 0 &&
    form.date.trim().length > 0 &&
    form.startTime.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!canSubmit) return;
    if (clients.length === 0 || services.length === 0) return;

    setIsSubmitting(true);
    try {
      await addAppointment({
        clientId: Number(form.clientId),
        serviceId: Number(form.serviceId),
        date: form.date,
        startTime: form.startTime,
        notes: form.notes.trim() ? form.notes.trim() : undefined,
      });

      toast('success', 'Rendez-vous créé avec succès.');
      await onSuccess?.();
      closeModal();
    } catch (error) {
      toastError(error, 'Impossible de créer le rendez-vous.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      title='Créer un rendez-vous'
      isOpen={isOpen}
      closeModal={closeModal}
    >
      <div>
        <form onSubmit={handleSubmit} className='space-y-4' method='POST'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Client</label>
              <select
                name='clientId'
                value={form.clientId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              >
                {clients.length === 0 ? (
                  <option value=''>Chargement…</option>
                ) : (
                  clients.map((c) => (
                    <option
                      key={c.id ?? `${c.firstName}-${c.lastName}`}
                      value={c.id}
                    >
                      {`${c.firstName} ${c.lastName}`.trim()}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>
                Prestation
              </label>
              <select
                name='serviceId'
                value={form.serviceId}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              >
                {services.length === 0 ? (
                  <option value=''>Chargement…</option>
                ) : (
                  services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Date</label>
              <input
                type='date'
                name='date'
                value={form.date}
                onChange={handleChange}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              />
            </div>

            <div className='space-y-1.5'>
              <label className='text-xs font-medium text-slate-700'>Heure</label>
              <input
                type='time'
                name='startTime'
                value={form.startTime}
                onChange={handleChange}
                step={300}
                className='w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
                required
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-medium text-slate-700'>Notes (optionnel)</label>
            <textarea
              name='notes'
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className='w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-rose-100 focus:bg-white focus:ring'
              placeholder='Ex: allergie, besoin spécifique, etc.'
            />
          </div>

          <div className='pt-1 mt-2 flex justify-end gap-2'>
            <Button
              type='button'
              className='justify-center'
              variant='outline'
              onClick={closeModal}
            >
              Annuler
            </Button>
            <Button type='submit' className='justify-center' disabled={isSubmitting || !canSubmit}>
              {isSubmitting ? 'Chargement…' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
}

