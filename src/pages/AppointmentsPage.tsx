import { useMemo, useState } from 'react';
import { PageHeader } from '../components';
import AppointmentFormModal from '../components/modals/AppointmentFormModal';
import CalendarView from '../components/appointments/CalendarView';
import { useAppointments } from '../hooks/useAppointments';
import { requestAppointmentStatus } from '../services/appointmentService';
import type {
  Appointment,
  AppointmentStatus,
} from '../types/appointmentType';
import { useToast } from '../components/ui/ToastProvider';

type ViewMode = 'day' | 'week';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toISODateLocal(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function statusLabel(status: AppointmentStatus) {
  switch (status) {
    case 'PENDING':
      return 'En attente';
    case 'CONFIRMED':
      return 'Confirmé';
    case 'COMPLETED':
      return 'Terminé';
    case 'CANCELLED':
      return 'Annulé';
  }
}

function getAppointmentDisplayName(appt: Appointment) {
  const clientName = appt.client
    ? `${appt.client.firstName} ${appt.client.lastName}`.trim()
    : `Client #${appt.clientId}`;
  const serviceName = appt.service?.name ?? `Prestation #${appt.serviceId}`;
  return `${clientName} - ${serviceName}`;
}

export default function AppointmentsPage() {
  const { toast, toastError } = useToast();
  const { appointments, loading, refetch } = useAppointments();

  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [anchorDate, setAnchorDate] = useState(() => new Date());

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createPrefillDate, setCreatePrefillDate] = useState(() =>
    toISODateLocal(new Date()),
  );
  const [createPrefillStartTime, setCreatePrefillStartTime] = useState('10:00');

  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);

  const safeAppointments = appointments ?? [];

  const handlers = useMemo(() => {
    function onSelectSlot(dateISO: string, startTime: string) {
      setCreatePrefillDate(dateISO);
      setCreatePrefillStartTime(startTime);
      setIsCreateOpen(true);
    }

    function onPrev() {
      setAnchorDate((prev) =>
        viewMode === 'day' ? addDays(prev, -1) : addDays(prev, -7),
      );
    }

    function onNext() {
      setAnchorDate((prev) =>
        viewMode === 'day' ? addDays(prev, 1) : addDays(prev, 7),
      );
    }

    function onToday() {
      setAnchorDate(new Date());
    }

    return { onSelectSlot, onPrev, onNext, onToday };
  }, [viewMode]);

  async function onChangeAppointmentStatus(
    appointment: Appointment,
    nextStatus: AppointmentStatus,
  ) {
    if (!appointment?.id) return;
    if (appointment.status === nextStatus) return;
    if (statusUpdatingId === appointment.id) return;

    const actionName = (() => {
      if (nextStatus === 'CONFIRMED') return 'confirmer';
      if (nextStatus === 'COMPLETED') return 'terminer';
      if (nextStatus === 'CANCELLED') return 'annuler';
      return 'mettre à jour';
    })();

    const ok = window.confirm(
      `Voulez-vous ${actionName} ce rendez-vous ? (${getAppointmentDisplayName(appointment)})`,
    );
    if (!ok) return;

    setStatusUpdatingId(appointment.id);
    try {
      await requestAppointmentStatus(appointment.id, nextStatus);
      await refetch();
      toast(
        'success',
        `Rendez-vous mis à jour : ${statusLabel(nextStatus)}.`,
      );
    } catch (error) {
      toastError(error, 'Impossible de mettre à jour le statut.');
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <section className='space-y-6'>
      <PageHeader
        title='Gestion des rendez-vous'
        subtitle='Vue jour / semaine, création et gestion du statut.'
      />

      <CalendarView
        appointments={safeAppointments}
        loading={loading}
        viewMode={viewMode}
        anchorDate={anchorDate}
        onViewModeChange={(m) => setViewMode(m)}
        onPrev={handlers.onPrev}
        onNext={handlers.onNext}
        onToday={handlers.onToday}
        onSelectSlot={handlers.onSelectSlot}
        onChangeAppointmentStatus={onChangeAppointmentStatus}
      />

      <AppointmentFormModal
        isOpen={isCreateOpen}
        closeModal={() => setIsCreateOpen(false)}
        prefillDate={createPrefillDate}
        prefillStartTime={createPrefillStartTime}
        onSuccess={async () => {
          await refetch();
        }}
      />
    </section>
  );
}

