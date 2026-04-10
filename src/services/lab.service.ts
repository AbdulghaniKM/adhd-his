import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  LabResponse,
  CreateLabRequest,
  UpdateLabRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const labService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<LabResponse>>(API_PATHS.LABS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<LabResponse>>(API_PATHS.LABS.SINGLE(id));
    return response.data;
  },

  create: async (data: CreateLabRequest) => {
    const response = await api.post<ApiSingleResponse<LabResponse>>(API_PATHS.LABS.ALL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateLabRequest) => {
    const response = await api.put<ApiSingleResponse<LabResponse>>(API_PATHS.LABS.SINGLE(id), data);
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.LABS.SOFT(id));
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(API_PATHS.LABS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.LABS.SINGLE(id));
    return response.data;
  },
};

export default labService;
