import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import { objectToFormData } from '../utils/form';
import type {
  PatientResponse,
  PatientProfileResponse,
  CreatePatientRequest,
  UpdatePatientRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const patientService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<PatientResponse>>(API_PATHS.PATIENTS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<PatientResponse>>(API_PATHS.PATIENTS.SINGLE(id));
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await api.get<ApiSingleResponse<PatientProfileResponse>>(
      API_PATHS.PATIENTS.PROFILE(id),
    );
    return response.data;
  },

  create: async (data: CreatePatientRequest) => {
    const formData = objectToFormData(data);
    const response = await api.post<ApiSingleResponse<PatientResponse>>(
      API_PATHS.PATIENTS.ALL,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  update: async (id: string, data: UpdatePatientRequest) => {
    const formData = objectToFormData(data);
    const response = await api.put<ApiSingleResponse<PatientResponse>>(
      API_PATHS.PATIENTS.SINGLE(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.PATIENTS.SOFT(id));
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(API_PATHS.PATIENTS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.PATIENTS.SINGLE(id));
    return response.data;
  },
};

export default patientService;
