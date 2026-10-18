import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MasterState } from "./master.reducer";

export const selectMasterState = createFeatureSelector<MasterState>("master");

export const selectStatuskeyList = createSelector(selectMasterState, (state) => {
  return state.statusKeyList ?? [];
});

export const selectOrganisationList = createSelector(
  selectMasterState,
  (state) => state.organisationList ?? []
);
