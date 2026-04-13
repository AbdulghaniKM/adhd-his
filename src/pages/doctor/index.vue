<template>
  <div class="mx-auto max-w-7xl space-y-8 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-text text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        <p class="text-text-secondary text-sm">
          Welcome back, <span class="text-primary font-semibold">Dr. {{ authStore.user?.name }}</span>. You have {{ appointmentStore.todayCount }} appointments today.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <AppButton
          label="Refresh Data"
          variant="outline"
          size="md"
          class="bg-surface! border-border/40! text-text-secondary! hover:text-primary! rounded-xl shadow-xs"
          icon="icon-[heroicons-outline--arrow-path]"
          :loading="appointmentStore.loading"
          @click="fetchAppointments"
        />
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div class="bg-surface border-border/40 group relative flex flex-col gap-1 overflow-hidden rounded-3xl border p-6 shadow-xs transition-all hover:shadow-lg hover:shadow-primary/5">
        <span class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Total Managed</span>
        <span class="text-text text-3xl font-black tracking-tight tabular-nums">{{ appointmentStore.totalCount }}</span>
        <div class="bg-primary/5 absolute -right-2 -top-2 flex size-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
          <span class="icon-[heroicons-outline--calendar] text-primary/20 text-2xl" />
        </div>
      </div>
      <div class="bg-surface border-border/40 group relative flex flex-col gap-1 overflow-hidden rounded-3xl border p-6 shadow-xs transition-all hover:shadow-lg hover:shadow-info/5">
        <span class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Today's Schedule</span>
        <span class="text-text text-3xl font-black tracking-tight tabular-nums">{{ appointmentStore.todayCount }}</span>
        <div class="bg-info/5 absolute -right-2 -top-2 flex size-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
          <span class="icon-[heroicons-outline--clock] text-info/20 text-2xl" />
        </div>
      </div>
      <div class="bg-surface border-border/40 group relative flex flex-col gap-1 overflow-hidden rounded-3xl border p-6 shadow-xs transition-all hover:shadow-lg hover:shadow-warning/5">
        <span class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Pending Review</span>
        <span class="text-text text-3xl font-black tracking-tight tabular-nums">{{ appointmentStore.pendingCount }}</span>
        <div class="bg-warning/5 absolute -right-2 -top-2 flex size-16 items-center justify-center rounded-full transition-transform group-hover:scale-110">
          <span class="icon-[heroicons-outline--exclamation-circle] text-warning/20 text-2xl" />
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-surface border-border/40 rounded-3xl border shadow-sm">
      <AppTable
        :columns="columns"
        :data="appointmentStore.doctorAppointments"
        :loading="appointmentStore.loading"
        searchable
        exportable
        export-file-name="my-appointments"
        show-column-toggle
        columns-visibility-key="doctor-appointments"
        search-placeholder="Search by patient name..."
        server-paginated
        :page-number="appointmentStore.pageNumber"
        :page-size="appointmentStore.pageSize"
        :total-count="appointmentStore.totalCount"
        :total-pages="appointmentStore.totalPages"
        outlined="false"
        @page-change="handlePageChange"
        @search="handleSearch"
      >
        <template #cell-patient="{ row }">
          <div class="flex items-center gap-4">
            <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl font-bold text-xs ring-1 ring-primary/20">
              {{ row.patient?.firstName[0] }}{{ row.patient?.lastName[0] }}
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-text text-sm font-bold leading-none">{{ row.patient?.firstName }} {{ row.patient?.lastName }}</span>
              <span class="text-text-secondary text-[11px] opacity-60">Patient ID: {{ row.patient?.id.slice(0, 8) }}</span>
            </div>
          </div>
        </template>

        <template #cell-type="{ value }">
          <span
            class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider"
            :class="value === AppointmentType.ONLINE ? 'bg-secondary/10 text-secondary ring-1 ring-secondary/20' : 'bg-primary/10 text-primary ring-1 ring-primary/20'"
          >
            <span :class="value === AppointmentType.ONLINE ? 'icon-[heroicons-outline--video-camera]' : 'icon-[heroicons-outline--user]'" />
            {{ mapAppointmentType(value) }}
          </span>
        </template>

        <template #cell-status="{ value }">
          <span
            class="rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-inset"
            :class="getStatusClass(value)"
          >
            {{ mapAppointmentStatus(value) }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-end gap-1.5">
            <AppButton
              v-if="row.status === AppointmentStatus.SCHEDULED"
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--check-circle]"
              icon-only
              tooltip="Confirm Appointment"
              class="text-success! hover:bg-success/10! rounded-lg"
              @click="handleUpdateStatus(row, AppointmentStatus.CONFIRMED)"
            />
            <AppButton
              v-if="row.status === AppointmentStatus.CONFIRMED"
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--login]"
              icon-only
              tooltip="Mark as Checked In"
              class="text-primary! hover:bg-primary/10! rounded-lg"
              @click="handleUpdateStatus(row, AppointmentStatus.CHECKED_IN)"
            />
             <AppButton
              v-if="row.status === AppointmentStatus.CHECKED_IN"
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--check-badge]"
              icon-only
              tooltip="Complete Visit"
              class="text-success! hover:bg-success/10! rounded-lg"
              @click="handleUpdateStatus(row, AppointmentStatus.CHECKED_OUT)"
            />
            <AppButton
              v-if="[AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(row.status)"
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--x-circle]"
              icon-only
              tooltip="Cancel Appointment"
              class="text-error! hover:bg-error/10! rounded-lg"
              @click="handleUpdateStatus(row, AppointmentStatus.CANCELLED)"
            />
          </div>
        </template>
      </AppTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { AuthStore } from '../../stores/auth.store';
  import { useAppointmentStore } from '../../stores/appointment.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import { useToast } from '../../composables/useToast';
  import { useEnums } from '../../composables/useEnums';
  import { formatDate } from '../../utils/format-date';
  import { AppointmentStatus, AppointmentType } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';

  const { mapAppointmentType, mapAppointmentStatus } = useEnums();

  const authStore = AuthStore();
  const appointmentStore = useAppointmentStore();
  const { success, error } = useToast();

  const columns: TableColumn[] = [
    { key: 'patient', label: 'Patient Information', sortable: true },
    { key: 'dateTime', label: 'Schedule', sortable: true, formatter: (v) => formatDate(v, true) },
    { key: 'type', label: 'Modality' },
    { key: 'status', label: 'Status' },
    { key: 'reason', label: 'Reason for Visit', defaultHidden: false },
    { key: 'notes', label: 'Doctor Notes', defaultHidden: true },
    { key: 'createdAt', label: 'Recorded On', defaultHidden: true, formatter: (v) => formatDate(v) },
    { key: 'actions', label: 'Operations', class: 'text-end' },
  ];

  const fetchAppointments = () => {
    if (authStore.user?.id) {
      appointmentStore.fetchDoctorAppointments(authStore.user.id);
      appointmentStore.fetchDashboardMetrics(authStore.user.id);
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
      appointmentStore.fetchDoctorAppointments(authStore.user.id, { PatientName: query, PageNumber: 1 });
    }
  };

  const handleUpdateStatus = async (appointment: any, status: AppointmentStatus) => {
    const res = await appointmentStore.updateStatus(appointment.id, { status }, true, authStore.user?.id);
    if (res) {
      success(`Appointment ${mapAppointmentStatus(status).toLowerCase()} successfully`);
    } else {
      error(appointmentStore.error || 'Failed to update status');
    }
  };

  const getStatusClass = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'bg-muted/50 text-text-secondary/70 ring-border/50';
      case AppointmentStatus.CONFIRMED: return 'bg-primary/10 text-primary ring-primary/30';
      case AppointmentStatus.CHECKED_IN: return 'bg-warning/10 text-warning ring-warning/30';
      case AppointmentStatus.CHECKED_OUT: return 'bg-success/10 text-success ring-success/30';
      case AppointmentStatus.CANCELLED: return 'bg-error/10 text-error ring-error/30';
      default: return 'bg-muted/50 text-text-secondary/70 ring-border/50';
    }
  };
</script>
