import { createRouter, createWebHistory } from 'vue-router';
import { AuthStore } from '../stores/auth.store';
import { AppRole } from '../types/enums.types';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/home.vue') },
    { path: '/login', name: 'login', component: () => import('../pages/login.vue') },
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('../pages/admin/index.vue') },
        { path: 'admins', name: 'admin-admins', component: () => import('../pages/admin/admins.vue') },
        { path: 'doctors', name: 'admin-doctors', component: () => import('../pages/admin/doctors.vue') },
        { path: 'patients', name: 'admin-patients', component: () => import('../pages/admin/patients.vue') },
        { path: 'lab-techs', name: 'admin-lab-techs', component: () => import('../pages/admin/lab-techs.vue') },
        { path: 'labs', name: 'admin-labs', component: () => import('../pages/admin/labs.vue') },
        { path: 'departments', name: 'admin-departments', component: () => import('../pages/admin/departments.vue') },
        { path: 'appointments', name: 'admin-appointments', component: () => import('../pages/admin/appointments.vue') },
      ],
    },
    {
      path: '/doctor',
      name: 'doctor',
      meta: { requiresAuth: true, role: AppRole.DOCTOR },
      children: [
        { path: '', name: 'doctor-dashboard', component: () => import('../pages/doctor/index.vue') },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = AuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: 'login' });
  } else if (to.name === 'login' && authStore.token) {
    if (authStore.role === AppRole.DOCTOR) {
      next({ name: 'doctor-dashboard' });
    } else {
      next({ name: 'admin-dashboard' });
    }
  } else {
    next();
  }
});

export default router;
