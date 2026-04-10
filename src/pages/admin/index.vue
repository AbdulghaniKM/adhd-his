<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text">Admin Dashboard</h1>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div v-for="stat in stats" :key="stat.label" class="rounded-2xl border border-border bg-surface p-6">
        <div class="flex items-center gap-4">
          <div :class="[stat.bgClass, 'flex size-12 items-center justify-center rounded-xl']">
            <AppIcon :name="stat.icon" :size="1.5" :class="stat.iconClass" />
          </div>
          <div>
            <p class="text-sm font-medium text-text-secondary">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-text">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-border bg-surface p-6">
        <h3 class="mb-4 text-lg font-semibold text-text">System Overview</h3>
        <p class="text-sm text-text-secondary leading-relaxed">
          Welcome to the ADHD HIS Administration panel. From here, you can manage all aspects of the system including medical staff, patients, departments, and laboratory settings.
        </p>
      </div>

      <div class="rounded-2xl border border-border bg-surface p-6">
        <h3 class="mb-4 text-lg font-semibold text-text">Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <AppButton
            v-for="action in quickActions"
            :key="action.label"
            :label="action.label"
            :icon="action.icon"
            variant="outline"
            size="sm"
            @click="$router.push(action.to)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppIcon from '../../components/ui/AppIcon.vue';
import AppButton from '../../components/ui/AppButton.vue';

const stats = ref([
  {
    label: 'Total Doctors',
    value: '...',
    icon: 'icon-[heroicons-outline--user-group]',
    bgClass: 'bg-blue-500/10',
    iconClass: 'text-blue-500',
  },
  {
    label: 'Active Patients',
    value: '...',
    icon: 'icon-[heroicons-outline--users]',
    bgClass: 'bg-green-500/10',
    iconClass: 'text-green-500',
  },
  {
    label: 'Appointments Today',
    value: '...',
    icon: 'icon-[heroicons-outline--calendar]',
    bgClass: 'bg-purple-500/10',
    iconClass: 'text-purple-500',
  },
  {
    label: 'Labs Operating',
    value: '...',
    icon: 'icon-[heroicons-outline--beaker]',
    bgClass: 'bg-amber-500/10',
    iconClass: 'text-amber-500',
  },
]);

const quickActions = [
  { label: 'Manage Doctors', icon: 'icon-[heroicons-outline--user-plus]', to: '/admin/doctors' },
  { label: 'View Appointments', icon: 'icon-[heroicons-outline--calendar-days]', to: '/admin/appointments' },
  { label: 'Manage Patients', icon: 'icon-[heroicons-outline--identification]', to: '/admin/patients' },
  { label: 'Department Settings', icon: 'icon-[heroicons-outline--building-office]', to: '/admin/departments' },
];
</script>
