import { Gender, BloodType, PatientStatus, AlergySeverity } from './enums.types';

export interface PatientResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  bloodType: BloodType;
  address: string | null;
  status: PatientStatus;
  primaryDoctorId: string | null;
  primaryDoctor?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  imageUrl: string | null;
}

export interface AllergyResponse {
  id: string;
  patientId: string;
  allergen: string;
  reaction: string | null;
  severity: AlergySeverity;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VitalsResponse {
  id: string;
  patientId: string;
  heartRate: number | null;
  bloodPressure: string | null;
  weight: number | null;
  height: number | null;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientProfileResponse extends PatientResponse {
  latestVitals?: VitalsResponse;
  allergies?: AllergyResponse[];
  lastVisits?: any[];
}

export interface CreatePatientRequest {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  BirthDate: string;
  Gender: Gender;
  BloodType: BloodType;
  Address?: string;
  Status: PatientStatus;
  PrimaryDoctorId?: string;
  image?: File;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {}

export interface CreateAllergyRequest {
  allergen: string;
  reaction?: string;
  severity: AlergySeverity;
}

export interface CreateVitalsRequest {
  heartRate?: number;
  bloodPressure?: string;
  weight?: number;
  height?: number;
  recordedAt: string;
}
