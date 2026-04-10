import { defineStore } from 'pinia';
import { ref } from 'vue';
import vitalsService from '../services/vitals.service';
import type { VitalsResponse, CreateVitalsRequest } from '../types';

export const useVitalsStore = defineStore('vitals', () => {
  const vitals = ref<VitalsResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchVitals = async (patientId: string, params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await vitalsService.getAll(patientId, params);
      if (response.isSuccess) {
        vitals.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch vitals';
    } finally {
      loading.value = false;
    }
  };

  const createVitals = async (patientId: string, data: CreateVitalsRequest) => {
    loading.value = true;
    try {
      const response = await vitalsService.create(patientId, data);
      if (response.isSuccess) {
        await fetchVitals(patientId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to add vitals';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteVitals = async (patientId: string, vitalId: string) => {
    loading.value = true;
    try {
      const response = await vitalsService.deletePermanent(patientId, vitalId);
      if (response.isSuccess) {
        await fetchVitals(patientId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete vitals';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    vitals,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchVitals,
    createVitals,
    deleteVitals,
  };
});
