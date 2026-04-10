import { defineStore } from 'pinia';
import { ref } from 'vue';
import doctorService from '../services/doctor.service';
import availabilityService from '../services/availability.service';
import educationService from '../services/education.service';
import { extractApiErrorMessage } from '../utils/error';
import type {
  DoctorProfileResponse,
  AvailabilityResponse,
  EducationResponse,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  CreateEducationRequest,
  UpdateEducationRequest,
} from '../types';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<DoctorProfileResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProfile = async (doctorId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const [profileRes, availabilityRes, educationRes] = await Promise.all([
        doctorService.getProfile(doctorId),
        availabilityService.getByDoctorId(doctorId),
        educationService.getByDoctorId(doctorId),
      ]);

      if (profileRes.isSuccess) {
        profile.value = {
          ...profileRes.data,
          availability: availabilityRes.isSuccess ? availabilityRes.data.items : [],
          educations: educationRes.isSuccess ? educationRes.data.items : [],
        };
      }
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (doctorId: string, data: any) => {
    loading.value = true;
    try {
      const res = await doctorService.updateProfile(doctorId, data);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const addAvailability = async (doctorId: string, data: CreateAvailabilityRequest) => {
    loading.value = true;
    try {
      const res = await availabilityService.create(doctorId, data);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateAvailability = async (doctorId: string, slotId: string, data: UpdateAvailabilityRequest) => {
    loading.value = true;
    try {
      const res = await availabilityService.update(doctorId, slotId, data);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteAvailability = async (doctorId: string, slotId: string) => {
    loading.value = true;
    try {
      const res = await availabilityService.delete(doctorId, slotId);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const addEducation = async (doctorId: string, data: CreateEducationRequest) => {
    loading.value = true;
    try {
      const res = await educationService.create(doctorId, data);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateEducation = async (doctorId: string, entryId: string, data: UpdateEducationRequest) => {
    loading.value = true;
    try {
      const res = await educationService.update(doctorId, entryId, data);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteEducation = async (doctorId: string, entryId: string) => {
    loading.value = true;
    try {
      const res = await educationService.delete(doctorId, entryId);
      if (res.isSuccess) {
        await fetchProfile(doctorId);
        return true;
      }
      return false;
    } catch (err: any) {
      error.value = extractApiErrorMessage(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    addAvailability,
    updateAvailability,
    deleteAvailability,
    addEducation,
    updateEducation,
    deleteEducation,
  };
});
