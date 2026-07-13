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

    on(PatientActions.getPetirntProfileListById, (state) => ({
        ...state,
        isLoading: true
    })),

    on(PatientActions.getPetirntProfileListByIdSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        patientProfiles: action.patientProfile
    })),

    on(PatientActions.getPetirntProfileListByIdFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error,
    })),
    on(PatientActions.getProfileDataByProfileId, (state) => ({
        ...state,
        isLoading: true
    })),

    on(PatientActions.getProfileDataByProfileIdSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        patientProfileData: action.patientProfileData
    })),

    on(PatientActions.getProfileDataByProfileIdFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error,
    })),
    on(PatientActions.getAllMecineDetailByPatientID, (state) => ({
        ...state,
        isLoading: true
    })),

    on(PatientActions.getAllMecineDetailByPatientIDSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        patientMedicalData: action.patientMedicalData
    })),

    on(PatientActions.getAllMecineDetailByPatientIDFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error,
    })),

)
