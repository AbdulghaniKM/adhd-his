import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import enumService from '../services/enum.service';
import type { EnumItem } from '../types/enum';

export const useEnumStore = defineStore('enum', () => {
  const enums = ref<any>({
    appRoles: [],
    gender: [],
    weekDays: [],
    bloodType: [],
    patientStatus: [],
    allergySeverity: [],
    appointmentType: [],
    appointmentStatus: [],
    eegTestStatus: [],
    adhdPrediction: [],
  });

  const loading = ref(false);
  const initialized = ref(false);

  const CACHE_KEY = 'app_enums_cache';
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  const fetchAllEnums = async (force = false) => {
    // 1. Try to load from cache first
    if (!force) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
          
          if (!isExpired) {
            enums.value = data;
            initialized.value = true;
            return;
          }
        } catch (err) {
          console.error('Failed to parse enum cache:', err);
        }
      }
    }

    // 2. Fetch from API if no cache or expired/forced
    loading.value = true;
    try {
      const data = await enumService.fetchAll();
      enums.value = data;
      initialized.value = true;
      
      // Save to cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Failed to fetch enums:', err);
    } finally {
      loading.value = false;
    }
  };

  // Helper to get a label map for a specific enum key
  const getMap = (key: string) => {
    const map: Record<number | string, string> = {};
    (enums.value[key] || []).forEach((item: EnumItem) => {
      map[item.id] = item.value;
      // Also map by name if needed for string enums like AppRole
      map[item.name] = item.value;
    });
    return map;
  };

  return {
    enums,
    loading,
    initialized,
    fetchAllEnums,
    getMap,
  };
});
