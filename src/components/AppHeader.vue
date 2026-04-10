<template>
  <header
    class="border-border/40 bg-surface/60 sticky top-0 z-[60] flex h-16 items-center justify-between border-b px-8 backdrop-blur-xl transition-all duration-300"
  >
    <!-- Logo Section -->
    <router-link to="/" class="group flex items-center gap-3 transition-transform hover:scale-[1.02]">
      <div
        class="bg-primary/10 flex size-9 items-center justify-center rounded-xl shadow-sm ring-1 ring-primary/20 transition-all group-hover:bg-primary group-hover:shadow-primary/25"
      >
        <span class="icon-[mdi--hospital-box] text-primary text-xl transition-colors group-hover:text-white" />
      </div>
      <div class="flex flex-col leading-none">
        <AppText variant="span" size="1.125rem" weight="bold" color="text" class="tracking-tight">
          ADHD<span class="text-primary">x</span>
        </AppText>
        <AppText variant="span" size="0.625rem" weight="semibold" color="text-secondary" class="uppercase tracking-[0.1em]">
          Health System
        </AppText>
      </div>
    </router-link>

    <!-- Navigation (Centered & Floating) -->
    <nav v-if="isAdmin || isDoctor" class="bg-muted/40 border-border/40 hidden items-center gap-1 rounded-2xl border p-1 md:flex shadow-xs backdrop-blur-md">
      <router-link
        v-for="link in navigationLinks"
        :key="link.to"
        :to="link.to"
        class="text-text-secondary hover:text-text hover:bg-surface relative flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition-all duration-200"
        active-class="bg-surface text-primary! shadow-sm ring-1 ring-border/50"
      >
        <span :class="link.icon" class="text-base" />
        {{ link.label }}
      </router-link>
    </nav>

    <!-- Actions Section -->
    <div class="flex items-center gap-4">
      <!-- Theme Toggle (Refined) -->
      <AppTooltip
        :content="isDark ? 'Light Appearance' : 'Dark Appearance'"
        placement="bottom"
      >
        <button
          type="button"
          class="border-border/40 bg-muted/30 text-text-secondary hover:bg-surface hover:text-text flex size-9 items-center justify-center rounded-xl border transition-all duration-200 hover:shadow-sm"
          @click="toggleTheme"
        >
          <span
            class="icon-[mdi--weather-sunny] text-lg transition-all duration-300"
            :class="isDark ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'"
          />
          <span
            class="icon-[mdi--weather-night] absolute text-lg transition-all duration-300"
            :class="isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'"
          />
        </button>
      </AppTooltip>

      <!-- User Chip (Modernized) -->
      <div
        v-if="store.user"
        class="border-border/40 bg-surface/50 hidden items-center gap-3 rounded-2xl border pl-1.5 pr-3 py-1.5 shadow-xs transition-all hover:bg-surface sm:flex"
      >
        <div class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-xl font-bold text-xs ring-1 ring-primary/20">
          {{ store.user.name.charAt(0) }}
        </div>
        <div class="flex flex-col">
          <AppText variant="span" size="0.75rem" weight="bold" color="text" class="leading-none">
            {{ store.user.name }}
          </AppText>
          <AppText
            variant="span"
            size="0.625rem"
            weight="medium"
            color="primary"
            class="leading-none opacity-80"
          >
            {{ store.role }}
          </AppText>
        </div>
      </div>

      <!-- Logout (Sleek) -->
      <AppButton
        v-if="store.token"
        variant="ghost"
        size="md"
        icon="icon-[mdi--logout]"
        icon-only
        tooltip="Sign Out"
        class="text-text-secondary! hover:bg-error/10! hover:text-error! rounded-xl"
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useTheme } from '../composables/useTheme';
  import { AuthStore } from '../stores/auth.store';
  import { useRouter } from 'vue-router';
  import { AppRole } from '../types/enums.types';
  import AppText from './ui/AppText.vue';
  import AppButton from './ui/AppButton.vue';
  import AppTooltip from './ui/AppTooltip.vue';

  const { isDark, toggleTheme } = useTheme();
  const store = AuthStore();
  const router = useRouter();

  const isAdmin = computed(
    () =>
      store.role === AppRole.ADMIN ||
      store.role === AppRole.SUPER_ADMIN ||
      String(store.role).toLowerCase().includes('admin'),
  );

  const isDoctor = computed(() => store.role === AppRole.DOCTOR);

  const adminLinks = [
    { label: 'Dashboard', to: '/admin', icon: 'icon-[heroicons-outline--home]' },
    { label: 'Admins', to: '/admin/admins', icon: 'icon-[heroicons-outline--shield-check]' },
    { label: 'Doctors', to: '/admin/doctors', icon: 'icon-[heroicons-outline--user-group]' },
    { label: 'Patients', to: '/admin/patients', icon: 'icon-[heroicons-outline--users]' },
    { label: 'Staff', to: '/admin/lab-techs', icon: 'icon-[heroicons-outline--briefcase]' },
    { label: 'Units', to: '/admin/labs', icon: 'icon-[heroicons-outline--beaker]' },
    { label: 'Depts', to: '/admin/departments', icon: 'icon-[heroicons-outline--building-office]' },
    { label: 'Calendar', to: '/admin/appointments', icon: 'icon-[heroicons-outline--calendar]' },
  ];

  const doctorLinks = [
    { label: 'Dashboard', to: '/doctor', icon: 'icon-[heroicons-outline--home]' },
    { label: 'Patients', to: '/doctor/patients', icon: 'icon-[heroicons-outline--users]' },
    { label: 'Units', to: '/doctor/labs', icon: 'icon-[heroicons-outline--beaker]' },
    { label: 'Calendar', to: '/doctor/appointments', icon: 'icon-[heroicons-outline--calendar]' },
    { label: 'Settings', to: '/doctor/settings', icon: 'icon-[heroicons-outline--cog-6-tooth]' },
  ];

  const navigationLinks = computed(() => {
    if (isAdmin.value) return adminLinks;
    if (isDoctor.value) return doctorLinks;
    return [];
  });

  const handleLogout = () => {
    store.clearSession();
    router.push({ name: 'login' });
  };
</script>
