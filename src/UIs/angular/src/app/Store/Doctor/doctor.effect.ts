import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as DoctorSpecialityActions from './doctor.action';
import { DoctorService } from '../../Services/doctor.service';

@Injectable()
export class DoctorSpecialityEffects {



    constructor(
        private actions$: Actions,
        private doctorService: DoctorService
    ) { }


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

    loadAllSpecialities$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.loadAllSpecialities),

            mergeMap(() =>
                this.doctorService.getAllSpecialities().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.loadAllSpecialitiesSuccess({
                            allSpeciality: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.loadAllSpecialitiesFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    loadAllDepartments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.loadAllDepartments),

            mergeMap(() =>
                this.doctorService.getAllDepartments().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.loadAllDepartmentsSuccess({
                            allDepartments: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.loadAllDepartmentsFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    loadAllRoles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.loadAllRoles),

            mergeMap(() =>
                this.doctorService.getAllRoles().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.loadAllRolesSuccess({
                            allRoles: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.loadAllRolesFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );
}