<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">System Administrators</h1>
        <p class="text-text-secondary text-sm">Manage administrative access to the platform</p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          variant="primary"
          label="Add Administrator"
          icon="icon-[heroicons-outline--plus]"
          @click="openCreateModal"
        />
      </div>
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
          <div class="bg-primary/10 size-8 overflow-hidden rounded-full">
            <img v-if="row.imageUrl" :src="row.imageUrl" alt="" class="size-full object-cover" />
            <div
              v-else
              class="text-primary flex size-full items-center justify-center text-xs font-bold"
            >
              {{ row.firstName[0] }}{{ row.lastName[0] }}
            </div>
          </div>
          <span class="text-text font-medium">{{ row.firstName }} {{ row.lastName }}</span>
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
      :title="isHardDelete ? 'Delete Forever' : 'Archive Administrator'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete ${adminToDelete?.firstName}? This action cannot be undone.`
          : `Are you sure you want to archive ${adminToDelete?.firstName}? You can restore it later.`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
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
  const isHardDelete = ref(false);

  const columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'username', label: 'Username', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'isActive', label: 'Status' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const formFields = computed<FormFieldRow[]>(() => {
    const fields: FormFieldRow[] = [
      [
        { key: 'FirstName', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
        { key: 'LastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
      ],
      [
        { key: 'Username', label: 'Username', type: 'text', placeholder: 'Enter username' },
        { key: 'Email', label: 'Email', type: 'email', placeholder: 'Enter email' },
      ],
    ];

    if (editingAdmin.value) {
      fields.push([
        {
          key: 'CurrentPassword',
          label: 'Current Password',
          type: 'password',
          placeholder: 'Enter current password to change',
        },
        {
          key: 'NewPassword',
          label: 'New Password',
          type: 'password',
          placeholder: 'Enter new password',
        },
      ]);
    } else {
      fields.push([{ key: 'Password', label: 'Password', type: 'password', placeholder: 'Enter password' }]);
    }

    return fields;
  });

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

  const confirmDelete = (admin: any, isHard = false) => {
    adminToDelete.value = admin;
    isHardDelete.value = isHard;
    isDeleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!adminToDelete.value) return;

    const res = await adminStore.deleteAdmin(adminToDelete.value.id, isHardDelete.value);
    if (res) {
      success(isHardDelete.value ? 'Admin deleted forever' : 'Admin archived');
      isDeleteModalOpen.value = false;
    } else {
      error(adminStore.error || 'Delete failed');
    }
  };

  const handleRestore = async (admin: any) => {
    const res = await adminStore.restoreAdmin(admin.id);
    if (res) {
      success('Admin restored');
    } else {
      error(adminStore.error || 'Restore failed');
    }
  };
</script>
