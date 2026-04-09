import { defineStore } from 'pinia';
import { ref } from 'vue';

export const AuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<null>(null);
  const loading = ref(false);

  return {
    token,
    user,
    loading,
  };
});
