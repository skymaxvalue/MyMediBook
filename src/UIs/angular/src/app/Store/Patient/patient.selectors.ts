import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PatientState } from './patient.state';

export const selectPatientState =
    createFeatureSelector<PatientState>('patient');

export const selectPatientDetails = createSelector(
    selectPatientState,
    state => state.patientDetails
);
export const selectUpdatedPatientDetails = createSelector(
    selectPatientState,
    state => state.patientDetails
);
export const selectGetProfileListByPatientId = createSelector(
    selectPatientState,
    state => state.patientProfiles
);
export const selectGetProfileDataByProfileId = createSelector(
    selectPatientState,
    state => state.patientProfileData
);