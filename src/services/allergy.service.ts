import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  AllergyResponse,
  CreateAllergyRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const allergyService = {
  getAll: async (patientId: string, params?: any) => {
    const response = await api.get<ApiResponse<AllergyResponse>>(
      API_PATHS.PATIENT_ALLERGIES.ALL(patientId),
      { params },
    );
    return response.data;
  },

  create: async (patientId: string, data: CreateAllergyRequest) => {
    const response = await api.post<ApiSingleResponse<AllergyResponse>>(
      API_PATHS.PATIENT_ALLERGIES.ALL(patientId),
      data,
    );
    return response.data;
  },

  update: async (patientId: string, allergyId: string, data: Partial<CreateAllergyRequest>) => {
    const response = await api.put<ApiSingleResponse<AllergyResponse>>(
      API_PATHS.PATIENT_ALLERGIES.SINGLE(patientId, allergyId),
      data,
    );
    return response.data;
  },

  softDelete: async (patientId: string, allergyId: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(
      API_PATHS.PATIENT_ALLERGIES.SOFT(patientId, allergyId),
    );
    return response.data;
  },

  restore: async (patientId: string, allergyId: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(
      API_PATHS.PATIENT_ALLERGIES.SOFT(patientId, allergyId),
    );
    return response.data;
  },

  deletePermanent: async (patientId: string, allergyId: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(
      API_PATHS.PATIENT_ALLERGIES.SINGLE(patientId, allergyId),
    );
    return response.data;
  },
};

export default allergyService;
