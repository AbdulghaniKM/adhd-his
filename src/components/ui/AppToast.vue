<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed end-4 top-4 z-[10000] flex flex-col items-end gap-3"
      role="log"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        <motion.div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl"
          :style="shadowStyle(toast.type)"
          role="alert"
          :initial="{ opacity: 0, x: 120, scale: 0.88 }"
          :animate="{ opacity: 1, x: 0, scale: 1 }"
          :exit="{ opacity: 0, x: 80, scale: 0.94, transition: { duration: 0.2 } }"
          :transition="{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }"
        >
          <!-- Left icon panel (solid color) -->
          <div
            class="flex w-[3.75rem] shrink-0 flex-col items-center justify-center gap-1.5"
            :class="panelClass(toast.type)"
          >
            <AppIcon :name="toastIcon(toast.type)" size="lg" class="text-white" />
          </div>

          <!-- Right content panel -->
          <div class="bg-surface flex min-w-0 flex-1 flex-col">
            <div class="flex items-start gap-2 px-4 py-3.5">
              <div class="min-w-0 flex-1">
                <!-- Type overline label -->
                <p
                  class="mb-1 text-[0.65rem] font-bold tracking-[0.12em] uppercase"
                  :class="labelClass(toast.type)"
                >
                  {{ toast.title ?? typeLabel(toast.type) }}
                </p>
                <!-- Message -->
                <p class="text-text text-sm leading-snug">{{ toast.message }}</p>
              </div>

              <!-- Dismiss -->
              <button
                type="button"
                class="text-text-secondary -me-1 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg opacity-40 transition-all hover:bg-muted hover:opacity-100"
                aria-label="Dismiss notification"
                @click="removeToast(toast.id)"
              >
                <AppIcon name="mdi--close" :size="0.8" />
              </button>
            </div>

            <!-- Progress bar -->
            <div
              v-if="toast.duration && toast.duration > 0"
              class="h-[0.1875rem] origin-left rounded-full"
              :class="progressClass(toast.type)"
              :style="{ animation: `toast-progress ${toast.duration}ms linear forwards` }"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import type { Toast } from '../../composables/useToast'
import AppIcon from './AppIcon.vue'

defineProps<{ toasts: Toast[] }>()

const emit = defineEmits<{ remove: [id: string] }>()
const removeToast = (id: string) => emit('remove', id)

const typeLabel = (type: Toast['type']) => ({
  success: 'Success',
  error:   'Error',
  warning: 'Warning',
  info:    'Info',
})[type]

const panelClass = (type: Toast['type']) => ({
  success: 'bg-success',
  error:   'bg-error',
  warning: 'bg-warning',
  info:    'bg-info',
})[type]

const labelClass = (type: Toast['type']) => ({
  success: 'text-success',
  error:   'text-error',
  warning: 'text-warning',
  info:    'text-info',
})[type]

const progressClass = (type: Toast['type']) => ({
  success: 'bg-success/60',
  error:   'bg-error/60',
  warning: 'bg-warning/60',
  info:    'bg-info/60',
})[type]

const toastIcon = (type: Toast['type']) => ({
  success: 'heroicons-outline--check-circle',
  error:   'heroicons-outline--x-circle',
  warning: 'heroicons--exclamation-triangle',
  info:    'heroicons-outline--information-circle',
})[type]

const shadowStyle = (type: Toast['type']) => {
  const c: Record<Toast['type'], string> = {
    success: 'var(--color-success)',
    error:   'var(--color-error)',
    warning: 'var(--color-warning)',
    info:    'var(--color-info)',
  }
  const col = c[type]
  return {
    boxShadow: `0 20px 48px -8px color-mix(in srgb, ${col} 35%, transparent),
                0 4px 12px -2px color-mix(in srgb, ${col} 20%, transparent),
                0 1px 3px 0 rgb(0 0 0 / 0.12)`,
  }
}
</script>

<style scoped>
@keyframes toast-progress {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}
</style>
