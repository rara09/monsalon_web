import { useMemo } from 'react';
import type { ReactNode } from 'react';
import BaseDropdown from '../ui/BaseDropdown';
import Button from '../ui/Button';
import { CheckCircle2, Plus, X } from 'lucide-react';
import type {
  Appointment,
  AppointmentStatus,
} from '../../types/appointmentType';

type ViewMode = 'day' | 'week';

const WORKING_START_MINUTES = 8 * 60; // 08:00
const WORKING_END_MINUTES = 20 * 60; // 20:00
const SLOT_STEP_MINUTES = 30;

// Visual scaling: 720min (08:00-20:00) => ~430px
const PIXELS_PER_MINUTE = 0.6;

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

function startOfWeekMonday(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // JS: 0=dimanche, 1=lundi ... => on veut lundi comme 0
  const jsDay = d.getDay();
  const diff = jsDay === 0 ? -6 : 1 - jsDay;
  d.setDate(d.getDate() + diff);
  return d;
}

function hhmmToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(':').map((v) => parseInt(v, 10));
  return h * 60 + m;
}

function formatDayHeader(date: Date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

function formatPeriod(start: Date, end: Date) {
  const s = start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  const e = end.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  return `Du ${s} au ${e}`;
}

function statusMeta(status: AppointmentStatus) {
  switch (status) {
    case 'PENDING':
      return {
        badge: 'bg-amber-100 text-amber-700 ring-amber-200',
        block: 'bg-amber-50 ring-amber-200 text-amber-900',
        label: 'En attente',
        canceledStyle: '',
      };
    case 'CONFIRMED':
      return {
        badge: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
        block: 'bg-indigo-50 ring-indigo-200 text-indigo-900',
        label: 'Confirmé',
        canceledStyle: '',
      };
    case 'COMPLETED':
      return {
        badge: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
        block: 'bg-emerald-50 ring-emerald-200 text-emerald-900',
        label: 'Terminé',
        canceledStyle: '',
      };
    case 'CANCELLED':
      return {
        badge: 'bg-slate-100 text-slate-500 ring-slate-200',
        block: 'bg-slate-50 ring-slate-200 text-slate-600',
        label: 'Annulé',
        canceledStyle: 'opacity-70 line-through',
      };
  }
}

function getActionItems(status: AppointmentStatus) {
  const items: Array<{
    label: string;
    next: AppointmentStatus;
    icon: ReactNode;
  }> = [];

  if (status === 'PENDING') {
    items.push({
      label: 'Confirmer',
      next: 'CONFIRMED',
      icon: <CheckCircle2 className='h-4 w-4 text-emerald-600' />,
    });
  }

  if (status === 'CONFIRMED') {
    items.push({
      label: 'Terminer',
      next: 'COMPLETED',
      icon: <CheckCircle2 className='h-4 w-4 text-emerald-600' />,
    });
  }

  if (status !== 'CANCELLED') {
    items.push({
      label: 'Annuler',
      next: 'CANCELLED',
      icon: <X className='h-4 w-4 text-rose-600' />,
    });
  }

  return items;
}

type CalendarViewProps = {
  appointments: Appointment[];
  loading?: boolean;
  viewMode: ViewMode;
  anchorDate: Date;
  onViewModeChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelectSlot: (dateISO: string, startTime: string) => void;
  onChangeAppointmentStatus: (
    appointment: Appointment,
    status: AppointmentStatus,
  ) => void | Promise<void>;
};

export default function CalendarView({
  appointments,
  loading,
  viewMode,
  anchorDate,
  onViewModeChange,
  onPrev,
  onNext,
  onToday,
  onSelectSlot,
  onChangeAppointmentStatus,
}: CalendarViewProps) {
  const selectedDayISO = toISODateLocal(anchorDate);
  const weekStart = useMemo(() => startOfWeekMonday(anchorDate), [anchorDate]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, idx) => addDays(weekStart, idx)),
    [weekStart],
  );

  const periodLabel = useMemo(() => {
    if (viewMode === 'day') {
      const d = anchorDate;
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
      });
    }
    return formatPeriod(weekDates[0], weekDates[6]);
  }, [anchorDate, viewMode, weekDates]);

  const dayAppointments = useMemo(() => {
    const forDay = appointments.filter((a) => a.date === selectedDayISO);
    return [...forDay].sort((a, b) => hhmmToMinutes(a.startTime) - hhmmToMinutes(b.startTime));
  }, [appointments, selectedDayISO]);

  const dayHeightPx =
    (WORKING_END_MINUTES - WORKING_START_MINUTES) * PIXELS_PER_MINUTE;

  const dayBlocks = dayAppointments.map((appt) => {
    const meta = statusMeta(appt.status);
    const startMin = hhmmToMinutes(appt.startTime);
    const endMin = appt.endTime ? hhmmToMinutes(appt.endTime) : startMin + (appt.service?.duration ?? 60);

    const clampedStart = Math.max(startMin, WORKING_START_MINUTES);
    const clampedEnd = Math.min(endMin, WORKING_END_MINUTES);
    const top = (clampedStart - WORKING_START_MINUTES) * PIXELS_PER_MINUTE;
    const height = Math.max(PIXELS_PER_MINUTE * 10, (clampedEnd - clampedStart) * PIXELS_PER_MINUTE);

    const clientName = appt.client ? `${appt.client.firstName} ${appt.client.lastName}`.trim() : 'Client';
    const serviceName = appt.service?.name ?? 'Prestation';

    const actionItems = getActionItems(appt.status);

    return (
      <div
        key={appt.id}
        className={`absolute left-2 right-2 rounded-lg border px-2 py-1 ${meta.block} ring-1`}
        style={{ top, height }}
      >
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2'>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${meta.badge}`}
              >
                {meta.label}
              </span>
            </div>
            <div className={`mt-1 text-xs font-semibold ${meta.canceledStyle}`}>
              {serviceName}
            </div>
            <div className={`text-[11px] text-slate-600 ${meta.canceledStyle} truncate`}>
              {clientName}
            </div>
            <div className={`text-[11px] text-slate-500 ${meta.canceledStyle}`}>
              {appt.startTime} - {appt.endTime}
            </div>
            {appt.notes ? (
              <div
                className={`mt-1 text-[11px] text-slate-600 ${meta.canceledStyle} truncate`}
                title={appt.notes}
              >
                {appt.notes}
              </div>
            ) : null}
          </div>

          {actionItems.length > 0 ? (
            <div className='flex-shrink-0'>
              <BaseDropdown
                btnChildren={null}
                items={actionItems.map((it) => ({
                  label: it.label,
                  icon: it.icon,
                  onClick: () =>
                    onChangeAppointmentStatus(appt, it.next),
                }))}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  });

  const daySlots = Array.from(
    { length: (WORKING_END_MINUTES - WORKING_START_MINUTES) / SLOT_STEP_MINUTES },
    (_, idx) => WORKING_START_MINUTES + idx * SLOT_STEP_MINUTES,
  );

  return (
    <section className='space-y-3'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-wrap items-center gap-2'>
          <div className='rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200'>
            {periodLabel}
          </div>

          <div className='flex flex-wrap rounded-full bg-slate-100 p-1 ring-1 ring-slate-200'>
            <button
              type='button'
              onClick={() => onViewModeChange('day')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'day'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Jour
            </button>
            <button
              type='button'
              onClick={() => onViewModeChange('week')}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'week'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semaine
            </button>
          </div>
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button variant='outline' className='px-3 py-2' onClick={onPrev} type='button'>
            ←
          </Button>
          <Button variant='outline' className='px-3 py-2' onClick={onToday} type='button'>
            Aujourd&apos;hui
          </Button>
          <Button variant='outline' className='px-3 py-2' onClick={onNext} type='button'>
            →
          </Button>

          <Button
            className='px-4 py-2'
            type='button'
            onClick={() => onSelectSlot(selectedDayISO, '10:00')}
          >
            <Plus className='mr-2 h-4 w-4' /> Nouveau RDV
          </Button>
        </div>
      </div>

      {loading && appointments.length === 0 ? (
        <div className='rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200'>
          Chargement des rendez-vous…
        </div>
      ) : null}

      {viewMode === 'day' ? (
        <div className='rounded-2xl bg-white p-4 ring-1 ring-slate-200'>
          <div className='relative w-full' style={{ height: dayHeightPx }}>
            {/* Clickable time slots (behind appointment blocks) */}
            {daySlots.map((minutes) => {
              const top = (minutes - WORKING_START_MINUTES) * PIXELS_PER_MINUTE;
              return (
                <button
                  key={minutes}
                  type='button'
                  className='absolute left-0 right-0 border-l-0 border-r-0 bg-transparent hover:bg-rose-50/50'
                  style={{
                    top,
                    height: SLOT_STEP_MINUTES * PIXELS_PER_MINUTE,
                    zIndex: 1,
                  }}
                  onClick={() => {
                    const dateISO = selectedDayISO;
                    const hh = Math.floor(minutes / 60);
                    const mm = minutes % 60;
                    onSelectSlot(dateISO, `${pad2(hh)}:${pad2(mm)}`);
                  }}
                />
              );
            })}

            {/* Hour separators + labels */}
            {Array.from({ length: (WORKING_END_MINUTES - WORKING_START_MINUTES) / 60 }, (_, i) => i).map(
              (hourIdx) => {
                const minutes = WORKING_START_MINUTES + hourIdx * 60;
                const top = (minutes - WORKING_START_MINUTES) * PIXELS_PER_MINUTE;
                const hour = Math.floor(minutes / 60);
                return (
                  <div key={minutes} className='absolute left-0 right-0' style={{ top }}>
                    <div className='border-t border-slate-200' />
                    <div className='absolute -left-1 top-[-10px] text-[11px] text-slate-400'>
                      {pad2(hour)}:00
                    </div>
                  </div>
                );
              },
            )}

            <div className='absolute inset-0' style={{ zIndex: 5 }}>
              {dayBlocks.length === 0 ? (
                <div className='flex h-full items-center justify-center text-sm text-slate-500'>
                  Aucun RDV pour cette journée.
                </div>
              ) : (
                dayBlocks
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className='rounded-2xl bg-white p-4 ring-1 ring-slate-200'>
          <div className='overflow-x-auto'>
            <div className='min-w-[980px] grid grid-cols-7 gap-3'>
              {weekDates.map((d) => {
                const iso = toISODateLocal(d);
                const dayAppts = appointments
                  .filter((a) => a.date === iso)
                  .sort((a, b) => hhmmToMinutes(a.startTime) - hhmmToMinutes(b.startTime));

                return (
                  <div key={iso} className='flex min-w-[0] flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <div className='text-xs font-semibold text-slate-700'>
                        {formatDayHeader(d)}
                      </div>
                      <button
                        type='button'
                        onClick={() => onSelectSlot(iso, '10:00')}
                        className='rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-600 ring-1 ring-rose-100 hover:bg-rose-100'
                      >
                        + RDV
                      </button>
                    </div>

                    <div className='space-y-2 overflow-y-auto pr-1' style={{ maxHeight: 520 }}>
                      {dayAppts.length === 0 ? (
                        <div className='rounded-xl border border-dashed border-slate-200 p-3 text-[11px] text-slate-400'>
                          Aucun rendez-vous
                        </div>
                      ) : (
                        dayAppts.map((appt) => {
                          const meta = statusMeta(appt.status);
                          const clientName = appt.client
                            ? `${appt.client.firstName} ${appt.client.lastName}`.trim()
                            : 'Client';
                          const serviceName = appt.service?.name ?? 'Prestation';
                          const actionItems = getActionItems(appt.status);

                          return (
                            <div
                              key={appt.id}
                              className={`rounded-xl border px-2 py-2 ring-1 ${meta.block} ${meta.canceledStyle}`}
                            >
                              <div className='flex items-start justify-between gap-2'>
                                <div className='min-w-0'>
                                  <div className='flex items-center gap-2'>
                                    <span
                                      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${meta.badge}`}
                                    >
                                      {meta.label}
                                    </span>
                                  </div>
                                  <div className='mt-1 truncate text-xs font-semibold'>
                                    {serviceName}
                                  </div>
                                  <div className='truncate text-[11px] text-slate-600'>
                                    {clientName}
                                  </div>
                                  <div className='text-[11px] text-slate-500'>
                                    {appt.startTime} - {appt.endTime}
                                  </div>
                                  {appt.notes ? (
                                    <div
                                      className='mt-1 truncate text-[11px] text-slate-500'
                                      title={appt.notes}
                                    >
                                      {appt.notes}
                                    </div>
                                  ) : null}
                                </div>

                                {actionItems.length > 0 ? (
                                  <div className='flex-shrink-0'>
                                    <BaseDropdown
                                      btnChildren={null}
                                      items={actionItems.map((it) => ({
                                        label: it.label,
                                        icon: it.icon,
                                        onClick: () =>
                                          onChangeAppointmentStatus(appt, it.next),
                                      }))}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

