<template>
  <div class="flex min-h-screen">
    <!-- ── Left brand panel ─────────────────────────────────────── -->
    <aside
      class="brand-panel relative hidden w-2/5 flex-col justify-between overflow-hidden p-10 lg:flex"
    >
      <!-- Subtle grid overlay -->
      <svg class="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              stroke-width="0.3"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <!-- Top: logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="flex size-9 items-center justify-center rounded-xl bg-white/15">
          <span class="icon-[mdi--hospital-box] text-lg text-white" />
        </div>
        <span class="text-sm font-semibold tracking-wide text-white/80 uppercase">ADHDx HIS</span>
      </div>

      <!-- Center: headline -->
      <div class="relative z-10 space-y-6">
        <div class="space-y-3">
          <p class="text-xs font-semibold tracking-widest text-white/40 uppercase">
            Hospital Information System
          </p>
          <h1 class="text-4xl leading-tight font-bold text-white">
            Clinical decisions,
            <br />
            powered by AI.
          </h1>
          <p class="text-sm leading-relaxed text-white/55">
            Manage patients, analyze EEG signals, and get AI-powered ADHD predictions — all in one
            secure platform.
          </p>
        </div>

        <!-- Feature list -->
        <ul class="space-y-3">
          <li
            v-for="f in features"
            :key="f.label"
            class="flex items-center gap-3 text-sm text-white/70"
          >
            <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/10">
              <span :class="[f.icon, 'text-xs text-white']" />
            </span>
            {{ f.label }}
          </li>
        </ul>
      </div>

      <!-- Bottom: ECG -->
      <div class="relative z-10">
        <svg
          viewBox="0 0 480 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full opacity-30"
          aria-hidden="true"
        >
          <polyline
            class="ecg"
            points="0,20 60,20 75,20 85,6 93,34 99,2 106,36 113,20 180,20 210,20 220,6 228,34 234,2 241,36 248,20 320,20 340,20 350,6 358,34 364,2 371,36 378,20 480,20"
            stroke="white"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </aside>

    <!-- ── Right form panel ──────────────────────────────────────── -->
    <main class="bg-background flex flex-1 flex-col items-center justify-center px-6 py-12">
      <!-- Mobile logo -->
      <div class="mb-10 flex items-center gap-2.5 lg:hidden">
        <div class="bg-primary flex size-8 items-center justify-center rounded-lg">
          <span class="icon-[mdi--hospital-box] text-sm text-white" />
        </div>
        <span class="text-text text-base font-bold">ADHDx HIS</span>
      </div>

      <div class="w-full max-w-sm space-y-8">
        <!-- Heading -->
        <div class="space-y-1.5">
          <h2 class="text-text text-2xl font-bold">Sign in</h2>
          <p class="text-text-secondary text-sm">Select your role, then enter your credentials.</p>
        </div>

        <!-- Role tabs -->
        <div
          class="border-border bg-muted flex rounded-xl border p-1"
          role="group"
          aria-label="Select role"
        >
          <button
            v-for="role in roles"
            :key="role.value"
            type="button"
            class="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all duration-150"
            :class="
              selectedRole === role.value
                ? 'bg-surface text-primary ring-border shadow-sm ring-1'
                : 'text-text-secondary hover:text-text'
            "
            :aria-pressed="selectedRole === role.value"
            @click="selectedRole = role.value"
          >
            <span :class="[role.icon, 'text-sm']" />
            {{ role.label }}
          </button>
        </div>

        <!-- Form -->
        <AppForm
          v-model="formData"
          :fields="fields"
          :schema="schema"
          container-class="space-y-4"
          @submitted="handleLogin"
          @error="handleError"
        >
          <template #actions>
            <AppButton
              type="submit"
              variant="primary"
              :label="`Sign in as ${selectedRoleLabel}`"
              :loading="store.loading"
              loading-label="Signing in…"
              full-width
              size="md"
            />
          </template>
        </AppForm>

        <p class="text-text-secondary text-center text-xs">
          &copy; {{ year }} ADHDx &mdash; Bitxero
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { z } from 'zod';
  import { AppRole } from '../types/enums.types';
  import { AuthStore } from '../stores/auth.store';
  import authService from '../services/auth.service';
  import { useToast } from '../composables/useToast';
  import AppForm from '../components/ui/Fields/AppForm.vue';
  import AppButton from '../components/ui/AppButton.vue';

  const router = useRouter();
  const store = AuthStore();
  const toast = useToast();
  const year = new Date().getFullYear();

  const features = [
    { icon: 'icon-[mdi--waveform]', label: 'EEG signal upload & analysis' },
    { icon: 'icon-[mdi--brain]', label: 'AI-powered ADHD prediction' },
    { icon: 'icon-[mdi--account-heart]', label: 'Full patient lifecycle management' },
    { icon: 'icon-[mdi--shield-check]', label: 'Role-based secure access' },
  ];

  const roles = [
    { label: 'Admin', value: AppRole.ADMIN, icon: 'icon-[mdi--shield-crown-outline]' },
    { label: 'Doctor', value: AppRole.DOCTOR, icon: 'icon-[mdi--stethoscope]' },
    { label: 'Lab Tech', value: AppRole.LAB_TECH, icon: 'icon-[mdi--test-tube]' },
  ];

  const selectedRole = ref(AppRole.ADMIN);
  const selectedRoleLabel = computed(
    () => roles.find((r) => r.value === selectedRole.value)?.label ?? 'User',
  );

  const formData = ref({ username: '', password: '' });

  const fields = [
    [{ key: 'username', type: 'text', label: 'Username', placeholder: 'Enter your username' }],
    [{ key: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password' }],
  ];

  const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  });

  const serviceMap = {
    [AppRole.ADMIN]: authService.adminLogin,
    [AppRole.SUPER_ADMIN]: authService.adminLogin,
    [AppRole.DOCTOR]: authService.doctorLogin,
    [AppRole.LAB_TECH]: authService.labtechLogin,
    [AppRole.PATIENT]: authService.doctorLogin,
    [AppRole.NONE]: authService.adminLogin,
  };

  const handleLogin = async (data) => {
    store.loading = true;
    try {
      const res = await serviceMap[selectedRole.value](data.username, data.password);
      store.setSession(res.data);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      router.push({ name: 'home' });
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      store.loading = false;
    }
  };

  const handleError = () => {
    toast.error('Something went wrong. Please try again.');
  };
</script>

<style scoped>
  /* Brand panel — deep indigo, theme-variable driven */
  .brand-panel {
    background: linear-gradient(
      160deg,
      var(--color-emphasis) 0%,
      color-mix(in srgb, var(--color-emphasis) 70%, var(--color-primary)) 100%
    );
    color: white;
  }

  /* ECG draw animation */
  .ecg {
    stroke-dasharray: 1800;
    stroke-dashoffset: 1800;
    animation: ecg-draw 3s ease-in-out infinite;
  }

  @keyframes ecg-draw {
    0% {
      stroke-dashoffset: 1800;
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    75% {
      stroke-dashoffset: 0;
      opacity: 1;
    }
    90% {
      stroke-dashoffset: 0;
      opacity: 0;
    }
    100% {
      stroke-dashoffset: 1800;
      opacity: 0;
    }
  }
</style>
