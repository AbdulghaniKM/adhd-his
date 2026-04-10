<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Doctor Dashboard</h1>
        <p class="text-text-secondary text-sm">Welcome back, Dr. {{ authStore.user?.name }}</p>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          label="Refresh"
          variant="outline"
          icon="icon-[heroicons-outline--arrow-path]"
          :loading="appointmentStore.loading"
          @click="fetchAppointments"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div class="bg-surface border-border flex flex-col gap-1 rounded-2xl border p-5 shadow-sm">
        <span class="text-text-secondary text-xs font-semibold uppercase tracking-wider">Total Appointments</span>
        <span class="text-text text-3xl font-bold">{{ appointmentStore.totalCount }}</span>
      </div>
      <div class="bg-surface border-border flex flex-col gap-1 rounded-2xl border p-5 shadow-sm">
        <span class="text-text-secondary text-xs font-semibold uppercase tracking-wider">Today's Schedule</span>
        <span class="text-text text-3xl font-bold">{{ todayAppointmentsCount }}</span>
      </div>
      <div class="bg-surface border-border flex flex-col gap-1 rounded-2xl border p-5 shadow-sm">
        <span class="text-text-secondary text-xs font-semibold uppercase tracking-wider">Pending Confirmations</span>
        <span class="text-text text-3xl font-bold">{{ pendingAppointmentsCount }}</span>
      </div>
    </div>

    <AppTable
      :columns="columns"
      :data="appointmentStore.doctorAppointments"
      :loading="appointmentStore.loading"
      searchable
      exportable
      export-file-name="my-appointments"
      show-column-toggle
      columns-visibility-key="doctor-appointments"
      search-placeholder="Search patients..."
      server-paginated
      :page-number="appointmentStore.pageNumber"
      :page-size="appointmentStore.pageSize"
      :total-count="appointmentStore.totalCount"
      :total-pages="appointmentStore.totalPages"
      @page-change="handlePageChange"
      @search="handleSearch"
    >
      <template #cell-patient="{ row }">
        <div class="flex items-center gap-3">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
            {{ row.patient?.firstName[0] }}{{ row.patient?.lastName[0] }}
          </div>
          <div>
            <div class="text-text font-medium">{{ row.patient?.firstName }} {{ row.patient?.lastName }}</div>
          </div>
        </div>
      </template>

      <template #cell-type="{ value }">
        <span
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          :class="value === AppointmentType.ONLINE ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'"
        >
          <span :class="value === AppointmentType.ONLINE ? 'icon-[heroicons-outline--video-camera]' : 'icon-[heroicons-outline--user]'" />
          {{ mapAppointmentType(value) }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <span
          class="rounded-full px-2 py-1 text-xs font-medium"
          :class="getStatusClass(value)"
        >
          {{ mapAppointmentStatus(value) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center justify-end gap-2">
          <AppButton
            v-if="row.status === AppointmentStatus.SCHEDULED"
            variant="ghost"
            size="sm"
            icon="icon-[heroicons-outline--check-circle]"
            icon-only
            tooltip="Confirm"
            class="text-success!"
            @click="handleUpdateStatus(row, AppointmentStatus.CONFIRMED)"
          />
          <AppButton
            v-if="row.status === AppointmentStatus.CONFIRMED"
            variant="ghost"
            size="sm"
            icon="icon-[heroicons-outline--login]"
            icon-only
            tooltip="Check In"
            class="text-primary!"
            @click="handleUpdateStatus(row, AppointmentStatus.CHECKED_IN)"
          />
           <AppButton
            v-if="row.status === AppointmentStatus.CHECKED_IN"
            variant="ghost"
            size="sm"
            icon="icon-[heroicons-outline--check-badge]"
            icon-only
            tooltip="Complete"
            class="text-success!"
            @click="handleUpdateStatus(row, AppointmentStatus.CHECKED_OUT)"
          />
          <AppButton
            v-if="[AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(row.status)"
            variant="ghost"
            size="sm"
            icon="icon-[heroicons-outline--x-circle]"
            icon-only
            tooltip="Cancel"
            class="text-error!"
            @click="handleUpdateStatus(row, AppointmentStatus.CANCELLED)"
          />
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { AuthStore } from '../../stores/auth.store';
  import { useAppointmentStore } from '../../stores/appointment.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import { useToast } from '../../composables/useToast';
  import { mapAppointmentType, mapAppointmentStatus } from '../../utils/enum-mapper';
  import { formatDate } from '../../utils/format-date';
  import { AppointmentStatus, AppointmentType } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';

  const authStore = AuthStore();
  const appointmentStore = useAppointmentStore();
  const { success, error } = useToast();

  const columns: TableColumn[] = [
    { key: 'patient', label: 'Patient', sortable: true },
    { key: 'dateTime', label: 'Date & Time', sortable: true, formatter: (v) => formatDate(v, true) },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'reason', label: 'Reason', defaultHidden: false },
    { key: 'notes', label: 'Notes', defaultHidden: true },
    { key: 'createdAt', label: 'Created At', defaultHidden: true, formatter: (v) => formatDate(v) },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const todayAppointmentsCount = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointmentStore.doctorAppointments.filter(a => a.dateTime.startsWith(today)).length;
  });

  const pendingAppointmentsCount = computed(() => {
    return appointmentStore.doctorAppointments.filter(a => a.status === AppointmentStatus.SCHEDULED).length;
  });

  const fetchAppointments = () => {
    if (authStore.user?.id) {
      appointmentStore.fetchDoctorAppointments(authStore.user.id);
    }
  };

  onMounted(() => {
    fetchAppointments();
  });

  const handlePageChange = (payload: any) => {
    if (authStore.user?.id) {
      appointmentStore.fetchDoctorAppointments(authStore.user.id, { ...payload });
    }
  };

  const handleSearch = (query: string) => {
    if (authStore.user?.id) {
      // Assuming the backend supports filtering by patient name in doctor appointments
      appointmentStore.fetchDoctorAppointments(authStore.user.id, { PatientName: query, PageNumber: 1 });
    }
  };

  const handleUpdateStatus = async (appointment: any, status: AppointmentStatus) => {
    const res = await appointmentStore.updateStatus(appointment.id, { status }, true, authStore.user?.id);
    if (res) {
      success(`Appointment ${mapAppointmentStatus(status).toLowerCase()}`);
    } else {
      error(appointmentStore.error || 'Failed to update status');
    }
  };

  const getStatusClass = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'bg-muted text-text-secondary';
      case AppointmentStatus.CONFIRMED: return 'bg-primary/10 text-primary';
      case AppointmentStatus.CHECKED_IN: return 'bg-warning/10 text-warning';
      case AppointmentStatus.CHECKED_OUT: return 'bg-success/10 text-success';
      case AppointmentStatus.CANCELLED: return 'bg-error/10 text-error';
      default: return 'bg-muted text-text-secondary';
    }
  };
</script>
