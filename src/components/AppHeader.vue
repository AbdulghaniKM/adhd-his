<template>
  <header
    class="border-border bg-surface/80 sticky top-0 z-50 flex h-14 items-center justify-between border-b px-6 backdrop-blur-md"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2.5">
      <div class="bg-primary flex size-7 items-center justify-center rounded-lg">
        <span class="icon-[mdi--hospital-box] text-sm text-white" />
      </div>
      <AppText variant="span" size="sm" weight="bold" color="text">ADHDx</AppText>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <!-- User chip -->
      <div
        v-if="store.user"
        class="border-border bg-muted flex items-center gap-2 rounded-full border px-3 py-1"
      >
        <span class="icon-[mdi--account-circle] text-text-secondary text-base" />
        <AppText variant="span" size="xs" weight="medium" color="text">
          {{ store.user.name }}
        </AppText>
        <AppText
          variant="span"
          size="0.625rem"
          weight="semibold"
          color="primary"
          class="bg-primary/10 rounded-full px-1.5 py-0.5"
        >
          {{ store.role }}
        </AppText>
      </div>

      <!-- Theme toggle -->
      <AppTooltip
        :content="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        placement="bottom"
      >
        <button
          type="button"
          class="theme-toggle border-border bg-muted text-text-secondary hover:bg-surface hover:text-text relative flex size-8 items-center justify-center rounded-lg border transition-colors duration-150"
          @click="toggleTheme"
        >
          <span
            class="icon-[mdi--weather-sunny] text-base transition-all duration-200"
            :class="isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'"
          />
          <span
            class="icon-[mdi--weather-night] absolute text-base transition-all duration-200"
            :class="isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
          />
        </button>
      </AppTooltip>

      <!-- Logout -->
      <AppButton
        v-if="store.token"
        icon-only
        variant="ghost"
        size="sm"
        icon="mdi--logout"
        tooltip="Sign out"
        tooltip-placement="bottom"
        class="hover:bg-error/10! hover:text-error!"
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useTheme } from '../composables/useTheme';
  import { AuthStore } from '../stores/auth.store';
  import { useRouter } from 'vue-router';
  import AppText from './ui/AppText.vue';
  import AppButton from './ui/AppButton.vue';
  import AppTooltip from './ui/AppTooltip.vue';

  const { isDark, toggleTheme } = useTheme();
  const store = AuthStore();
  const router = useRouter();

  const handleLogout = () => {
    store.clearSession();
    router.push({ name: 'login' });
  };
</script>
