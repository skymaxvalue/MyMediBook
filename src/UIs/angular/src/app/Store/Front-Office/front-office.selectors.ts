import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FrontOfficeState } from "./front-office.reducer";

export const selectFrontOfficeState = createFeatureSelector<FrontOfficeState>("front-office");
export const selectRelationList = createSelector(selectFrontOfficeState, (state) => {
  return state.relationList ?? [];
});
