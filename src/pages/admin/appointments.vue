<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Appointments</h1>
        <p class="text-text-secondary text-sm">Monitor and manage patient consultations</p>
      </div>
      <div v-if="!isDoctorFlow" class="flex items-center gap-2">
        <AppButton
          variant="primary"
          label="Add Appointment"
          icon="icon-[heroicons-outline--calendar-days]"
          @click="openCreateModal"
        />
      </div>
    </div>

    <AppTable
      :columns="visibleColumns"
      :data="isDoctorFlow ? appointmentStore.doctorAppointments : appointmentStore.appointments"
      :loading="appointmentStore.loading"
      searchable
      show-column-toggle
      columns-visibility-key="appointment-list"
      search-placeholder="Search appointments..."
      server-paginated
      :page-number="appointmentStore.pageNumber"
      :page-size="appointmentStore.pageSize"
      :total-count="appointmentStore.totalCount"
      :total-pages="appointmentStore.totalPages"
      @page-change="handlePageChange"
      @search="handleSearch"
    >
      <template #cell-patient="{ row }">
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-[10px] font-bold">
            {{ row.patient?.firstName?.[0] }}{{ row.patient?.lastName?.[0] }}
          </div>
          <span class="text-text font-medium">{{ row.patient?.firstName }} {{ row.patient?.lastName }}</span>
        </div>
      </template>

      <template #cell-doctor="{ row }">
        <span class="text-text">Dr. {{ row.doctor?.firstName }} {{ row.doctor?.lastName }}</span>
      </template>

      <template #cell-type="{ value }">
        <span class="bg-muted text-text-secondary rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
          {{ mapAppointmentType(value) }}
        </span>
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
              icon="icon-[heroicons-outline--beaker]"
              icon-only
              tooltip="Order EEG"
              class="text-primary! hover:bg-primary/10!"
              @click="openOrderEegModal(row)"
            />
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--pencil-square]"
              icon-only
              tooltip="Change Status"
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

    <!-- Create Modal -->
    <AppModal
      :is-open="isCreateModalOpen"
      title="Add New Appointment"
      max-width="lg"
      @close="isCreateModalOpen = false"
    >
      <AppForm
        v-model="createFormData"
        :fields="createFormFields"
        :schema="appointmentSchema"
        :is-submitting="appointmentStore.loading"
        @submitted="handleCreate"
      />
    </AppModal>

    <!-- Edit Status Modal -->
    <AppModal
      :is-open="isModalOpen"
      title="Update Appointment Status"
      max-width="md"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="appointmentStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Order EEG Modal -->
    <AppModal
      :is-open="isEegModalOpen"
      title="Order EEG Test"
      max-width="md"
      @close="isEegModalOpen = false"
    >
      <AppForm
        v-model="eegFormData"
        :fields="eegFormFields"
        :is-submitting="eegStore.loading"
        @submitted="handleCreateEeg"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="isHardDelete ? 'Delete Forever' : 'Archive Appointment'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete the appointment for ${appointmentToDelete?.patient?.firstName}?`
          : `Are you sure you want to archive this appointment?`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { z } from 'zod';
  import { AuthStore } from '../../stores/auth.store';
  import { useAppointmentStore } from '../../stores/appointment.store';
  import { usePatientStore } from '../../stores/patient.store';
  import { useDoctorStore } from '../../stores/doctor.store';
  import { useEegTestStore } from '../../stores/eeg-test.store';
  import { useLabStore } from '../../stores/lab.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import AppForm from '../../components/ui/Fields/AppForm.vue';
  import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
  import { useToast } from '../../composables/useToast';
  import { useEnums } from '../../composables/useEnums';
  import { formatDate } from '../../utils/format-date';
  import { AppointmentStatus, AppointmentType } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';
  import type { FormFieldRow } from '../../types/form';

  const appointmentStore = useAppointmentStore();
  const patientStore = usePatientStore();
  const doctorStore = useDoctorStore();
  const eegStore = useEegTestStore();
  const labStore = useLabStore();
  const authStore = AuthStore();
  const route = useRoute();
  const { success, error } = useToast();

  const isDoctorFlow = computed(() => route.path.startsWith('/doctor'));

  const {
    mapAppointmentStatus,
    mapAppointmentType,
    appointmentStatusLabels,
    appointmentTypeLabels,
  } = useEnums();

  const appointmentSchema = z.object({
    PatientId: z.string().min(1, 'Please select a patient'),
    DoctorId: z.string().min(1, 'Please select a doctor'),
    DateTime: z.string().min(1, 'Date and time is required'),
    Type: z.number(),
    Reason: z.string().optional().or(z.literal('')),
  });

  const columns: TableColumn[] = [
    { key: 'dateTime', label: 'Date/Time', sortable: true, formatter: (v) => formatDate(v, true) },
    { key: 'patient', label: 'Patient' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const visibleColumns = computed(() => {
    if (isDoctorFlow.value) {
      return columns.filter((c) => c.key !== 'doctor');
    }
    return columns;
  });

  const statusClasses: Record<number, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-blue-500/10 text-blue-500',
    [AppointmentStatus.CONFIRMED]: 'bg-indigo-500/10 text-indigo-500',
    [AppointmentStatus.CHECKED_IN]: 'bg-amber-500/10 text-amber-500',
    [AppointmentStatus.CHECKED_OUT]: 'bg-green-500/10 text-green-500',
    [AppointmentStatus.CANCELLED]: 'bg-error/10 text-error',
  };

  const patientOptions = computed(() => 
    patientStore.patients.map(p => ({ label: `${p.firstName} ${p.lastName}`, value: p.id }))
  );

  const doctorOptions = computed(() => 
    doctorStore.doctors.map(d => ({ label: `Dr. ${d.firstName} ${d.lastName}`, value: d.id }))
  );

  const createFormFields = computed<FormFieldRow[]>(() => [
    [
      { key: 'PatientId', label: 'Patient', type: 'select', items: patientOptions.value },
      { key: 'DoctorId', label: 'Doctor', type: 'select', items: doctorOptions.value },
    ],
    [
      { key: 'DateTime', label: 'Date/Time', type: 'datetime-local' },
      {
        key: 'Type',
        label: 'Appointment Type',
        type: 'select',
        items: Object.entries(appointmentTypeLabels.value).map(([value, label]) => ({
          label,
          value: Number(value),
        })),
      },
    ],
    [{ key: 'Reason', label: 'Reason/Notes', type: 'textarea' }],
  ]);

  const formFields = computed<FormFieldRow[]>(() => [
    [
      {
        key: 'status',
        label: 'New Status',
        type: 'select',
        items: Object.entries(appointmentStatusLabels.value).map(([value, label]) => ({
          label,
          value: Number(value),
        })),
      },
    ],
    [{ key: 'notes', label: 'Status Change Notes', type: 'textarea' }],
  ]);

  const labOptions = computed(() => labStore.labs.map(l => ({ label: l.name, value: l.id })));
  const eegFormFields = computed<FormFieldRow[]>(() => [
    [{ key: 'testDate', label: 'Planned Test Date', type: 'datetime-local' }],
    [{ key: 'labId', label: 'Target Laboratory', type: 'select', items: labOptions.value }],
    [{ key: 'notes', label: 'Additional Notes', type: 'textarea' }],
  ]);

  const isCreateModalOpen = ref(false);
  const createFormData = ref<any>({});
  const isModalOpen = ref(false);
  const editingAppointment = ref<any>(null);
  const formData = ref<any>({});

  const isEegModalOpen = ref(false);
  const eegFormData = ref<any>({});

  const isDeleteModalOpen = ref(false);
  const appointmentToDelete = ref<any>(null);
  const isHardDelete = ref(false);

  const fetchAppointments = (payload?: any) => {
    if (isDoctorFlow.value && authStore.user?.id) {
      appointmentStore.fetchDoctorAppointments(authStore.user.id, payload);
    } else {
      appointmentStore.fetchAppointments(payload);
    }
  };

  onMounted(() => {
    fetchAppointments();
    patientStore.fetchPatients({ pageSize: 100 });
    doctorStore.fetchDoctors();
    labStore.fetchLabs();
  });

  const handlePageChange = (payload: any) => {
    fetchAppointments(payload);
  };

  const handleSearch = (query: string) => {
    fetchAppointments({ PatientName: query, PageNumber: 1 });
  };

  const openCreateModal = () => {
    createFormData.value = { 
      PatientId: '',
      DoctorId: '',
      Type: AppointmentType.CONSULTATION,
      DateTime: new Date().toISOString().slice(0, 16),
      Reason: ''
    };
    isCreateModalOpen.value = true;
  };

  const handleCreate = async (data: any) => {
    const res = await appointmentStore.createAppointment(data);
    if (res) {
      success('Appointment scheduled');
      isCreateModalOpen.value = false;
    } else {
      error(appointmentStore.error || 'Failed to create');
    }
  };

  const openEditModal = (appointment: any) => {
    editingAppointment.value = appointment;
    formData.value = { status: appointment.status };
    isModalOpen.value = true;
  };

  const handleSubmit = async (data: any) => {
    if (!editingAppointment.value) return;
    const res = await appointmentStore.updateStatus(
      editingAppointment.value.id, 
      data,
      isDoctorFlow.value,
      authStore.user?.id
    );
    if (res) {
      success('Status updated');
      isModalOpen.value = false;
    } else {
      error(appointmentStore.error || 'Update failed');
    }
  };

  const openOrderEegModal = (appointment: any) => {
    eegFormData.value = {
      appointmentId: appointment.id,
      testDate: new Date().toISOString().slice(0, 16)
    };
    isEegModalOpen.value = true;
  };

  const handleCreateEeg = async (data: any) => {
    const res = await eegStore.createTest(data);
    if (res) {
      success('EEG test ordered');
      isEegModalOpen.value = false;
    } else {
      error(eegStore.error || 'Failed to order EEG');
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
      error(appointmentStore.error || 'Delete failed');
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