import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/Services/auth.service';
import * as AuthActions from './auth.actions';
import { catchError, mergeMap, map, of, exhaustMap, tap } from 'rxjs';


@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService
    ) { }


    //   Login Effect

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap((action) =>
                this.authService.loginPatient({
                    username: action.username,
                    password: action.password
                }, action.role).pipe(

                    tap((response: any) => {

                        localStorage.setItem('token', response.accessToken);
                        localStorage.setItem('refreshToken', response.refreshToken);
                        localStorage.setItem('user', JSON.stringify(response.data));

                        this.authService.startRefreshTimer();

                    }),

                    map((response: any) =>
                        AuthActions.loginSuccess({ user: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.loginFailure({
                            error: error.message || 'Login Failed'
                        }))
                    )

                )
            )

        )
    )

    // Request OTP
    requestOtp$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.requestOTP),
            mergeMap((action) =>
                this.authService.requestOTP({ email: action.email }).pipe(
                    map((response: any) =>
                        AuthActions.requestOTPSuccess({ requesteOTP: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.requestOTPFailure({ error: error.message || 'Login Failed' }))
                    )

                )
            )

        )
    )

    refreshToken$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.refreshToken),

            mergeMap(() =>
                this.authService.callRefreshToken().pipe(

                    map((response: any) =>
                        AuthActions.refreshTokenSuccess({
                            accessToken: response.accessToken,
                            refreshToken: response.refreshToken
                        })
                    ),

                    catchError((error) =>
                        of(
                            AuthActions.refreshTokenFailure({
                                error: error.message || 'Refresh Token Failed'
                            })
                        )
                    )

                )
            )

        )
    );

    //  Register Effect

    registerPatient$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.register),
            mergeMap((action) =>
                this.authService.registerPatient(action.patient).pipe(
                    map((response: any) =>
                        AuthActions.registerPatientSuccess({ patient: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.registerPatientFailure({ error: error.message || 'Registration Failed' }))
                    )
                )
            )

        )

    )

    getSecurityQuestions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.getSecurityQuestions),
            mergeMap(() =>
                this.authService.getSecurityQuestions().pipe(
                    map((response: any) =>
                        AuthActions.getSecurityQuestionsSuccess({ questions: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.getSecurityQuestionsFailure({ error: error.message || 'Failed to load security questions' }))
                    )
                )
            )
        )
    )

    getCountries$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.getCountries),
            mergeMap(() =>
                this.authService.getCountries().pipe(
                    map((response: any) =>
                        AuthActions.getCountriesSuccess({ countries: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.getCountriesFailure({ error: error.message || 'Failed to load countries' }))
                    )
                )
            )
        )
    )

    getStates$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.getStates),
            mergeMap((action) =>
                this.authService.getStates(action.countryId).pipe(
                    map((response: any) =>
                        AuthActions.getStatesSuccess({ states: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.getStatesFailure({ error: error.message || 'Failed to load states' }))
                    )
                )
            )
        )
    )

    getCities$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.getCities),
            mergeMap((action) =>
                this.authService.getCities(action.stateId).pipe(
                    map((response: any) =>
                        AuthActions.getCitiesSuccess({ cities: response })
                    ),
                    catchError((error) =>
                        of(AuthActions.getCitiesFailure({ error: error.message || 'Failed to load cities' }))
                    )
                )
            )
        )
    )






}
