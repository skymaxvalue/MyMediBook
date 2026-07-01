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
export const selectRegisterAssociate = createSelector(
    selectDoctorSpecialityState,
    state => state.registerassociate
);
export const selectGetRoleDepSpeciOfAssociate = createSelector(
    selectDoctorSpecialityState,
    state => state.allRoleDepartSpeci
);
export const selectGetWeekDays = createSelector(
    selectDoctorSpecialityState,
    state => state.weeakDays
);

export const selectGelAllAssociate = createSelector(
    selectDoctorSpecialityState,
    state => state.allAssociates
);
export const selectCreatedAssociateSchedule = createSelector(
    selectDoctorSpecialityState,
    state => state.associateSchedule
);
export const selectGetTimeSlotOfDoctor = createSelector(
    selectDoctorSpecialityState,
    state => state.timeSlot
)
