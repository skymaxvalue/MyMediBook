import { createFeatureSelector, createSelector } from "@ngrx/store";
import { OrganizationState } from "./organization.state";


export const selectOrganizationState =
    createFeatureSelector<OrganizationState>(
        'organization'
    );
export const selectOrganizationList = createSelector(
    selectOrganizationState,
    state => state.organizationList
);