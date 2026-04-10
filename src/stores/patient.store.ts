import { defineStore } from 'pinia';
import { ref } from 'vue';
import patientService from '../services/patient.service';
import type { PatientResponse, CreatePatientRequest, UpdatePatientRequest } from '../types';

export const usePatientStore = defineStore('patient', () => {
  const patients = ref<PatientResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchPatients = async (params?: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await patientService.getAll(params);
      if (response.isSuccess) {
        patients.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch patients';
    } finally {
      loading.value = false;
    }
  };

  const createPatient = async (data: CreatePatientRequest) => {
    loading.value = true;
    try {
      const response = await patientService.create(data);
      if (response.isSuccess) {
        await fetchPatients({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to create patient';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updatePatient = async (id: string, data: UpdatePatientRequest) => {
    loading.value = true;
    try {
      const response = await patientService.update(id, data);
      if (response.isSuccess) {
        await fetchPatients({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update patient';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deletePatient = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await patientService.deletePermanent(id)
        : await patientService.softDelete(id);
      if (response.isSuccess) {
        await fetchPatients({ PageNumber: pageNumber.value, PageSize: pageSize.value });
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete patient';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    patients,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
});
