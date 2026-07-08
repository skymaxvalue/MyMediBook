import { PatientRegister } from "../../Models/Patient-Model"


export interface AuthState {
    user: any,
    token: string | null,
    loginPatient: any | null,
    registeredPatient: PatientRegister | null;
    isLoading: boolean;
    error: string | null;
    securityQuestions?: any[];
    getCountries?: any[];
    getStates?: any[];
    getCities?: any[];
    requestedOtp: any;
    refreshToken: string | null;
}

export const initialAuthState: AuthState = {
    user: null,
    token: null,
    registeredPatient: null,
    isLoading: false,
    error: null,
    securityQuestions: [],
    getCountries: [],
    getStates: [],
    getCities: [],
    loginPatient: null,
    requestedOtp: null,
    refreshToken: null
}