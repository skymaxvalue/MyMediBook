import { createAction, props } from '@ngrx/store';
import { PatientRegister } from "../../Models/Patient-Model";

// Login Actions
export const login = createAction(
    '[Auth] Login',
    props<{ username: string; password: string, role: string }>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ patient: any }>()
);

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
);

// Requested OTP Action
export const requestOTP = createAction(
    '[Auth] OTP',
    props<{ email: string }>()
);

export const requestOTPSuccess = createAction(
    '[Auth] OTP Success',
    props<{ requesteOTP: any }>()
);

export const requestOTPFailure = createAction(
    '[Auth] OTP Failure',
    props<{ error: string }>()
);

// Register Actions
export const register = createAction(
    '[Auth] Register Patient',
    props<{ patient: PatientRegister }>()
);

export const registerPatientSuccess = createAction(
    '[Auth] Register Patient Success',
    props<{ patient: any }>()
);

export const registerPatientFailure = createAction(
    '[Auth] Register Patient Failure',
    props<{ error: string }>()
);



// Get Security Questions Actions
export const getSecurityQuestions = createAction(
    '[Auth] Get Security Questions'
);

export const getSecurityQuestionsSuccess = createAction(
    '[Auth] Get Security Questions Success',
    props<{ questions: any[] }>()
);

export const getSecurityQuestionsFailure = createAction(
    '[Auth] Get Security Questions Failure',
    props<{ error: string }>()
);

// Get Countries Actions
export const getCountries = createAction(
    '[Auth] Get Countries'
);

export const getCountriesSuccess = createAction(
    '[Auth] Get Countries Success',
    props<{ countries: any[] }>()
);

export const getCountriesFailure = createAction(
    '[Auth] Get Countries Failure',
    props<{ error: string }>()
);

// Get States Actions
export const getStates = createAction(
    '[Auth] Get States',
    props<{ countryId: number }>()
);

export const getStatesSuccess = createAction(
    '[Auth] Get States Success',
    props<{ states: any[] }>()
);

export const getStatesFailure = createAction(
    '[Auth] Get States Failure',
    props<{ error: string }>()
);

// Get Cities Actions
export const getCities = createAction(
    '[Auth] Get Cities',
    props<{ stateId: number }>()
);

export const getCitiesSuccess = createAction(
    '[Auth] Get Cities Success',
    props<{ cities: any[] }>()
);

export const getCitiesFailure = createAction(
    '[Auth] Get Cities Failure',
    props<{ error: string }>()
);

export const refreshToken = createAction(
    '[Auth] Refresh Token',
    props<{ refreshToken: string }>()
);

export const refreshTokenSuccess = createAction(
    '[Auth] Refresh Token Success',
    props<{
        accessToken: string;
        refreshToken: string;
    }>()
);

export const refreshTokenFailure = createAction(
    '[Auth] Refresh Token Failure',
    props<{ error: string }>()
);


// Associate login

// Login Actions
export const associateLogin = createAction(
    '[Auth] Associate Login',
    props<{ username: string; password: string, role: string }>()
);

export const associateLoginSuccess = createAction(
    '[Auth] Associate Login Success',
    props<{ associate: any }>()
);

export const associateLoginFailure = createAction(
    '[Auth] Associate Login Failure',
    props<{ error: string }>()
);


