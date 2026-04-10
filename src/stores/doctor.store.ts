import { defineStore } from 'pinia';
import { ref } from 'vue';
import doctorService from '../services/doctor.service';
import type { DoctorResponse, CreateDoctorRequest, UpdateDoctorRequest } from '../types';

export const useDoctorStore = defineStore('doctor', () => {
  const doctors = ref<DoctorResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDoctors = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await doctorService.getAll(params);
      if (response.isSuccess) {
        doctors.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch doctors';
    } finally {
      loading.value = false;
    }
  };

  const createDoctor = async (data: CreateDoctorRequest) => {
    loading.value = true;
    try {
      const response = await doctorService.create(data);
      if (response.isSuccess) {
        await fetchDoctors({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to create doctor';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateDoctor = async (id: string, data: UpdateDoctorRequest) => {
    loading.value = true;
    try {
      const response = await doctorService.update(id, data);
      if (response.isSuccess) {
        await fetchDoctors({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update doctor';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteDoctor = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await doctorService.deletePermanent(id)
        : await doctorService.softDelete(id);
      if (response.isSuccess) {
        await fetchDoctors({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete doctor';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    doctors,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
});
