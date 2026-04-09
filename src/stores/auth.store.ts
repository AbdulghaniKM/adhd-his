import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AuthUser, LoginResponseData } from '../types/auth.types';
import { AppRole } from '../types/enums.types';

export const AuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth-token'));
  const user = ref<AuthUser | null>(null);
  const role = ref<AppRole | null>(null);
  const loading = ref(false);

  const setSession = (data: LoginResponseData) => {
    token.value = data.accessToken;
    user.value = data.user;
    role.value = data.role;
    localStorage.setItem('auth-token', data.accessToken);
  };

  const clearSession = () => {
    token.value = null;
    user.value = null;
    role.value = null;
    localStorage.removeItem('auth-token');
  };

  return { token, user, role, loading, setSession, clearSession };
});
