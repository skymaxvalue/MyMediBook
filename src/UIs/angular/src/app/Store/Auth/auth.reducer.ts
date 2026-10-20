import { Action, createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { PatientRegister } from "../../core/Models/Patient-Model";

export const AUTH_FEATURE_KEY = "auth";

export interface AuthState {
  user: any;
  token: string | null;
  loginUser: any | null;
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
  resetPassRes: any;
}

export const initialState: AuthState = {
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
  resetPassRes: null,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.loginSuccess, (state, action) => {
    return {
      ...state,
      isLoading: false,
      loginUser: action.user,
      user: action.user.data,
      token: action.user.accessToken ?? action.user.tokenKey,

      refreshToken: action.user.refreshToken,
    };
  }),

  on(AuthActions.loginFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.LogOut, (state) => ({
    ...state,
  })),
  on(AuthActions.logOutComplete, () => initialState),
  on(AuthActions.logOutFailure, (state, { error }) => ({
    ...initialState,
    error: error,
  })),

  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { accessToken, refreshToken }) => ({
    ...state,
    token: accessToken,
    accessToken,
    refreshToken,
  })),

  on(AuthActions.refreshTokenFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  // Request OTP
  on(AuthActions.requestOTP, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.requestOTPSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    requestedOtp: action.requestedOtp,
  })),

  on(AuthActions.requestOTPFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.register, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.registerPatientSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    registeredPatient: action.patient,
  })),

  on(AuthActions.registerPatientFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.getSecurityQuestions, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.getSecurityQuestionsSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    // Assuming you want to store the questions in the state, you can add a property for it
    securityQuestions: action.questions,
  })),

  on(AuthActions.getSecurityQuestionsFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AuthActions.getCountries, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.getCountriesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    getCountries: action.countries,
  })),
  on(AuthActions.getCountriesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AuthActions.getStates, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.getStatesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    getStates: action.states,
  })),
  on(AuthActions.getStatesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(AuthActions.getCities, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.getCitiesSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    getCities: action.cities,
  })),
  on(AuthActions.getCitiesFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.verifyOTP, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.verifyOTPSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    otpres: action.otpres,
  })),

  on(AuthActions.verifyOTPFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.ForrgetResetPassword, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.ForrgetResetPasswordSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    resetPassRes: action.resetPassRes,
  })),

  on(AuthActions.ForrgetResetPasswordFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),

  on(AuthActions.register_by_reseptionist, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(AuthActions.register_by_reseptionistSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    registeredPatient: action.patient,
  })),

  on(AuthActions.register_by_reseptionistFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  }))
);

export function AuthReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action);
}
