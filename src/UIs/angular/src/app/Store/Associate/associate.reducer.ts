import { Action, createReducer, on } from "@ngrx/store";
import * as MasterActions from "./associate.actions";

export const ASSOCIATE_FEATURE_KEY = "associate";

export interface AssociateState {
  associate: any;
  selectedAssociateId: number;
  error: any;
}

export const initialState: AssociateState = {
  associate: null,
  selectedAssociateId: 0,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(MasterActions.GetAssociateById, (state, { associateId }) => ({
    ...state,
  })),
  on(MasterActions.GetAssociateByIdSuccess, (state, { response }) => ({
    ...state,
    associate: response,
  })),
  on(MasterActions.GetAssociateByIdFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),

  on(MasterActions.SetSelectedAssociateId, (state, { associateId }) => ({
    ...state,
    selectedAssociateId: associateId,
  })),
  on(MasterActions.ClearSelectedAssociateId, (state) => ({
    ...state,
    selectedAssociateId: 0,
  }))
);

export function AssociateReducer(state: AssociateState | undefined, action: Action) {
  return reducer(state, action);
}
