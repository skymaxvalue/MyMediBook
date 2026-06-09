
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PatientAction from "./patient.action"

import { catchError, mergeMap, map, of } from 'rxjs';
import { PatientService } from 'src/app/Services/patient.service';


@Injectable()
export class PatientEffects {
    constructor(
        private actions$: Actions,
        private patientService: PatientService
    ) { }
    getPatientByID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PatientAction.getPatientDetailsById),
            mergeMap((action) =>
                this.patientService.getPatientById({ id: action.id }).pipe(
                    map((response: any) =>
                        PatientAction.getPatientDetailsByIdSuccess({ patient: response })
                    ),
                    catchError((error) =>
                        of(PatientAction.getPatientDetailsByIdFailure({ error: error.message || 'Login Failed' }))
                    )

                )
            )

        )
    );
    updatePatientByID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PatientAction.updatePatientDetailsById),
            mergeMap((action) =>
                this.patientService.updatePatientById(action.patient).pipe(
                    map((response: any) =>
                        PatientAction.updatePatientDetailsByIdSuccess({ patient: response })
                    ),
                    catchError((error) =>
                        of(PatientAction.updatePatientDetailsByIdFailure({ error: error.message || 'Login Failed' }))
                    )

                )
            )

        )
    )



}