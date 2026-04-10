import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  EducationResponse,
  CreateEducationRequest,
  UpdateEducationRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const educationService = {
  getByDoctorId: async (doctorId: string, params?: any) => {
    const response = await api.get<ApiResponse<EducationResponse>>(
      API_PATHS.DOCTOR_EDUCATION.SINGLE(doctorId),
      { params },
    );
    return response.data;
  },

  create: async (doctorId: string, data: CreateEducationRequest) => {
    const response = await api.post<ApiSingleResponse<EducationResponse>>(
      API_PATHS.DOCTOR_EDUCATION.SINGLE(doctorId),
      data,
    );
    return response.data;
  },

  update: async (doctorId: string, entryId: string, data: UpdateEducationRequest) => {
    const response = await api.put<ApiSingleResponse<EducationResponse>>(
      API_PATHS.DOCTOR_EDUCATION.SOFT(doctorId, entryId),
      data,
    );
    return response.data;
  },

  delete: async (doctorId: string, entryId: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(
      API_PATHS.DOCTOR_EDUCATION.SOFT(doctorId, entryId),
    );
    return response.data;
  },
};

export default educationService;
