<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text">Laboratory Facilities</h1>
        <p class="text-sm text-text-secondary">Manage hospital lab units and contact details</p>
      </div>
      <AppButton
        label="Add Laboratory"
        icon="icon-[heroicons-outline--plus]"
        @click="openCreateModal"
      />
    </div>

    <AppTable
      :columns="columns"
      :data="labStore.labs"
      :loading="labStore.loading"
      searchable
      search-placeholder="Search labs..."
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
      :title="editingLab ? 'Edit Laboratory' : 'Add New Laboratory'"
      max-width="md"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="labStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      title="Remove Laboratory"
      :message="`Are you sure you want to remove the ${labToDelete?.name} facility?`"
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLabStore } from '../../stores/lab.store';
import AppTable from '../../components/ui/AppTable.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppModal from '../../components/ui/AppModal.vue';
import AppForm from '../../components/ui/Fields/AppForm.vue';
import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
import { useToast } from '../../composables/useToast';
import type { TableColumn } from '../../components/ui/AppTable.vue';
import type { FormFieldRow } from '../../types/form';

const labStore = useLabStore();
const { success, error } = useToast();

const columns: TableColumn[] = [
  { key: 'name', label: 'Laboratory Name', sortable: true },
  { key: 'location', label: 'Location' },
  { key: 'contactPhone', label: 'Contact Phone' },
  { key: 'actions', label: 'Actions', class: 'text-end' },
];

const formFields: FormFieldRow[] = [
  [{ key: 'Name', label: 'Lab Name', type: 'text', placeholder: 'e.g. Hematology Lab' }],
  [
    { key: 'Location', label: 'Location/Building', type: 'text', placeholder: 'e.g. Block B, 2nd Floor' },
    { key: 'ContactPhone', label: 'Contact Extension', type: 'phone' },
  ],
];

const isModalOpen = ref(false);
const editingLab = ref<any>(null);
const formData = ref<any>({});

const isDeleteModalOpen = ref(false);
const labToDelete = ref<any>(null);

onMounted(() => {
  labStore.fetchLabs();
});

const handleSearch = (query: string) => {
  labStore.fetchLabs({ Name: query });
};

const openCreateModal = () => {
  editingLab.value = null;
  formData.value = { Name: '', Location: '', ContactPhone: '' };
  isModalOpen.value = true;
};

const openEditModal = (lab: any) => {
  editingLab.value = lab;
  formData.value = { Name: lab.name, Location: lab.location, ContactPhone: lab.contactPhone };
  isModalOpen.value = true;
};

const handleSubmit = async (data: any) => {
  let res;
  if (editingLab.value) {
    res = await labStore.updateLab(editingLab.value.id, data);
  } else {
    res = await labStore.createLab(data);
  }

  if (res) {
    success(editingLab.value ? 'Lab updated' : 'Lab created');
    isModalOpen.value = false;
  } else {
    error(labStore.error || 'Operation failed');
  }
};

const confirmDelete = (lab: any) => {
  labToDelete.value = lab;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!labToDelete.value) return;
  const res = await labStore.deleteLab(labToDelete.value.id);
  if (res) {
    success('Laboratory removed');
    isDeleteModalOpen.value = false;
  } else {
    error(labStore.error || 'Delete failed');
  }
};
</script>
