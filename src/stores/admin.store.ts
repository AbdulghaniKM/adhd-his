import { defineStore } from 'pinia';
import { ref } from 'vue';
import adminService from '../services/admin.service';
import type { AdminResponse, CreateAdminRequest, UpdateAdminRequest } from '../types';

export const useAdminStore = defineStore('admin', () => {
  const admins = ref<AdminResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchParams = ref<any>({});

  const fetchAdmins = async (params?: any) => {
    if (params) {
      lastFetchParams.value = { ...lastFetchParams.value, ...params };
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await adminService.getAll(lastFetchParams.value);
      if (response.isSuccess) {
        admins.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch admins';
    } finally {
      loading.value = false;
    }
  };

  const createAdmin = async (data: CreateAdminRequest) => {
    loading.value = true;
    try {
      const response = await adminService.create(data);
      if (response.isSuccess) {
        await fetchAdmins(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to create admin';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateAdmin = async (id: string, data: UpdateAdminRequest) => {
    loading.value = true;
    try {
      const response = await adminService.update(id, data);
      if (response.isSuccess) {
        await fetchAdmins(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update admin';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteAdmin = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await adminService.deletePermanent(id)
        : await adminService.softDelete(id);
      if (response.isSuccess) {
        await fetchAdmins(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete admin';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const restoreAdmin = async (id: string) => {
    loading.value = true;
    try {
      const response = await adminService.restore(id);
      if (response.isSuccess) {
        await fetchAdmins(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to restore admin';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    admins,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    restoreAdmin,
  };
});
