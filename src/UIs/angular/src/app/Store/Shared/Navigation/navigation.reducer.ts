import { createReducer, on } from "@ngrx/store";

export const NAVIGATION_FEATURE_KEY = "navigation";

export interface NavigationState {}

export const initialState: NavigationState = {};

export const reducer = createReducer(initialState);
