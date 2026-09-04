import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState =
    createFeatureSelector<AuthState>('auth');

export const selectRegisteredPatient =
    createSelector(
        selectAuthState,
        state => state.registeredPatient
    );
export const selectLoginUser =
    createSelector(
        selectAuthState,
        state => state.loginUser
    );


export const selectRefreshToken =
    createSelector(
        selectAuthState,
        state => state.refreshToken
    );
// Requested otp
export const selectRequestedOTP =
    createSelector(
        selectAuthState,
        state => state.requestedOtp
    );



export const selectLoading =
    createSelector(
        selectAuthState,
        state => state.isLoading
    );

export const selectError =
    createSelector(
        selectAuthState,
        state => state.error
    );

export const selectSecurityQuestions =
    createSelector(
        selectAuthState,
        state => state.securityQuestions
    );

export const selectCountry =
    createSelector(
        selectAuthState,
        state => state.getCountries
    );

export const selectState =
    createSelector(
        selectAuthState,
        state => state.getStates
    );

export const selectCity =
    createSelector(
        selectAuthState,
        state => state.getCities
    );

export const selectVerifyOTP =
    createSelector(
        selectAuthState,
        state => state.otpres
    );

export const selectForgotPassReset =
    createSelector(
        selectAuthState,
        state => state.resetPassRes
    );



