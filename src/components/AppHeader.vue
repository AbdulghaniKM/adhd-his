<template>
  <header
    class="border-border/40 bg-surface/60 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-8 backdrop-blur-xl transition-all duration-300"
  >
    <div class="flex items-center gap-4">
      <!-- Sidebar Toggle -->
      <AppTooltip :content="isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'" placement="bottom">
        <button
          type="button"
          class="border-border/40 bg-muted/30 text-text-secondary hover:bg-surface hover:text-text flex size-9 items-center justify-center rounded-xl border transition-all duration-200 hover:shadow-sm"
          @click="toggleSidebar"
        >
          <span
            class="icon-[heroicons-outline--bars-3-bottom-left] text-xl transition-transform duration-300"
            :class="[isCollapsed ? 'rotate-180' : '']"
          />
        </button>
      </AppTooltip>
    </div>

    <!-- Actions Section -->
    <div class="flex items-center gap-4">
      <!-- Theme Toggle -->
      <AppTooltip :content="isDark ? 'Light Appearance' : 'Dark Appearance'" placement="bottom">
        <button
          type="button"
          class="border-border/40 bg-muted/30 text-text-secondary hover:bg-surface hover:text-text flex size-9 items-center justify-center rounded-xl border transition-all duration-200 hover:shadow-sm"
          @click="toggleTheme"
        >
          <span
            class="icon-[mdi--weather-sunny] text-lg transition-all duration-300"
            :class="isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'"
          />
          <span
            class="icon-[mdi--weather-night] absolute text-lg transition-all duration-300"
            :class="isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'"
          />
        </button>
      </AppTooltip>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useTheme } from '../composables/useTheme';
  import { useSidebar } from '../composables/useSidebar';
  import AppTooltip from './ui/AppTooltip.vue';

  const { isDark, toggleTheme } = useTheme();
  const { isCollapsed, toggleSidebar } = useSidebar();
</script>
