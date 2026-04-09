import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type { ApiSingleResponse } from '../types/response.types';
import type { LoginResponseData } from '../types/auth.types';

const authService = {
  adminLogin: async (username: string, password: string) => {
    const response = await api.post<ApiSingleResponse<LoginResponseData>>(
      API_PATHS.AUTH.ADMIN_LOGIN,
      { username, password },
    );
    return response.data;
  },
  doctorLogin: async (username: string, password: string) => {
    const response = await api.post<ApiSingleResponse<LoginResponseData>>(
      API_PATHS.AUTH.DOCTOR_LOGIN,
      { username, password },
    );
    return response.data;
  },
  labtechLogin: async (username: string, password: string) => {
    const response = await api.post<ApiSingleResponse<LoginResponseData>>(
      API_PATHS.AUTH.LABTECH_LOGIN,
      { username, password },
    );
    return response.data;
  },
  logout: async () => {
    const response = await api.post(API_PATHS.AUTH.LOGOUT);
    return response.data;
  },
};

export default authService;
