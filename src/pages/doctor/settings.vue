<template>
  <div class="mx-auto max-w-5xl space-y-8 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-text text-3xl font-bold tracking-tight">Account Settings</h1>
        <p class="text-text-secondary text-sm">
          Update your professional profile, manage your schedule, and educational records.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <AppTabs v-model="activeTab" :tabs="tabs">
      <!-- Profile Tab -->
      <template #profile>
        <div class="space-y-6">
          <div class="bg-surface border-border rounded-2xl border p-6 shadow-sm">
            <div class="mb-6 space-y-1">
              <h3 class="text-text text-lg font-bold">Personal Information</h3>
              <p class="text-text-secondary text-xs">
                This information will be displayed on your public profile for patients to see.
              </p>
            </div>
            <AppForm
              v-if="profileData"
              v-model="profileData"
              :fields="profileFields"
              :schema="profileSchema"
              :is-submitting="profileStore.loading"
              @submitted="handleUpdateProfile"
            />
          </div>
        </div>
      </template>

      <!-- Availability Tab -->
      <template #availability>
        <div class="space-y-6">
          <div class="bg-surface border-border rounded-2xl border p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
              <div class="space-y-1">
                <h3 class="text-text text-lg font-bold">Weekly Availability</h3>
                <p class="text-text-secondary text-xs">
                  Set your working hours for each day of the week.
                </p>
              </div>
              <AppButton
                variant="primary"
                label="Add Slot"
                size="sm"
                icon="icon-[heroicons-outline--plus]"
                @click="openAvailabilityModal()"
              />
            </div>

            <AppTable
              :columns="availabilityColumns"
              :data="profileStore.profile?.availability || []"
              :loading="profileStore.loading"
            >
              <template #cell-dayOfWeek="{ value }">
                <span class="text-text font-medium">{{ mapWeekDay(value) }}</span>
              </template>
              <template #cell-startTime="{ value }">
                <span class="text-text-secondary font-mono text-xs uppercase">{{ value }}</span>
              </template>
              <template #cell-endTime="{ value }">
                <span class="text-text-secondary font-mono text-xs uppercase">{{ value }}</span>
              </template>
              <template #cell-actions="{ row }">
                <div class="flex items-center justify-end gap-2">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon="icon-[heroicons-outline--pencil-square]"
                    icon-only
                    tooltip="Edit slot"
                    @click="openAvailabilityModal(row)"
                  />
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon="icon-[heroicons-outline--trash]"
                    icon-only
                    class="text-error! hover:bg-error/10!"
                    tooltip="Remove slot"
                    @click="handleDeleteAvailability(row.id)"
                  />
                </div>
              </template>
            </AppTable>
          </div>
        </div>
      </template>

      <!-- Education Tab -->
      <template #education>
        <div class="space-y-6">
          <div class="bg-surface border-border rounded-2xl border p-6 shadow-sm">
            <div class="mb-6 flex items-center justify-between">
              <div class="space-y-1">
                <h3 class="text-text text-lg font-bold">Education & Certifications</h3>
                <p class="text-text-secondary text-xs">
                  Highlight your academic achievements and medical certifications.
                </p>
              </div>
              <AppButton
                variant="primary"
                label="Add Education"
                size="sm"
                icon="icon-[heroicons-outline--plus]"
                @click="openEducationModal()"
              />
            </div>

            <AppTable
              :columns="educationColumns"
              :data="profileStore.profile?.educations || []"
              :loading="profileStore.loading"
            >
              <template #cell-degree="{ value }">
                <span class="text-text font-medium">{{ value }}</span>
              </template>
              <template #cell-actions="{ row }">
                <div class="flex items-center justify-end gap-2">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon="icon-[heroicons-outline--pencil-square]"
                    icon-only
                    tooltip="Edit entry"
                    @click="openEducationModal(row)"
                  />
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon="icon-[heroicons-outline--trash]"
                    icon-only
                    class="text-error! hover:bg-error/10!"
                    tooltip="Remove entry"
                    @click="handleDeleteEducation(row.id)"
                  />
                </div>
              </template>
            </AppTable>
          </div>
        </div>
      </template>
    </AppTabs>

    <!-- Modals -->
    <AppModal
      :is-open="isAvailabilityModalOpen"
      :title="editingSlot ? 'Edit Availability Slot' : 'Add Availability Slot'"
      max-width="md"
      @close="isAvailabilityModalOpen = false"
    >
      <div class="p-1">
        <AppForm
          v-model="availabilityFormData"
          :fields="availabilityFields"
          @submitted="handleSubmitAvailability"
        />
      </div>
    </AppModal>

    <AppModal
      :is-open="isEducationModalOpen"
      :title="editingEducation ? 'Edit Education Record' : 'Add Education Record'"
      max-width="md"
      @close="isEducationModalOpen = false"
    >
      <div class="p-1">
        <AppForm
          v-model="educationFormData"
          :fields="educationFields"
          @submitted="handleSubmitEducation"
        />
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { z } from 'zod';
  import { AuthStore } from '../../stores/auth.store';
  import { useProfileStore } from '../../stores/profile.store';
  import { useDepartmentStore } from '../../stores/department.store';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import AppForm from '../../components/ui/Fields/AppForm.vue';
  import AppTabs from '../../components/ui/AppTabs.vue';
  import { useToast } from '../../composables/useToast';
  import { useEnums } from '../../composables/useEnums';
  import { Gender, BloodType, WeekDays } from '../../types/enums.types';

  const { mapWeekDay, bloodTypeLabels, genderLabels, weekDayLabels } = useEnums();
  import type { FormFieldRow } from '../../types/form';
  import type { TableColumn } from '../../components/ui/AppTable.vue';

  const authStore = AuthStore();
  const profileStore = useProfileStore();
  const departmentStore = useDepartmentStore();
  const { success, error } = useToast();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'icon-[heroicons-outline--user-circle]' },
    { id: 'availability', label: 'Schedule', icon: 'icon-[heroicons-outline--calendar-days]' },
    { id: 'education', label: 'Education', icon: 'icon-[heroicons-outline--academic-cap]' },
  ];
  const activeTab = ref('profile');

  // --- Validation Schemas ---
  const profileSchema = z.object({
    FirstName: z.string().min(2, 'First name is too short'),
    LastName: z.string().min(2, 'Last name is too short'),
    Username: z.string().min(3, 'Username must be at least 3 characters'),
    Email: z.string().email('Invalid email address'),
    Phone: z.string().nullable().optional(),
    BirthDate: z.string().min(1, 'Birth date is required'),
    Gender: z.nativeEnum(Gender),
    BloodType: z.nativeEnum(BloodType),
    DepartmentId: z.string().uuid('Please select a department'),
    ConsultationCharge: z.number().min(0, 'Charge cannot be negative'),
    YearsOfExperience: z.number().min(0, 'Experience cannot be negative'),
    MedicalLicenseNumber: z.string().min(1, 'License number is required'),
    Bio: z.string().nullable().optional(),
    CurrentPassword: z.string().optional(),
    NewPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
  });

  const availabilitySchema = z
    .object({
      dayOfWeek: z.nativeEnum(WeekDays),
      startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
      endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)'),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: 'End time must be after start time',
      path: ['endTime'],
    });

  const educationSchema = z.object({
    degree: z.string().min(2, 'Degree name is too short'),
    institution: z.string().min(2, 'Institution name is too short'),
    year: z
      .number()
      .min(1900, 'Invalid year')
      .max(new Date().getFullYear(), 'Year cannot be in the future'),
  });

  // --- Profile Logic ---
  const profileData = ref<any>(null);
  const departmentOptions = computed(() =>
    departmentStore.departments.map((d) => ({ label: d.title, value: d.id })),
  );

  const profileFields = computed<FormFieldRow[]>(() => [
    [
      { key: 'FirstName', label: 'First Name', type: 'text' },
      { key: 'LastName', label: 'Last Name', type: 'text' },
    ],
    [
      { key: 'Username', label: 'Username', type: 'text' },
      { key: 'Email', label: 'Email', type: 'email' },
    ],
    [
      { key: 'Phone', label: 'Phone', type: 'text' },
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
    [
      { key: 'DepartmentId', label: 'Department', type: 'select', items: departmentOptions.value },
      { key: 'ConsultationCharge', label: 'Consultation Charge ($)', type: 'number' },
    ],
    [
      { key: 'YearsOfExperience', label: 'Years of Experience', type: 'number' },
      { key: 'MedicalLicenseNumber', label: 'License Number', type: 'text' },
    ],
    [{ key: 'Bio', label: 'Professional Biography', type: 'textarea' }],
    [
      {
        key: 'CurrentPassword',
        label: 'Current Password',
        type: 'password',
        placeholder: 'Required to change password',
      },
      {
        key: 'NewPassword',
        label: 'New Password',
        type: 'password',
        placeholder: 'Leave empty to keep current',
      },
    ],
  ]);

  const handleUpdateProfile = async (data: any) => {
    if (!authStore.user?.id) return;
    const res = await profileStore.updateProfile(authStore.user.id, data);
    if (res) success('Profile updated successfully');
    else error(profileStore.error || 'Update failed');
  };

  // --- Availability Logic ---
  const isAvailabilityModalOpen = ref(false);
  const editingSlot = ref<any>(null);
  const availabilityFormData = ref<any>({});
  const availabilityColumns: TableColumn[] = [
    { key: 'dayOfWeek', label: 'Working Day' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];
  const availabilityFields: FormFieldRow[] = [
    [
      {
        key: 'dayOfWeek',
        label: 'Select Day',
        type: 'select',
        items: [
          { label: 'Sunday', value: WeekDays.SUNDAY },
          { label: 'Monday', value: WeekDays.MONDAY },
          { label: 'Tuesday', value: WeekDays.TUESDAY },
          { label: 'Wednesday', value: WeekDays.WEDNESDAY },
          { label: 'Thursday', value: WeekDays.THURSDAY },
          { label: 'Friday', value: WeekDays.FRIDAY },
          { label: 'Saturday', value: WeekDays.SATURDAY },
        ],
      },
    ],
    [
      { key: 'startTime', label: 'Start Work Time', type: 'time' },
      { key: 'endTime', label: 'End Work Time', type: 'time' },
    ],
  ];

  const openAvailabilityModal = (slot?: any) => {
    editingSlot.value = slot;
    availabilityFormData.value = slot
      ? { 
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime.slice(0, 5), // Convert HH:mm:ss to HH:mm for input
          endTime: slot.endTime.slice(0, 5) 
        }
      : { dayOfWeek: WeekDays.MONDAY, startTime: '09:00', endTime: '17:00' };
    isAvailabilityModalOpen.value = true;
  };

  const handleSubmitAvailability = async (data: any) => {
    if (!authStore.user?.id) return;
    
    // API expects HH:mm:ss
    const payload = {
      ...data,
      startTime: data.startTime.length === 5 ? `${data.startTime}:00` : data.startTime,
      endTime: data.endTime.length === 5 ? `${data.endTime}:00` : data.endTime
    };

    let res;
    if (editingSlot.value) {
      res = await profileStore.updateAvailability(authStore.user.id, editingSlot.value.id, payload);
    } else {
      res = await profileStore.addAvailability(authStore.user.id, payload);
    }
    if (res) {
      success('Availability saved');
      isAvailabilityModalOpen.value = false;
    } else error(profileStore.error || 'Operation failed');
  };

  const handleDeleteAvailability = async (id: string) => {
    if (!authStore.user?.id) return;
    const res = await profileStore.deleteAvailability(authStore.user.id, id);
    if (res) success('Slot removed');
    else error(profileStore.error || 'Delete failed');
  };

  // --- Education Logic ---
  const isEducationModalOpen = ref(false);
  const editingEducation = ref<any>(null);
  const educationFormData = ref<any>({});
  const educationColumns: TableColumn[] = [
    { key: 'degree', label: 'Degree / Certification' },
    { key: 'institution', label: 'Institution Name' },
    { key: 'year', label: 'Graduation Year' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];
  const educationFields: FormFieldRow[] = [
    [{ key: 'degree', label: 'Degree/Certification Name', type: 'text' }],
    [{ key: 'institution', label: 'University/Institution', type: 'text' }],
    [{ key: 'year', label: 'Year', type: 'number' }],
  ];

  const openEducationModal = (edu?: any) => {
    editingEducation.value = edu;
    educationFormData.value = edu ? { ...edu } : { year: new Date().getFullYear() };
    isEducationModalOpen.value = true;
  };

  const handleSubmitEducation = async (data: any) => {
    if (!authStore.user?.id) return;
    let res;
    if (editingEducation.value) {
      res = await profileStore.updateEducation(authStore.user.id, editingEducation.value.id, data);
    } else {
      res = await profileStore.addEducation(authStore.user.id, data);
    }
    if (res) {
      success('Education record saved');
      isEducationModalOpen.value = false;
    } else error(profileStore.error || 'Operation failed');
  };

  const handleDeleteEducation = async (id: string) => {
    if (!authStore.user?.id) return;
    const res = await profileStore.deleteEducation(authStore.user.id, id);
    if (res) success('Entry removed');
    else error(profileStore.error || 'Delete failed');
  };

  // --- Lifecycle ---
  onMounted(async () => {
    if (authStore.user?.id) {
      await profileStore.fetchProfile(authStore.user.id);
      await departmentStore.fetchDepartments();
    }
  });

  watch(
    () => profileStore.profile,
    (newProfile) => {
      if (newProfile && !profileData.value) {
        profileData.value = {
          FirstName: newProfile.firstName,
          LastName: newProfile.lastName,
          Username: newProfile.username,
          Email: newProfile.email,
          Phone: newProfile.phone,
          BirthDate: newProfile.birthDate?.split('T')[0],
          Gender: newProfile.gender,
          BloodType: newProfile.bloodType,
          DepartmentId: newProfile.departmentId,
          ConsultationCharge: newProfile.consultationCharge,
          YearsOfExperience: newProfile.yearsOfExperience,
          MedicalLicenseNumber: newProfile.medicalLicenseNumber,
          Bio: newProfile.bio,
        };
      }
    },
    { immediate: true },
  );
</script>
perience,
          MedicalLicenseNumber: newProfile.medicalLicenseNumber,
          Bio: newProfile.bio,
        };
      }
    },
    { immediate: true },
  );
</script>
