import { createAction, props } from "@ngrx/store";

export const getOrganizationList = createAction(
    '[organization list]'
);
export const getOrganizationListSuccess = createAction(
    '[organization list] succses',
    props<{ organizationLis: any }>()
);
export const getOrganizationListFailure = createAction(
    '[organization list] succses',
    props<{ error: any }>()
);