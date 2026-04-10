<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Appointments</h1>
        <p class="text-text-secondary text-sm">Monitor and manage hospital appointment schedules</p>
      </div>
    </div>

    <AppTable
      :columns="columns"
      :data="appointmentStore.appointments"
      :loading="appointmentStore.loading"
      searchable
      search-placeholder="Search by patient or doctor..."
      server-paginated
      :page-number="appointmentStore.pageNumber"
      :page-size="appointmentStore.pageSize"
      :total-count="appointmentStore.totalCount"
      :total-pages="appointmentStore.totalPages"
      @page-change="handlePageChange"
    >
      <template #cell-patient="{ row }">
        <span class="text-text font-medium">
          {{ row.patient?.firstName }} {{ row.patient?.lastName }}
        </span>
      </template>

      <template #cell-doctor="{ row }">
        <span class="text-text-secondary">
          Dr. {{ row.doctor?.firstName }} {{ row.doctor?.lastName }}
        </span>
      </template>

      <template #cell-type="{ value }">
        {{ mapAppointmentType(value) }}
      </template>

      <template #cell-status="{ value }">
        <span
          class="rounded-full px-2 py-1 text-xs font-medium"
          :class="statusClasses[value] || 'bg-muted text-text-secondary'"
        >
          {{ mapAppointmentStatus(value) }}
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
              tooltip="Update Status"
              @click="openStatusModal(row)"
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

    <!-- Status Update Modal -->
    <AppModal
      :is-open="isStatusModalOpen"
      title="Update Appointment Status"
      max-width="sm"
      @close="isStatusModalOpen = false"
    >
      <div class="space-y-4 py-4">
        <div class="space-y-1.5">
          <label class="text-text-secondary text-xs font-semibold tracking-wider uppercase">
            New Status
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="status in availableStatuses"
              :key="status"
              type="button"
              class="border-border hover:border-primary rounded-xl border p-3 text-start transition-all"
              :class="
                selectedStatus === status
                  ? 'border-primary bg-primary/5 ring-primary ring-1'
                  : 'bg-surface'
              "
              @click="selectedStatus = status"
            >
              <div class="text-text text-sm font-bold">{{ mapAppointmentStatus(status) }}</div>
            </button>
          </div>
        </div>
        <AppButton
          label="Update Status"
          class="w-full"
          :loading="appointmentStore.loading"
          @click="handleStatusUpdate"
        />
      </div>
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="isHardDelete ? 'Delete Forever' : 'Archive Appointment'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete this appointment? This action cannot be undone.`
          : `Are you sure you want to archive this appointment? You can restore it later.`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useAppointmentStore } from '../../stores/appointment.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
  import { useToast } from '../../composables/useToast';
  import { mapAppointmentStatus, mapAppointmentType } from '../../utils/enum-mapper';
  import { formatDate } from '../../utils/format-date';
  import { AppointmentStatus } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';

  const appointmentStore = useAppointmentStore();
  const { success, error } = useToast();

  const isHardDelete = ref(false);

  const columns: TableColumn[] = [
    { key: 'dateTime', label: 'Date & Time', sortable: true, formatter: formatDate },
    { key: 'patient', label: 'Patient' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const statusClasses: Record<number, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-blue-500/10 text-blue-500',
    [AppointmentStatus.CONFIRMED]: 'bg-indigo-500/10 text-indigo-500',
    [AppointmentStatus.CHECKED_IN]: 'bg-amber-500/10 text-amber-500',
    [AppointmentStatus.CHECKED_OUT]: 'bg-green-500/10 text-green-500',
    [AppointmentStatus.CANCELLED]: 'bg-error/10 text-error',
  };

  const availableStatuses = Object.values(AppointmentStatus);

  const isStatusModalOpen = ref(false);
  const selectedAppointment = ref<any>(null);
  const selectedStatus = ref<AppointmentStatus>(AppointmentStatus.SCHEDULED);

  const isDeleteModalOpen = ref(false);
  const appointmentToDelete = ref<any>(null);

  onMounted(() => {
    appointmentStore.fetchAppointments();
  });

  const handlePageChange = (payload: any) => {
    appointmentStore.fetchAppointments({ ...payload });
  };

  const openStatusModal = (appointment: any) => {
    selectedAppointment.value = appointment;
    selectedStatus.value = appointment.status;
    isStatusModalOpen.value = true;
  };

  const handleStatusUpdate = async () => {
    if (!selectedAppointment.value) return;
    const res = await appointmentStore.updateStatus(selectedAppointment.value.id, {
      status: selectedStatus.value,
    });

    if (res) {
      success('Appointment status updated');
      isStatusModalOpen.value = false;
    } else {
      error(appointmentStore.error || 'Update failed');
    }
  };

  const confirmDelete = (appointment: any, isHard = false) => {
    appointmentToDelete.value = appointment;
    isHardDelete.value = isHard;
    isDeleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!appointmentToDelete.value) return;
    const res = await appointmentStore.deleteAppointment(
      appointmentToDelete.value.id,
      isHardDelete.value,
    );
    if (res) {
      success(isHardDelete.value ? 'Appointment deleted forever' : 'Appointment archived');
      isDeleteModalOpen.value = false;
    } else {
      error(appointmentStore.error || 'Operation failed');
    }
  };

  const handleRestore = async (appointment: any) => {
    const res = await appointmentStore.restoreAppointment(appointment.id);
    if (res) {
      success('Appointment restored');
    } else {
      error(appointmentStore.error || 'Restore failed');
    }
  };
</script>
