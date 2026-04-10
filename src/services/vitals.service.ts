import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  VitalsResponse,
  CreateVitalsRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const vitalsService = {
  getAll: async (patientId: string, params?: any) => {
    const response = await api.get<ApiResponse<VitalsResponse>>(
      API_PATHS.PATIENT_VITALS.ALL(patientId),
      { params },
    );
    return response.data;
  },

  create: async (patientId: string, data: CreateVitalsRequest) => {
    const response = await api.post<ApiSingleResponse<VitalsResponse>>(
      API_PATHS.PATIENT_VITALS.ALL(patientId),
      data,
    );
    return response.data;
  },

  deletePermanent: async (patientId: string, vitalId: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(
      API_PATHS.PATIENT_VITALS.SINGLE(patientId, vitalId),
    );
    return response.data;
  },
};

export default vitalsService;
