<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-text">System Administrators</h1>
        <p class="text-sm text-text-secondary">Manage administrative access to the platform</p>
      </div>
      <AppButton
        label="Add Administrator"
        icon="icon-[heroicons-outline--plus]"
        @click="openCreateModal"
      />
    </div>

    <AppTable
      v-model:selected="selectedAdmins"
      :columns="columns"
      :data="adminStore.admins"
      :loading="adminStore.loading"
      searchable
      selectable
      show-column-toggle
      columns-visibility-key="admin-list"
      search-placeholder="Search admins..."
      server-paginated
      :page-number="adminStore.pageNumber"
      :page-size="adminStore.pageSize"
      :total-count="adminStore.totalCount"
      :total-pages="adminStore.totalPages"
      @page-change="handlePageChange"
      @search="handleSearch"
    >
      <template #cell-name="{ row }">
        <div class="flex items-center gap-3">
          <div class="size-8 overflow-hidden rounded-full bg-primary/10">
            <img v-if="row.imageUrl" :src="row.imageUrl" alt="" class="size-full object-cover" />
            <div v-else class="flex size-full items-center justify-center text-xs font-bold text-primary">
              {{ row.firstName[0] }}{{ row.lastName[0] }}
            </div>
          </div>
          <span class="font-medium text-text">{{ row.firstName }} {{ row.lastName }}</span>
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
      :title="editingAdmin ? 'Edit Administrator' : 'Add Administrator'"
      max-width="md"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="adminStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      title="Delete Administrator"
      :message="`Are you sure you want to delete ${adminToDelete?.firstName}? This action cannot be undone.`"
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../../stores/admin.store';
import AppTable from '../../components/ui/AppTable.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppModal from '../../components/ui/AppModal.vue';
import AppForm from '../../components/ui/Fields/AppForm.vue';
import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
import { useToast } from '../../composables/useToast';
import type { TableColumn } from '../../components/ui/AppTable.vue';
import type { FormFieldRow } from '../../types/form';

const adminStore = useAdminStore();
const { success, error } = useToast();

const selectedAdmins = ref<any[]>([]);

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'isActive', label: 'Status' },
  { key: 'actions', label: 'Actions', class: 'text-end' },
];

const formFields: FormFieldRow[] = [
  [
    { key: 'FirstName', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
    { key: 'LastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
  ],
  [
    { key: 'Username', label: 'Username', type: 'text', placeholder: 'Enter username' },
    { key: 'Email', label: 'Email', type: 'email', placeholder: 'Enter email' },
  ],
  [
    { key: 'Password', label: 'Password', type: 'password', placeholder: 'Enter password' },
  ],
];

const isModalOpen = ref(false);
const editingAdmin = ref<any>(null);
const formData = ref<any>({});

const isDeleteModalOpen = ref(false);
const adminToDelete = ref<any>(null);

onMounted(() => {
  adminStore.fetchAdmins();
});

const handlePageChange = ({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }) => {
  adminStore.fetchAdmins({ PageNumber: pageNumber, PageSize: pageSize });
};

const handleSearch = (query: string) => {
  adminStore.fetchAdmins({ Username: query, PageNumber: 1 });
};

const openCreateModal = () => {
  editingAdmin.value = null;
  formData.value = { FirstName: '', LastName: '', Username: '', Email: '', Password: '' };
  isModalOpen.value = true;
};

const openEditModal = (admin: any) => {
  editingAdmin.value = admin;
  formData.value = {
    FirstName: admin.firstName,
    LastName: admin.lastName,
    Username: admin.username,
    Email: admin.email,
  };
  isModalOpen.value = true;
};

const handleSubmit = async (data: any) => {
  let res;
  if (editingAdmin.value) {
    res = await adminStore.updateAdmin(editingAdmin.value.id, data);
  } else {
    res = await adminStore.createAdmin(data);
  }

  if (res) {
    success(editingAdmin.value ? 'Admin updated' : 'Admin created');
    isModalOpen.value = false;
  } else {
    error(adminStore.error || 'Operation failed');
  }
};

const confirmDelete = (admin: any) => {
  adminToDelete.value = admin;
  isDeleteModalOpen.value = true;
};

const handleDelete = async () => {
  if (!adminToDelete.value) return;

  const res = await adminStore.deleteAdmin(adminToDelete.value.id);
  if (res) {
    success('Admin deleted');
    isDeleteModalOpen.value = false;
  } else {
    error(adminStore.error || 'Delete failed');
  }
};
</script>
