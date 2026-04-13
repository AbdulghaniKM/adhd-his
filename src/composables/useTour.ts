import { driver } from 'driver.js';
import type { DriveStep } from 'driver.js';
import { useRoute } from 'vue-router';

export function useTour() {
  const route = useRoute();

  const defaultOptions = {
    showProgress: true,
    animate: true,
    padding: 12,
    allowClose: true,
    overlayColor: '#0f172a',
    overlayOpacity: 0.85,
    stageRadius: 16,
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    doneBtnText: 'Finish',
  };

  const startTour = (steps: DriveStep[]) => {
    const driverObj = driver({
      ...defaultOptions,
      steps,
    });

    driverObj.drive();
  };

  /**
   * Universal Contextual Tour Dispatcher
   * Maps current route names to specific onboarding steps.
   */
  const startContextualTour = () => {
    const name = String(route.name);

    // 1. Dashboards
    if (name.includes('admin-dashboard')) return startAdminDashboardTour();
    if (name.includes('doctor-dashboard')) return startDoctorDashboardTour();
    if (name.includes('lab-tech-dashboard')) return startLabTechDashboardTour();

    // 2. User Management
    if (name.includes('admin-admins')) return startAdminListTour();
    if (name.includes('admin-doctors')) return startDoctorListTour();
    if (name.includes('admin-lab-techs')) return startStaffListTour();

    // 3. Clinical Data
    if (name.includes('patients') && !name.includes('profile')) return startPatientListTour();
    if (name.includes('patient-profile')) return startPatientProfileTour();
    if (name.includes('appointments')) return startAppointmentTour();

    // 4. Laboratory & EEG
    if (name.includes('eeg-tests') && !name.includes('details')) return startEegListTour();
    if (name.includes('eeg-test-details')) return startEegDetailsTour();
    if (name.includes('labs')) return startLabListTour();
    if (name.includes('departments')) return startDeptListTour();

    // 5. Settings
    if (name.includes('settings')) return startSettingsTour();

    // Fallback: Default Welcome
    startTour([
      {
        element: 'aside',
        popover: { 
          title: 'System Navigation', 
          description: 'Use the sidebar to explore different sections of the ADHDx system.', 
          side: 'right' 
        }
      }
    ]);
  };

  // --- Specific Tour Steps ---

  const startAdminDashboardTour = () => {
    startTour([
      { popover: { title: 'Admin Hub', description: 'Monitor the entire ADHDx ecosystem from this central hub.', side: 'bottom' } },
      { element: '.grid-cols-1.gap-6', popover: { title: 'Live Metrics', description: 'Real-time counts of staff, patients, appointments, and units.', side: 'bottom' } },
      { element: '.bg-surface.border-border\\/40.space-y-6', popover: { title: 'Shortcuts', description: 'Quick access to key management tasks.', side: 'left' } }
    ]);
  };

  const startAdminListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'System Admins', description: 'Manage top-level administrators and their access status.', side: 'bottom' } },
      { element: 'button.variant-primary', popover: { title: 'New Admin', description: 'Add a new administrative user to the system.', side: 'left' } }
    ]);
  };

  const startDoctorListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'Clinical Staff', description: 'Manage doctor profiles, specialties, and experience levels.', side: 'bottom' } },
      { element: '.app-table', popover: { title: 'Staff Roster', description: 'View and edit doctor details or clinical departments.', side: 'top' } }
    ]);
  };

  const startStaffListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'Laboratory Technicians', description: 'Manage technical staff assigned to laboratory units.', side: 'bottom' } }
    ]);
  };

  const startPatientListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'Patient Registry', description: 'Search and manage all registered patients.', side: 'bottom' } },
      { element: 'button.variant-primary', popover: { title: 'Registration', description: 'Click here to add a new patient to the clinic.', side: 'left' } }
    ]);
  };

  const startPatientProfileTour = () => {
    startTour([
      { element: '.bg-surface.border-border', popover: { title: 'Medical Record', description: 'Full view of patient vitals, history, and allergies.', side: 'bottom' } },
      { element: '.app-tabs', popover: { title: 'Navigation', description: 'Switch between clinical logs and ADHD screening tests.', side: 'bottom' } }
    ]);
  };

  const startAppointmentTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'Central Calendar', description: 'Track all patient visits and diagnostic schedules.', side: 'bottom' } },
      { element: '.app-table', popover: { title: 'Status Tracking', description: 'Monitor confirmed, checked-in, and completed visits.', side: 'top' } }
    ]);
  };

  const startLabListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'Laboratory Units', description: 'Manage clinical units and diagnostic facilities.', side: 'bottom' } }
    ]);
  };

  const startDeptListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'Departments', description: 'Organize medical staff into clinical departments.', side: 'bottom' } }
    ]);
  };

  const startEegListTour = () => {
    startTour([
      { element: '.text-2xl', popover: { title: 'EEG Screening Hub', description: 'Monitor ADHD diagnostic tests across the facility.', side: 'bottom' } }
    ]);
  };

  const startEegDetailsTour = () => {
    startTour([
      { element: '.lg\\:col-span-1', popover: { title: 'Test Summary', description: 'Clinical context and target lab for this specific study.', side: 'right' } },
      { element: '.border-dashed', popover: { title: 'Signal Upload', description: 'Upload the 19-channel EEG CSV file for AI analysis.', side: 'right' } },
      { element: '.lg\\:col-span-2', popover: { title: 'AI Results', description: 'Deep-dive into ADHD probability and spectral band powers.', side: 'left' } }
    ]);
  };

  const startSettingsTour = () => {
    startTour([
      { element: '.space-y-8', popover: { title: 'Professional Settings', description: 'Update your medical bio and manage weekly availability slots.', side: 'bottom' } }
    ]);
  };

  const startDoctorDashboardTour = () => {
    startTour([
      { element: '.grid-cols-1', popover: { title: 'Workload Overview', description: 'Quick check of today\'s appointments and managed patients.', side: 'bottom' } }
    ]);
  };

  const startLabTechDashboardTour = () => {
    startTour([
      { element: '.grid-cols-1', popover: { title: 'Technical Hub', description: 'Monitor active test queues and assigned units.', side: 'bottom' } }
    ]);
  };

  return {
    startTour,
    startContextualTour,
  };
}
