<template>
  <div class="w-full space-y-3">
    <!-- ── Toolbar ────────────────────────────────────────────────────────────────────────────────────────── -->
    <div
      v-if="searchable || showColumnToggle || exportable || $slots['toolbar-end']"
      class="flex w-full flex-wrap items-center justify-between gap-3"
    >
      <div class="flex min-w-0 flex-1 items-center gap-2 sm:max-w-md">
        <!-- Search -->
        <div v-if="searchable" class="relative flex-1">
          <AppIcon
            name="icon-[heroicons-outline--magnifying-glass]"
            :size="1.125"
            class="text-text-secondary pointer-events-none absolute start-3 top-1/2 -translate-y-1/2"
          />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            :placeholder="searchPlaceholder"
            class="border-border bg-surface text-text placeholder:text-text-secondary/60 focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-2 ps-9 pe-9 text-sm transition-all focus:ring-2 focus:outline-none"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="text-text-secondary hover:text-text absolute end-2.5 top-1/2 -translate-y-1/2 transition-colors"
            aria-label="Clear search"
            @click="
              searchQuery = '';
              searchInputRef?.focus();
            "
          >
            <AppIcon name="icon-[heroicons-outline--x-mark]" :size="1" />
          </button>
        </div>

        <!-- Column Toggle -->
        <div v-if="showColumnToggle" ref="columnToggleRef" class="relative">
          <AppButton
            variant="outline"
            size="md"
            icon="icon-[heroicons-outline--view-columns]"
            :label="`${visibleToggleableCount}/${toggleableColumns.length}`"
            class="hidden sm:flex"
            @click="showColumnMenu = !showColumnMenu"
          />
          <AppButton
            variant="outline"
            size="md"
            icon="icon-[heroicons-outline--view-columns]"
            icon-only
            class="sm:hidden"
            @click="showColumnMenu = !showColumnMenu"
          />

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div
              v-if="showColumnMenu"
              class="border-border bg-surface absolute start-0 top-full z-50 mt-1.5 min-w-[14rem] origin-top-left rounded-2xl border p-1.5 shadow-xl shadow-black/8"
            >
              <div class="flex items-center justify-between px-3 py-2">
                <p class="text-text-secondary text-xs font-semibold tracking-wider uppercase">
                  Visible Columns
                </p>
                <span v-if="columnSavedHint" class="text-success text-[10px] font-bold uppercase">
                  Saved
                </span>
              </div>
              <div class="border-border mb-1 border-t" />
              <div class="custom-scrollbar max-h-[60vh] overflow-y-auto py-1">
                <button
                  v-for="col in toggleableColumns"
                  :key="col.key"
                  type="button"
                  class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-all"
                  :class="
                    visibleColumnsSet.has(col.key)
                      ? 'text-text hover:bg-primary/5'
                      : 'text-text-secondary/60 hover:bg-muted'
                  "
                  @click="toggleColumn(col.key)"
                >
                  <span class="font-medium">{{ col.label }}</span>
                  <div
                    class="flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200"
                    :class="visibleColumnsSet.has(col.key) ? 'bg-primary' : 'bg-border'"
                  >
                    <div
                      class="size-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                      :class="visibleColumnsSet.has(col.key) ? 'translate-x-4' : 'translate-x-0'"
                    />
                  </div>
                </button>
              </div>
              <div class="border-border mt-1 border-t" />
              <button
                type="button"
                class="text-text-secondary hover:text-primary mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold transition-colors"
                @click="resetColumnVisibility"
              >
                <AppIcon name="icon-[heroicons-outline--arrow-path]" :size="0.875" />
                Reset to Defaults
              </button>
            </div>
          </Transition>
        </div>

        <!-- Export Button -->
        <AppButton
          v-if="exportable"
          variant="success"
          size="md"
          icon="icon-[heroicons-outline--arrow-down-tray]"
          label="Export"
          class="hidden sm:flex"
          :disabled="loading || displayData.length === 0"
          @click="exportToExcel"
        />
        <AppButton
          v-if="exportable"
          variant="success"
          size="md"
          icon="icon-[heroicons-outline--arrow-down-tray]"
          icon-only
          class="sm:hidden"
          :disabled="loading || displayData.length === 0"
          @click="exportToExcel"
        />
      </div>

      <div class="flex items-center gap-2">
        <slot name="toolbar-end" />
      </div>
    </div>

    <!-- ── Table Wrapper ───────────────────────────────────────────────────────────────────────────────────── -->
    <div
      class="overflow-hidden rounded-2xl transition-all"
      :class="outlined ? 'border-border bg-surface border shadow-sm' : ''"
    >
      <div
        ref="scrollContainerRef"
        class="custom-scrollbar overflow-x-auto"
        style="-webkit-overflow-scrolling: touch"
        @scroll="handleScroll"
      >
        <table
          class="w-full min-w-[48rem] border-collapse"
          :class="[compact ? 'table-compact' : '', !isAtEnd ? 'has-sticky-shadow' : '']"
        >
          <!-- Header -->
          <thead>
            <tr class="bg-muted/40 border-border border-b">
              <!-- Selection Checkbox -->
              <th v-if="selectable" class="w-12 px-4 py-3 text-start">
                <div class="flex items-center justify-center">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isPartiallySelected"
                    class="accent-primary size-4 cursor-pointer rounded-lg"
                    @change="toggleSelectAll"
                  />
                </div>
              </th>

              <th
                v-for="column in visibleColumns"
                :key="column.key"
                class="px-4 py-3 text-start text-xs font-bold tracking-widest uppercase"
                :class="[
                  column.class,
                  column.key === 'actions' ? 'sticky-actions-th w-px' : '',
                  'text-text-secondary',
                ]"
              >
                <button
                  v-if="isColumnSortable(column)"
                  type="button"
                  class="group flex items-center gap-1.5 transition-colors"
                  :class="sortKey === column.key ? 'text-primary' : 'hover:text-text'"
                  @click="handleSort(column.key)"
                >
                  <span>{{ column.label }}</span>
                  <div
                    class="flex size-5 items-center justify-center rounded-lg transition-all"
                    :class="
                      sortKey === column.key
                        ? 'bg-primary scale-110 text-white'
                        : 'bg-muted text-text-secondary opacity-0 group-hover:opacity-100'
                    "
                  >
                    <AppIcon
                      :name="
                        sortKey === column.key && sortOrder === 'desc'
                          ? 'icon-[heroicons--bars-arrow-down]'
                          : 'icon-[heroicons--bars-arrow-up]'
                      "
                      :size="0.75"
                    />
                  </div>
                </button>
                <span v-else>{{ column.label }}</span>
              </th>
            </tr>
          </thead>

          <!-- Body -->
          <tbody>
            <!-- Skeleton loading -->
            <template v-if="loading">
              <tr
                v-for="i in skeletonRows"
                :key="`skeleton-${i}`"
                class="border-border/40 border-b"
              >
                <td v-if="selectable" class="px-4 py-3.5">
                  <div class="bg-muted mx-auto size-4 animate-pulse rounded" />
                </td>
                <td v-for="column in visibleColumns" :key="column.key" class="px-4 py-3.5">
                  <div
                    class="bg-muted h-4 animate-pulse rounded-lg"
                    :class="column.key === 'actions' ? 'ms-auto w-16' : 'w-full max-w-[10rem]'"
                  />
                </td>
              </tr>
            </template>

            <!-- Empty state -->
            <tr v-else-if="displayData.length === 0">
              <td :colspan="visibleColumns.length + (selectable ? 1 : 0)" class="py-20 text-center">
                <div class="flex flex-col items-center gap-4">
                  <div
                    class="bg-muted flex size-16 items-center justify-center rounded-3xl shadow-inner"
                  >
                    <AppIcon
                      name="icon-[heroicons-outline--inbox-stack]"
                      :size="2"
                      class="text-text-secondary/40"
                    />
                  </div>
                  <div class="space-y-1">
                    <p class="text-text text-base font-bold">{{ emptyMessage }}</p>
                    <p v-if="searchQuery" class="text-text-secondary text-sm">
                      No results match "{{ searchQuery }}"
                    </p>
                  </div>
                  <AppButton
                    v-if="searchQuery"
                    variant="outline"
                    label="Clear Search"
                    icon="icon-[heroicons-outline--arrow-path]"
                    size="sm"
                    class="rounded-full"
                    @click="searchQuery = ''"
                  />
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr
              v-for="(row, index) in displayData"
              v-else
              :key="getRowKey(row, index)"
              class="table-row-data group border-border/40 hover:bg-primary/[0.03] border-b transition-all last:border-b-0"
              :class="isRowSelected(row) ? 'bg-primary/[0.05]' : ''"
            >
              <!-- Row Checkbox -->
              <td v-if="selectable" class="w-12 px-4 py-3">
                <div class="flex items-center justify-center">
                  <input
                    type="checkbox"
                    :checked="isRowSelected(row)"
                    class="accent-primary size-4 cursor-pointer rounded-lg"
                    @change="toggleRowSelection(row)"
                  />
                </div>
              </td>

              <td
                v-for="column in visibleColumns"
                :key="column.key"
                class="text-text min-w-0 px-4 py-3 text-sm whitespace-nowrap transition-all"
                :class="[
                  column.class,
                  column.key === 'actions' ? 'sticky-actions-td w-px' : '',
                  isRowSelected(row) ? 'font-medium' : '',
                ]"
              >
                <slot
                  :name="`cell-${column.key}`"
                  :row="row"
                  :value="getValue(row, column.key)"
                  :column="column"
                >
                  <AppTooltip
                    v-if="column.truncate && getValue(row, column.key)"
                    :content="String(getValue(row, column.key))"
                    placement="top"
                    :dark="false"
                  >
                    <span
                      class="text-text-secondary block max-w-[16rem] truncate text-start text-sm"
                    >
                      {{ column.formatter ? column.formatter(getValue(row, column.key)) : display(getValue(row, column.key)) }}
                    </span>
                  </AppTooltip>
                  <template v-else>
                    {{ column.formatter ? column.formatter(getValue(row, column.key)) : display(getValue(row, column.key)) }}
                  </template>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Footer / Pagination ─────────────────────────────────────────────────────────────────────────────── -->
    <div
      v-if="showPagination"
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <!-- Left: Selection Info + Page Size -->
      <div class="flex flex-wrap items-center gap-3">
        <div
          v-if="selectable && selected.length > 0"
          class="bg-primary/10 text-primary ring-primary/20 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1"
        >
          <AppIcon name="icon-[heroicons--check-circle]" :size="0.875" />
          {{ selected.length }} Selected
          <button
            type="button"
            class="hover:text-primary-dark ms-1 underline transition-colors"
            @click="emit('update:selected', [])"
          >
            Clear
          </button>
        </div>

        <span class="text-text-secondary text-sm tabular-nums">
          Showing
          <span class="text-text font-semibold">{{ paginationStart }}</span>
          to
          <span class="text-text font-semibold">{{ paginationEnd }}</span>
          of
          <span class="text-text font-semibold">{{ paginationTotal }}</span>
        </span>

        <!-- Page size selector -->
        <div
          v-if="serverPaginated && pageSizeOptions.length > 0"
          ref="pageSizeRef"
          class="relative"
        >
          <button
            type="button"
            class="border-border bg-surface text-text hover:bg-muted flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition-all"
            @click="showPageSizeMenu = !showPageSizeMenu"
          >
            {{ pageSize }} per page
            <AppIcon
              name="icon-[heroicons--chevron-up-down]"
              :size="0.75"
              class="text-text-secondary"
            />
          </button>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showPageSizeMenu"
              class="border-border bg-surface absolute start-0 bottom-full z-50 mb-1.5 min-w-[6rem] origin-bottom-left rounded-xl border p-1 shadow-lg"
            >
              <button
                v-for="n in pageSizeOptions"
                :key="n"
                type="button"
                class="flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-sm transition-colors"
                :class="
                  n === pageSize
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-text hover:bg-muted'
                "
                @click="selectPageSize(n)"
              >
                {{ n }}
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Right: Pagination Nav -->
      <div class="flex items-center gap-1.5 self-end sm:self-auto">
        <AppButton
          icon="icon-[heroicons-outline--chevron-left]"
          variant="outline"
          size="sm"
          icon-only
          :disabled="!canGoPrev"
          class="rounded-xl shadow-xs"
          @click="goToPrev"
        />

        <div class="flex items-center gap-1">
          <template v-if="!serverPaginated">
            <button
              v-for="p in clientVisiblePages"
              :key="p"
              type="button"
              class="flex size-8 items-center justify-center rounded-xl text-sm font-bold transition-all"
              :class="
                p === clientPage
                  ? 'bg-primary shadow-primary/20 text-white shadow-md'
                  : 'text-text-secondary hover:bg-muted hover:text-text'
              "
              @click="goToPage(p)"
            >
              {{ p }}
            </button>
          </template>
          <div
            v-else
            class="bg-muted/50 border-border flex h-8 items-center gap-2 rounded-xl border px-3 text-sm font-bold tabular-nums shadow-xs"
          >
            <span class="text-text-secondary text-[10px] tracking-widest uppercase">Page</span>
            <span class="text-primary">{{ props.pageNumber }}</span>
            <span class="text-text-secondary">/</span>
            <span class="text-text">{{ props.totalPages || 1 }}</span>
          </div>
        </div>

        <AppButton
          icon="icon-[heroicons-outline--chevron-right]"
          variant="outline"
          size="sm"
          icon-only
          :disabled="!canGoNext"
          class="rounded-xl shadow-xs"
          @click="goToNext"
        />
      </div>
    </div>

    <!-- Expansion Modal -->
    <AppModal
      :is-open="truncateModalOpen"
      :title="truncateModalTitle"
      max-width="sm"
      @close="truncateModalOpen = false"
    >
      <p dir="auto" class="text-text p-4 text-sm leading-relaxed whitespace-pre-wrap">
        {{ truncateModalContent }}
      </p>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { onClickOutside } from '@vueuse/core';
  import { usePagination } from '../../composables/usePagination';
  import { useDebounce } from '../../composables/useDebounce';

  import AppButton from './AppButton.vue';
  import AppIcon from './AppIcon.vue';
  import AppTooltip from './AppTooltip.vue';
  import AppModal from './AppModal.vue';
  import { display } from '../../utils/display';
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  hideable?: boolean;
  defaultHidden?: boolean;
  class?: string;
  truncate?: boolean;
  formatter?: (value: any) => string;
  exportFormatter?: (row: any) => any;
}

  interface Props {
    columns: TableColumn[];
    data: any[];
    loading?: boolean;
    outlined?: boolean;
    compact?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    paginated?: boolean;
    itemsPerPage?: number;
    emptyMessage?: string;
    rowKey?: string | ((row: any) => string | number);
    // Server-side
    serverPaginated?: boolean;
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    // Column control
    showColumnToggle?: boolean;
    columnsVisibilityKey?: string;
    pageSizeOptions?: number[];
    // Controlled Sort
    sortKey?: string | null;
    sortOrder?: 'asc' | 'desc';
    // Selection
    selectable?: boolean;
    selected?: any[]; // list of keys or rows
    // Export
    exportable?: boolean;
    exportFileName?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    outlined: true,
    compact: false,
    searchable: false,
    searchPlaceholder: 'Quick search...',
    paginated: false,
    itemsPerPage: 10,
    emptyMessage: 'No records found',
    rowKey: 'id',
    serverPaginated: false,
    pageNumber: 1,
    pageSize: 15,
    totalCount: 0,
    totalPages: 1,
    showColumnToggle: false,
    columnsVisibilityKey: '',
    pageSizeOptions: () => [10, 15, 25, 50, 100],
    sortKey: null,
    sortOrder: 'asc',
    selectable: false,
    selected: () => [],
    exportable: false,
    exportFileName: 'table-export',
  });

  const emit = defineEmits<{
    pageChange: [payload: { pageNumber: number; pageSize: number }];
    search: [query: string];
    'update:sortKey': [key: string | null];
    'update:sortOrder': [order: 'asc' | 'desc'];
    'update:selected': [rows: any[]];
  }>();

  // ── State ────────────────────────────────────────────────────────────────────────────────────────────
  const searchInputRef = ref<HTMLInputElement | null>(null);
  const scrollContainerRef = ref<HTMLElement | null>(null);
  const searchQuery = ref('');
  const internalSortKey = ref<string | null>(props.sortKey);
  const internalSortOrder = ref<'asc' | 'desc'>(props.sortOrder);
  const isAtEnd = ref(true);

  function handleScroll() {
    if (!scrollContainerRef.value) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.value;
    isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 1;
  }

  watch(
    [() => props.data, scrollContainerRef],
    () => {
      setTimeout(handleScroll, 50);
    },
    { immediate: true },
  );

  // Column toggle popover
  const showColumnMenu = ref(false);
  const columnToggleRef = ref<HTMLElement | null>(null);
  onClickOutside(columnToggleRef, () => {
    showColumnMenu.value = false;
  });

  // Page size menu
  const showPageSizeMenu = ref(false);
  const pageSizeRef = ref<HTMLElement | null>(null);
  onClickOutside(pageSizeRef, () => {
    showPageSizeMenu.value = false;
  });

  // Truncate expansion modal
  const truncateModalOpen = ref(false);
  const truncateModalTitle = ref('');
  const truncateModalContent = ref('');

  // ── Sync External/Internal Sort ──────────────────────────────────────────────────────────────────────
  watch(
    () => props.sortKey,
    (newVal) => (internalSortKey.value = newVal),
  );
  watch(
    () => props.sortOrder,
    (newVal) => (internalSortOrder.value = newVal),
  );

  const sortKey = computed(() => (props.serverPaginated ? props.sortKey : internalSortKey.value));
  const sortOrder = computed(() =>
    props.serverPaginated ? props.sortOrder : internalSortOrder.value,
  );

  // ── Column Visibility Logic ──────────────────────────────────────────────────────────────────────────
  const STORAGE_PREFIX = 'app-table-cols-';

  function loadSavedVisibility(): Record<string, boolean> {
    if (!props.columnsVisibilityKey) return {};
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + props.columnsVisibilityKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  const columnVisibility = ref<Record<string, boolean>>(loadSavedVisibility());
  const columnSavedHint = ref(false);

  const toggleableColumns = computed(() =>
    props.columns.filter((c) => c.hideable !== false && c.key !== 'actions'),
  );

  const visibleColumnsSet = computed(() => {
    const saved = columnVisibility.value;
    const set = new Set<string>();
    for (const col of props.columns) {
      if (col.hideable === false || col.key === 'actions') {
        set.add(col.key);
      } else if (saved[col.key] !== undefined) {
        if (saved[col.key]) set.add(col.key);
      } else if (!col.defaultHidden) {
        set.add(col.key);
      }
    }
    return set;
  });

  const visibleColumns = computed(() =>
    props.columns.filter((c) => visibleColumnsSet.value.has(c.key)),
  );
  const visibleToggleableCount = computed(
    () => toggleableColumns.value.filter((c) => visibleColumnsSet.value.has(c.key)).length,
  );

  function toggleColumn(key: string) {
    const isVisible = visibleColumnsSet.value.has(key);
    if (isVisible && visibleColumnsSet.value.size <= 1) return;

    columnVisibility.value = { ...columnVisibility.value, [key]: !isVisible };
    if (props.columnsVisibilityKey) {
      localStorage.setItem(
        STORAGE_PREFIX + props.columnsVisibilityKey,
        JSON.stringify(columnVisibility.value),
      );
      columnSavedHint.value = true;
      setTimeout(() => (columnSavedHint.value = false), 2000);
    }
  }

  function resetColumnVisibility() {
    columnVisibility.value = {};
    if (props.columnsVisibilityKey)
      localStorage.removeItem(STORAGE_PREFIX + props.columnsVisibilityKey);
  }

  // ── Selection Logic ──────────────────────────────────────────────────────────────────────────────────
  const isRowSelected = (row: any) => {
    const key = getRowKey(row, 0);
    return props.selected.some((s) => (typeof s === 'object' ? getRowKey(s, 0) : s) === key);
  };

  const isAllSelected = computed(() => {
    if (displayData.value.length === 0) return false;
    return displayData.value.every((row) => isRowSelected(row));
  });

  const isPartiallySelected = computed(() => {
    const selectedCount = displayData.value.filter((row) => isRowSelected(row)).length;
    return selectedCount > 0 && selectedCount < displayData.value.length;
  });

  function toggleRowSelection(row: any) {
    const key = getRowKey(row, 0);
    let newSelected = [...props.selected];

    if (isRowSelected(row)) {
      newSelected = newSelected.filter(
        (s) => (typeof s === 'object' ? getRowKey(s, 0) : s) !== key,
      );
    } else {
      newSelected.push(props.rowKey === 'id' ? row.id : row);
    }
    emit('update:selected', newSelected);
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      emit('update:selected', []);
    } else {
      emit('update:selected', [...displayData.value]);
    }
  }

  // ── Export Logic ─────────────────────────────────────────────────────────────────────────────────────
  const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
    completed:  { text: 'FF166534', bg: 'FFD1FAE5' },
    active:     { text: 'FF1D4ED8', bg: 'FFDBEAFE' },
    inactive:   { text: 'FF4B5563', bg: 'FFF3F4F6' },
    pending:    { text: 'FFB45309', bg: 'FFFEF3C7' },
    control:    { text: 'FF6D28D9', bg: 'FFEDE9FE' },
    cancelled:  { text: 'FF991B1B', bg: 'FFFEE2E2' },
    approved:   { text: 'FF166534', bg: 'FFD1FAE5' },
    rejected:   { text: 'FF991B1B', bg: 'FFFEE2E2' },
    done:       { text: 'FF166534', bg: 'FFD1FAE5' },
    open:       { text: 'FF1D4ED8', bg: 'FFDBEAFE' },
    closed:     { text: 'FF4B5563', bg: 'FFF3F4F6' },
  };

  async function exportToExcel() {
    const itemsToExport = props.selected.length > 0 ? props.selected : displayData.value;
    if (itemsToExport.length === 0) return;

    const exportCols = visibleColumns.value.filter((c) => c.key !== 'actions');

    const { default: ExcelJS } = await import('exceljs');
    const wb = new ExcelJS.Workbook();
    wb.creator = 'AppTable';
    wb.created = new Date();

    const ws = wb.addWorksheet('Data');

    // ── Columns (initial widths from header label) ────────────────────────
    ws.columns = exportCols.map((col) => ({
      key: col.key,
      width: Math.max(col.label.length + 4, 12),
    }));

    // ── Header row ────────────────────────────────────────────────────────
    const headerRow = ws.addRow(exportCols.map((c) => c.label));
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill   = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
      cell.font   = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11, name: 'Calibri' };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF3730A3' } },
      };
    });

    // ── Data rows ─────────────────────────────────────────────────────────
    itemsToExport.forEach((row, rowIdx) => {
      const values = exportCols.map((col) => {
        if (col.exportFormatter) return display(col.exportFormatter(row), '');
        const val = getValue(row, col.key);
        if (col.formatter) return col.formatter(val);
        return display(val, '');
      });

      const excelRow = ws.addRow(values);
      excelRow.height = 22;

      const isEven = rowIdx % 2 === 0;
      const rowBg = isEven ? 'FFFFFFFF' : 'FFF8F9FF';

      excelRow.eachCell({ includeEmpty: true }, (cell, colIdx) => {
        const cellStr = String(cell.value ?? '');
        const statusKey = cellStr.toLowerCase();
        const statusStyle = STATUS_COLORS[statusKey];

        if (statusStyle) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusStyle.bg } };
          cell.font = { bold: true, color: { argb: statusStyle.text }, size: 10, name: 'Calibri' };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
          cell.font = { size: 10, color: { argb: 'FF1F2937' }, name: 'Calibri' };
          cell.alignment = { vertical: 'middle', horizontal: 'left' };
        }

        cell.border = {
          top:    { style: 'hair', color: { argb: 'FFE5E7EB' } },
          bottom: { style: 'hair', color: { argb: 'FFE5E7EB' } },
          left:   { style: 'hair', color: { argb: 'FFE5E7EB' } },
          right:  { style: 'hair', color: { argb: 'FFE5E7EB' } },
        };

        // Auto-fit: widen column if cell content is wider
        const wsCol = ws.getColumn(colIdx);
        const contentWidth = cellStr.length + 4;
        if (contentWidth > (wsCol.width ?? 0)) {
          wsCol.width = Math.min(contentWidth, 60);
        }
      });
    });

    // Freeze header + auto-filter
    ws.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A2' }];
    ws.autoFilter = {
      from: { row: 1, column: 1 },
      to:   { row: 1, column: exportCols.length },
    };

    // ── Download ──────────────────────────────────────────────────────────
    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${props.exportFileName}-${new Date().toISOString().split('T')[0]}.xlsx`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ── Row Helpers ──────────────────────────────────────────────────────────────────────────────────────
  const getRowKey = (row: any, index: number): string | number => {
    if (typeof props.rowKey === 'function') return props.rowKey(row);
    return row[props.rowKey] ?? index;
  };

  const getValue = (row: any, key: string): any => {
    return key.split('.').reduce((obj, k) => obj?.[k], row) ?? '';
  };

  // ── Sorting ─────────────────────────────────────────────────────────────────────────────────────────
  const isColumnSortable = (col: TableColumn) => col.sortable !== false;

  function handleSort(key: string) {
    let nextOrder: 'asc' | 'desc' = 'asc';
    let nextKey: string | null = key;

    if (sortKey.value === key) {
      if (sortOrder.value === 'asc') nextOrder = 'desc';
      else nextKey = null;
    }

    if (props.serverPaginated) {
      emit('update:sortKey', nextKey);
      emit('update:sortOrder', nextOrder);
    } else {
      internalSortKey.value = nextKey;
      internalSortOrder.value = nextOrder;
    }
  }

  const parseSortVal = (v: any) => {
    if (v == null || v === '') return '';
    if (typeof v === 'number') return v;
    const d = Date.parse(v);
    if (!isNaN(d)) return d;
    return String(v).toLowerCase();
  };

  // ── Data Processing ─────────────────────────────────────────────────────────────────────────────────
  const processedData = computed(() => {
    if (props.serverPaginated) return props.data;
    let result = [...props.data];
    if (props.searchable && searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      result = result.filter((row) =>
        props.columns.some((col) => String(getValue(row, col.key)).toLowerCase().includes(q)),
      );
    }
    if (internalSortKey.value) {
      result.sort((a, b) => {
        const vA = parseSortVal(getValue(a, internalSortKey.value!));
        const vB = parseSortVal(getValue(b, internalSortKey.value!));
        if (vA === vB) return 0;
        const cmp = vA < vB ? -1 : 1;
        return internalSortOrder.value === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  });

  // ── Client Pagination ───────────────────────────────────────────────────────────────────────────────
  const clientPag = usePagination({
    total: computed(() => processedData.value.length),
    pageSize: computed(() => props.itemsPerPage),
  });

  const clientPage = clientPag.page;
  const clientVisiblePages = clientPag.visiblePages;

  const displayData = computed(() => {
    if (props.serverPaginated) return props.data;
    return props.paginated ? clientPag.paginate(processedData.value) : processedData.value;
  });

  // ── Unified Pagination Display ──────────────────────────────────────────────────────────────────────
  const showPagination = computed(() => {
    if (props.serverPaginated) return props.totalCount > 0;
    return props.paginated && processedData.value.length > props.itemsPerPage;
  });

  const paginationTotal = computed(() =>
    props.serverPaginated ? props.totalCount : processedData.value.length,
  );
  const paginationStart = computed(() => {
    if (paginationTotal.value === 0) return 0;
    const page = props.serverPaginated ? props.pageNumber : clientPage.value;
    const size = props.serverPaginated ? props.pageSize : props.itemsPerPage;
    return (page - 1) * size + 1;
  });
  const paginationEnd = computed(() => {
    const size = props.serverPaginated ? props.pageSize : props.itemsPerPage;
    return Math.min(paginationStart.value + displayData.value.length - 1, paginationTotal.value);
  });

  const canGoPrev = computed(
    () => (props.serverPaginated ? props.pageNumber : clientPage.value) > 1,
  );
  const canGoNext = computed(() => {
    const current = props.serverPaginated ? props.pageNumber : clientPage.value;
    const total = props.serverPaginated ? props.totalPages : clientPag.totalPages.value;
    return current < total;
  });

  function goToPrev() {
    if (props.serverPaginated)
      emit('pageChange', { pageNumber: props.pageNumber - 1, pageSize: props.pageSize });
    else clientPag.prev();
  }

  function goToNext() {
    if (props.serverPaginated)
      emit('pageChange', { pageNumber: props.pageNumber + 1, pageSize: props.pageSize });
    else clientPag.next();
  }

  function goToPage(p: number) {
    clientPag.goTo(p);
  }

  function selectPageSize(size: number) {
    showPageSizeMenu.value = false;
    emit('pageChange', { pageNumber: 1, pageSize: size });
  }

  // ── Watchers ─────────────────────────────────────────────────────────────────────────────────────────
  watch(
    () => props.data,
    () => {
      if (!props.serverPaginated) clientPag.first();
    },
  );
  const debouncedSearch = useDebounce(searchQuery, 500);
  watch(debouncedSearch, (q) => {
    if (props.serverPaginated) emit('search', q ?? '');
  });

  const skeletonRows = computed(() =>
    Math.min(props.serverPaginated ? props.pageSize : props.itemsPerPage, 10),
  );
</script>

<style scoped>
  .sticky-actions-th,
  .sticky-actions-td {
    position: sticky;
    inset-inline-end: 0;
  }

  .sticky-actions-th {
    z-index: 11;
    background: color-mix(in srgb, var(--color-muted, #f3f4f6) 80%, transparent);
  }

  .sticky-actions-td {
    z-index: 10;
    background: var(--color-surface, #fff);
  }

  tr:hover > .sticky-actions-td {
    background: color-mix(in srgb, var(--color-primary, #3b82f6) 3%, var(--color-surface, #fff));
  }

  .has-sticky-shadow .sticky-actions-th::before,
  .has-sticky-shadow .sticky-actions-td::before {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: -1rem;
    bottom: 0;
    width: 1rem;
    pointer-events: none;
    background: linear-gradient(to right, transparent, rgb(0 0 0 / 0.03));
  }

  .table-row-data {
    position: relative;
    z-index: 0;
  }

  .table-row-data:hover {
    z-index: 12;
  }

  .table-compact td,
  .table-compact th {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .custom-scrollbar::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--color-text-secondary);
  }
</style>
