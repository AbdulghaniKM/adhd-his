<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text">Departments</h1>
        <p class="text-sm text-text-secondary">Manage hospital clinical departments</p>
      </div>
      <AppButton
        label="Add Department"
        icon="icon-[heroicons-outline--plus]"
        @click="openCreateModal"
      />
    </div>

    <AppTable
      :columns="columns"
      :data="departmentStore.departments"
      :loading="departmentStore.loading"
      searchable
      search-placeholder="Search departments..."
      @search="handleSearch"
    >
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
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
            icon="icon-[heroicons-outline--trash]"
            icon-only
            class="text-error hover:text-error"
            tooltip="Delete"
            @click="confirmDelete(row)"
          />
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
      title="Remove Department"
      :message="`Are you sure you want to remove the ${departmentToDelete?.title} department?`"
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

const handleSearch = (query: string) => {
  departmentStore.fetchDepartments({ Title: query });
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

const confirmDelete = (dept: any) => {
  departmentToDelete.value = dept;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!departmentToDelete.value) return;
  const res = await departmentStore.deleteDepartment(departmentToDelete.value.id);
  if (res) {
    success('Department removed');
    isDeleteModalOpen.value = false;
  } else {
    error(departmentStore.error || 'Delete failed');
  }
};
</script>
