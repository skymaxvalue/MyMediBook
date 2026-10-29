import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CommonState } from "./common.reducer";

export const selectCommonState = createFeatureSelector<CommonState>("common");

export const selectSearchedPatientList = createSelector(selectCommonState, (state) => {
  return state.patientDetails ?? [];
});
export const selectSearchByFromDate = createSelector(
  selectCommonState,
  (state) => state.searchByFromDate
);

export const selectSearchByEndDate = createSelector(
  selectCommonState,
  (state) => state.searchByEndDate
);

export const selectSearchByDob = createSelector(selectCommonState, (state) => state.searchByDob);

export const selectSearchByName = createSelector(selectCommonState, (state) => state.searchByName);

export const selectSearchByMobileNo = createSelector(
  selectCommonState,
  (state) => state.searchByPhoneNumber
);
