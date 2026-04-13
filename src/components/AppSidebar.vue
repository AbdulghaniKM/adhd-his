<template>
  <aside
    class="bg-surface border-border/60 fixed inset-y-0 left-0 z-[60] flex flex-col border-r transition-all duration-300"
    :class="[isCollapsed ? 'w-20' : 'w-72']"
  >
    <!-- Brand / User Profile Section -->
    <div class="border-border/40 flex flex-col items-center px-4 py-4 border-b">
      <div class="flex w-full items-center mb-4" :class="[isCollapsed ? 'justify-center' : 'justify-between px-2']">
        <router-link to="/" class="group flex items-center gap-3">
          <div
            class="bg-primary/10 flex size-9 items-center justify-center rounded-xl shadow-sm ring-1 ring-primary/20 shrink-0 transition-all group-hover:bg-primary group-hover:text-white"
          >
            <span class="icon-[mdi--hospital-box] text-primary text-xl transition-colors group-hover:text-inherit" />
          </div>
          <div v-if="!isCollapsed" class="flex flex-col leading-none">
            <AppText variant="span" size="1.125rem" weight="bold" color="text" class="tracking-tight">
              ADHD<span class="text-primary">x</span>
            </AppText>
            <AppText variant="span" size="0.625rem" weight="semibold" color="text-secondary" class="uppercase tracking-[0.1em]">
              Health System
            </AppText>
          </div>
        </router-link>
      </div>

      <!-- User Info (Replaces Clinic Selector) -->
      <div 
        v-if="store.user"
        class="bg-surface border-border/60 shadow-xs flex w-full items-center gap-3 rounded-xl border p-2.5 transition-all"
        :class="[isCollapsed ? 'justify-center border-none shadow-none bg-transparent p-0' : '']"
      >
        <AppTooltip :content="store.user.name" :disabled="!isCollapsed" placement="right">
          <div class="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg font-bold text-sm ring-1 ring-primary/20 transition-transform hover:scale-105">
            {{ store.user.name.charAt(0) }}
          </div>
        </AppTooltip>
        
        <div v-if="!isCollapsed" class="flex flex-1 flex-col overflow-hidden">
          <AppText variant="p" size="0.875rem" weight="semibold" color="text" class="truncate leading-tight">
            {{ store.user.name }}
          </AppText>
          <AppText variant="p" size="0.8125rem" color="primary" weight="medium" class="truncate leading-tight opacity-80">
            {{ store.role }}
          </AppText>
        </div>
        <span v-if="!isCollapsed" class="icon-[heroicons-outline--chevron-up-down] text-text-secondary text-sm opacity-50" />
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto px-3 py-6 scrollbar-none">
      <div v-for="(group, gIdx) in navigationGroups" :key="gIdx" class="mb-6 last:mb-2">
        <AppText
          v-if="!isCollapsed"
          variant="p"
          size="0.8125rem"
          weight="medium"
          color="text-secondary"
          class="mb-2 px-3 uppercase tracking-wider opacity-60"
        >
          {{ group.title }}
        </AppText>
        
        <div class="flex w-full flex-col gap-1">
          <AppTooltip
            v-for="link in group.links"
            :key="link.to"
            :content="link.label"
            :disabled="!isCollapsed"
            placement="right"
            full-width
          >
            <router-link
              :to="link.to"
              class="text-text-secondary hover:text-text hover:bg-muted/50 group flex w-full items-center gap-3 rounded-lg py-2.5 text-[0.875rem] font-medium transition-all"
              :class="[isCollapsed ? 'justify-center px-0' : 'px-3']"
              :active-class="link.label === 'Dashboard' ? '' : 'bg-primary/5 text-primary! font-semibold ring-1 ring-primary/10 shadow-sm'"
              :exact-active-class="link.label === 'Dashboard' ? 'bg-primary/5 text-primary! font-semibold ring-1 ring-primary/10 shadow-sm' : ''"
            >
              <span :class="link.icon" class="text-xl opacity-80 group-hover:opacity-100" />
              <span v-if="!isCollapsed" class="truncate">{{ link.label }}</span>
            </router-link>
          </AppTooltip>
        </div>
      </div>
    </nav>

    <!-- Bottom Actions (Settings at the very end) -->
    <div class="border-border/40 space-y-2 border-t p-3">
      <AppTooltip content="Start Guide" :disabled="!isCollapsed" placement="right" full-width>
        <button
          class="text-text-secondary hover:text-primary hover:bg-primary/5 group flex w-full items-center gap-3 rounded-lg py-2.5 text-[0.875rem] font-medium transition-all"
          :class="[isCollapsed ? 'justify-center px-0' : 'px-3']"
          @click="startTour"
        >
          <span class="icon-[heroicons-outline--sparkles] text-xl opacity-80 group-hover:opacity-100" />
          <span v-if="!isCollapsed" class="truncate">Help Guide</span>
        </button>
      </AppTooltip>

      <AppTooltip v-if="store.role === AppRole.DOCTOR" content="Settings" :disabled="!isCollapsed" placement="right" full-width>
        <router-link
          to="/doctor/settings"
          class="text-text-secondary hover:text-text hover:bg-muted/50 group flex w-full items-center gap-3 rounded-lg py-2.5 text-[0.875rem] font-medium transition-all"
          :class="[isCollapsed ? 'justify-center px-0' : 'px-3']"
          active-class="bg-primary/5 text-primary! font-semibold ring-1 ring-primary/10 shadow-sm"
        >
          <span class="icon-[heroicons-outline--cog-6-tooth] text-xl opacity-80 group-hover:opacity-100" />
          <span v-if="!isCollapsed" class="truncate">Settings</span>
        </router-link>
      </AppTooltip>
    </div>

    <!-- Minimal Logout for Sidebar -->
    <div class="border-border/40 border-t p-3">
      <AppTooltip content="Sign Out" :disabled="!isCollapsed" placement="right" full-width>
        <button
          class="text-text-secondary hover:text-error hover:bg-error/10 group flex w-full items-center gap-3 rounded-lg py-2.5 text-[0.875rem] font-medium transition-all"
          :class="[isCollapsed ? 'justify-center px-0' : 'px-3']"
          @click="handleLogout"
        >
          <span class="icon-[mdi--logout] text-xl opacity-80 group-hover:opacity-100" />
          <span v-if="!isCollapsed" class="truncate">Logout</span>
        </button>
      </AppTooltip>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { AuthStore } from '../stores/auth.store';
import { useSidebar } from '../composables/useSidebar';
import { useTour } from '../composables/useTour';
import { AppRole } from '../types/enums.types';
import AppText from './ui/AppText.vue';
import AppTooltip from './ui/AppTooltip.vue';

const store = AuthStore();
const router = useRouter();
const { isCollapsed } = useSidebar();
const { startContextualTour } = useTour();

const startTour = () => {
  startContextualTour();
};

const isAdmin = computed(
  () =>
    store.role === AppRole.ADMIN ||
    store.role === AppRole.SUPER_ADMIN ||
    String(store.role).toLowerCase().includes('admin'),
);

const isDoctor = computed(() => store.role === AppRole.DOCTOR);
const isLabTech = computed(() => store.role === AppRole.LAB_TECH);

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: 'icon-[heroicons-outline--home]' },
  { label: 'Admins', to: '/admin/admins', icon: 'icon-[heroicons-outline--shield-check]' },
  { label: 'Doctors', to: '/admin/doctors', icon: 'icon-[heroicons-outline--user-group]' },
  { label: 'Patients', to: '/admin/patients', icon: 'icon-[heroicons-outline--users]' },
  { label: 'Staff', to: '/admin/lab-techs', icon: 'icon-[heroicons-outline--briefcase]' },
  { label: 'Units', to: '/admin/labs', icon: 'icon-[heroicons-outline--beaker]' },
  { label: 'Depts', to: '/admin/departments', icon: 'icon-[heroicons-outline--building-office]' },
  { label: 'Calendar', to: '/admin/appointments', icon: 'icon-[heroicons-outline--calendar]' },
  { label: 'EEG Tests', to: '/admin/eeg-tests', icon: 'icon-[heroicons-outline--document-chart-bar]' },
];

const doctorLinks = [
  { label: 'Dashboard', to: '/doctor', icon: 'icon-[heroicons-outline--home]' },
  { label: 'Patients', to: '/doctor/patients', icon: 'icon-[heroicons-outline--users]' },
  { label: 'Units', to: '/doctor/labs', icon: 'icon-[heroicons-outline--beaker]' },
  { label: 'Calendar', to: '/doctor/appointments', icon: 'icon-[heroicons-outline--calendar]' },
  { label: 'EEG Tests', to: '/doctor/eeg-tests', icon: 'icon-[heroicons-outline--document-chart-bar]' },
];

const labTechLinks = [
  { label: 'Dashboard', to: '/lab-tech', icon: 'icon-[heroicons-outline--home]' },
  { label: 'Patients', to: '/lab-tech/patients', icon: 'icon-[heroicons-outline--users]' },
  { label: 'Units', to: '/lab-tech/labs', icon: 'icon-[heroicons-outline--beaker]' },
  { label: 'Depts', to: '/lab-tech/departments', icon: 'icon-[heroicons-outline--building-office]' },
  { label: 'EEG Tests', to: '/lab-tech/eeg-tests', icon: 'icon-[heroicons-outline--document-chart-bar]' },
];

const navigationGroups = computed(() => {
  const groups = [];
  
  if (isAdmin.value) {
    groups.push({ title: 'Overview', links: adminLinks.slice(0, 1) });
    groups.push({ title: 'Management', links: adminLinks.slice(1) });
  } else if (isDoctor.value) {
    groups.push({ title: 'Overview', links: doctorLinks.slice(0, 1) });
    groups.push({ title: 'Practice', links: doctorLinks.slice(1) });
  } else if (isLabTech.value) {
    groups.push({ title: 'Overview', links: labTechLinks.slice(0, 1) });
    groups.push({ title: 'Operations', links: labTechLinks.slice(1) });
  }
  
  return groups;
});

const handleLogout = () => {
  store.clearSession();
  router.push({ name: 'login' });
};
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
