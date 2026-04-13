<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DefaultLayout from './layout/index.vue';
import { useEnumStore } from './stores/enum.store';

const enumStore = useEnumStore();

onMounted(() => {
  enumStore.fetchAllEnums();
});
</script>
