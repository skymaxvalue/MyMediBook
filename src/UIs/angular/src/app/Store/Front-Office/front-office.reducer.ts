import { createReducer, on } from "@ngrx/store";

export const FRONT_OFFICE_FEATURE_KEY = "front-office";

export interface FrontOfficeState {}

export const initialState: FrontOfficeState = {};

export const reducer = createReducer(initialState);
