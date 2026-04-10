<template>
  <div class="mx-auto max-w-7xl space-y-10 p-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h1 class="text-text text-3xl font-bold tracking-tight">Laboratory Dashboard</h1>
        <p class="text-text-secondary text-sm">
          Monitor lab units, manage diagnostic tests, and review patient records.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="bg-success/10 text-success flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold ring-1 ring-success/20">
          <span class="size-2 animate-pulse rounded-full bg-success" />
          LABS OPERATIONAL
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-surface border-border/40 group relative overflow-hidden rounded-3xl border p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
      >
        <div class="relative z-10 flex items-center gap-5">
          <div :class="[stat.bgClass, 'flex size-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/5 transition-transform duration-500 group-hover:rotate-12']">
            <AppIcon :name="stat.icon" :size="1.75" :class="stat.iconClass" />
          </div>
          <div class="flex flex-col gap-0.5">
            <p class="text-text-secondary text-[11px] font-bold tracking-widest uppercase opacity-60">
              {{ stat.label }}
            </p>
            <p class="text-text text-3xl font-black tracking-tight tabular-nums">
              {{ stat.value }}
            </p>
          </div>
        </div>
        <!-- Decorative Background Pattern -->
        <div class="absolute -right-4 -top-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-150">
          <AppIcon :name="stat.icon" :size="8" />
        </div>
      </div>
    </div>

    <!-- Secondary Section -->
    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Welcome Card -->
      <div class="bg-primary/5 border-primary/10 relative overflow-hidden rounded-3xl border p-8 lg:col-span-2">
        <div class="relative z-10 space-y-4">
          <div class="bg-primary text-surface flex size-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
            <span class="icon-[heroicons-outline--beaker] text-xl" />
          </div>
          <h2 class="text-text text-2xl font-extrabold tracking-tight">Technical Operations Hub</h2>
          <p class="text-text-secondary max-w-xl text-sm leading-relaxed">
            Manage your assigned laboratory units, update diagnostic results, and ensure patient data accuracy. Use the shortcuts to quickly jump between units and patient registries.
          </p>
          <div class="pt-2">
            <AppButton
              label="Lab Safety Protocols"
              variant="outline"
              size="md"
              class="bg-surface! border-primary/20! text-primary! rounded-xl"
              icon="icon-[heroicons-outline--shield-exclamation]"
            />
          </div>
        </div>
        <!-- Abstract Decoration -->
        <div class="bg-primary/10 absolute -right-20 -top-20 size-64 rounded-full blur-3xl" />
      </div>

      <!-- Quick Actions -->
      <div class="bg-surface border-border/40 space-y-6 rounded-3xl border p-8 shadow-xs">
        <h3 class="text-text text-lg font-bold tracking-tight">Quick Actions</h3>
        <div class="flex flex-col gap-3">
          <button
            v-for="action in quickActions"
            :key="action.label"
            type="button"
            class="hover:bg-muted group flex items-center justify-between rounded-2xl border border-transparent p-4 transition-all hover:border-border/40 active:scale-[0.98]"
            @click="$router.push(action.to)"
          >
            <div class="flex items-center gap-4">
              <div class="bg-muted text-text-secondary group-hover:bg-primary group-hover:text-surface flex size-10 items-center justify-center rounded-xl transition-all">
                <AppIcon :name="action.icon" :size="1.25" />
              </div>
              <span class="text-text text-sm font-bold">{{ action.label }}</span>
            </div>
            <AppIcon name="icon-[heroicons-outline--chevron-right]" :size="1" class="text-text-secondary opacity-0 transition-all -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" />
          </button>
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
      label: 'Assigned Units',
      value: '3',
      icon: 'icon-[heroicons-outline--beaker]',
      bgClass: 'bg-primary/10',
      iconClass: 'text-primary',
    },
    {
      label: 'Total Patients',
      value: '1,280',
      icon: 'icon-[heroicons-outline--users]',
      bgClass: 'bg-secondary/10',
      iconClass: 'text-secondary',
    },
    {
      label: 'Active Tests',
      value: '12',
      icon: 'icon-[heroicons-outline--document-chart-bar]',
      bgClass: 'bg-info/10',
      iconClass: 'text-info',
    },
    {
      label: 'Departments',
      value: '8',
      icon: 'icon-[heroicons-outline--building-office]',
      bgClass: 'bg-accent/10',
      iconClass: 'text-accent',
    },
  ]);

  const quickActions = [
    { label: 'Manage Units', icon: 'icon-[heroicons-outline--beaker]', to: '/lab-tech/labs' },
    { label: 'Patient Registry', icon: 'icon-[heroicons-outline--identification]', to: '/lab-tech/patients' },
    { label: 'View Departments', icon: 'icon-[heroicons-outline--building-library]', to: '/lab-tech/departments' },
  ];
</script>
