import { defineStore } from 'pinia';
import { ref } from 'vue';
import allergyService from '../services/allergy.service';
import type { AllergyResponse, CreateAllergyRequest } from '../types';

export const useAllergyStore = defineStore('allergy', () => {
  const allergies = ref<AllergyResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAllergies = async (patientId: string, params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await allergyService.getAll(patientId, params);
      if (response.isSuccess) {
        allergies.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch allergies';
    } finally {
      loading.value = false;
    }
  };

  const createAllergy = async (patientId: string, data: CreateAllergyRequest) => {
    loading.value = true;
    try {
      const response = await allergyService.create(patientId, data);
      if (response.isSuccess) {
        await fetchAllergies(patientId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to add allergy';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateAllergy = async (patientId: string, allergyId: string, data: Partial<CreateAllergyRequest>) => {
    loading.value = true;
    try {
      const response = await allergyService.update(patientId, allergyId, data);
      if (response.isSuccess) {
        await fetchAllergies(patientId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update allergy';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteAllergy = async (patientId: string, allergyId: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await allergyService.deletePermanent(patientId, allergyId)
        : await allergyService.softDelete(patientId, allergyId);
      if (response.isSuccess) {
        await fetchAllergies(patientId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete allergy';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const restoreAllergy = async (patientId: string, allergyId: string) => {
    loading.value = true;
    try {
      const response = await allergyService.restore(patientId, allergyId);
      if (response.isSuccess) {
        await fetchAllergies(patientId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to restore allergy';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    allergies,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchAllergies,
    createAllergy,
    updateAllergy,
    deleteAllergy,
    restoreAllergy,
  };
});
