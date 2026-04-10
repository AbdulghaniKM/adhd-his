import { AppointmentType, AppointmentStatus } from './enums.types';

export interface AppointmentResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  patientId: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctorId: string;
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  dateTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string | null;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
  notes?: string;
}
