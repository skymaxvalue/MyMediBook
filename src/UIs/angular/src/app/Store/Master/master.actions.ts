import { createAction, props } from "@ngrx/store";

export const GetStatusKeyList = createAction("[Master] Get Status Key List");
export const GetStatusKeyListSuccess = createAction(
  "[Master] Get Status Key List Success",
  props<{ response: any[] }>()
);
export const GetStatusKeyListFailure = createAction(
  "[Master] Get Status Key List Failure",
  props<{ error: string }>()
);

export const GetOrganisationList = createAction(
    '[Master] Get Organisation List'
);
export const GetOrganisationListSuccess = createAction(
    '[Master] Get Organisation List Success',
    props<{ response: any }>()
);
export const GetOrganisationListFailure = createAction(
    '[Master] Get Organisation List Failure',
    props<{ error: any }>()
);
