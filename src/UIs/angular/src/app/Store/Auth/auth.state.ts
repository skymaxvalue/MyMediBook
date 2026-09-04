import { PatientRegister } from "../../core/Models/Patient-Model"


export interface AuthState {
    user: any,
    token: string | null,
    loginUser: any | null,
    registeredPatient: PatientRegister | null;
    isLoading: boolean;
    error: string | null;
    securityQuestions?: any[];
    getCountries?: any[];
    getStates?: any[];
    getCities?: any[];
    requestedOtp: any;
    refreshToken: string | null;
    associate: any;
    otpres: any;
    resetPassRes: any
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
    loginUser: null,
    requestedOtp: null,
    refreshToken: null,
    associate: null,
    otpres: null,
    resetPassRes: null
}