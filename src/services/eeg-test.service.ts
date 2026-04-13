import { API_PATHS } from '../config/api-paths';
import api from '../plugins/axios';
import type { ApiResponse, ApiSingleResponse } from '../types/response.types';
import type { 
  EegTestResponse, 
  EegDataResponse, 
  CreateEegTestRequest, 
  UpdateEegTestStatusRequest 
} from '../types/eeg-test';

const eegTestService = {
  getAll: async (params?: any) => {
    const response = await api.get<ApiResponse<EegTestResponse>>(API_PATHS.EEG_TESTS.ALL, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSingleResponse<EegTestResponse>>(API_PATHS.EEG_TESTS.SINGLE(id));
    return response.data;
  },

  getByPatient: async (patientId: string, params?: any) => {
    const response = await api.get<ApiResponse<EegTestResponse>>(API_PATHS.EEG_TESTS.PATIENT(patientId), { params });
    return response.data;
  },

  create: async (data: CreateEegTestRequest) => {
    const response = await api.post<ApiSingleResponse<EegTestResponse>>(API_PATHS.EEG_TESTS.ALL, data);
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateEegTestStatusRequest) => {
    const response = await api.put<ApiSingleResponse<EegTestResponse>>(API_PATHS.EEG_TESTS.STATUS(id), data);
    return response.data;
  },

  uploadCSV: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiSingleResponse<EegDataResponse>>(
      API_PATHS.EEG_TESTS.UPLOAD(id), 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  },

  getUploads: async (id: string, params?: any) => {
    const response = await api.get<ApiResponse<EegDataResponse>>(API_PATHS.EEG_TESTS.DATA(id), { params });
    return response.data;
  },

  analyze: async (id: string) => {
    const response = await api.post<ApiSingleResponse<EegTestResponse>>(API_PATHS.EEG_TESTS.ANALYZE(id));
    return response.data;
  }
};

export default eegTestService;
