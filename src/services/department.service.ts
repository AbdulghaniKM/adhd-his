import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type {
  DepartmentResponse,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  ApiResponse,
  ApiSingleResponse,
} from '../types';

const departmentService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<DepartmentResponse>>(API_PATHS.DEPARTMENTS.ALL, {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<DepartmentResponse>>(
      API_PATHS.DEPARTMENTS.SINGLE(id),
    );
    return response.data;
  },

  create: async (data: CreateDepartmentRequest) => {
    const response = await api.post<ApiSingleResponse<DepartmentResponse>>(
      API_PATHS.DEPARTMENTS.ALL,
      data,
    );
    return response.data;
  },

  update: async (id: string, data: UpdateDepartmentRequest) => {
    const response = await api.put<ApiSingleResponse<DepartmentResponse>>(
      API_PATHS.DEPARTMENTS.SINGLE(id),
      data,
    );
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.DEPARTMENTS.SOFT(id));
    return response.data;
  },

  restore: async (id: string) => {
    const response = await api.patch<ApiSingleResponse<null>>(API_PATHS.DEPARTMENTS.SOFT(id));
    return response.data;
  },

  deletePermanent: async (id: string) => {
    const response = await api.delete<ApiSingleResponse<null>>(API_PATHS.DEPARTMENTS.SINGLE(id));
    return response.data;
  },
};

export default departmentService;
