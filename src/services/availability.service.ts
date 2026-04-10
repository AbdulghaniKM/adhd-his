import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  AvailabilityResponse,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const availabilityService = {
  getByDoctorId: async (doctorId: string, params?: any) => {
    const response = await api.get<ApiResponse<AvailabilityResponse>>(
      API_PATHS.DOCTOR_AVAILABILITY.SINGLE(doctorId),
      { params },
    );
    return response.data;
  },

  create: async (doctorId: string, data: CreateAvailabilityRequest) => {
    const response = await api.post<ApiSingleResponse<AvailabilityResponse>>(
      API_PATHS.DOCTOR_AVAILABILITY.SINGLE(doctorId),
      data,
    );
    return response.data;
  },

  update: async (doctorId: string, slotId: string, data: UpdateAvailabilityRequest) => {
    const response = await api.put<ApiSingleResponse<AvailabilityResponse>>(
      API_PATHS.DOCTOR_AVAILABILITY.SOFT(doctorId, slotId),
      data,
    );
    return response.data;
  },

  delete: async (doctorId: string, slotId: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(
      API_PATHS.DOCTOR_AVAILABILITY.SOFT(doctorId, slotId),
    );
    return response.data;
  },
};

export default availabilityService;
