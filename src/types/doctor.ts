import { Gender, BloodType } from './enums.types';

export interface DoctorResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  phone: string | null;
  birthDate: string;
  gender: Gender;
  bloodType: BloodType;
  bio: string | null;
  medicalLicenseNumber: string | null;
  departmentId: string;
  department?: {
    id: string;
    title: string;
  };
  consultationCharge: number | null;
  yearsOfExperience: number;
  location: string | null;
  imageUrl: string | null;
}

export interface CreateDoctorRequest {
  FirstName: string;
  LastName: string;
  Username: string;
  Email: string;
  Password: string;
  Phone?: string;
  BirthDate: string;
  Gender: Gender;
  BloodType: BloodType;
  Bio?: string;
  MedicalLicenseNumber?: string;
  DepartmentId: string;
  ConsultationCharge?: number;
  YearsOfExperience: number;
  Location?: string;
  image?: File;
}

export interface UpdateDoctorRequest extends Partial<Omit<CreateDoctorRequest, 'Password'>> {
  Password?: string;
}

export interface DoctorProfileResponse extends DoctorResponse {
  availability?: AvailabilityResponse[];
  educations?: EducationResponse[];
}

export interface AvailabilityResponse {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isDeleted: boolean;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateAvailabilityRequest extends Partial<CreateAvailabilityRequest> {}

export interface EducationResponse {
  id: string;
  degree: string;
  institution: string;
  year: number;
  isDeleted: boolean;
}

export interface CreateEducationRequest {
  degree: string;
  institution: string;
  year: number;
}

export interface UpdateEducationRequest extends Partial<CreateEducationRequest> {}
