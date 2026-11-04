import { createReducer, on } from "@ngrx/store";
import { IRelationTypeMasterModel } from "../../core/Models/master/relation-type-master.model";
import * as A from "./front-office.actions";
import { LoadStatus } from "../../utils/enum/load-status.enum";
export const FRONT_OFFICE_FEATURE_KEY = "front-office";

export interface FrontOfficeState {
  relationList: IRelationTypeMasterModel[];
  isLoading: LoadStatus;
  error: any;
}

export const initialState: FrontOfficeState = {
  relationList: [],
  isLoading: LoadStatus.NotLoaded,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(A.getRelationTypeList, (state) => ({
    ...state,
    isLoading: LoadStatus.Loading,
    error: null,
  })),
  on(A.getRelationTypeListSuccess, (state, { response }) => ({
    ...state,
    isLoading: LoadStatus.Loaded,
    relationList: response,
    error: null,
  })),
  on(A.getRelationTypeListFailure, (state, { error }) => ({
    ...state,
    isLoading: LoadStatus.NotLoaded,
    error: error,
  }))
);
