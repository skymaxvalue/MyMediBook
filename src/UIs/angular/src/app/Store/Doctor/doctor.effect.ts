import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as DoctorSpecialityActions from './doctor.action';
import { DoctorService } from '../../core/Services/doctor.service';

@Injectable()
export class DoctorSpecialityEffects {



    constructor(
        private actions$: Actions,
        private doctorService: DoctorService
    ) { }


    loadDoctorList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.loadDoctorSpecialities),

            mergeMap(() =>
                this.doctorService.getDoctorSpecialities().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.loadDoctorSpecialitiesSuccess({
                            doctorList: response.data
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

    registerAssociate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.registerAssociotion),

            mergeMap((action) =>
                this.doctorService.registerAssociate(action.associate).pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.registerAssociotionSuccess({
                            associate: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.registerAssociotionFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    loadAllRoleDepSpeci$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.getRoleDepaSpecia),

            mergeMap(() =>
                this.doctorService.getAllRoleDepSpeci().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.getRoleDepaSpeciaSuccess({
                            allRoleDepartSpeci: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.getRoleDepaSpeciaFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    loadAllAssociateList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.getWeekDays),

            mergeMap(() =>
                this.doctorService.getAllWeeksDays().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.getWeekDaysSuccess({
                            weeakDays: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.getWeekDaysFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    loadAllWeekDays$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.getAllAssociates),

            mergeMap(() =>
                this.doctorService.getAllAssociates().pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.getAllAssociatesSuccess({
                            allAssociates: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.getAllAssociatesFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    createAssociateSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.createAssociatesSchedule),

            mergeMap((action) =>
                this.doctorService.createAssociateSchedule(action.associate).pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.createAssociatesScheduleSuccess({
                            associateSchedule: response
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.createAssociatesScheduleFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );
    getDoctorAvalableTimeSlot$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.getTimeSloteByDoctorID),

            mergeMap((action) =>
                this.doctorService.getDoctorAvalabilityTimeSlot(action.payload).pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.getTimeSloteByDoctorIDSuccess({
                            doctorTimeSlot: response
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.getTimeSloteByDoctorIDFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );
    loadAssociateByAssociateID$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.getAssociatesByID),

            mergeMap((action) =>
                this.doctorService.getAssociateByAssociateID({ associateId: action.associateId }).pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.getAssociatesByIDSuccess({
                            accociateDetails: response.data
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.getAssociatesByIDFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );

    updateAssociateSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.updateAssociatesAndItsSchedule),

            mergeMap((action) =>
                this.doctorService.updateAssociateSchedule(action.associate).pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.updateAssociatesAndItsScheduleSuccess({
                            updatedAssociate: response
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.updateAssociatesAndItsScheduleFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );
    deleteAssociateSchedule$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DoctorSpecialityActions.deleteAssociatesAndItsSchedule),

            mergeMap((action: any) =>
                this.doctorService.deleteAssociateSchedule(action.associate).pipe(

                    map((response: any) =>
                        DoctorSpecialityActions.deleteAssociatesAndItsScheduleSuccess({
                            associate: response
                        })
                    ),

                    catchError(error =>
                        of(
                            DoctorSpecialityActions.deleteAssociatesAndItsScheduleFailure({
                                error
                            })
                        )
                    )
                )
            )
        )
    );
}