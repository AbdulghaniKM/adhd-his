export enum AppRole {
  NONE = 'None',
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  LAB_TECH = 'LabTech',
  PATIENT = 'Patient',
}

export enum Gender {
  NOT_SET = 0,
  MALE = 1,
  FEMALE = 2,
}

export enum WeekDays {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export enum BloodType {
  A_POSITIVE = 0,
  A_NEGATIVE = 1,
  B_POSITIVE = 2,
  B_NEGATIVE = 3,
  AB_POSITIVE = 4,
  AB_NEGATIVE = 5,
  O_POSITIVE = 6,
  O_NEGATIVE = 7,
}

export enum PatientStatus {
  NOT_SET = 0,
  IN_PATIENT = 1,
  OUT_PATIENT = 2,
}

export enum AlergySeverity {
  MILD = 0,
  MODERATE = 1,
  SEVERE = 2,
}

export enum AppointmentType {
  IN_PERSON = 0,
  ONLINE = 1,
}

export enum AppointmentStatus {
  SCHEDULED = 0,
  CONFIRMED = 1,
  CHECKED_IN = 2,
  CHECKED_OUT = 3,
  CANCELLED = 4,
}

export enum EEGTestStatus {
  ORDERED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2,
  ANALYZED = 3,
  CANCELLED = 4,
}

export enum ADHDPrediction {
  ADHD = 0,
  CONTROL = 1,
}
