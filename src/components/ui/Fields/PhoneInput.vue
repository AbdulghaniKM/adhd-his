<template>
  <div class="flex min-w-0 flex-col gap-1.5 w-full">
    <span v-if="label" class="text-sm font-medium text-text">
      {{ label }}
    </span>
    <div
      class="relative flex min-w-0 items-stretch rounded-lg border bg-surface transition-all"
      :class="[
        isFocused && !error
          ? 'border-primary ring-2 ring-primary/20'
          : error
            ? 'border-error ring-2 ring-error/20'
            : 'border-border',
        readonly ? 'opacity-50 cursor-not-allowed' : '',
      ]"
    >
      <input
        :id="id"
        ref="inputRef"
        type="tel"
        :value="phoneNumber"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="readonly"
        dir="ltr"
        class="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-text placeholder:text-text/40 focus:outline-none disabled:cursor-not-allowed text-sm overflow-x-auto"
        :class="customClass"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <template v-if="showCountryCode">
        <div
          class="flex items-center gap-1.5 ps-3 pe-3 text-sm text-text bg-muted/20 rounded-e-lg border-s border-border shrink-0"
        >
          <span class="text-lg leading-none">🇮🇶</span>
          <span class="font-medium" dir="ltr">+964</span>
        </div>
      </template>
    </div>
    <span class="block min-h-[1.25rem] text-sm text-error" :class="{ invisible: !error }">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface CountryCode {
  code: string;
  flag: string;
  name: string;
}

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  readonly?: boolean;
  error?: string;
  customClass?: string;
  showCountryCode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'Enter phone number',
  readonly: false,
  error: '',
  customClass: '',
  showCountryCode: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const id = computed(() => `phone-${Math.random().toString(36).substr(2, 9)}`);

const countryCode = ref('+964');
const phoneNumber = ref('');
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const parsePhone = (value: string) => {
  if (!value) {
    phoneNumber.value = '';
    return;
  }
  if (value.startsWith('+964')) {
    phoneNumber.value = value.slice(4).trim();
  } else {
    phoneNumber.value = value;
  }
};

parsePhone(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  parsePhone(newVal);
});

function emitValue() {
  if (props.showCountryCode) {
    emit('update:modelValue', `${countryCode.value} ${phoneNumber.value}`.trim());
  } else {
    emit('update:modelValue', phoneNumber.value);
  }
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const digitsOnly = target.value.replace(/\D/g, '').slice(0, 15);
  target.value = digitsOnly;
  phoneNumber.value = digitsOnly;
  emitValue();
};

watch(countryCode, () => {
  emitValue();
});
</script>
