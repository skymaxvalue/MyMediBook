import { Action, createReducer, on } from "@ngrx/store";
import * as A from "./common.actions";
import { ISearchPatientResponseModel } from "../../core/Models/common/search-patient.model";
import { LoadStatus } from "../../utils/enum/load-status.enum";

export const COMMON_FEATURE_KEY = "common";

export interface CommonState {
  patientDetails: ISearchPatientResponseModel[];
  error: any;
  loading: LoadStatus;
  searchByFromDate: string;
  searchByEndDate: string;
  searchByName: string;
  searchByDob: string;
  searchByPhoneNumber: number;
}

export const initialState: CommonState = {
  patientDetails: [],
  error: null,
  loading: LoadStatus.NotLoaded,
  searchByFromDate: "",
  searchByEndDate: "",
  searchByName: "",
  searchByDob: "",
  searchByPhoneNumber: 0,
};

export const reducer = createReducer(
  initialState,
  on(A.searchPatients, (state) => ({
    ...state,
    loading: LoadStatus.Loading,
  })),
  on(A.searchPatientsSuccess, (state, { response }) => ({
    ...state,
    patientDetails: response,
    loading: LoadStatus.Loaded,
    error: null,
  })),
  on(A.searchPatientsFailure, (state, { error }) => ({
    ...state,
    patientDetails: [],
    error: error,
    loading: LoadStatus.NotLoaded,
  })),
  on(A.searchByFromAndEndDate, (state, { fromDate, endDate }) => ({
    ...state,
    searchByFromDate: fromDate,
    searchByEndDate: endDate,
  })),
  on(A.searchByDOB, (state, { DOB }) => ({
    ...state,
    searchByDob: DOB,
  })),
  on(A.searchByName, (state, { name }) => ({
    ...state,
    searchByName: name,
  })),
  on(A.searchByPhoneNumber, (state, { phoneNumber }) => ({
    ...state,
    searchByPhoneNumber: phoneNumber,
  })),
  on(A.clearPatientSearch, (state) => ({
    ...state,
    patientDetails: [],
    error: null,
    loading: LoadStatus.NotLoaded,
    searchByPhoneNumber: 0,
    searchByDob: "",
    searchByEndDate: "",
    searchByFromDate: "",
    searchByName: "",
  }))
);

export function CommonReducer(state: CommonState | undefined, action: Action) {
  return reducer(state, action);
}
