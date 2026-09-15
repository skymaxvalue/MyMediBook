import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { OrganizationService } from "src/app/core/Services/organization.service";
import * as OrganizationAction from "./organization.actions"

import { catchError, map, mergeMap, of } from 'rxjs';



@Injectable()
export class OrganizationEffects {
    constructor(
        private actions$: Actions,
        private organizationService: OrganizationService
    ) { }


    getOrganizationList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OrganizationAction.getOrganizationList),

            mergeMap((action) =>
                this.organizationService
                    .getOrganizationList()
                    .pipe(
                        map((response: any) =>
                            OrganizationAction.getOrganizationListSuccess({
                                organizationLis: response.data
                            })
                        ),

                        catchError((error) =>
                            of(
                                OrganizationAction.getOrganizationListFailure({
                                    error:
                                        error?.message ||
                                        'Getting Organization Data Failed'
                                })
                            )
                        )
                    )
            )
        )
    );

    // getRelationType$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(OrganizationAction.getOrganizationList),

    //         mergeMap((action) =>
    //             this.appointmentService
    //                 .getRelationType()
    //                 .pipe(
    //                     map((response: any) =>
    //                         AppointmentActions.getRelationTypeSuccess({
    //                             Relations: response
    //                         })
    //                     ),

    //                     catchError((error) =>
    //                         of(
    //                             AppointmentActions.getRelationTypeFailure({
    //                                 error:
    //                                     error?.message ||
    //                                     'Getting Relation Data Failed'
    //                             })
    //                         )
    //                     )
    //                 )
    //         )
    //     )
    // );
}