import { computed } from 'vue';
import { useEnumStore } from '../stores/enum.store';

/**
 * Composable to provide reactive enum label mapping.
 * Uses the dynamic Arabic labels fetched from the backend.
 */
export function useEnums() {
  const store = useEnumStore();

  // Maps (computed so they update when the store is initialized)
  const appRoleLabels        = computed(() => store.getMap('appRoles'));
  const genderLabels          = computed(() => store.getMap('gender'));
  const weekDayLabels         = computed(() => store.getMap('weekDays'));
  const bloodTypeLabels       = computed(() => store.getMap('bloodType'));
  const patientStatusLabels   = computed(() => store.getMap('patientStatus'));
  const allergySeverityLabels = computed(() => store.getMap('allergySeverity'));
  const appointmentTypeLabels = computed(() => store.getMap('appointmentType'));
  const appointmentStatusLabels = computed(() => store.getMap('appointmentStatus'));
  const eegTestStatusLabels   = computed(() => store.getMap('eegTestStatus'));
  const adhdPredictionLabels  = computed(() => store.getMap('adhdPrediction'));

  // Mapping functions
  const mapAppRole        = (val: any) => appRoleLabels.value[val]        ?? String(val);
  const mapGender         = (val: any) => genderLabels.value[val]          ?? String(val);
  const mapWeekDay        = (val: any) => weekDayLabels.value[val]         ?? String(val);
  const mapBloodType      = (val: any) => bloodTypeLabels.value[val]       ?? String(val);
  const mapPatientStatus  = (val: any) => patientStatusLabels.value[val]   ?? String(val);
  const mapAllergySeverity = (val: any) => allergySeverityLabels.value[val] ?? String(val);
  const mapAppointmentType   = (val: any) => appointmentTypeLabels.value[val]   ?? String(val);
  const mapAppointmentStatus = (val: any) => appointmentStatusLabels.value[val] ?? String(val);
  const mapEegTestStatus  = (val: any) => eegTestStatusLabels.value[val]   ?? String(val);
  const mapAdhdPrediction = (val: any) => adhdPredictionLabels.value[val]  ?? String(val);

  return {
    // Labels
    appRoleLabels,
    genderLabels,
    weekDayLabels,
    bloodTypeLabels,
    patientStatusLabels,
    allergySeverityLabels,
    appointmentTypeLabels,
    appointmentStatusLabels,
    eegTestStatusLabels,
    adhdPredictionLabels,

    // Mappers
    mapAppRole,
    mapGender,
    mapWeekDay,
    mapBloodType,
    mapPatientStatus,
    mapAllergySeverity,
    mapAppointmentType,
    mapAppointmentStatus,
    mapEegTestStatus,
    mapAdhdPrediction,

    // Loading State
    loading: computed(() => store.loading),
    initialized: computed(() => store.initialized),
  };
}
