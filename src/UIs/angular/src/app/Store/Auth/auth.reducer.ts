import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';


export const authReducer = createReducer(
    initialAuthState,

    on(AuthActions.login, (state) => ({
        ...state,
        isLoading: true
    })),

    on(AuthActions.loginSuccess, (state, action) => {

        return {
            ...state,
            isLoading: false,
            loginUser: action.user,
            user: action.user.data,
            token: action.user.accessToken ?? action.user.tokenKey,

            refreshToken: action.user.refreshToken
        };
    }),

    on(AuthActions.loginFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error,
    })),

    on(AuthActions.refreshToken, (state) => ({
        ...state,
        isLoading: true,
    })),

    on(AuthActions.refreshTokenSuccess, (state, { accessToken, refreshToken }) => ({

        ...state,
        token: accessToken,
        accessToken,
        refreshToken

    })),

    on(AuthActions.refreshTokenFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),

    // Request OTP
    on(AuthActions.requestOTP, (state) => ({
        ...state,
        isLoading: true
    })),

    on(AuthActions.requestOTPSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        requestedOtp: action.requesteOTP
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
        error: action.error
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

)
