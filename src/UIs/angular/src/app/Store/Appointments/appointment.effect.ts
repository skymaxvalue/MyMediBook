import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AppointmentActions from './appointment.actions';
import { AppoinmentService } from '../../Services/appoinment.service';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AppointmentEffects {

    constructor(
        private actions$: Actions,
        private appointmentService: AppoinmentService
    ) { }

    createAppointment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.createAppointment),

            mergeMap((action) =>
                this.appointmentService
                    .createAppointment(action.appointment)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.createAppointmentSuccess({
                                appointment: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.createAppointmentFailure({
                                    error:
                                        error?.message ||
                                        'Appointment Booking Failed'
                                })
                            )
                        )
                    )
            )
        )
    );
}