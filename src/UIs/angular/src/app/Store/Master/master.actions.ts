import { createAction, props } from "@ngrx/store";
import { IRelationTypeModel } from "../../core/Models/master/relation-type.model";
import { IOtpTypeModel } from "../../core/Models/master/otp-type.model";

export const GetStatusKeyList = createAction("[Master] Get Status Key List");
export const GetStatusKeyListSuccess = createAction(
  "[Master] Get Status Key List Success",
  props<{ response: any[] }>()
);
export const GetStatusKeyListFailure = createAction(
  "[Master] Get Status Key List Failure",
  props<{ error: string }>()
);

export const GetOrganisationList = createAction("[Master] Get Organisation List");
export const GetOrganisationListSuccess = createAction(
  "[Master] Get Organisation List Success",
  props<{ response: any }>()
);
export const GetOrganisationListFailure = createAction(
  "[Master] Get Organisation List Failure",
  props<{ error: any }>()
);

// ---------- Relation Type List ----------
export const getRelationTypeList = createAction("[Master] Load Relation List");
export const getRelationTypeListSuccess = createAction(
  "[Master] Load Relation List Success",
  props<{ response: IRelationTypeModel[] }>()
);
export const getRelationTypeListFailure = createAction(
  "[Master] Load Relation List Failure",
  props<{ error: any }>()
);

// ---------- OTP Type List ----------
export const getOtpTypeList = createAction("[Master] Load Otp Type List");
export const getOtpTypeListSuccess = createAction(
  "[Master] Load Otp Type List Success",
  props<{ response: IOtpTypeModel[] }>()
);
export const getOtpTypeListFailure = createAction(
  "[Master] Load Otp Type List Failure",
  props<{ error: any }>()
);
