<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Patient Management</h1>
        <p class="text-text-secondary text-sm">Register and manage patient records</p>
      </div>
      <AppButton
        variant="primary"
        label="Register Patient"
        icon="icon-[heroicons-outline--user-plus]"
        @click="openCreateModal"
      />
    </div>

    <AppTable
      v-model:selected="selectedPatients"
      :columns="columns"
      :data="patientStore.patients"
      :loading="patientStore.loading"
      searchable
      selectable
      exportable
      export-file-name="patients-list"
      show-column-toggle
      columns-visibility-key="patient-list"
      search-placeholder="Search patients..."
      server-paginated
      :page-number="patientStore.pageNumber"
      :page-size="patientStore.pageSize"
      :total-count="patientStore.totalCount"
      :total-pages="patientStore.totalPages"
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

      <template #cell-gender="{ value }">
        {{ mapGender(value) }}
      </template>

      <template #cell-bloodType="{ value }">
        {{ mapBloodType(value) }}
      </template>

      <template #cell-status="{ value }">
        <span
          class="rounded-full px-2 py-1 text-xs font-medium"
          :class="statusClasses[value] || 'bg-muted text-text-secondary'"
        >
          {{ mapPatientStatus(value) }}
        </span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <template v-if="!row.isDeleted">
            <AppButton
              variant="ghost"
              size="sm"
              icon="icon-[heroicons-outline--eye]"
              icon-only
              tooltip="View Profile"
              @click="navigateToProfile(row.id)"
            />
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
      :title="editingPatient ? 'Edit Patient Profile' : 'Register New Patient'"
      max-width="lg"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="patientStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="isHardDelete ? 'Delete Forever' : 'Archive Patient'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete ${patientToDelete?.firstName}'s record? This cannot be undone.`
          : `Are you sure you want to archive ${patientToDelete?.firstName}'s record? You can restore it later.`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePatientStore } from '../../stores/patient.store';
  import { useDoctorStore } from '../../stores/doctor.store';
  import { AuthStore } from '../../stores/auth.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import AppForm from '../../components/ui/Fields/AppForm.vue';
  import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
  import { useToast } from '../../composables/useToast';
  import { mapPatientStatus, mapGender, mapBloodType, BloodTypeLabels } from '../../utils/enum-mapper';
  import { formatDate } from '../../utils/format-date';
  import { Gender, BloodType, PatientStatus, AppRole } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';
  import type { FormFieldRow } from '../../types/form';

  const router = useRouter();
  const patientStore = usePatientStore();
  const doctorStore = useDoctorStore();
  const authStore = AuthStore();
  const { success, error } = useToast();

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Patient',
      sortable: true,
      exportFormatter: (row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'birthDate', label: 'Birth Date', defaultHidden: true, formatter: formatDate },
    {
      key: 'gender',
      label: 'Gender',
      defaultHidden: true,
      exportFormatter: (row) => mapGender(row.gender),
    },
    {
      key: 'bloodType',
      label: 'Blood Type',
      defaultHidden: true,
      exportFormatter: (row) => mapBloodType(row.bloodType),
    },
    { key: 'status', label: 'Status', exportFormatter: (row) => mapPatientStatus(row.status) },
    { key: 'primaryDoctor.firstName', label: 'Primary Doctor', defaultHidden: true },
    { key: 'createdAt', label: 'Registered', defaultHidden: true, formatter: formatDate },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const selectedPatients = ref<any[]>([]);
  const isHardDelete = ref(false);

  const statusClasses: Record<number, string> = {
    [PatientStatus.IN_PATIENT]: 'bg-amber-500/10 text-amber-500',
    [PatientStatus.OUT_PATIENT]: 'bg-green-500/10 text-green-500',
    [PatientStatus.NOT_SET]: 'bg-muted text-text-secondary',
  };

  const doctorOptions = computed(() =>
    doctorStore.doctors.map((d) => ({ label: `Dr. ${d.firstName} ${d.lastName}`, value: d.id })),
  );

  const formFields = computed<FormFieldRow[]>(() => [
    [
      { key: 'FirstName', label: 'First Name', type: 'text' },
      { key: 'LastName', label: 'Last Name', type: 'text' },
    ],
    [
      { key: 'Email', label: 'Email', type: 'email' },
      { key: 'Phone', label: 'Phone', type: 'phone' },
    ],
    [
      { key: 'BirthDate', label: 'Birth Date', type: 'date' },
      {
        key: 'Gender',
        label: 'Gender',
        type: 'select',
        items: [
          { label: 'Male', value: Gender.MALE },
          { label: 'Female', value: Gender.FEMALE },
        ],
      },
    ],
    [
      {
        key: 'BloodType',
        label: 'Blood Type',
        type: 'select',
        items: Object.entries(BloodTypeLabels).map(([value, label]) => ({
          label,
          value: Number(value),
        })),
      },
      {
        key: 'Status',
        label: 'Status',
        type: 'select',
        items: [
          { label: 'In Patient', value: PatientStatus.IN_PATIENT },
          { label: 'Out Patient', value: PatientStatus.OUT_PATIENT },
        ],
      },
    ],
    [
      {
        key: 'PrimaryDoctorId',
        label: 'Primary Doctor',
        type: 'select',
        items: doctorOptions.value,
      },
    ],
    [{ key: 'Address', label: 'Address', type: 'textarea', rows: 2 }],
  ]);

  const isModalOpen = ref(false);
  const editingPatient = ref<any>(null);
  const formData = ref<any>({});

  const isDeleteModalOpen = ref(false);
  const patientToDelete = ref<any>(null);

  onMounted(() => {
    patientStore.fetchPatients();
    doctorStore.fetchDoctors();
  });

  const handlePageChange = (payload: any) => {
    patientStore.fetchPatients(payload);
  };

  const handleSearch = (query: string) => {
    patientStore.fetchPatients({ FirstName: query, PageNumber: 1 });
  };

  const navigateToProfile = (id: string) => {
    let routeName = 'admin-patient-profile';
    if (authStore.role === AppRole.DOCTOR) routeName = 'doctor-patient-profile';
    if (authStore.role === AppRole.LAB_TECH) routeName = 'lab-tech-patient-profile';

    router.push({ name: routeName, params: { id } });
  };

  const openCreateModal = () => {
    editingPatient.value = null;
    formData.value = {
      Gender: Gender.MALE,
      BloodType: BloodType.O_POSITIVE,
      Status: PatientStatus.OUT_PATIENT,
    };
    isModalOpen.value = true;
  };

  const openEditModal = (patient: any) => {
    editingPatient.value = patient;
    formData.value = {
      FirstName: patient.firstName,
      LastName: patient.lastName,
      Email: patient.email,
      Phone: patient.phone,
      BirthDate: patient.birthDate?.split('T')[0],
      Gender: patient.gender,
      BloodType: patient.bloodType,
      Status: patient.status,
      PrimaryDoctorId: patient.primaryDoctorId,
      Address: patient.address,
    };
    isModalOpen.value = true;
  };

  const handleSubmit = async (data: any) => {
    let res;
    if (editingPatient.value) {
      res = await patientStore.updatePatient(editingPatient.value.id, data);
    } else {
      res = await patientStore.createPatient(data);
    }

    if (res) {
      success(editingPatient.value ? 'Patient updated' : 'Patient registered');
      isModalOpen.value = false;
    } else {
      error(patientStore.error || 'Operation failed');
    }
  };

  const confirmDelete = (patient: any, isHard = false) => {
    patientToDelete.value = patient;
    isHardDelete.value = isHard;
    isDeleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!patientToDelete.value) return;
    const res = await patientStore.deletePatient(patientToDelete.value.id, isHardDelete.value);
    if (res) {
      success(
        isHardDelete.value ? 'Patient record permanently deleted' : 'Patient record archived',
      );
      isDeleteModalOpen.value = false;
    } else {
      error(patientStore.error || 'Delete failed');
    }
  };

  const handleRestore = async (patient: any) => {
    const res = await patientStore.restorePatient(patient.id);
    if (res) {
      success('Patient record restored');
    } else {
      error(patientStore.error || 'Restore failed');
    }
  };
</script>
