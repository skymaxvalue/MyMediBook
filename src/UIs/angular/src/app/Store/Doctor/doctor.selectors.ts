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

export const selectAllSpecialities = createSelector(
    selectDoctorSpecialityState,
    state => state.allSpeciality
);
export const selectAllDepartments = createSelector(
    selectDoctorSpecialityState,
    state => state.allDepartments
);
export const selectAllRoles = createSelector(
    selectDoctorSpecialityState,
    state => state.allRoles
);
export const selectLoading = createSelector(
    selectDoctorSpecialityState,
    state => state.isLoading
);

