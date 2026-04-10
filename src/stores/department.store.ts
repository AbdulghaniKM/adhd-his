import { defineStore } from 'pinia';
import { ref } from 'vue';
import departmentService from '../services/department.service';
import type { DepartmentResponse, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types';

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<DepartmentResponse[]>([]);
  const totalCount = ref(0);
  const totalPages = ref(0);
  const pageNumber = ref(1);
  const pageSize = ref(10);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastFetchParams = ref<any>({});

  const fetchDepartments = async (params?: any) => {
    if (params) {
      lastFetchParams.value = { ...lastFetchParams.value, ...params };
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await departmentService.getAll(lastFetchParams.value);
      if (response.isSuccess) {
        departments.value = response.data.items;
        totalCount.value = response.data.totalCount;
        totalPages.value = response.data.totalPages;
        pageNumber.value = response.data.pageNumber;
        pageSize.value = response.data.pageSize;
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch departments';
    } finally {
      loading.value = false;
    }
  };

  const createDepartment = async (data: CreateDepartmentRequest) => {
    loading.value = true;
    try {
      const response = await departmentService.create(data);
      if (response.isSuccess) {
        await fetchDepartments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to create department';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateDepartment = async (id: string, data: UpdateDepartmentRequest) => {
    loading.value = true;
    try {
      const response = await departmentService.update(id, data);
      if (response.isSuccess) {
        await fetchDepartments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to update department';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteDepartment = async (id: string, permanent = false) => {
    loading.value = true;
    try {
      const response = permanent
        ? await departmentService.deletePermanent(id)
        : await departmentService.softDelete(id);
      if (response.isSuccess) {
        await fetchDepartments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete department';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const restoreDepartment = async (id: string) => {
    loading.value = true;
    try {
      const response = await departmentService.restore(id);
      if (response.isSuccess) {
        await fetchDepartments(lastFetchParams.value);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = err.message || 'Failed to restore department';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    departments,
    totalCount,
    totalPages,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    restoreDepartment,
  };
});
