import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import { objectToFormData } from '../utils/form';
import type {
  AdminResponse,
  CreateAdminRequest,
  UpdateAdminRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const adminService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<AdminResponse>>(API_PATHS.ADMINS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<AdminResponse>>(API_PATHS.ADMINS.SINGLE(id));
    return response.data;
  },

  create: async (data: CreateAdminRequest) => {
    const formData = objectToFormData(data);
    const response = await api.post<ApiSingleResponse<AdminResponse>>(
      API_PATHS.ADMINS.ALL,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  update: async (id: string, data: UpdateAdminRequest) => {
    const formData = objectToFormData(data);
    const response = await api.put<ApiSingleResponse<AdminResponse>>(
      API_PATHS.ADMINS.SINGLE(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.ADMINS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.ADMINS.SINGLE(id));
    return response.data;
  },
};

export default adminService;
