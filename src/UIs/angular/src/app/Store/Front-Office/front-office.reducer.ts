import { Action, createReducer, on } from "@ngrx/store";
import * as A from "./front-office.actions";
import { LoadStatus } from "../../utils/enum/load-status.enum";
export const FRONT_OFFICE_FEATURE_KEY = "front-office";

export interface FrontOfficeState {
  isLoading: LoadStatus;
  error: any;
}

export const initialState: FrontOfficeState = {
  isLoading: LoadStatus.NotLoaded,
  error: null,
};

export const reducer = createReducer(initialState);

export function FrontOfficeReducer(state: FrontOfficeState | undefined, action: Action) {
  return reducer(state, action);
}
