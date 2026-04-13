<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">Doctor Management</h1>
        <p class="text-text-secondary text-sm">Manage hospital clinical staff and departments</p>
      </div>
      <AppButton
        variant="primary"
        label="Add Doctor"
        icon="icon-[heroicons-outline--user-plus]"
        @click="openCreateModal"
      />
    </div>

    <AppTable
      :columns="columns"
      :data="doctorStore.doctors"
      :loading="doctorStore.loading"
      searchable
      search-placeholder="Search doctors..."
      server-paginated
      :page-number="doctorStore.pageNumber"
      :page-size="doctorStore.pageSize"
      :total-count="doctorStore.totalCount"
      :total-pages="doctorStore.totalPages"
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
          <span class="text-text font-medium">Dr. {{ row.firstName }} {{ row.lastName }}</span>
        </div>
      </template>

      <template #cell-gender="{ value }">
        {{ mapGender(value) }}
      </template>

      <template #cell-bloodType="{ value }">
        {{ mapBloodType(value) }}
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
      :title="editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'"
      max-width="lg"
      @close="isModalOpen = false"
    >
      <AppForm
        v-model="formData"
        :fields="formFields"
        :is-submitting="doctorStore.loading"
        @submitted="handleSubmit"
      />
    </AppModal>

    <!-- Delete Confirmation -->
    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="isHardDelete ? 'Delete Forever' : 'Archive Doctor'"
      :message="
        isHardDelete
          ? `Are you sure you want to PERMANENTLY delete Dr. ${doctorToDelete?.lastName}? This cannot be undone.`
          : `Are you sure you want to archive Dr. ${doctorToDelete?.lastName}?`
      "
      @close="isDeleteModalOpen = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useDoctorStore } from '../../stores/doctor.store';
  import { useDepartmentStore } from '../../stores/department.store';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import AppForm from '../../components/ui/Fields/AppForm.vue';
  import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
  import { useToast } from '../../composables/useToast';
  import { useEnums } from '../../composables/useEnums';
  import { formatDate } from '../../utils/format-date';
  import { Gender, BloodType } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';
  import type { FormFieldRow } from '../../types/form';

  const doctorStore = useDoctorStore();
  const deptStore = useDepartmentStore();
  const { success, error } = useToast();

  const { mapGender, mapBloodType, bloodTypeLabels, genderLabels } = useEnums();

  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Doctor',
      sortable: true,
      exportFormatter: (row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department.title', label: 'Department' },
    { key: 'yearsOfExperience', label: 'Exp. (Years)', sortable: true },
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
    { key: 'medicalLicenseNumber', label: 'License', defaultHidden: true },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const departmentOptions = computed(() =>
    deptStore.departments.map((d) => ({ label: d.title, value: d.id })),
  );

  const formFields = computed<FormFieldRow[]>(() => {
    const fields: FormFieldRow[] = [
      [
        { key: 'FirstName', label: 'First Name', type: 'text', placeholder: 'First Name' },
        { key: 'LastName', label: 'Last Name', type: 'text', placeholder: 'Last Name' },
      ],
      [
        { key: 'Username', label: 'Username', type: 'text' },
        { key: 'Email', label: 'Email', type: 'email' },
      ],
      [
        { key: 'DepartmentId', label: 'Department', type: 'select', items: departmentOptions.value },
        { key: 'MedicalLicenseNumber', label: 'License Number', type: 'text' },
      ],
      [
        { key: 'YearsOfExperience', label: 'Experience (Years)', type: 'number' },
        { key: 'BirthDate', label: 'Birth Date', type: 'date' },
      ],
      [
        {
          key: 'Gender',
          label: 'Gender',
          type: 'select',
          items: [
            { label: genderLabels.value[Gender.MALE], value: Gender.MALE },
            { label: genderLabels.value[Gender.FEMALE], value: Gender.FEMALE },
          ],
        },
        {
          key: 'BloodType',
          label: 'Blood Type',
          type: 'select',
          items: Object.entries(bloodTypeLabels.value).map(([value, label]) => ({
            label,
            value: Number(value),
          })),
        },
      ],
    ];

    if (editingDoctor.value) {
      fields.push([
        {
          key: 'CurrentPassword',
          label: 'Current Password',
          type: 'password',
          placeholder: 'Current password to change',
        },
        {
          key: 'NewPassword',
          label: 'New Password',
          type: 'password',
          placeholder: 'New password',
        },
      ]);
    } else {
      fields.push([{ key: 'Password', label: 'Password', type: 'password' }]);
    }

    return fields;
  });

  const isModalOpen = ref(false);
  const editingDoctor = ref<any>(null);
  const formData = ref<any>({});

  const isDeleteModalOpen = ref(false);
  const doctorToDelete = ref<any>(null);
  const isHardDelete = ref(false);

  onMounted(() => {
    doctorStore.fetchDoctors();
    deptStore.fetchDepartments();
  });

  const handlePageChange = (payload: any) => {
    doctorStore.fetchDoctors(payload);
  };

  const handleSearch = (query: string) => {
    doctorStore.fetchDoctors({ FirstName: query, PageNumber: 1 });
  };

  const openCreateModal = () => {
    editingDoctor.value = null;
    formData.value = {
      Gender: Gender.MALE,
      BloodType: BloodType.O_POSITIVE,
      YearsOfExperience: 0,
    };
    isModalOpen.value = true;
  };

  const openEditModal = (doctor: any) => {
    editingDoctor.value = doctor;
    formData.value = {
      FirstName: doctor.firstName,
      LastName: doctor.lastName,
      Username: doctor.username,
      Email: doctor.email,
      DepartmentId: doctor.departmentId,
      MedicalLicenseNumber: doctor.medicalLicenseNumber,
      YearsOfExperience: doctor.yearsOfExperience,
      BirthDate: doctor.birthDate?.split('T')[0],
      Gender: doctor.gender,
      BloodType: doctor.bloodType,
    };
    isModalOpen.value = true;
  };

  const handleSubmit = async (data: any) => {
    let res;
    if (editingDoctor.value) {
      res = await doctorStore.updateDoctor(editingDoctor.value.id, data);
    } else {
      res = await doctorStore.createDoctor(data);
    }

    if (res) {
      success(editingDoctor.value ? 'Doctor updated' : 'Doctor added');
      isModalOpen.value = false;
    } else {
      error(doctorStore.error || 'Operation failed');
    }
  };

  const confirmDelete = (doctor: any, isHard = false) => {
    doctorToDelete.value = doctor;
    isHardDelete.value = isHard;
    isDeleteModalOpen.value = true;
  };

  const handleDelete = async () => {
    if (!doctorToDelete.value) return;
    const res = await doctorStore.deleteDoctor(doctorToDelete.value.id, isHardDelete.value);
    if (res) {
      success(
        isHardDelete.value ? 'Doctor permanently deleted' : 'Doctor archived',
      );
      isDeleteModalOpen.value = false;
    } else {
      error(doctorStore.error || 'Delete failed');
    }
  };

  const handleRestore = async (doctor: any) => {
    const res = await doctorStore.restoreDoctor(doctor.id);
    if (res) {
      success('Doctor restored');
    } else {
      error(doctorStore.error || 'Restore failed');
    }
  };
</script>
