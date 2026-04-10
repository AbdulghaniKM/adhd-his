import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AuthUser, LoginResponseData } from '../types/auth.types';
import { AppRole } from '../types/enums.types';

export const AuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth-token'));
  const user = ref<AuthUser | null>(JSON.parse(localStorage.getItem('auth-user') || 'null'));
  const role = ref<AppRole | null>(localStorage.getItem('auth-role') as AppRole || null);
  const loading = ref(false);

  const setSession = (data: LoginResponseData) => {
    token.value = data.accessToken;
    user.value = data.user;
    role.value = data.role;
    localStorage.setItem('auth-token', data.accessToken);
    localStorage.setItem('auth-role', data.role);
    localStorage.setItem('auth-user', JSON.stringify(data.user));
  };

  const clearSession = () => {
    token.value = null;
    user.value = null;
    role.value = null;
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-role');
    localStorage.removeItem('auth-user');
  };

  return { token, user, role, loading, setSession, clearSession };
});
