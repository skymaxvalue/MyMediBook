import { createAction, props } from '@ngrx/store';
import { PatientRegister } from "../../Models/Patient-Model";// Login Actions



export const getPatientDetailsById = createAction(
    '[Patient] get-patient',
    props<{ id: string }>()
);

export const getPatientDetailsByIdSuccess = createAction(
    '[Patient] get-patient Success',
    props<{ patient: any }>()
);

export const getPatientDetailsByIdFailure = createAction(
    '[Patient] get-patient Failure',
    props<{ error: string }>()
);

export const updatePatientDetailsById = createAction(
    '[Patient] update-patient',
    props<{ patient: any }>()
);

export const updatePatientDetailsByIdSuccess = createAction(
    '[Patient] update-patient Success',
    props<{ patient: any }>()
);

export const updatePatientDetailsByIdFailure = createAction(
    '[Patient] update-patient Failure',
    props<{ error: string }>()
);

export const getPetirntProfileListById = createAction(
    '[Patient] Profile List',
    props<{ patientId: any }>()

);

export const getPetirntProfileListByIdSuccess = createAction(
    '[Patient] Profile List Success',
    props<{ patientProfile: any }>()
);

export const getPetirntProfileListByIdFailure = createAction(
    '[Patient] Profile List Failure',
    props<{ error: string }>()
);
export const getProfileDataByProfileId = createAction(
    '[Patient Profile] Profile List ',
    props<{ profileId: any }>()

);

export const getProfileDataByProfileIdSuccess = createAction(
    '[Patient Profile] Profile Data Success',
    props<{ patientProfileData: any }>()
);

export const getProfileDataByProfileIdFailure = createAction(
    '[Patient Profile] Profile Data Failure',
    props<{ error: string }>()
);

export const getAllMecineDetailByPatientID = createAction(
    '[Patient Medicine] Medicine List ',
    props<{ patientId: any }>()

);

export const getAllMecineDetailByPatientIDSuccess = createAction(
    '[Patient Medicine] Medicine Data Success',
    props<{ patientMedicalData: any }>()
);

export const getAllMecineDetailByPatientIDFailure = createAction(
    '[Patient Medicine] Medicine Data Failure',
    props<{ error: string }>()
);