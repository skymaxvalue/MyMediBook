import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as LabResultAction from './lab-result.actions';
import { AppoinmentService } from '../../core/Services/appoinment.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LabResultService } from 'src/app/core/Services/lab-result.service';

@Injectable()
export class LabResultEffects {

    constructor(
        private actions$: Actions,
        private labResultService: LabResultService
    ) { }



    getMyLabResults$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LabResultAction.getMyLabResults),

            mergeMap((action) =>
                this.labResultService.GetMyLabResultsByPatientId(action.patientId).pipe(
                    map((response: any) =>
                        LabResultAction.getMyLabResultsSuccess({
                            LabResultList: response.data
                        })
                    ),

                    catchError((error) =>
                        of(
                            LabResultAction.getMyLabResultsFailure({
                                error:
                                    error?.message ||
                                    'Getting Relation Data Failed'
                            })
                        )
                    )
                )
            )
        )
    );



}