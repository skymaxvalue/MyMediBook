import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AssociateState } from "./associate.reducer";

export const selectAssociateState = createFeatureSelector<AssociateState>("associate");

export const selectAsssocicateById = createSelector(selectAssociateState, (state) => {
  return state.associate ?? [];
});

export const selectedAssociateId = createSelector(
  selectAssociateState,
  (state) => state.selectedAssociateId ?? 0
);
