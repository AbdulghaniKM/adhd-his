<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Departments</h1>
        <p class="text-text-secondary text-sm">Manage hospital clinical departments</p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          label="Add Department"
          icon="icon-[heroicons-outline--plus]"
          @click="openCreateModal"
        />
      </div>
    </div>

    <AppTable
      :columns="columns"
      :data="departmentStore.departments"
      :loading="departmentStore.loading"
      searchable
      search-placeholder="Search departments..."
      server-paginated
      :page-number="departmentStore.pageNumber"
      :page-size="departmentStore.pageSize"
      :total-count="departmentStore.totalCount"
      :total-pages="departmentStore.totalPages"
      @page-change="handlePageChange"
      @search="handleSearch"
    >
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <template v-if="!row.isDeleted">
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--pencil-square]"
              icon-only
              tooltip="Edit"
              @click="openEditModal(row)"
            />
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--archive-box]"
              icon-only
              class="text-warning hover:text-warning"
              tooltip="Archive"
              @click="confirmDelete(row, false)"
            />
          </template>
          <template v-else>
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--arrow-path]"
              icon-only
              class="text-success hover:text-success"
              tooltip="Restore"
              @click="handleRestore(row)"
            />
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--trash]"
              icon-only
              class="text-error hover:text-error"
              tooltip="Delete Forever"
              @click="confirmDelete(row, true)"
            />
          </template>
        </div>
      </template>
    </AppTable>

    <!-- Create/Edit Modal -->
    <AppModal
      :is-open="isModalOpen"
      :title="editingDepartment ? 'Edit Department' : 'Add New Department'"
      max-width="sm"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="departmentStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="isHardDelete ? 'Delete Forever' : 'Archive Department'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete the ${departmentToDelete?.title} department? This action cannot be undone.`
          : `Are you sure you want to archive the ${departmentToDelete?.title} department? You can restore it later.`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useDepartmentStore } from '../../stores/department.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import AppForm from '../../components/ui/Fields/AppForm.vue';
  import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
  import { useToast } from '../../composables/useToast';
  import type { TableColumn } from '../../components/ui/AppTable.vue';
  import type { FormFieldRow } from '../../types/form';

  const departmentStore = useDepartmentStore();
  const { success, error } = useToast();

  const isHardDelete = ref(false);

  const columns: TableColumn[] = [
    { key: 'title', label: 'Department Name', sortable: true },
    { key: 'createdAt', label: 'Created At' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const formFields: FormFieldRow[] = [
    [{ key: 'Title', label: 'Department Title', type: 'text', placeholder: 'e.g. Neurology' }],
  ];

  const isModalOpen = ref(false);
  const editingDepartment = ref<any>(null);
  const formData = ref<any>({});

  const isDeleteModalOpen = ref(false);
  const departmentToDelete = ref<any>(null);

  onMounted(() => {
    departmentStore.fetchDepartments();
  });

  const handlePageChange = ({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }) => {
    departmentStore.fetchDepartments({ PageNumber: pageNumber, PageSize: pageSize });
  };

  const handleSearch = (query: string) => {
    departmentStore.fetchDepartments({ Title: query, PageNumber: 1 });
  };

  const openCreateModal = () => {
    editingDepartment.value = null;
    formData.value = { Title: '' };
    isModalOpen.value = true;
  };

  const openEditModal = (dept: any) => {
    editingDepartment.value = dept;
    formData.value = { Title: dept.title };
    isModalOpen.value = true;
  };

  const handleSubmit = async (data: any) => {
    let res;
    if (editingDepartment.value) {
      res = await departmentStore.updateDepartment(editingDepartment.value.id, data);
    } else {
      res = await departmentStore.createDepartment(data);
    }

    if (res) {
      success(editingDepartment.value ? 'Department updated' : 'Department created');
      isModalOpen.value = false;
    } else {
      error(departmentStore.error || 'Operation failed');
    }
  };

  const confirmDelete = (dept: any, isHard = false) => {
    departmentToDelete.value = dept;
    isHardDelete.value = isHard;
    isDeleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!departmentToDelete.value) return;
    const res = await departmentStore.deleteDepartment(
      departmentToDelete.value.id,
      isHardDelete.value,
    );
    if (res) {
      success(isHardDelete.value ? 'Department deleted forever' : 'Department archived');
      isDeleteModalOpen.value = false;
    } else {
      error(departmentStore.error || 'Delete failed');
    }
  };

  const handleRestore = async (dept: any) => {
    const res = await departmentStore.restoreDepartment(dept.id);
    if (res) {
      success('Department restored');
    } else {
      error(departmentStore.error || 'Restore failed');
    }
  };
</script>
