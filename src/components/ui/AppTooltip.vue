<template>
  <div
    ref="reference"
    class="inline-flex"
    :class="[fullWidth ? 'w-full' : 'w-fit']"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focusin="onEnter"
    @focusout="onLeave"
  >
    <slot />

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="content && show && !disabled"
          ref="floating"
          :style="floatingStyles"
          class="pointer-events-none z-[9999] max-w-xs whitespace-normal rounded-lg px-3 py-1.5 text-xs font-medium leading-snug shadow-lg ring-1 transition-transform"
          :class="[
            dark
              ? 'bg-[#1e293b] text-white ring-white/10'
              : 'bg-surface border-border border text-text shadow-md ring-transparent',
          ]"
        >
          {{ content }}

          <!-- Arrow -->
          <div
            v-if="arrowRef"
            ref="arrowElement"
            class="absolute size-2 rotate-45"
            :style="{
              left: arrowX != null ? `${arrowX}px` : '',
              top: arrowY != null ? `${arrowY}px` : '',
              [staticSide]: '-4px',
            }"
            :class="[dark ? 'bg-[#1e293b]' : 'bg-surface border-border border']"
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  autoUpdate,
  type Placement,
} from '@floating-ui/vue'
import { useBreakpoint } from '../../composables/useBreakpoint'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: Placement
    dark?: boolean
    delay?: number
    disabled?: boolean
    arrow?: boolean
    fullWidth?: boolean
  }>(),
  {
    content: '',
    placement: 'top',
    dark: true,
    delay: 200,
    disabled: false,
    arrow: true,
    fullWidth: false,
  }
)

const { isMobile: disableOnMobile } = useBreakpoint()
const show = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)
const arrowElement = ref<HTMLElement | null>(null)

const { floatingStyles, middlewareData, placement } = useFloating(reference, floating, {
  placement: props.placement,
  whileElementsMounted: autoUpdate,
  middleware: [
    offset(8),
    flip(),
    shift({ padding: 5 }),
    arrow({ element: arrowElement }),
  ],
})

const arrowX = computed(() => middlewareData.value.arrow?.x)
const arrowY = computed(() => middlewareData.value.arrow?.y)
const arrowRef = computed(() => props.arrow)

const staticSide = computed(() => {
  const side = placement.value.split('-')[0]
  const staticSideMap: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }
  return staticSideMap[side]
})

function onEnter() {
  if (disableOnMobile.value || props.disabled) return
  timeoutId = setTimeout(() => {
    show.value = true
  }, props.delay)
}

function onLeave() {
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
  show.value = false
}
</script>
