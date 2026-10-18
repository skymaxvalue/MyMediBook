import { Action, createReducer, on } from "@ngrx/store";
import * as MasterActions from "./master.actions";

export const MASTER_FEATURE_KEY = "master";

export interface MasterState {
  statusKeyList: any[];
  organisationList: any[];
  error: any;
}

export const initialState: MasterState = {
  statusKeyList: [],
  organisationList: [],
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
  }))
);

export function MasterReducer(state: MasterState | undefined, action: Action) {
  return reducer(state, action);
}
