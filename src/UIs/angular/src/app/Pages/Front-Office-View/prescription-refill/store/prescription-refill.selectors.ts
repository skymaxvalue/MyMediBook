import { createFeatureSelector, createSelector } from "@ngrx/store";
import {
  PrescriptionRefillState,
  prescriptionRefillFeatureKey,
} from "./prescription-refill.reducer";

export const selectFeature = createFeatureSelector<PrescriptionRefillState>(
  prescriptionRefillFeatureKey
);

export const selectSearchResults = createSelector(selectFeature, (s) => s.searchResults);
export const selectSearching = createSelector(selectFeature, (s) => s.searching);
export const selectSearched = createSelector(selectFeature, (s) => s.searched);
export const selectSelectedPatientId = createSelector(selectFeature, (s) => s.selectedPatientId);
export const selectDetails = createSelector(selectFeature, (s) => s.details);
export const selectLoadingDetails = createSelector(selectFeature, (s) => s.loadingDetails);
export const selectPhysicians = createSelector(selectFeature, (s) => s.physicians);
export const selectSubmitting = createSelector(selectFeature, (s) => s.submitting);
export const selectSavingDraft = createSelector(selectFeature, (s) => s.savingDraft);
export const selectSubmitResult = createSelector(selectFeature, (s) => s.submitResult);
export const selectDraftResult = createSelector(selectFeature, (s) => s.draftResult);
export const selectError = createSelector(selectFeature, (s) => s.error);

export const selectActiveMedications = createSelector(selectDetails, (d) =>
  (d?.medications ?? []).filter((m) => m.status === "Active")
);

export const selectNoResults = createSelector(
  selectSearched,
  selectSearchResults,
  (searched, results) => searched && results.length === 0
);
