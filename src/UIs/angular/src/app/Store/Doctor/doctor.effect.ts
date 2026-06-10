import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as DoctorSpecialityActions from './doctor.action';
import { DoctorService } from '../../Services/doctor.service';

@Injectable()
export class DoctorSpecialityEffects {

    loadSpecialities$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.loadDoctorSpecialities),

            mergeMap(() =>
                this.doctorService.getDoctorSpecialities().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.loadDoctorSpecialitiesSuccess({
                            specialities: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.loadDoctorSpecialitiesFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private doctorService: DoctorService
    ) { }
}