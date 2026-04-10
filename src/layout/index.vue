<template>
  <div class="flex min-h-screen flex-col bg-background">
    <AppHeader v-if="!isLoginRoute" />
    <main class="flex-1">
      <slot />
    </main>
    <AppToast :toasts="toasts" @remove="remove" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppToast from '../components/ui/AppToast.vue';
import { useToast } from '../composables/useToast';

const route = useRoute();
const isLoginRoute = computed(() => route.name === 'login');

const { toasts, remove } = useToast();
</script>
