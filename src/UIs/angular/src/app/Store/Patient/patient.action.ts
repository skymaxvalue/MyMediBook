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