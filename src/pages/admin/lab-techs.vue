<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text">Laboratory Technicians</h1>
        <p class="text-sm text-text-secondary">Manage lab staff and assignments</p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          variant="primary"
          label="Add Technician"
          icon="icon-[heroicons-outline--user-plus]"
          @click="openCreateModal"
        />
      </div>
    </div>

    <AppTable
      :columns="columns"
      :data="labTechStore.labTechs"
      :loading="labTechStore.loading"
      searchable
      search-placeholder="Search technicians..."
      server-paginated
      :page-number="labTechStore.pageNumber"
      :page-size="labTechStore.pageSize"
      :total-count="labTechStore.totalCount"
      :total-pages="labTechStore.totalPages"
      @page-change="handlePageChange"
      @search="handleSearch"
    >
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <div class="size-8 overflow-hidden rounded-full bg-primary/10 text-primary">
             <img v-if="row.imageUrl" :src="row.imageUrl" alt="" class="size-full object-cover" />
             <div v-else class="flex size-full items-center justify-center text-xs font-bold">
               {{ row.firstName[0] }}{{ row.lastName[0] }}
             </div>
          </div>
          <div>
            <div class="font-medium text-text">{{ row.firstName }} {{ row.lastName }}</div>
            <div class="text-xs text-text-secondary">{{ row.lab?.name || 'No Lab' }}</div>
          </div>
        </div>
      </template>

      <template #cell-isActive="{ value }">
        <span
          class="rounded-full px-2 py-1 text-xs font-medium"
          :class="value ? 'bg-success/10 text-success' : 'bg-muted text-text-secondary'"
        >
          {{ value ? 'Active' : 'Inactive' }}
        </span>
      </template>

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
              class="text-warning! hover:bg-warning/10!"
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
              class="text-success! hover:bg-success/10!"
              tooltip="Restore"
              @click="handleRestore(row)"
            />
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--trash]"
              icon-only
              class="text-error! hover:bg-error/10!"
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
      :title="editingTech ? 'Edit Technician' : 'Add New Technician'"
      max-width="lg"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="labTechStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="isHardDelete ? 'Delete Forever' : 'Archive Technician'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete ${techToDelete?.firstName}? This action cannot be undone.`
          : `Are you sure you want to archive ${techToDelete?.firstName}? You can restore it later.`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useLabTechStore } from '../../stores/lab-tech.store';
import { useLabStore } from '../../stores/lab.store';
import AppTable from '../../components/ui/AppTable.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppModal from '../../components/ui/AppModal.vue';
import AppForm from '../../components/ui/Fields/AppForm.vue';
import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
import { useToast } from '../../composables/useToast';
import type { TableColumn } from '../../components/ui/AppTable.vue';
import type { FormFieldRow } from '../../types/form';

const labTechStore = useLabTechStore();
const labStore = useLabStore();
const { success, error } = useToast();

const isHardDelete = ref(false);

const columns: TableColumn[] = [
  { key: 'name', label: 'Technician', sortable: true },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'isActive', label: 'Status' },
  { key: 'actions', label: 'Actions', class: 'text-end' },
];

const labOptions = computed(() =>
  labStore.labs.map(l => ({ label: l.name, value: l.id }))
);

const formFields = computed<FormFieldRow[]>(() => [
  [
    { key: 'FirstName', label: 'First Name', type: 'text' },
    { key: 'LastName', label: 'Last Name', type: 'text' },
  ],
  [
    { key: 'Username', label: 'Username', type: 'text' },
    { key: 'Email', label: 'Email', type: 'email' },
  ],
  [
    { key: 'LabId', label: 'Assigned Lab', type: 'select', items: labOptions.value },
    { key: 'Phone', label: 'Phone', type: 'phone' },
  ],
  [
    { key: 'Password', label: 'Password', type: 'password', placeholder: 'Leave empty to keep current password if editing' },
  ],
]);

const isModalOpen = ref(false);
const editingTech = ref<any>(null);
const formData = ref<any>({});

const isDeleteModalOpen = ref(false);
const techToDelete = ref<any>(null);

onMounted(() => {
  labTechStore.fetchLabTechs();
  labStore.fetchLabs();
});

const handlePageChange = (payload: any) => {
  labTechStore.fetchLabTechs({ ...payload });
};

const handleSearch = (query: string) => {
  labTechStore.fetchLabTechs({ FirstName: query, PageNumber: 1 });
};

const openCreateModal = () => {
  editingTech.value = null;
  formData.value = { FirstName: '', LastName: '', Username: '', Email: '', LabId: '', Phone: '' };
  isModalOpen.value = true;
};

const openEditModal = (tech: any) => {
  editingTech.value = tech;
  formData.value = {
    FirstName: tech.firstName,
    LastName: tech.lastName,
    Username: tech.username,
    Email: tech.email,
    LabId: tech.lab?.id,
    Phone: tech.phone,
  };
  isModalOpen.value = true;
};

const handleSubmit = async (data: any) => {
  let res;
  if (editingTech.value) {
    if (!data.Password) delete data.Password;
    res = await labTechStore.updateLabTech(editingTech.value.id, data);
  } else {
    res = await labTechStore.createLabTech(data);
  }

  if (res) {
    success(editingTech.value ? 'Technician updated' : 'Technician added');
    isModalOpen.value = false;
  } else {
    error(labTechStore.error || 'Operation failed');
  }
};

const confirmDelete = (tech: any, isHard = false) => {
  techToDelete.value = tech;
  isHardDelete.value = isHard;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!techToDelete.value) return;
  const res = await labTechStore.deleteLabTech(techToDelete.value.id, isHardDelete.value);
  if (res) {
    success(isHardDelete.value ? 'Technician deleted forever' : 'Technician archived');
    isDeleteModalOpen.value = false;
  } else {
    error(labTechStore.error || 'Delete failed');
  }
};

const handleRestore = async (tech: any) => {
  const res = await labTechStore.restoreLabTech(tech.id);
  if (res) {
    success('Technician restored');
  } else {
    error(labTechStore.error || 'Restore failed');
  }
};
</script>
