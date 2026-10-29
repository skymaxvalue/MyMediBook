import { Action, createReducer, on } from "@ngrx/store";
import * as A from "./common.actions";
import { ISearchPatientResponseModel } from "../../core/Models/common/search-patient.model";

export const COMMON_FEATURE_KEY = "common";

export interface CommonState {
  patientDetails: ISearchPatientResponseModel[];
  error: any;
  searchByFromDate: string;
  searchByEndDate: string;
  searchByName: string;
  searchByDob: string;
  searchByPhoneNumber: number;
}

export const initialState: CommonState = {
  patientDetails: [],
  error: null,
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
  })),
  on(A.searchPatientsSuccess, (state, { response }) => ({
    ...state,
    patientDetails: response,
  })),
  on(A.searchPatientsFailure, (state, { error }) => ({
    ...state,
    patientDetails: [],
    error: error,
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
    searchByMobileNo: A.searchByPhoneNumber,
  })),
  on(A.clearPatientSearch, (state) => ({
    ...state,
    searchByMobileNo: null,
    searchByDob: "",
    searchByEndDate: "",
    searchByFromDate: "",
    searchByName: "",
  }))
);

export function CommonReducer(state: CommonState | undefined, action: Action) {
  return reducer(state, action);
}
