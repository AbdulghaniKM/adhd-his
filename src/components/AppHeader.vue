<template>
  <header
    class="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface/80 px-6 backdrop-blur-md"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2.5">
      <div class="flex size-7 items-center justify-center rounded-lg bg-primary">
        <span class="icon-[mdi--hospital-box] text-sm text-white" />
      </div>
      <span class="text-sm font-bold text-text">ADHDx HIS</span>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <!-- User chip -->
      <div
        v-if="store.user"
        class="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1"
      >
        <span class="icon-[mdi--account-circle] text-base text-text-secondary" />
        <span class="text-xs font-medium text-text">{{ store.user.name }}</span>
        <span class="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          {{ store.role }}
        </span>
      </div>

      <!-- Theme toggle -->
      <button
        type="button"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        class="theme-toggle relative flex size-8 items-center justify-center rounded-lg border border-border bg-muted text-text-secondary transition-colors duration-150 hover:bg-surface hover:text-text"
        @click="toggleTheme"
      >
        <span class="icon-[mdi--weather-sunny] text-base transition-all duration-200" :class="isDark ? 'scale-0 opacity-0' : 'scale-100 opacity-100'" />
        <span class="icon-[mdi--weather-night] absolute text-base transition-all duration-200" :class="isDark ? 'scale-100 opacity-100' : 'scale-0 opacity-0'" />
      </button>

      <!-- Logout -->
      <button
        v-if="store.token"
        type="button"
        title="Sign out"
        class="flex size-8 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-error/10 hover:text-error"
        @click="handleLogout"
      >
        <span class="icon-[mdi--logout] text-base" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme';
import { AuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';

const { isDark, toggleTheme } = useTheme();
const store = AuthStore();
const router = useRouter();

const handleLogout = () => {
  store.clearSession();
  router.push({ name: 'login' });
};
</script>
