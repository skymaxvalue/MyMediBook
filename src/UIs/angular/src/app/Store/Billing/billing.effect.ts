import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as BillingAction from './billing.actions';
import { AppoinmentService } from '../../core/Services/appoinment.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { LabResultService } from 'src/app/core/Services/lab-result.service';
import { BillsService } from 'src/app/core/Services/bills.service';

@Injectable()
export class BillsEffects {

    constructor(
        private actions$: Actions,
        private LabbillingService: BillsService
    ) { }



    getMyLabResults$ = createEffect(() =>
        this.actions$.pipe(
            ofType(BillingAction.getMyAllBills),

            mergeMap((action) =>
                this.LabbillingService.GetMyBillsByPatientId(action.patientId).pipe(
                    map((response: any) =>
                        BillingAction.getMyAllBillsSuccess({
                            myBillList: response.data
                        })
                    ),

                    catchError((error) =>
                        of(
                            BillingAction.getMyAllBillsFailure({
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