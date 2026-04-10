<template>
  <div class="flex flex-col gap-4">
    <!-- Tabs Header -->
    <div
      class="border-border bg-muted/50 flex w-fit items-center gap-1 rounded-xl border p-1"
      role="tablist"
      aria-label="Tabs navigation"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
        :class="
          modelValue === tab.id
            ? 'bg-surface text-primary ring-border shadow-sm ring-1'
            : 'text-text-secondary hover:bg-muted hover:text-text'
        "
        role="tab"
        :aria-selected="modelValue === tab.id"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span v-if="tab.icon" :class="[tab.icon, 'text-base']" />
        {{ tab.label }}
        
        <!-- Active indicator dot if needed -->
        <span
          v-if="tab.badge"
          class="size-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      </button>
    </div>

    <!-- Tabs Content Slot -->
    <div class="relative min-h-0 w-full overflow-hidden">
      <transition
        name="fade"
        mode="out-in"
      >
        <div :key="modelValue" class="w-full">
          <slot :name="modelValue" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Tab {
    id: string;
    label: string;
    icon?: string;
    badge?: boolean;
  }

  defineProps<{
    modelValue: string;
    tabs: Tab[];
  }>();

  defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .fade-enter-from {
    opacity: 0;
    transform: translateY(4px);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
</style>
