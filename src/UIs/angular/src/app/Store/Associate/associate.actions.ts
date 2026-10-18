import { createAction, props } from "@ngrx/store";

export const GetAssociateById = createAction(
  "[Associate] Get Associate By Id",
  props<{ associateId: number }>()
);
export const GetAssociateByIdSuccess = createAction(
  "[Associate] Get Associate By Id Success",
  props<{ response: any[] }>()
);
export const GetAssociateByIdFailure = createAction(
  "[Associate] Get Associate By Id Failure",
  props<{ error: string }>()
);

export const SetSelectedAssociateId = createAction(
  "[Associate] Set Selected Associate Id",
  props<{ associateId: number }>()
);

export const ClearSelectedAssociateId = createAction("[Associate] Clear Selected Associate Id");
