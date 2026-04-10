<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Laboratory Facilities</h1>
        <p class="text-text-secondary text-sm">Manage hospital lab units and contact details</p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          label="Add Laboratory"
          icon="icon-[heroicons-outline--plus]"
          @click="openCreateModal"
        />
      </div>
    </div>

    <AppTable
      :columns="columns"
      :data="labStore.labs"
      :loading="labStore.loading"
      searchable
      search-placeholder="Search labs..."
      server-paginated
      :page-number="labStore.pageNumber"
      :page-size="labStore.pageSize"
      :total-count="labStore.totalCount"
      :total-pages="labStore.totalPages"
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
      :title="isHardDelete ? 'Delete Forever' : 'Archive Laboratory'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete the ${labToDelete?.name} facility? This action cannot be undone.`
          : `Are you sure you want to archive the ${labToDelete?.name} facility? You can restore it later.`
      "
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

  const isHardDelete = ref(false);

  const columns: TableColumn[] = [
    { key: 'name', label: 'Laboratory Name', sortable: true },
    { key: 'location', label: 'Location' },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const formFields: FormFieldRow[] = [
    [{ key: 'Name', label: 'Lab Name', type: 'text', placeholder: 'e.g. Hematology Lab' }],
    [
      {
        key: 'Location',
        label: 'Location/Building',
        type: 'text',
        placeholder: 'e.g. Block B, 2nd Floor',
      },
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

  const handlePageChange = ({ pageNumber, pageSize }: { pageNumber: number; pageSize: number }) => {
    labStore.fetchLabs({ PageNumber: pageNumber, PageSize: pageSize });
  };

  const handleSearch = (query: string) => {
    labStore.fetchLabs({ Name: query, PageNumber: 1 });
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

  const confirmDelete = (lab: any, isHard = false) => {
    labToDelete.value = lab;
    isHardDelete.value = isHard;
    isDeleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!labToDelete.value) return;
    const res = await labStore.deleteLab(labToDelete.value.id, isHardDelete.value);
    if (res) {
      success(isHardDelete.value ? 'Lab deleted forever' : 'Lab archived');
      isDeleteModalOpen.value = false;
    } else {
      error(labStore.error || 'Delete failed');
    }
  };

  const handleRestore = async (lab: any) => {
    const res = await labStore.restoreLab(lab.id);
    if (res) {
      success('Lab restored');
    } else {
      error(labStore.error || 'Restore failed');
    }
  };
</script>
