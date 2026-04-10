import { Gender, BloodType, PatientStatus } from './enums.types';

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

export interface PatientProfileResponse extends PatientResponse {
  latestVitals?: any;
  allergies?: any[];
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
