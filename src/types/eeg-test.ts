import { EEGTestStatus, ADHDPrediction } from './enums.types';

export interface EegTestResponse {
  id: string;
  appointmentId: string;
  patientId: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  doctorId: string;
  doctor: {
    id: string;
    firstName: string;
    lastName: string;
  };
  labId: string | null;
  lab: {
    id: string;
    name: string;
  } | null;
  testDate: string;
  status: EEGTestStatus;
  notes: string | null;
  
  // AI Results (null until Analyzed)
  adhdProbability: number | null;
  prediction: ADHDPrediction | null;
  segmentsAnalyzed: number | null;
  adhdSegments: number | null;
  controlSegments: number | null;
  thetaBetaRatio: number | null;
  thetaPower: number | null;
  alphaPower: number | null;
  betaPower: number | null;
  deltaPower: number | null;
  analyzedAt: string | null;

  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EegDataResponse {
  id: string;
  eegTestId: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEegTestRequest {
  appointmentId: string;
  testDate: string;
  labId?: string;
  notes?: string;
}

export interface UpdateEegTestStatusRequest {
  status: EEGTestStatus;
}
