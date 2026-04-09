<template>
  <div class="flex min-h-screen flex-col bg-background">
    <AppHeader v-if="!isLoginRoute" />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

const route = useRoute();
const isLoginRoute = computed(() => route.name === 'login');
</script>
