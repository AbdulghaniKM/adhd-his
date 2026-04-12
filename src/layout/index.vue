<template>
  <div class="flex min-h-screen bg-background">
    <!-- Sidebar - Fixed Navigation -->
    <AppSidebar v-if="!isLoginRoute" />
    
    <!-- Main Content Area -->
    <div 
      class="flex flex-1 flex-col transition-all duration-300"
      :class="[!isLoginRoute ? (isCollapsed ? 'pl-20' : 'pl-72') : '']"
    >
      <!-- Top Header (Actions & Branding) -->
      <AppHeader v-if="!isLoginRoute" />
      
      <!-- View Content -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
    
    <!-- Global Toast Notifications -->
    <AppToast :toasts="toasts" @remove="remove" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppSidebar from '../components/AppSidebar.vue';
import AppHeader from '../components/AppHeader.vue';
import AppToast from '../components/ui/AppToast.vue';
import { useToast } from '../composables/useToast';
import { useSidebar } from '../composables/useSidebar';

const route = useRoute();
const isLoginRoute = computed(() => route.name === 'login');
const { isCollapsed } = useSidebar();

const { toasts, remove } = useToast();
</script>
