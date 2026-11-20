import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import {
    catchError,
    map,
    of,
    switchMap
} from 'rxjs';

import * as PaymentActions from './payment.actions';

import { PaymentService } from
    'src/app/core/Services/payment/payment.service';

@Injectable()
export class PaymentEffects {

    private actions$ = inject(Actions);

    private paymentService = inject(PaymentService);

    searchPatients$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PaymentActions.searchPatients),

            switchMap(({ payload }) =>
                this.paymentService.searchPatients(payload).pipe(

                    map((patients) =>
                        PaymentActions.searchPatientsSuccess({
                            patients: patients || []
                        })
                    ),

                    catchError((error) =>
                        of(
                            PaymentActions.searchPatientsFailure({
                                error:
                                    error?.error?.message ||
                                    error?.message ||
                                    'Unable to search patients.'
                            })
                        )
                    )

                )
            )
        )
    );

    getPaymentListByPatientId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PaymentActions.getPaymentListByPatientId),
            switchMap(({ patientId }) =>
                this.paymentService.getPaymentListByPatientId(patientId).pipe(
                    map((paymentList) =>
                        PaymentActions.getPaymentListByPatientIdSuccess({ paymentList })
                    ),
                    catchError((error) =>
                        of(
                            PaymentActions.getPaymentListByPatientIdFailure({
                                error:
                                    error?.error?.message ||
                                    error?.message ||
                                    'Unable to get payment list.'
                            })
                        )
                    )
                )
            )
        )
    );
}