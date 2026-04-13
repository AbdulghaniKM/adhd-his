import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type { ApiSingleResponse } from '../types/response.types';
import type { EnumItem } from '../types/enum';

const enumService = {
  getAppRoles: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.APP_ROLES).then(r => r.data),
  getGender: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.GENDER).then(r => r.data),
  getWeekDays: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.WEEK_DAYS).then(r => r.data),
  getBloodType: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.BLOOD_TYPE).then(r => r.data),
  getPatientStatus: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.PATIENT_STATUS).then(r => r.data),
  getAllergySeverity: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.ALLERGY_SEVERITY).then(r => r.data),
  getAppointmentType: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.APPOINTMENT_TYPE).then(r => r.data),
  getAppointmentStatus: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.APPOINTMENT_STATUS).then(r => r.data),
  getEegTestStatus: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.EEG_TEST_STATUS).then(r => r.data),
  getAdhdPrediction: () => api.get<ApiSingleResponse<EnumItem[]>>(API_PATHS.ENUMS.ADHD_PREDICTION).then(r => r.data),
  
  // Helper to fetch all enums in parallel
  fetchAll: async () => {
    const [
      appRoles, gender, weekDays, bloodType, patientStatus,
      allergySeverity, appointmentType, appointmentStatus,
      eegTestStatus, adhdPrediction
    ] = await Promise.all([
      enumService.getAppRoles(),
      enumService.getGender(),
      enumService.getWeekDays(),
      enumService.getBloodType(),
      enumService.getPatientStatus(),
      enumService.getAllergySeverity(),
      enumService.getAppointmentType(),
      enumService.getAppointmentStatus(),
      enumService.getEegTestStatus(),
      enumService.getAdhdPrediction(),
    ]);

    return {
      appRoles: appRoles.data,
      gender: gender.data,
      weekDays: weekDays.data,
      bloodType: bloodType.data,
      patientStatus: patientStatus.data,
      allergySeverity: allergySeverity.data,
      appointmentType: appointmentType.data,
      appointmentStatus: appointmentStatus.data,
      eegTestStatus: eegTestStatus.data,
      adhdPrediction: adhdPrediction.data,
    };
  }
};

export default enumService;
