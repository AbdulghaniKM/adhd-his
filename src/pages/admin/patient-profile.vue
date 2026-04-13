<template>
  <div class="mx-auto max-w-7xl space-y-8 p-6">
    <!-- Header: Patient Info -->
    <div v-if="patientStore.currentProfile" class="bg-surface border-border overflow-hidden rounded-3xl border shadow-sm transition-all hover:shadow-md">
      <div class="bg-primary/5 flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
        <!-- Avatar -->
        <div class="bg-primary/10 relative size-24 shrink-0 overflow-hidden rounded-2xl ring-4 ring-white shadow-sm">
          <img v-if="patientStore.currentProfile.imageUrl" :src="patientStore.currentProfile.imageUrl" class="size-full object-cover" />
          <div v-else class="text-primary flex size-full items-center justify-center text-3xl font-black">
            {{ patientStore.currentProfile.firstName[0] }}{{ patientStore.currentProfile.lastName[0] }}
          </div>
        </div>

        <!-- Info Grid -->
        <div class="flex-1 space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-text text-3xl font-black tracking-tight">
              {{ patientStore.currentProfile.firstName }} {{ patientStore.currentProfile.lastName }}
            </h1>
            <span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {{ mapPatientStatus(patientStore.currentProfile.status) }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
            <div class="space-y-0.5">
              <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Age / DOB</p>
              <p class="text-text text-sm font-semibold">{{ calculateAge(patientStore.currentProfile.birthDate) }} yrs ({{ formatDate(patientStore.currentProfile.birthDate) }})</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Blood Type</p>
              <p class="text-text text-sm font-semibold">{{ mapBloodType(patientStore.currentProfile.bloodType) }}</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Phone</p>
              <p class="text-text text-sm font-semibold">{{ patientStore.currentProfile.phone }}</p>
            </div>
            <div class="space-y-0.5">
              <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Gender</p>
              <p class="text-text text-sm font-semibold">{{ mapGender(patientStore.currentProfile.gender) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Button (Edit Patient) -->
        <div v-if="!isReadOnly" class="pt-4 md:pt-0">
          <AppButton
            variant="outline"
            label="Edit Profile"
            size="sm"
            icon="icon-[heroicons-outline--pencil]"
            @click="isEditPatientModalOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- Tabs Content -->
    <AppTabs v-model="activeTab" :tabs="tabs">
      <!-- Overview Tab -->
      <template #overview>
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <!-- Latest Vitals -->
          <div class="bg-surface border-border space-y-6 rounded-3xl border p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <h3 class="text-text text-lg font-bold tracking-tight">Latest Vitals</h3>
              <AppIcon name="icon-[heroicons-outline--heart]" class="text-primary" />
            </div>
            
            <div v-if="patientStore.currentProfile?.latestVitals" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-muted/50 rounded-2xl p-4 transition-colors hover:bg-muted">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Heart Rate</p>
                  <p class="text-text text-xl font-black tabular-nums">{{ patientStore.currentProfile.latestVitals.heartRate }} <span class="text-xs font-medium opacity-60">BPM</span></p>
                </div>
                <div class="bg-muted/50 rounded-2xl p-4 transition-colors hover:bg-muted">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Blood Pressure</p>
                  <p class="text-text text-xl font-black tabular-nums">{{ patientStore.currentProfile.latestVitals.bloodPressure }}</p>
                </div>
                <div class="bg-muted/50 rounded-2xl p-4 transition-colors hover:bg-muted">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Weight</p>
                  <p class="text-text text-xl font-black tabular-nums">{{ patientStore.currentProfile.latestVitals.weight }} <span class="text-xs font-medium opacity-60">kg</span></p>
                </div>
                <div class="bg-muted/50 rounded-2xl p-4 transition-colors hover:bg-muted">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Height</p>
                  <p class="text-text text-xl font-black tabular-nums">{{ patientStore.currentProfile.latestVitals.height }} <span class="text-xs font-medium opacity-60">cm</span></p>
                </div>
              </div>
              <p class="text-text-secondary text-center text-[10px] italic">
                Recorded on {{ formatDate(patientStore.currentProfile.latestVitals.recordedAt, true) }}
              </p>
            </div>
            <div v-else class="py-12 text-center">
              <p class="text-text-secondary text-sm italic">No vitals recorded yet.</p>
            </div>
          </div>

          <!-- Recent Visits -->
          <div class="bg-surface border-border space-y-6 rounded-3xl border p-6 shadow-sm lg:col-span-2">
            <h3 class="text-text text-lg font-bold tracking-tight">Recent Visits</h3>
            <div v-if="patientStore.currentProfile?.lastVisits?.length" class="space-y-4">
              <div v-for="visit in patientStore.currentProfile.lastVisits" :key="visit.id" class="border-border hover:bg-muted/30 flex items-center justify-between rounded-2xl border p-4 transition-all">
                <div class="flex items-center gap-4">
                  <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl font-bold">
                    <AppIcon name="icon-[heroicons-outline--calendar]" />
                  </div>
                  <div>
                    <p class="text-text text-sm font-bold">{{ formatDate(visit.dateTime, true) }}</p>
                    <p class="text-text-secondary text-xs">Dr. {{ visit.doctor?.firstName }} {{ visit.doctor?.lastName }}</p>
                  </div>
                </div>
                <div class="text-end">
                  <span class="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider" :class="statusClasses[visit.status]">
                    {{ mapAppointmentStatus(visit.status) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="py-12 text-center">
              <p class="text-text-secondary text-sm italic">No past visits found.</p>
            </div>
          </div>
        </div>
      </template>

      <!-- Vitals History Tab -->
      <template #vitals>
        <div class="space-y-6">
          <div class="bg-surface border-border flex items-center justify-between rounded-3xl border p-6 shadow-sm">
            <div>
              <h3 class="text-text text-lg font-bold">Vitals History</h3>
              <p class="text-text-secondary text-xs">A log of all clinical vital signs</p>
            </div>
            <AppButton
              v-if="!isReadOnly"
              variant="primary"
              label="Record Vitals"
              size="sm"
              icon="icon-[heroicons-outline--plus]"
              @click="isVitalsModalOpen = true"
            />
          </div>

          <div v-if="vitalsStore.vitals.length" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              v-for="vital in vitalsStore.vitals"
              :key="vital.id"
              class="bg-surface border-border group relative flex flex-col gap-4 rounded-3xl border p-5 transition-all hover:shadow-md"
            >
              <div class="flex items-center justify-between border-b border-border/50 pb-3">
                <div class="flex items-center gap-2.5">
                  <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                    <AppIcon name="icon-[heroicons-outline--clock]" :size="1.125" />
                  </div>
                  <span class="text-text text-sm font-bold">{{ formatDate(vital.recordedAt, true) }}</span>
                </div>
                <AppButton
                  v-if="!isReadOnly"
                  variant="ghost"
                  size="sm"
                  icon="icon-[heroicons-outline--trash]"
                  class="text-error! opacity-0 transition-opacity hover:bg-error/10! group-hover:opacity-100"
                  icon-only
                  @click="confirmDeleteVital(vital)"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Heart Rate</p>
                  <p class="text-text text-sm font-black">{{ vital.heartRate }} <span class="text-[10px] font-medium opacity-60">BPM</span></p>
                </div>
                <div class="space-y-1">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Blood Pressure</p>
                  <p class="text-text text-sm font-black">{{ vital.bloodPressure }}</p>
                </div>
                <div class="space-y-1">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Weight</p>
                  <p class="text-text text-sm font-black">{{ vital.weight }} <span class="text-[10px] font-medium opacity-60">kg</span></p>
                </div>
                <div class="space-y-1">
                  <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Height</p>
                  <p class="text-text text-sm font-black">{{ vital.height }} <span class="text-[10px] font-medium opacity-60">cm</span></p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-surface border-border flex flex-col items-center justify-center rounded-3xl border py-20 text-center shadow-sm">
            <div class="bg-muted text-text-secondary mb-4 flex size-16 items-center justify-center rounded-full opacity-40">
              <AppIcon name="icon-[heroicons-outline--heart]" :size="2" />
            </div>
            <p class="text-text-secondary text-sm italic">No vitals recorded in the history log.</p>
          </div>
        </div>
      </template>

      <!-- Allergies Tab -->
      <template #allergies>
        <div class="space-y-6">
          <div class="bg-surface border-border flex items-center justify-between rounded-3xl border p-6 shadow-sm">
            <div>
              <h3 class="text-text text-lg font-bold">Allergy Profile</h3>
              <p class="text-text-secondary text-xs">Identified allergens and reactions</p>
            </div>
            <AppButton
              v-if="!isReadOnly"
              variant="primary"
              label="Add Allergy"
              size="sm"
              icon="icon-[heroicons-outline--plus]"
              @click="openAddAllergyModal"
            />
          </div>

          <div v-if="allergyStore.allergies.length" class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="allergy in allergyStore.allergies"
              :key="allergy.id"
              class="bg-surface border-border group relative overflow-hidden rounded-3xl border p-5 transition-all hover:shadow-md"
            >
              <div
                class="absolute inset-y-0 start-0 w-1"
                :class="{
                  'bg-success': allergy.severity === AlergySeverity.MILD,
                  'bg-amber-500': allergy.severity === AlergySeverity.MODERATE,
                  'bg-error': allergy.severity === AlergySeverity.SEVERE
                }"
              ></div>
              
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-text text-base font-black tracking-tight">{{ allergy.allergen }}</h4>
                    <span
                      class="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest"
                      :class="severityClasses[allergy.severity]"
                    >
                      {{ mapAlergySeverity(allergy.severity) }}
                    </span>
                  </div>
                  <p class="text-text-secondary mt-1 text-xs leading-relaxed">
                    <span class="font-bold">Reaction:</span> {{ allergy.reaction }}
                  </p>
                </div>

                <div v-if="!isReadOnly" class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon="icon-[heroicons-outline--pencil]"
                    icon-only
                    class="hover:bg-muted!"
                    @click="openEditAllergyModal(allergy)"
                  />
                  <AppButton
                    variant="ghost"
                    size="sm"
                    icon="icon-[heroicons-outline--trash]"
                    class="text-error! hover:bg-error/10!"
                    icon-only
                    @click="confirmDeleteAllergy(allergy)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-surface border-border flex flex-col items-center justify-center rounded-3xl border py-20 text-center shadow-sm">
            <div class="bg-muted text-text-secondary mb-4 flex size-16 items-center justify-center rounded-full opacity-40">
              <AppIcon name="icon-[heroicons-outline--no-symbol]" :size="2" />
            </div>
            <p class="text-text-secondary text-sm italic">No known allergies for this patient.</p>
          </div>
        </div>
      </template>
    </AppTabs>

    <!-- Modals -->
    <AppModal :is-open="isEditPatientModalOpen" title="Edit Patient Profile" max-width="lg" @close="isEditPatientModalOpen = false">
      <AppForm v-model="patientFormData" :fields="patientFields" :is-submitting="patientStore.loading" @submitted="handleUpdatePatient" />
    </AppModal>

    <AppModal :is-open="isVitalsModalOpen" title="Record Patient Vitals" max-width="md" @close="isVitalsModalOpen = false">
      <AppForm v-model="vitalsFormData" :fields="vitalsFields" @submitted="handleAddVitals" />
    </AppModal>

    <AppModal :is-open="isAllergyModalOpen" :title="editingAllergy ? 'Edit Allergy' : 'Add New Allergy'" max-width="md" @close="isAllergyModalOpen = false">
      <AppForm v-model="allergyFormData" :fields="allergyFields" @submitted="handleSaveAllergy" />
    </AppModal>

    <ConfirmDangerModal
      :is-open="isDeleteModalOpen"
      :title="deleteTargetType === 'vital' ? 'Delete Vital Record' : 'Delete Allergy Record'"
      message="Are you sure you want to delete this clinical record? This action cannot be undone."
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { usePatientStore } from '../../stores/patient.store';
  import { useVitalsStore } from '../../stores/vitals.store';
  import { useAllergyStore } from '../../stores/allergy.store';
  import { useDoctorStore } from '../../stores/doctor.store';
  import { useEegTestStore } from '../../stores/eeg-test.store';
  import { useLabStore } from '../../stores/lab.store';
  import { AuthStore } from '../../stores/auth.store';
  import { useToast } from '../../composables/useToast';
  import { formatDate } from '../../utils/format-date';
  import { useEnums } from '../../composables/useEnums';
  import { Gender, BloodType, PatientStatus, AppRole, AlergySeverity, AppointmentStatus } from '../../types/enums.types';

  import AppTabs from '../../components/ui/AppTabs.vue';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppIcon from '../../components/ui/AppIcon.vue';
  import AppModal from '../../components/ui/AppModal.vue';
  import AppForm from '../../components/ui/Fields/AppForm.vue';
  import ConfirmDangerModal from '../../components/ui/ConfirmDangerModal.vue';
  import type { TableColumn } from '../../components/ui/AppTable.vue';
  import type { FormFieldRow } from '../../types/form';

  const { 
    mapPatientStatus, 
    mapGender, 
    mapBloodType, 
    mapAppointmentStatus, 
    mapAllergySeverity: mapAlergySeverity,
    mapEegTestStatus,
    mapAdhdPrediction,
    bloodTypeLabels
  } = useEnums();

  const route = useRoute();
  const patientStore = usePatientStore();
  const vitalsStore = useVitalsStore();
  const allergyStore = useAllergyStore();
  const doctorStore = useDoctorStore();
  const eegStore = useEegTestStore();
  const labStore = useLabStore();
  const authStore = AuthStore();
  const { success, error } = useToast();

  const patientId = route.params.id as string;
  const isReadOnly = computed(() => authStore.role === AppRole.LAB_TECH);

  // --- EEG Tests Logic ---
  const isOrderEegModalOpen = ref(false);
  const eegFormData = ref<any>({ testDate: new Date().toISOString().slice(0, 16) });
  
  const labOptions = computed(() => labStore.labs.map(l => ({ label: l.name, value: l.id })));
  const appointmentOptions = computed(() => 
    (patientStore.currentProfile?.lastVisits || [])
      .filter(v => v.status !== AppointmentStatus.CANCELLED)
      .map(v => ({ label: `${formatDate(v.dateTime, true)} with Dr. ${v.doctor?.lastName}`, value: v.id }))
  );

  const eegFields = computed<FormFieldRow[]>(() => [
    [{ key: 'appointmentId', label: 'Related Appointment', type: 'select', items: appointmentOptions.value }],
    [{ key: 'testDate', label: 'Test Date/Time', type: 'datetime-local' }],
    [{ key: 'labId', label: 'Target Laboratory (Unit)', type: 'select', items: labOptions.value }],
    [{ key: 'notes', label: 'Notes', type: 'textarea' }],
  ]);

  const handleOrderEeg = async (data: any) => {
    const res = await eegStore.createTest(data);
    if (res) {
      success('EEG test ordered successfully');
      isOrderEegModalOpen.value = false;
      await eegStore.fetchPatientTests(patientId);
    } else error(eegStore.error || 'Failed to order test');
  };

  const navigateToEegDetails = (id: string) => {
    let prefix = 'admin';
    if (authStore.role === AppRole.DOCTOR) prefix = 'doctor';
    if (authStore.role === AppRole.LAB_TECH) prefix = 'lab-tech';
    router.push({ name: `${prefix}-eeg-test-details`, params: { id } });
  };

  const eegStatusClasses: Record<number, string> = {
    0: 'bg-blue-500/10 text-blue-500 ring-blue-500/30',
    1: 'bg-amber-500/10 text-amber-500 ring-amber-500/30',
    2: 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/30',
    3: 'bg-green-500/10 text-green-500 ring-green-500/30',
    4: 'bg-error/10 text-error ring-error/30',
  };

  const activeTab = ref('overview');
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'icon-[heroicons-outline--squares-2x2]' },
    { id: 'vitals', label: 'Vitals Log', icon: 'icon-[heroicons-outline--heart]' },
    { id: 'allergies', label: 'Allergies', icon: 'icon-[heroicons-outline--no-symbol]' },
    { id: 'eeg', label: 'EEG Tests', icon: 'icon-[heroicons-outline--document-chart-bar]' },
  ];

  // --- Patient Edit Logic ---
  const isEditPatientModalOpen = ref(false);
  const patientFormData = ref<any>({});

  const doctorOptions = computed(() =>
    doctorStore.doctors.map((d) => ({ label: `Dr. ${d.firstName} ${d.lastName}`, value: d.id })),
  );

  const patientFields = computed<FormFieldRow[]>(() => [
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

  const handleUpdatePatient = async (data: any) => {
    const res = await patientStore.updatePatient(patientId, data);
    if (res) {
      success('Patient record updated');
      isEditPatientModalOpen.value = false;
    } else {
      error(patientStore.error || 'Update failed');
    }
  };

  // --- Utils ---
  const calculateAge = (dob: string) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const statusClasses: Record<number, string> = {
    [AppointmentStatus.SCHEDULED]: 'bg-blue-500/10 text-blue-500',
    [AppointmentStatus.CONFIRMED]: 'bg-indigo-500/10 text-indigo-500',
    [AppointmentStatus.CHECKED_IN]: 'bg-amber-500/10 text-amber-500',
    [AppointmentStatus.CHECKED_OUT]: 'bg-green-500/10 text-green-500',
    [AppointmentStatus.CANCELLED]: 'bg-error/10 text-error',
  };

  const severityClasses: Record<number, string> = {
    [AlergySeverity.MILD]: 'bg-green-500/10 text-green-500',
    [AlergySeverity.MODERATE]: 'bg-amber-500/10 text-amber-500',
    [AlergySeverity.SEVERE]: 'bg-error/10 text-error',
  };

  // --- Vitals ---
  const isVitalsModalOpen = ref(false);
  const vitalsFormData = ref<any>({ recordedAt: new Date().toISOString().slice(0, 16) });
  const vitalsColumns: TableColumn[] = [
    { key: 'recordedAt', label: 'Date' },
    { key: 'heartRate', label: 'HR (BPM)' },
    { key: 'bloodPressure', label: 'BP' },
    { key: 'weight', label: 'Wt (kg)' },
    { key: 'height', label: 'Ht (cm)' },
    { key: 'actions', label: '', class: 'text-end' },
  ];
  const vitalsFields: FormFieldRow[] = [
    [{ key: 'recordedAt', label: 'Recording Date/Time', type: 'datetime-local' }],
    [
      { key: 'heartRate', label: 'Heart Rate (BPM)', type: 'number' },
      { key: 'bloodPressure', label: 'Blood Pressure (e.g. 120/80)', type: 'text' },
    ],
    [
      { key: 'weight', label: 'Weight (kg)', type: 'number' },
      { key: 'height', label: 'Height (cm)', type: 'number' },
    ],
  ];

  const handleAddVitals = async (data: any) => {
    const res = await vitalsStore.createVitals(patientId, data);
    if (res) {
      success('Vitals recorded');
      isVitalsModalOpen.value = false;
      await patientStore.fetchProfile(patientId); // Refresh overview
    } else error(vitalsStore.error || 'Failed to save');
  };

  // --- Allergies ---
  const isAllergyModalOpen = ref(false);
  const editingAllergy = ref<any>(null);
  const allergyFormData = ref<any>({});
  const allergyColumns: TableColumn[] = [
    { key: 'allergen', label: 'Allergen', class: 'font-bold' },
    { key: 'reaction', label: 'Reaction' },
    { key: 'severity', label: 'Severity' },
    { key: 'actions', label: '', class: 'text-end' },
  ];
  const allergyFields: FormFieldRow[] = [
    [{ key: 'allergen', label: 'Allergen Name', type: 'text' }],
    [{ key: 'reaction', label: 'Known Reaction', type: 'text' }],
    [{
      key: 'severity',
      label: 'Severity',
      type: 'select',
      items: [
        { label: 'Mild', value: AlergySeverity.MILD },
        { label: 'Moderate', value: AlergySeverity.MODERATE },
        { label: 'Severe', value: AlergySeverity.SEVERE },
      ]
    }],
  ];

  const openAddAllergyModal = () => {
    editingAllergy.value = null;
    allergyFormData.value = { severity: AlergySeverity.MILD };
    isAllergyModalOpen.value = true;
  };

  const openEditAllergyModal = (allergy: any) => {
    editingAllergy.value = allergy;
    allergyFormData.value = { ...allergy };
    isAllergyModalOpen.value = true;
  };

  const handleSaveAllergy = async (data: any) => {
    let res;
    if (editingAllergy.value) {
      res = await allergyStore.updateAllergy(patientId, editingAllergy.value.id, data);
    } else {
      res = await allergyStore.createAllergy(patientId, data);
    }
    if (res) {
      success(editingAllergy.value ? 'Allergy updated' : 'Allergy added');
      isAllergyModalOpen.value = false;
    } else error(allergyStore.error || 'Failed to save');
  };

  // --- Deletion ---
  const isDeleteModalOpen = ref(false);
  const deleteTarget = ref<any>(null);
  const deleteTargetType = ref<'vital' | 'allergy'>('vital');

  const confirmDeleteVital = (vital: any) => {
    deleteTarget.value = vital;
    deleteTargetType.value = 'vital';
    isDeleteModalOpen.value = true;
  };

  const confirmDeleteAllergy = (allergy: any) => {
    deleteTarget.value = allergy;
    deleteTargetType.value = 'allergy';
    isDeleteModalOpen.value = true;
  };

  const handleDeleteConfirmed = async () => {
    let res;
    if (deleteTargetType.value === 'vital') {
      res = await vitalsStore.deleteVitals(patientId, deleteTarget.value.id);
    } else {
      res = await allergyStore.deleteAllergy(patientId, deleteTarget.value.id, true);
    }

    if (res) {
      success('Record deleted');
      isDeleteModalOpen.value = false;
      if (deleteTargetType.value === 'vital') await patientStore.fetchProfile(patientId);
    } else error('Deletion failed');
  };

  // --- Lifecycle ---
  watch(
    () => patientStore.currentProfile,
    (profile) => {
      if (profile) {
        patientFormData.value = {
          FirstName: profile.firstName,
          LastName: profile.lastName,
          Email: profile.email,
          Phone: profile.phone,
          BirthDate: profile.birthDate?.split('T')[0],
          Gender: profile.gender,
          BloodType: profile.bloodType,
          Status: profile.status,
          PrimaryDoctorId: profile.primaryDoctorId,
          Address: profile.address,
        };
      }
    },
    { immediate: true },
  );

  onMounted(async () => {
    await patientStore.fetchProfile(patientId);
    await allergyStore.fetchAllergies(patientId);
    await vitalsStore.fetchVitals(patientId);
    await doctorStore.fetchDoctors();
    await eegStore.fetchPatientTests(patientId);
    await labStore.fetchLabs();
  });
</script>
