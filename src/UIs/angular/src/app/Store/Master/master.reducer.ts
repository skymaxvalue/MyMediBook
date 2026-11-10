import { Action, createReducer, on } from "@ngrx/store";
import * as MasterActions from "./master.actions";
import { IRelationTypeModel } from "../../core/Models/master/relation-type.model";
import { LoadStatus } from "../../utils/enum/load-status.enum";
import { IOtpTypeModel } from "../../core/Models/master/otp-type.model";

export const MASTER_FEATURE_KEY = "master";

export interface MasterState {
  relationList: IRelationTypeModel[];
  otpTypeList: IOtpTypeModel[];
  statusKeyList: any[];
  organisationList: any[];
  isLoading: LoadStatus;
  error: any;
}

export const initialState: MasterState = {
  relationList: [],
  otpTypeList: [],
  statusKeyList: [],
  organisationList: [],
  isLoading: LoadStatus.NotLoaded,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(MasterActions.GetStatusKeyList, (state) => ({
    ...state,
    statusKeyList: [],
  })),
  on(MasterActions.GetStatusKeyListSuccess, (state, { response }) => ({
    ...state,
    statusKeyList: response,
  })),
  on(MasterActions.GetStatusKeyListFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(MasterActions.GetOrganisationList, (state) => ({
    ...state,
    organisationList: [],
  })),
  on(MasterActions.GetOrganisationListSuccess, (state, { response }) => ({
    ...state,
    organisationList: response,
  })),
  on(MasterActions.GetOrganisationListFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(MasterActions.getRelationTypeList, (state) => ({
    ...state,
    isLoading: LoadStatus.Loading,
    error: null,
  })),
  on(MasterActions.getRelationTypeListSuccess, (state, { response }) => ({
    ...state,
    isLoading: LoadStatus.Loaded,
    relationList: response,
    error: null,
  })),
  on(MasterActions.getRelationTypeListFailure, (state, { error }) => ({
    ...state,
    isLoading: LoadStatus.NotLoaded,
    error: error,
  })),
  on(MasterActions.getOtpTypeList, (state) => ({
    ...state,
    isLoading: LoadStatus.Loading,
    error: null,
  })),
  on(MasterActions.getOtpTypeListSuccess, (state, { response }) => ({
    ...state,
    isLoading: LoadStatus.Loaded,
    otpTypeList: response,
    error: null,
  })),
  on(MasterActions.getOtpTypeListFailure, (state, { error }) => ({
    ...state,
    isLoading: LoadStatus.NotLoaded,
    error: error,
  }))
);

export function MasterReducer(state: MasterState | undefined, action: Action) {
  return reducer(state, action);
}
