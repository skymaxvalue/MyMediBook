import { createReducer, on } from '@ngrx/store';
import {
  DraftResult,
  Patient,
  PatientDetails,
  Physician,
  RefillResult,
} from '../prescription-refill.models/Model';
import { PrescriptionRefillActions as A } from './prescription-refill.actions';

export const prescriptionRefillFeatureKey = 'prescriptionRefill';

export interface PrescriptionRefillState {
  searchResults: Patient[];
  searching: boolean;
  searched: boolean;
  selectedPatientId: string | null;
  details: PatientDetails | null;
  loadingDetails: boolean;
  physicians: Physician[];
  submitting: boolean;
  savingDraft: boolean;
  submitResult: RefillResult | null;
  draftResult: DraftResult | null;
  error: string | null;
}

export const initialState: PrescriptionRefillState = {
  searchResults: [],
  searching: false,
  searched: false,
  selectedPatientId: null,
  details: null,
  loadingDetails: false,
  physicians: [],
  submitting: false,
  savingDraft: false,
  submitResult: null,
  draftResult: null,
  error: null,
};

export const prescriptionRefillReducer = createReducer(
  initialState,

  on(A.searchPatients, (s) => ({ ...s, searching: true, searched: false, error: null })),
  on(A.searchPatientsSuccess, (s, { patients }) => ({
    ...s,
    searching: false,
    searched: true,
    searchResults: patients,
  })),
  on(A.searchPatientsFailure, (s, { error }) => ({ ...s, searching: false, searched: true, error })),
  on(A.clearSearch, (s) => ({ ...s, searchResults: [], searched: false, searching: false })),

  on(A.selectPatient, (s, { patientId }) => ({
    ...s,
    selectedPatientId: patientId,
    loadingDetails: true,
    searchResults: [],
    searched: false,
    error: null,
  })),
  on(A.loadPatientDetailsSuccess, (s, { details }) => ({ ...s, details, loadingDetails: false })),
  on(A.loadPatientDetailsFailure, (s, { error }) => ({ ...s, loadingDetails: false, error })),

  on(A.loadPhysiciansSuccess, (s, { physicians }) => ({ ...s, physicians })),
  on(A.loadPhysiciansFailure, (s, { error }) => ({ ...s, error })),

  on(A.submitRefill, (s) => ({ ...s, submitting: true, error: null })),
  on(A.submitRefillSuccess, (s, { result }) => ({ ...s, submitting: false, submitResult: result })),
  on(A.submitRefillFailure, (s, { error }) => ({ ...s, submitting: false, error })),

  on(A.saveDraft, (s) => ({ ...s, savingDraft: true, error: null })),
  on(A.saveDraftSuccess, (s, { result }) => ({ ...s, savingDraft: false, draftResult: result })),
  on(A.saveDraftFailure, (s, { error }) => ({ ...s, savingDraft: false, error })),

  on(A.clearResults, (s) => ({ ...s, submitResult: null, draftResult: null })),
  // keep physicians (reference data), wipe everything patient-specific (PHI)
  on(A.resetForm, (s) => ({ ...initialState, physicians: s.physicians })),
);
