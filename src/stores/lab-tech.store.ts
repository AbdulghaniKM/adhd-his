import { defineStore } from 'pinia';
import { ref } from 'vue';
import labTechService from '../services/lab-tech.service';
import type { LabTechResponse, CreateLabTechRequest, UpdateLabTechRequest } from '../types';

export const useLabTechStore = defineStore('labTech', () => {
  const labTechs = ref<LabTechResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchParams = ref<any>({});

  const fetchLabTechs = async (params?: any) => {
    if (params) {
      lastFetchParams.value = { ...lastFetchParams.value, ...params };
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await labTechService.getAll(lastFetchParams.value);
      if (response.isSuccess) {
        labTechs.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch lab techs';
    } finally {
      loading.value = false;
    }
  };

  const createLabTech = async (data: CreateLabTechRequest) => {
    loading.value = true;
    try {
      const response = await labTechService.create(data);
      if (response.isSuccess) {
        await fetchLabTechs(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to create lab tech';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateLabTech = async (id: string, data: UpdateLabTechRequest) => {
    loading.value = true;
    try {
      const response = await labTechService.update(id, data);
      if (response.isSuccess) {
        await fetchLabTechs(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update lab tech';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteLabTech = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await labTechService.deletePermanent(id)
        : await labTechService.softDelete(id);
      if (response.isSuccess) {
        await fetchLabTechs(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete lab tech';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const restoreLabTech = async (id: string) => {
    loading.value = true;
    try {
      const response = await labTechService.restore(id);
      if (response.isSuccess) {
        await fetchLabTechs(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to restore lab tech';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    labTechs,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchLabTechs,
    createLabTech,
    updateLabTech,
    deleteLabTech,
    restoreLabTech,
  };
});
