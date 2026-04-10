import { defineStore } from 'pinia';
import { ref } from 'vue';
import appointmentService from '../services/appointment.service';
import type { AppointmentResponse, UpdateAppointmentStatusRequest } from '../types';

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref<AppointmentResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchParams = ref<any>({});

  const fetchAppointments = async (params?: any) => {
    if (params) {
      lastFetchParams.value = { ...lastFetchParams.value, ...params };
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.getAll(lastFetchParams.value);
      if (response.isSuccess) {
        appointments.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch appointments';
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: string, data: UpdateAppointmentStatusRequest) => {
    loading.value = true;
    try {
      const response = await appointmentService.updateStatus(id, data);
      if (response.isSuccess) {
        await fetchAppointments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update appointment status';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteAppointment = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await appointmentService.deletePermanent(id)
        : await appointmentService.softDelete(id);
      if (response.isSuccess) {
        await fetchAppointments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete appointment';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const restoreAppointment = async (id: string) => {
    loading.value = true;
    try {
      const response = await appointmentService.restore(id);
      if (response.isSuccess) {
        await fetchAppointments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to restore appointment';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    appointments,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchAppointments,
    updateStatus,
    deleteAppointment,
    restoreAppointment,
  };
});
