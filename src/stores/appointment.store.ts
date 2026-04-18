import { defineStore } from 'pinia';
import { ref } from 'vue';
import appointmentService from '../services/appointment.service';
import type { AppointmentResponse, UpdateAppointmentStatusRequest } from '../types';

export const useAppointmentStore = defineStore('appointment', () => {
  const appointments = ref<AppointmentResponse[]>([]);
  const doctorAppointments = ref<AppointmentResponse[]>([]);
  const totalCount = ref(0);
  const todayCount = ref(0);
  const pendingCount = ref(0);
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

  const fetchDoctorAppointments = async (doctorId: string, params?: any) => {
    if (params) {
      lastFetchParams.value = { ...lastFetchParams.value, ...params };
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.getByDoctorId(doctorId, lastFetchParams.value);
      if (response.isSuccess) {
        doctorAppointments.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch doctor appointments';
    } finally {
      loading.value = false;
    }
  };

  const fetchDashboardMetrics = async (doctorId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [todayRes, pendingRes] = await Promise.all([
        appointmentService.getByDoctorId(doctorId, { dateFrom: today, dateTo: today, pageSize: 1 }),
        appointmentService.getByDoctorId(doctorId, { status: 0, pageSize: 1 }), // 0 = Scheduled/Pending
      ]);

      if (todayRes.isSuccess) todayCount.value = todayRes.data.totalCount;
      if (pendingRes.isSuccess) pendingCount.value = pendingRes.data.totalCount;
    } catch (err) {
      console.error('Failed to fetch dashboard metrics:', err);
    }
  };

  const createAppointment = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.create(data);
      if (response.isSuccess) {
        await fetchAppointments(lastFetchParams.value);
        return response.data;
      }
      return null;
    } catch (err: any) {
      error.value = err.message || 'Failed to create appointment';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: string, data: UpdateAppointmentStatusRequest, isDoctor = false, doctorId?: string) => {
    loading.value = true;
    try {
      const response = await appointmentService.updateStatus(id, data);
      if (response.isSuccess) {
        if (isDoctor && doctorId) {
          await fetchDoctorAppointments(doctorId, lastFetchParams.value);
          await fetchDashboardMetrics(doctorId);
        } else {
          await fetchAppointments(lastFetchParams.value);
        }
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
    doctorAppointments,
    totalCount,
    todayCount,
    pendingCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchAppointments,
    fetchDoctorAppointments,
    fetchDashboardMetrics,
    createAppointment,
    updateStatus,
    deleteAppointment,
    restoreAppointment,
  };
});
