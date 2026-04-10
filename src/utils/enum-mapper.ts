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

// ── Per-enum label maps (no key collisions between enums) ────────────────────

export const AppRoleLabels: Record<string, string> = {
  [AppRole.NONE]:        'None',
  [AppRole.SUPER_ADMIN]: 'Super Admin',
  [AppRole.ADMIN]:       'Administrator',
  [AppRole.DOCTOR]:      'Doctor',
  [AppRole.LAB_TECH]:    'Lab Technician',
  [AppRole.PATIENT]:     'Patient',
};

export const GenderLabels: Record<number, string> = {
  [Gender.NOT_SET]: 'Not Set',
  [Gender.MALE]:    'Male',
  [Gender.FEMALE]:  'Female',
};

export const WeekDayLabels: Record<number, string> = {
  [WeekDays.SUNDAY]:    'Sunday',
  [WeekDays.MONDAY]:    'Monday',
  [WeekDays.TUESDAY]:   'Tuesday',
  [WeekDays.WEDNESDAY]: 'Wednesday',
  [WeekDays.THURSDAY]:  'Thursday',
  [WeekDays.FRIDAY]:    'Friday',
  [WeekDays.SATURDAY]:  'Saturday',
};

export const BloodTypeLabels: Record<number, string> = {
  [BloodType.A_POSITIVE]:  'A+',
  [BloodType.A_NEGATIVE]:  'A-',
  [BloodType.B_POSITIVE]:  'B+',
  [BloodType.B_NEGATIVE]:  'B-',
  [BloodType.AB_POSITIVE]: 'AB+',
  [BloodType.AB_NEGATIVE]: 'AB-',
  [BloodType.O_POSITIVE]:  'O+',
  [BloodType.O_NEGATIVE]:  'O-',
};

export const PatientStatusLabels: Record<number, string> = {
  [PatientStatus.NOT_SET]:     'Not Set',
  [PatientStatus.IN_PATIENT]:  'In-Patient',
  [PatientStatus.OUT_PATIENT]: 'Out-Patient',
};

export const AlergySeverityLabels: Record<number, string> = {
  [AlergySeverity.MILD]:     'Mild',
  [AlergySeverity.MODERATE]: 'Moderate',
  [AlergySeverity.SEVERE]:   'Severe',
};

export const AppointmentTypeLabels: Record<number, string> = {
  [AppointmentType.IN_PERSON]: 'In-Person',
  [AppointmentType.ONLINE]:    'Online',
};

export const AppointmentStatusLabels: Record<number, string> = {
  [AppointmentStatus.SCHEDULED]:  'Scheduled',
  [AppointmentStatus.CONFIRMED]:  'Confirmed',
  [AppointmentStatus.CHECKED_IN]: 'Checked In',
  [AppointmentStatus.CHECKED_OUT]:'Checked Out',
  [AppointmentStatus.CANCELLED]:  'Cancelled',
};

export const EEGTestStatusLabels: Record<number, string> = {
  [EEGTestStatus.ORDERED]:     'Ordered',
  [EEGTestStatus.IN_PROGRESS]: 'In Progress',
  [EEGTestStatus.COMPLETED]:   'Completed',
  [EEGTestStatus.ANALYZED]:    'Analyzed',
  [EEGTestStatus.CANCELLED]:   'Cancelled',
};

export const ADHDPredictionLabels: Record<number, string> = {
  [ADHDPrediction.ADHD]:    'ADHD',
  [ADHDPrediction.CONTROL]: 'Control',
};

// ── Typed helper functions ────────────────────────────────────────────────────

export const mapAppRole        = (v: AppRole)           => AppRoleLabels[v]           ?? String(v);
export const mapGender         = (v: Gender)            => GenderLabels[v]            ?? String(v);
export const mapWeekDay        = (v: WeekDays)          => WeekDayLabels[v]           ?? String(v);
export const mapBloodType      = (v: BloodType)         => BloodTypeLabels[v]         ?? String(v);
export const mapPatientStatus  = (v: PatientStatus)     => PatientStatusLabels[v]     ?? String(v);
export const mapAlergySeverity = (v: AlergySeverity)    => AlergySeverityLabels[v]    ?? String(v);
export const mapAppointmentType   = (v: AppointmentType)   => AppointmentTypeLabels[v]   ?? String(v);
export const mapAppointmentStatus = (v: AppointmentStatus) => AppointmentStatusLabels[v] ?? String(v);
export const mapEEGTestStatus  = (v: EEGTestStatus)     => EEGTestStatusLabels[v]     ?? String(v);
export const mapADHDPrediction = (v: ADHDPrediction)    => ADHDPredictionLabels[v]    ?? String(v);

/**
 * Generic mapper — only safe for string-valued enums (e.g. AppRole).
 * Do NOT use for numeric enums; use the typed helpers above instead.
 */
export function mapEnum(value: AppRole | string): string {
  if (value === null || value === undefined) return '';
  return AppRoleLabels[value as string] ?? String(value);
}
