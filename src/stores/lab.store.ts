import { defineStore } from 'pinia';
import { ref } from 'vue';
import labService from '../services/lab.service';
import type { LabResponse, CreateLabRequest, UpdateLabRequest } from '../types';

export const useLabStore = defineStore('lab', () => {
  const labs = ref<LabResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchLabs = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await labService.getAll(params);
      if (response.isSuccess) {
        labs.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch labs';
    } finally {
      loading.value = false;
    }
  };

  const createLab = async (data: CreateLabRequest) => {
    loading.value = true;
    try {
      const response = await labService.create(data);
      if (response.isSuccess) {
        await fetchLabs({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to create lab';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateLab = async (id: string, data: UpdateLabRequest) => {
    loading.value = true;
    try {
      const response = await labService.update(id, data);
      if (response.isSuccess) {
        await fetchLabs({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update lab';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteLab = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await labService.deletePermanent(id)
        : await labService.softDelete(id);
      if (response.isSuccess) {
        await fetchLabs({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete lab';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    labs,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchLabs,
    createLab,
    updateLab,
    deleteLab,
  };
});
