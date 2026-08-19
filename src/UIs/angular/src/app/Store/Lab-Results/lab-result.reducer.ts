import { createReducer, on } from '@ngrx/store';
import * as LabResultActions from './lab-result.actions';
import { initialLabResultState } from './lab-result.state';

export const LabResultReducer = createReducer(
    initialLabResultState,



    on(LabResultActions.getMyLabResults, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(LabResultActions.getMyLabResultsSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        LabResultList: action.LabResultList
    })),

    on(LabResultActions.getMyLabResultsFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))


);