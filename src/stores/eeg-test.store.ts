import { defineStore } from 'pinia';
import { ref } from 'vue';
import eegTestService from '../services/eeg-test.service';
import type { 
  EegTestResponse, 
  EegDataResponse, 
  CreateEegTestRequest, 
  UpdateEegTestStatusRequest 
} from '../types/eeg-test';

export const useEegTestStore = defineStore('eeg-test', () => {
  const tests = ref<EegTestResponse[]>([]);
  const currentTest = ref<EegTestResponse | null>(null);
  const uploads = ref<EegDataResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchTests = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await eegTestService.getAll(params);
      if (response.isSuccess) {
        tests.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch EEG tests';
    } finally {
      loading.value = false;
    }
  };

  const fetchPatientTests = async (patientId: string, params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await eegTestService.getByPatient(patientId, params);
      if (response.isSuccess) {
        tests.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        return response.data.items;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch patient EEG tests';
    } finally {
      loading.value = false;
    }
    return [];
  };

  const fetchTestById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await eegTestService.getById(id);
      if (response.isSuccess) {
        currentTest.value = response.data;
        return response.data;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch EEG test details';
    } finally {
      loading.value = false;
    }
    return null;
  };

  const createTest = async (data: CreateEegTestRequest) => {
    loading.value = true;
    try {
      const response = await eegTestService.create(data);
      if (response.isSuccess) {
        return response.data;
      }
      return null;
    } catch (err: any) {
      error.value = err.message || 'Failed to create EEG test';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: string, data: UpdateEegTestStatusRequest) => {
    loading.value = true;
    try {
      const response = await eegTestService.updateStatus(id, data);
      if (response.isSuccess) {
        if (currentTest.value?.id === id) {
          currentTest.value = response.data;
        }
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update test status';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const uploadCSV = async (id: string, file: File) => {
    loading.value = true;
    try {
      const response = await eegTestService.uploadCSV(id, file);
      if (response.isSuccess) {
        await fetchTestById(id);
        await fetchUploads(id);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to upload EEG data';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const fetchUploads = async (id: string, params?: any) => {
    try {
      const response = await eegTestService.getUploads(id, params);
      if (response.isSuccess) {
        uploads.value = response.data.items;
      }
    } catch (err: any) {
      console.error('Failed to fetch uploads:', err);
    }
  };

  const analyze = async (id: string) => {
    loading.value = true;
    try {
      const response = await eegTestService.analyze(id);
      if (response.isSuccess) {
        currentTest.value = response.data;
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Analysis failed';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    tests,
    currentTest,
    uploads,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchTests,
    fetchPatientTests,
    fetchTestById,
    createTest,
    updateStatus,
    uploadCSV,
    fetchUploads,
    analyze,
  };
});
