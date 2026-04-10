import {
  AppRole,
  Gender,
  WeekDays,
  BloodType,
  PatientStatus,
  AlergySeverity,
  AppointmentType,
  AppointmentStatus,
  EEGTestStatus,
  ADHDPrediction,
} from '../types/enums.types';

export const enumMappers = {
  [AppRole.NONE]: 'None',
  [AppRole.SUPER_ADMIN]: 'Super Admin',
  [AppRole.ADMIN]: 'Administrator',
  [AppRole.DOCTOR]: 'Doctor',
  [AppRole.LAB_TECH]: 'Lab Technician',
  [AppRole.PATIENT]: 'Patient',

  [Gender.NOT_SET]: 'Not Set',
  [Gender.MALE]: 'Male',
  [Gender.FEMALE]: 'Female',

  [WeekDays.SATURDAY]: 'Saturday',
  [WeekDays.SUNDAY]: 'Sunday',
  [WeekDays.MONDAY]: 'Monday',
  [WeekDays.TUESDAY]: 'Tuesday',
  [WeekDays.WEDNESDAY]: 'Wednesday',
  [WeekDays.THURSDAY]: 'Thursday',
  [WeekDays.FRIDAY]: 'Friday',

  [BloodType.A_POSITIVE]: 'A+',
  [BloodType.A_NEGATIVE]: 'A-',
  [BloodType.B_POSITIVE]: 'B+',
  [BloodType.B_NEGATIVE]: 'B-',
  [BloodType.AB_POSITIVE]: 'AB+',
  [BloodType.AB_NEGATIVE]: 'AB-',
  [BloodType.O_POSITIVE]: 'O+',
  [BloodType.O_NEGATIVE]: 'O-',

  [PatientStatus.NOT_SET]: 'Not Set',
  [PatientStatus.IN_PATIENT]: 'In-Patient',
  [PatientStatus.OUT_PATIENT]: 'Out-Patient',

  [AlergySeverity.MILD]: 'Mild',
  [AlergySeverity.MODERATE]: 'Moderate',
  [AlergySeverity.SEVERE]: 'Severe',

  [AppointmentType.IN_PERSON]: 'In-Person',
  [AppointmentType.ONLINE]: 'Online',

  [AppointmentStatus.SCHEDULED]: 'Scheduled',
  [AppointmentStatus.CONFIRMED]: 'Confirmed',
  [AppointmentStatus.CHECKED_IN]: 'Checked In',
  [AppointmentStatus.CHECKED_OUT]: 'Checked Out',
  [AppointmentStatus.CANCELLED]: 'Cancelled',

  [EEGTestStatus.ORDERED]: 'Ordered',
  [EEGTestStatus.IN_PROGRESS]: 'In Progress',
  [EEGTestStatus.COMPLETED]: 'Completed',
  [EEGTestStatus.ANALYZED]: 'Analyzed',
  [EEGTestStatus.CANCELLED]: 'Cancelled',

  [ADHDPrediction.ADHD]: 'ADHD',
  [ADHDPrediction.CONTROL]: 'Control',
};

/**
 * Maps an enum value to its human-readable string.
 */
export function mapEnum(value: any): string {
  if (value === null || value === undefined) return '';
  return (enumMappers as any)[value] || String(value);
}
