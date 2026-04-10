import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import { objectToFormData } from '../utils/form';
import type {
  LabTechResponse,
  CreateLabTechRequest,
  UpdateLabTechRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const labTechService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<LabTechResponse>>(API_PATHS.LAB_TECHS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<LabTechResponse>>(API_PATHS.LAB_TECHS.SINGLE(id));
    return response.data;
  },

  create: async (data: CreateLabTechRequest) => {
    const formData = objectToFormData(data);
    const response = await api.post<ApiSingleResponse<LabTechResponse>>(
      API_PATHS.LAB_TECHS.ALL,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  update: async (id: string, data: UpdateLabTechRequest) => {
    const formData = objectToFormData(data);
    const response = await api.put<ApiSingleResponse<LabTechResponse>>(
      API_PATHS.LAB_TECHS.SINGLE(id),
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.LAB_TECHS.SOFT(id));
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(API_PATHS.LAB_TECHS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.LAB_TECHS.SINGLE(id));
    return response.data;
  },
};

export default labTechService;
