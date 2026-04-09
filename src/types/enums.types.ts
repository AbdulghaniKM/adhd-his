export enum AppRole {
  NONE = 'None',
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  DOCTOR = 'Doctor',
  LAB_TECH = 'LabTech',
  PATIENT = 'Patient',
}

export enum Gender {
  NOT_SET = 'NotSet',
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum WeekDays {
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
}

export enum BloodType {
  A_POSITIVE = 'APositive',
  A_NEGATIVE = 'ANegative',
  B_POSITIVE = 'BPositive',
  B_NEGATIVE = 'BNegative',
  AB_POSITIVE = 'ABPositive',
  AB_NEGATIVE = 'ABNegative',
  O_POSITIVE = 'OPositive',
  O_NEGATIVE = 'ONegative',
}

export enum PatientStatus {
  NOT_SET = 'NotSet',
  IN_PATIENT = 'InPatient',
  OUT_PATIENT = 'OutPatient',
}

export enum AlergySeverity {
  MILD = 'Mild',
  MODERATE = 'Moderate',
  SEVERE = 'Severe',
}

export enum AppointmentType {
  IN_PERSON = 'InPerson',
  ONLINE = 'Online',
}

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  CHECKED_IN = 'CheckedIn',
  CHECKED_OUT = 'CheckedOut',
  CANCELLED = 'Cancelled',
}

export enum EEGTestStatus {
  ORDERED = 'Ordered',
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  ANALYZED = 'Analyzed',
  CANCELLED = 'Cancelled',
}

export enum ADHDPrediction {
  ADHD = 'ADHD',
  CONTROL = 'Control',
}
