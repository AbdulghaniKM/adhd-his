<template>
  <div v-if="eegStore.currentTest" class="mx-auto max-w-7xl space-y-8 p-6">
    <!-- Header: Test Info & Breadcrumbs -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <AppButton variant="ghost" icon="icon-[heroicons-outline--arrow-left]" @click="router.back()" />
        <div>
          <h1 class="text-text text-2xl font-bold tracking-tight">EEG Test Details</h1>
          <p class="text-text-secondary text-sm">Patient: {{ eegStore.currentTest.patient.firstName }} {{ eegStore.currentTest.patient.lastName }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span
          class="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ring-1 ring-inset"
          :class="eegStatusClasses[eegStore.currentTest.status]"
        >
          {{ mapEegTestStatus(eegStore.currentTest.status) }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Left Column: Test & Patient Info -->
      <div class="space-y-8 lg:col-span-1">
        <div class="bg-surface border-border overflow-hidden rounded-3xl border shadow-sm">
          <div class="bg-primary/5 p-6 pb-4">
            <h3 class="text-text text-sm font-bold uppercase tracking-widest opacity-60">Test Summary</h3>
          </div>
          <div class="p-6 pt-2">
            <dl class="space-y-4">
              <div>
                <dt class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Test Date</dt>
                <dd class="text-text font-semibold">{{ formatDate(eegStore.currentTest.testDate, true) }}</dd>
              </div>
              <div>
                <dt class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Ordering Doctor</dt>
                <dd class="text-text font-semibold">Dr. {{ eegStore.currentTest.doctor.firstName }} {{ eegStore.currentTest.doctor.lastName }}</dd>
              </div>
              <div>
                <dt class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Laboratory / Unit</dt>
                <dd class="text-text font-semibold">{{ eegStore.currentTest.lab?.name || 'In-clinic / Mobile Unit' }}</dd>
              </div>
              <div v-if="eegStore.currentTest.notes">
                <dt class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Clinical Notes</dt>
                <dd class="text-text text-sm italic">{{ eegStore.currentTest.notes }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- File Upload Section (Only if not analyzed/cancelled) -->
        <div v-if="[0, 1].includes(eegStore.currentTest.status)" class="bg-surface border-border overflow-hidden rounded-3xl border shadow-sm">
          <div class="bg-primary/5 p-6 pb-4">
            <h3 class="text-text text-sm font-bold uppercase tracking-widest opacity-60">Upload EEG Data</h3>
          </div>
          <div class="p-6">
            <div
              class="border-border bg-muted/30 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed py-8 text-center transition-all hover:bg-muted/50"
              @click="fileInput?.click()"
            >
              <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFileUpload" />
              <div class="bg-primary/10 text-primary mb-3 flex size-12 items-center justify-center rounded-xl">
                <AppIcon name="icon-[heroicons-outline--cloud-arrow-up]" :size="1.5" />
              </div>
              <p class="text-text text-sm font-bold">Click to select CSV file</p>
              <p class="text-text-secondary text-[10px] mt-1">Maximum size: 200 MB</p>
            </div>
            
            <div v-if="uploadProgress" class="mt-4 space-y-2">
              <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div class="bg-primary h-full transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
              </div>
              <p class="text-text-secondary text-center text-xs">Uploading... {{ uploadProgress }}%</p>
            </div>

            <div v-if="eegStore.uploads.length" class="mt-8 space-y-4">
              <h4 class="text-text text-xs font-bold uppercase tracking-wider">File History</h4>
              <div v-for="file in eegStore.uploads" :key="file.id" class="bg-muted/30 flex items-center justify-between rounded-xl p-3">
                <div class="flex items-center gap-3">
                  <AppIcon name="icon-[heroicons-outline--document-text]" class="text-text-secondary opacity-60" />
                  <div>
                    <p class="text-text text-xs font-medium">EEG_Data_{{ file.id.slice(0, 5) }}.csv</p>
                    <p class="text-text-secondary text-[10px]">{{ formatDate(file.uploadedAt, true) }}</p>
                  </div>
                </div>
                <AppIcon name="icon-[heroicons-outline--check-circle]" class="text-success" />
              </div>
            </div>
          </div>
        </div>

        <!-- Analysis Trigger -->
        <div v-if="eegStore.currentTest.status === 1" class="bg-primary/5 border-primary/20 rounded-3xl border p-6 text-center">
          <p class="text-text-secondary mb-4 text-xs italic">Data uploaded. Trigger the AI analysis to get ADHD screening results.</p>
          <AppButton
            variant="primary"
            label="Run AI Analysis"
            icon="icon-[heroicons-outline--bolt]"
            full-width
            :loading="isAnalyzing"
            @click="handleAnalyze"
          />
        </div>
      </div>

      <!-- Right Column: AI Results Dashboard -->
      <div class="space-y-8 lg:col-span-2">
        <div v-if="eegStore.currentTest.status === 3" class="space-y-8">
          <!-- Main Prediction Card -->
          <div class="bg-surface border-border overflow-hidden rounded-3xl border shadow-lg transition-all hover:shadow-xl">
            <div class="flex flex-col md:flex-row">
              <div class="flex flex-1 flex-col justify-center p-8">
                <p class="text-text-secondary text-xs font-bold uppercase tracking-widest opacity-60">AI Screening Result</p>
                <h2 class="text-text mt-2 text-4xl font-black tracking-tight uppercase">
                  {{ mapAdhdPrediction(eegStore.currentTest.prediction) }}
                </h2>
                <p class="text-text-secondary mt-2 text-sm leading-relaxed">
                  Based on {{ eegStore.currentTest.segmentsAnalyzed }} EEG segments analyzed using the EEGNet model.
                </p>
                
                <div class="mt-8 grid grid-cols-2 gap-6 border-t border-border/50 pt-8">
                  <div>
                    <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">ADHD Probability</p>
                    <p class="text-text text-3xl font-black tabular-nums">{{ (eegStore.currentTest.adhdProbability! * 100).toFixed(1) }}<span class="text-sm font-medium opacity-60">%</span></p>
                  </div>
                  <div>
                    <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Theta/Beta Ratio</p>
                    <p class="text-text text-3xl font-black tabular-nums">{{ eegStore.currentTest.thetaBetaRatio?.toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Visual Probability Gauge (CSS-based) -->
              <div class="bg-primary/5 flex items-center justify-center p-8 md:w-64">
                <div class="relative flex size-40 items-center justify-center">
                  <svg class="size-full rotate-[-90deg]">
                    <circle cx="80" cy="80" r="70" class="stroke-muted fill-none" stroke-width="12" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      class="fill-none transition-all duration-1000"
                      :class="eegStore.currentTest.prediction === 0 ? 'stroke-error' : 'stroke-success'"
                      stroke-width="12"
                      stroke-dasharray="440"
                      :stroke-dashoffset="440 - (440 * (eegStore.currentTest.adhdProbability || 0))"
                      stroke-linecap="round"
                    />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span class="text-text text-3xl font-black">{{ (eegStore.currentTest.adhdProbability! * 100).toFixed(0) }}%</span>
                    <span class="text-text-secondary text-[8px] font-bold uppercase opacity-60">ADHD Prob.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Segment Statistics -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="bg-surface border-border rounded-3xl border p-6 shadow-sm">
              <h4 class="text-text mb-4 text-sm font-bold uppercase tracking-wider opacity-60">Segment Analysis</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-text-secondary text-xs">Total Segments</span>
                  <span class="text-text font-black">{{ eegStore.currentTest.segmentsAnalyzed }}</span>
                </div>
                <div class="bg-muted h-2 w-full overflow-hidden rounded-full flex">
                   <div class="bg-error h-full" :style="{ width: `${(eegStore.currentTest.adhdSegments! / eegStore.currentTest.segmentsAnalyzed!) * 100}%` }"></div>
                   <div class="bg-success h-full" :style="{ width: `${(eegStore.currentTest.controlSegments! / eegStore.currentTest.segmentsAnalyzed!) * 100}%` }"></div>
                </div>
                <div class="flex items-center justify-between pt-2">
                  <div class="flex items-center gap-2">
                    <div class="bg-error size-2.5 rounded-full"></div>
                    <span class="text-text-secondary text-[10px] font-bold">ADHD ({{ eegStore.currentTest.adhdSegments }})</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="bg-success size-2.5 rounded-full"></div>
                    <span class="text-text-secondary text-[10px] font-bold">Control ({{ eegStore.currentTest.controlSegments }})</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-surface border-border rounded-3xl border p-6 shadow-sm">
              <h4 class="text-text mb-4 text-sm font-bold uppercase tracking-wider opacity-60">Analysis Timestamp</h4>
              <div class="flex items-center gap-4 py-4">
                <div class="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                  <AppIcon name="icon-[heroicons-outline--calendar-days]" :size="1.5" />
                </div>
                <div>
                  <p class="text-text font-bold">{{ formatDate(eegStore.currentTest.analyzedAt!, true) }}</p>
                  <p class="text-text-secondary text-xs italic">DSS Version 4.2 (EEGNet-19)</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Spectral Power Card -->
          <div class="bg-surface border-border rounded-3xl border p-8 shadow-sm">
             <h4 class="text-text mb-8 text-sm font-bold uppercase tracking-wider opacity-60">Spectral Power Density (μV²/Hz)</h4>
             <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
               <div class="space-y-2">
                 <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Delta (0.5–4 Hz)</p>
                 <p class="text-text text-2xl font-black">{{ eegStore.currentTest.deltaPower?.toFixed(1) }}</p>
                 <div class="bg-muted h-1 rounded-full"><div class="bg-indigo-500 h-full" style="width: 60%"></div></div>
               </div>
               <div class="space-y-2">
                 <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Theta (4–8 Hz)</p>
                 <p class="text-text text-2xl font-black">{{ eegStore.currentTest.thetaPower?.toFixed(1) }}</p>
                 <div class="bg-muted h-1 rounded-full"><div class="bg-blue-500 h-full" style="width: 80%"></div></div>
               </div>
               <div class="space-y-2">
                 <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Alpha (8–12 Hz)</p>
                 <p class="text-text text-2xl font-black">{{ eegStore.currentTest.alphaPower?.toFixed(1) }}</p>
                 <div class="bg-muted h-1 rounded-full"><div class="bg-green-500 h-full" style="width: 45%"></div></div>
               </div>
               <div class="space-y-2">
                 <p class="text-text-secondary text-[10px] font-bold tracking-widest uppercase opacity-60">Beta (13–30 Hz)</p>
                 <p class="text-text text-2xl font-black">{{ eegStore.currentTest.betaPower?.toFixed(1) }}</p>
                 <div class="bg-muted h-1 rounded-full"><div class="bg-amber-500 h-full" style="width: 30%"></div></div>
               </div>
             </div>
          </div>
        </div>

        <!-- Waiting for data state -->
        <div v-else-if="eegStore.currentTest.status === 0" class="bg-surface border-border flex flex-col items-center justify-center rounded-3xl border py-32 text-center shadow-sm">
           <div class="bg-muted text-text-secondary mb-6 flex size-20 items-center justify-center rounded-full opacity-40">
             <AppIcon name="icon-[heroicons-outline--document-arrow-up]" :size="3" />
           </div>
           <h3 class="text-text text-xl font-black tracking-tight">Awaiting EEG Data</h3>
           <p class="text-text-secondary mx-auto mt-2 max-w-xs text-sm">Please upload the 19-channel CSV file from the EEG recording to begin the AI analysis.</p>
        </div>

        <!-- Processing state -->
        <div v-else-if="eegStore.currentTest.status === 1 || eegStore.currentTest.status === 2" class="bg-surface border-border flex flex-col items-center justify-center rounded-3xl border py-32 text-center shadow-sm">
           <div class="mb-6">
             <AppSpinner size="lg" />
           </div>
           <h3 class="text-text text-xl font-black tracking-tight">Analysis in Progress</h3>
           <p class="text-text-secondary mx-auto mt-2 max-w-xs text-sm">The Decision Support System is analyzing the signal for markers of ADHD. This usually takes less than 60 seconds.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useEegTestStore } from '../../stores/eeg-test.store';
  import { useEnums } from '../../composables/useEnums';
  import { formatDate } from '../../utils/format-date';
  import { useToast } from '../../composables/useToast';
  import AppButton from '../../components/ui/AppButton.vue';
  import AppIcon from '../../components/ui/AppIcon.vue';
  import AppSpinner from '../../components/ui/AppSpinner.vue';

  const route = useRoute();
  const router = useRouter();
  const eegStore = useEegTestStore();
  const { mapEegTestStatus, mapAdhdPrediction } = useEnums();
  const { success, error } = useToast();

  const testId = route.params.id as string;
  const fileInput = ref<HTMLInputElement | null>(null);
  const uploadProgress = ref(0);
  const isAnalyzing = ref(false);

  onMounted(async () => {
    await eegStore.fetchTestById(testId);
    await eegStore.fetchUploads(testId);
  });

  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      const file = target.files[0];
      if (!file.name.endsWith('.csv')) {
        error('Please upload a valid CSV file');
        return;
      }
      
      // Artificial progress for better UX
      uploadProgress.value = 10;
      const res = await eegStore.uploadCSV(testId, file);
      uploadProgress.value = 100;
      
      if (res) {
        success('EEG data uploaded successfully');
        uploadProgress.value = 0;
      } else {
        error(eegStore.error || 'Upload failed');
        uploadProgress.value = 0;
      }
    }
  };

  const handleAnalyze = async () => {
    isAnalyzing.value = true;
    const res = await eegStore.analyze(testId);
    isAnalyzing.value = false;
    
    if (res) {
      success('AI Analysis completed successfully');
    } else {
      error(eegStore.error || 'Analysis failed');
    }
  };

  const eegStatusClasses: Record<number, string> = {
    0: 'bg-blue-500/10 text-blue-500 ring-blue-500/30',
    1: 'bg-amber-500/10 text-amber-500 ring-amber-500/30',
    2: 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/30',
    3: 'bg-green-500/10 text-green-500 ring-green-500/30',
    4: 'bg-error/10 text-error ring-error/30',
  };
</script>
