<template>
  <div class="space-y-6 p-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-text text-2xl font-bold">EEG ADHD Screening</h1>
        <p class="text-text-secondary text-sm">Monitor and manage diagnostic EEG tests across the hospital</p>
      </div>
    </div>

    <AppTable
      :columns="columns"
      :data="eegStore.tests"
      :loading="eegStore.loading"
      searchable
      search-placeholder="Search tests..."
      server-paginated
      :page-number="eegStore.pageNumber"
      :page-size="eegStore.pageSize"
      :total-count="eegStore.totalCount"
      :total-pages="eegStore.totalPages"
      @page-change="handlePageChange"
    >
      <template #cell-patient="{ row }">
        <div class="flex items-center gap-2">
          <span class="text-text font-medium">{{ row.patient.firstName }} {{ row.patient.lastName }}</span>
        </div>
      </template>

      <template #cell-doctor="{ row }">
        <span class="text-text-secondary text-xs">Dr. {{ row.doctor.firstName }} {{ row.doctor.lastName }}</span>
      </template>

      <template #cell-status="{ value }">
        <span
          class="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset"
          :class="eegStatusClasses[value]"
        >
          {{ mapEegTestStatus(value) }}
        </span>
      </template>

      <template #cell-prediction="{ value }">
        <span v-if="value !== null" class="font-bold" :class="value === 0 ? 'text-error' : 'text-success'">
          {{ mapAdhdPrediction(value) }}
        </span>
        <span v-else class="text-text-secondary italic opacity-40">—</span>
      </template>

      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <AppButton
            variant="ghost"
            size="sm"
            icon="icon-[heroicons-outline--eye]"
            icon-only
            tooltip="View Details"
            @click="navigateToDetails(row.id)"
          />
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useEegTestStore } from '../../stores/eeg-test.store';
  import { AuthStore } from '../../stores/auth.store';
  import { useEnums } from '../../composables/useEnums';
  import { formatDate } from '../../utils/format-date';
  import AppTable from '../../components/ui/AppTable.vue';
  import AppButton from '../../components/ui/AppButton.vue';
  import { AppRole } from '../../types/enums.types';
  import type { TableColumn } from '../../components/ui/AppTable.vue';

  const eegStore = useEegTestStore();
  const authStore = AuthStore();
  const router = useRouter();
  const { mapEegTestStatus, mapAdhdPrediction } = useEnums();

  const columns: TableColumn[] = [
    { key: 'testDate', label: 'Test Date', sortable: true, formatter: (v) => formatDate(v, true) },
    { key: 'patient', label: 'Patient' },
    { key: 'doctor', label: 'Ordering Doctor' },
    { key: 'lab.name', label: 'Laboratory' },
    { key: 'status', label: 'Status' },
    { key: 'prediction', label: 'AI Result' },
    { key: 'actions', label: 'Actions', class: 'text-end' },
  ];

  const eegStatusClasses: Record<number, string> = {
    0: 'bg-blue-500/10 text-blue-500 ring-blue-500/30',
    1: 'bg-amber-500/10 text-amber-500 ring-amber-500/30',
    2: 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/30',
    3: 'bg-green-500/10 text-green-500 ring-green-500/30',
    4: 'bg-error/10 text-error ring-error/30',
  };

  onMounted(() => {
    eegStore.fetchTests();
  });

  const handlePageChange = (payload: any) => {
    eegStore.fetchTests(payload);
  };

  const navigateToDetails = (id: string) => {
    let prefix = 'admin';
    if (authStore.role === AppRole.DOCTOR) prefix = 'doctor';
    if (authStore.role === AppRole.LAB_TECH) prefix = 'lab-tech';
    router.push({ name: `${prefix}-eeg-test-details`, params: { id } });
  };
</script>
