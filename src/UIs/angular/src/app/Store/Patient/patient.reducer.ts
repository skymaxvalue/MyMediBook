import { createReducer, on } from '@ngrx/store';
import * as PatientActions from './patient.action';
import { initialAuthState } from './patient.state';


export const patientReducer = createReducer(
    initialAuthState,

    on(PatientActions.getPatientDetailsById, (state) => ({
        ...state,
        isLoading: true
    })),

    on(PatientActions.getPatientDetailsByIdSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        patientDetails: action.patient
    })),

    on(PatientActions.getPatientDetailsByIdFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error,
    })),


)
