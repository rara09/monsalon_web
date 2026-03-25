export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type AppointmentClient = {
  id: number;
  firstName: string;
  lastName: string;
};

export type AppointmentService = {
  id: number;
  name: string;
  // Backend: duration is used to compute endTime for scheduling.
  duration?: number;
};

export type Appointment = {
  id: number;
  clientId: number;
  serviceId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;

  // Included via TypeORM relations (appointments.controller.ts returns relations)
  client?: AppointmentClient;
  service?: AppointmentService;
};

export type CreateAppointmentPayload = {
  clientId: number;
  serviceId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  notes?: string;
};

export type UpdateAppointmentStatusPayload = {
  status: AppointmentStatus;
};

