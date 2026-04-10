import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import { objectToFormData } from '../utils/form';
import type {
  DoctorResponse,
  DoctorProfileResponse,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const doctorService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<DoctorResponse>>(API_PATHS.DOCTORS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<DoctorResponse>>(API_PATHS.DOCTORS.SINGLE(id));
    return response.data;
  },

  create: async (data: CreateDoctorRequest) => {
    const formData = objectToFormData(data);
    const response = await api.post<ApiSingleResponse<DoctorResponse>>(
      API_PATHS.DOCTORS.ALL,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  update: async (id: string, data: UpdateDoctorRequest) => {
    const formData = objectToFormData(data);
    const response = await api.put<ApiSingleResponse<DoctorResponse>>(
      API_PATHS.DOCTORS.SINGLE(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.DOCTORS.SOFT(id));
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(API_PATHS.DOCTORS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.DOCTORS.SINGLE(id));
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await api.get<ApiSingleResponse<DoctorResponse>>(
      API_PATHS.DOCTORS.SINGLE(id),
    );
    return response.data;
  },

  updateProfile: async (id: string, data: any) => {
    const formData = objectToFormData(data);
    const response = await api.put<ApiSingleResponse<DoctorProfileResponse>>(
      API_PATHS.DOCTORS.PROFILE(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },
};

export default doctorService;
