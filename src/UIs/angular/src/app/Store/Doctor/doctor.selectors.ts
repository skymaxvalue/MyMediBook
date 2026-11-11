import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DoctorState } from "./doctor.reducer";

export const selectDoctorSpecialityState = createFeatureSelector<DoctorState>("doctor");

export const selectDoctorSpecialities = createSelector(
  selectDoctorSpecialityState,
  (state) => state.doctorList ?? []
);

export const selectAllSpecialities = createSelector(
  selectDoctorSpecialityState,
  (state) => state.allSpeciality
);
export const selectAllDepartments = createSelector(
  selectDoctorSpecialityState,
  (state) => state.allDepartments
);
export const selectAllRoles = createSelector(
  selectDoctorSpecialityState,
  (state) => state.allRoles
);
export const selectLoading = createSelector(
  selectDoctorSpecialityState,
  (state) => state.isLoading
);
export const selectRegisterAssociate = createSelector(
  selectDoctorSpecialityState,
  (state) => state.registerassociate
);
export const selectGetRoleDepSpeciOfAssociate = createSelector(
  selectDoctorSpecialityState,
  (state) => state.allRoleDepartSpeci
);
export const selectGetWeekDays = createSelector(
  selectDoctorSpecialityState,
  (state) => state.weeakDays
);

export const selectGelAllAssociate = createSelector(
  selectDoctorSpecialityState,
  (state) => state.allAssociates
);
export const selectCreatedAssociateSchedule = createSelector(
  selectDoctorSpecialityState,
  (state) => state.associateSchedule
);
export const selectDoctorTimeSlotList = createSelector(
  selectDoctorSpecialityState,
  (state) => state.doctorTimeSlotList ?? []
);
export const selectGetAssociateDetailsByItID = createSelector(
  selectDoctorSpecialityState,
  (state) => state.accociateDetails
);
export const selectUpdateAssociateDetailsByItID = createSelector(
  selectDoctorSpecialityState,
  (state) => state.updatedAssociate
);
