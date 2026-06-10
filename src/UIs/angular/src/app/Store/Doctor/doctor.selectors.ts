import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DoctorSpecialityState } from './doctor.state';

export const selectDoctorSpecialityState =
    createFeatureSelector<DoctorSpecialityState>(
        'doctor'
    );

export const selectDoctorSpecialities = createSelector(
    selectDoctorSpecialityState,
    state => state.specialities
);

export const selectLoading = createSelector(
    selectDoctorSpecialityState,
    state => state.isLoading
);