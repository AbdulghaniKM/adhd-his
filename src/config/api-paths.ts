export const API_PATHS = {
  AUTH: {
    ADMIN_LOGIN: '/auth/admin/login',
    DOCTOR_LOGIN: '/auth/doctor/login',
    LABTECH_LOGIN: '/auth/lab-tech/login',
    LOGOUT: '/auth/logout',
  },
  ADMINS: {
    ALL: '/admins',
    SINGLE: (id: string) => `/admins/${id}`,
    SOFT: (id: string) => `/admins/${id}/soft`,
  },
  APPOINTMENTS: {
    ALL: '/appointments',
    SINGLE: (id: string) => `/appointments/${id}`,
    DOCTOR: (doctorId: string) => `/appointments/doctor/${doctorId}`,
    PATIENT: (patientId: string) => `/appointments/patient/${patientId}`,
    SOFT: (id: string) => `/appointments/${id}/soft`,
    STATUS: (id: string) => `/appointments/${id}/status`,
  },
  DEPARTMENTS: {
    ALL: '/departments',
    SINGLE: (id: string) => `/departments/${id}`,
    SOFT: (id: string) => `/departments/${id}/soft`,
  },
  DOCTOR_AVAILABILITY: {
    SINGLE: (doctorId: string) => `/doctors/${doctorId}/availability`,
    SOFT: (doctorId: string, slotId: string) => `/doctors/${doctorId}/availability/${slotId}`,
  },
  DOCTOR_EDUCATION: {
    SINGLE: (doctorId: string) => `/doctors/${doctorId}/education`,
    SOFT: (doctorId: string, entryId: string) => `/doctors/${doctorId}/education/${entryId}`,
  },
  DOCTORS: {
    ALL: '/doctors',
    SINGLE: (id: string) => `/doctors/${id}`,
    SOFT: (id: string) => `/doctors/${id}/soft`,
    PROFILE: (id: string) => `/doctors/${id}/profile`,
  },
  LAB_TECHS: {
    ALL: '/lab-techs',
    SINGLE: (id: string) => `/lab-techs/${id}`,
    SOFT: (id: string) => `/lab-techs/${id}/soft`,
  },
  LABS: {
    ALL: '/labs',
    SINGLE: (id: string) => `/labs/${id}`,
    SOFT: (id: string) => `/labs/${id}/soft`,
  },
  PATIENT_ALLERGIES: {
    ALL: (patientId: string) => `/patients/${patientId}/allergies`,
    SINGLE: (patientId: string, allergyId: string) =>
      `/patients/${patientId}/allergies/${allergyId}`,
    SOFT: (patientId: string, allergyId: string) =>
      `/patients/${patientId}/allergies/${allergyId}/soft`,
  },
  PATIENT_VITALS: {
    ALL: (patientId: string) => `/patients/${patientId}/vitals`,
    SINGLE: (patientId: string, vitalId: string) => `/patients/${patientId}/vitals/${vitalId}`,
  },
  PATIENTS: {
    ALL: '/patients',
    SINGLE: (id: string) => `/patients/${id}`,
    SOFT: (id: string) => `/patients/${id}/soft`,
    PROFILE: (id: string) => `/patients/${id}/profile`,
  },
  EEG_TESTS: {
    ALL: '/eeg-tests',
    SINGLE: (id: string) => `/eeg-tests/${id}`,
    PATIENT: (patientId: string) => `/eeg-tests/patient/${patientId}`,
    STATUS: (id: string) => `/eeg-tests/${id}/status`,
    UPLOAD: (id: string) => `/eeg-tests/${id}/upload`,
    DATA: (id: string) => `/eeg-tests/${id}/data`,
    ANALYZE: (id: string) => `/eeg-tests/${id}/analyze`,
  },
  ENUMS: {
    APP_ROLES: '/enums/app-roles',
    GENDER: '/enums/gender',
    WEEK_DAYS: '/enums/week-days',
    BLOOD_TYPE: '/enums/blood-type',
    PATIENT_STATUS: '/enums/patient-status',
    ALLERGY_SEVERITY: '/enums/allergy-severity',
    APPOINTMENT_TYPE: '/enums/appointment-type',
    APPOINTMENT_STATUS: '/enums/appointment-status',
    EEG_TEST_STATUS: '/enums/eeg-test-status',
    ADHD_PREDICTION: '/enums/adhd-prediction',
  },
} as const;
