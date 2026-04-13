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
      meta: { requiresAuth: true, roles: [AppRole.ADMIN, AppRole.SUPER_ADMIN] },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('../pages/admin/index.vue') },
        { path: 'admins', name: 'admin-admins', component: () => import('../pages/admin/admins.vue') },
        { path: 'doctors', name: 'admin-doctors', component: () => import('../pages/admin/doctors.vue') },
        { path: 'patients', name: 'admin-patients', component: () => import('../pages/admin/patients.vue') },
        { path: 'patients/:id', name: 'admin-patient-profile', component: () => import('../pages/admin/patient-profile.vue') },
        { path: 'lab-techs', name: 'admin-lab-techs', component: () => import('../pages/admin/lab-techs.vue') },
        { path: 'labs', name: 'admin-labs', component: () => import('../pages/admin/labs.vue') },
        { path: 'departments', name: 'admin-departments', component: () => import('../pages/admin/departments.vue') },
        { path: 'appointments', name: 'admin-appointments', component: () => import('../pages/admin/appointments.vue') },
        { path: 'eeg-tests', name: 'admin-eeg-tests', component: () => import('../pages/admin/eeg-tests.vue') },
        { path: 'eeg-tests/:id', name: 'admin-eeg-test-details', component: () => import('../pages/admin/eeg-test-details.vue') },
      ],
    },
    {
      path: '/doctor',
      name: 'doctor',
      meta: { requiresAuth: true, roles: [AppRole.DOCTOR] },
      children: [
        { path: '', name: 'doctor-dashboard', component: () => import('../pages/doctor/index.vue') },
        { path: 'patients', name: 'doctor-patients', component: () => import('../pages/admin/patients.vue') },
        { path: 'patients/:id', name: 'doctor-patient-profile', component: () => import('../pages/admin/patient-profile.vue') },
        { path: 'labs', name: 'doctor-labs', component: () => import('../pages/admin/labs.vue') },
        { path: 'appointments', name: 'doctor-appointments', component: () => import('../pages/admin/appointments.vue') },
        { path: 'eeg-tests', name: 'doctor-eeg-tests', component: () => import('../pages/admin/eeg-tests.vue') },
        { path: 'eeg-tests/:id', name: 'doctor-eeg-test-details', component: () => import('../pages/admin/eeg-test-details.vue') },
        { path: 'settings', name: 'doctor-settings', component: () => import('../pages/doctor/settings.vue') },
      ],
    },
    {
      path: '/lab-tech',
      name: 'lab-tech',
      meta: { requiresAuth: true, roles: [AppRole.LAB_TECH] },
      children: [
        { path: '', name: 'lab-tech-dashboard', component: () => import('../pages/lab-tech/index.vue') },
        { path: 'patients', name: 'lab-tech-patients', component: () => import('../pages/admin/patients.vue') },
        { path: 'patients/:id', name: 'lab-tech-patient-profile', component: () => import('../pages/admin/patient-profile.vue') },
        { path: 'labs', name: 'lab-tech-labs', component: () => import('../pages/admin/labs.vue') },
        { path: 'departments', name: 'lab-tech-departments', component: () => import('../pages/admin/departments.vue') },
        { path: 'eeg-tests', name: 'lab-tech-eeg-tests', component: () => import('../pages/admin/eeg-tests.vue') },
        { path: 'eeg-tests/:id', name: 'lab-tech-eeg-test-details', component: () => import('../pages/admin/eeg-test-details.vue') },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = AuthStore();
  const userRole = authStore.role as AppRole;

  // 1. Not logged in -> go to login (unless it's a public route)
  if (to.meta.requiresAuth && !authStore.token) {
    return next({ name: 'login' });
  }

  // 2. Logged in and trying to access login -> redirect to their dashboard
  if (to.name === 'login' && authStore.token) {
    if (userRole === AppRole.DOCTOR) return next({ name: 'doctor-dashboard' });
    if (userRole === AppRole.LAB_TECH) return next({ name: 'lab-tech-dashboard' });
    return next({ name: 'admin-dashboard' });
  }

  // 3. Check role-based access
  if (to.meta.roles) {
    const allowedRoles = to.meta.roles as AppRole[];
    if (!allowedRoles.includes(userRole)) {
      // Not allowed: redirect to their own dashboard
      if (userRole === AppRole.DOCTOR) return next({ name: 'doctor-dashboard' });
      if (userRole === AppRole.LAB_TECH) return next({ name: 'lab-tech-dashboard' });
      if (userRole === AppRole.ADMIN || userRole === AppRole.SUPER_ADMIN) return next({ name: 'admin-dashboard' });
      
      // If role is unknown, clear session and login
      authStore.clearSession();
      return next({ name: 'login' });
    }
  }

  next();
});

export default router;
