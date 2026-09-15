import { createReducer, on } from "@ngrx/store";
import { initialOrganizationState } from "./organization.state";
import { getOrganizationList, getOrganizationListFailure, getOrganizationListSuccess } from "./organization.actions";



export const organizationReducer = createReducer(
    initialOrganizationState,

    on(getOrganizationList, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(getOrganizationListSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        organizationList: action.organizationLis
    })),

    on(getOrganizationListFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
)