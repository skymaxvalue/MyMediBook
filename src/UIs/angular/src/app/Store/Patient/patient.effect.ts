
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PatientAction from "./patient.action"

import { catchError, mergeMap, map, of } from 'rxjs';
import { PatientService } from 'src/app/core/Services/patient.service';


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
    );

    getProfileListPatientByID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PatientAction.getPetirntProfileListById),
            mergeMap((action) =>
                this.patientService.getProfileListByPatientById(action.patientId).pipe(
                    map((response: any) =>
                        PatientAction.getPetirntProfileListByIdSuccess({ patientProfile: response })
                    ),
                    catchError((error) =>
                        of(PatientAction.getPetirntProfileListByIdFailure({ error: error.message || 'Login Failed' }))
                    )

                )
            )

        )
    )

    getProfileDataByProfile_ID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PatientAction.getProfileDataByProfileId),
            mergeMap((action) =>
                this.patientService.getProfileDataByPRofile_Id(action.profileId).pipe(
                    map((response: any) =>
                        PatientAction.getProfileDataByProfileIdSuccess({ patientProfileData: response })
                    ),
                    catchError((error) =>
                        of(PatientAction.getProfileDataByProfileIdFailure({ error: error.message || 'Login Failed' }))
                    )

                )
            )

        )
    )

    getMedicineDetailsByPatientID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(PatientAction.getAllMecineDetailByPatientID),
            mergeMap((action) =>
                this.patientService.getAllMediceneByPatientId(action.patientId).pipe(
                    map((response: any) =>
                        PatientAction.getAllMecineDetailByPatientIDSuccess({ patientMedicalData: response })
                    ),
                    catchError((error) =>
                        of(PatientAction.getAllMecineDetailByPatientIDFailure({ error: error.message || 'Login Failed' }))
                    )

                )
            )

        )
    )



}