import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  AppointmentResponse,
  UpdateAppointmentStatusRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const appointmentService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<AppointmentResponse>>(API_PATHS.APPOINTMENTS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<AppointmentResponse>>(
      API_PATHS.APPOINTMENTS.SINGLE(id),
    );
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateAppointmentStatusRequest) => {
    const response = await api.put<ApiSingleResponse<AppointmentResponse>>(
      API_PATHS.APPOINTMENTS.STATUS(id),
      data,
    );
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.APPOINTMENTS.SOFT(id));
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(API_PATHS.APPOINTMENTS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.APPOINTMENTS.SINGLE(id));
    return response.data;
  },
};

export default appointmentService;
