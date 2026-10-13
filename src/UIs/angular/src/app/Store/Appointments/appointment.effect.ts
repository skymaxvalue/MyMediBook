import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AppointmentActions from './appointment.actions';
import { AppoinmentService } from '../../core/Services/appoinment.service';
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
                                appointment: response.data
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
    getAgeType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getAgeType),

            mergeMap((action) =>
                this.appointmentService
                    .getAgeType()
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getAgeTypeSuccess({
                                ageType: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getAgeTypeFailure({
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
    getRelationType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getRelationType),

            mergeMap((action) =>
                this.appointmentService
                    .getRelationType()
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getRelationTypeSuccess({
                                Relations: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getRelationTypeFailure({
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
    getMyAppointments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getMyAppointments),

            mergeMap((action) =>
                this.appointmentService
                    .getMyAppoitmentsByPatientID(action.patientId)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getMyAppointmentsSuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getMyAppointmentsFailure({
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

    cancelMyAppointments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.cancelMyAppointment),

            mergeMap((action) =>
                this.appointmentService
                    .cancelAppoitmentsByPatientID(action.patientId, action.appointmentId, action.associateRole, action.lastUpdatedBy, action.cancelReason)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.cancelMyAppointmentSuccess({
                                canceledAppoint: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.cancelMyAppointmentFailure({
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


    rescheduleMyAppointments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.rescheduleMyAppointment),

            mergeMap((action) =>
                this.appointmentService
                    .rescheduleAppoitmentsByPatientID({ patientId: action.patientId, appointmentId: action.appointmentId, associateId: action.associateId, slotId: action.slotId, visitPurpose: action.visitPurpose, visitType: action.visitType, lastUpdatedBy: action.lastUpdatedBy, associateRole: action.associateRole, rescheduleReason: action.rescheduleReason })
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.rescheduleMyAppointmentSuccess({
                                rescheduledAppointment: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.rescheduleMyAppointmentFailure({
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

    getAppointmentListByAssociateList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getAppointmentListByAssociateId),

            mergeMap((action) =>
                this.appointmentService
                    .getAppointmentListByAssociateId(action.associateId)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getAppointmentListByAssociateIdSuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getAppointmentListByAssociateIdFailure({
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

    getDashboardSummary$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getDashboardSummary),

            mergeMap((action) =>
                this.appointmentService
                    .getDashboardSummary(action.associateId, action.fromDate, action.toDate)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getDashboardSummarySuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getDashboardSummaryFailure({
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
    getDashboardDataForReceptionist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getFrontOfficeRecentPatientQueueList),

            mergeMap((action) =>
                this.appointmentService
                    .getFrontOfficeRecentPatientQueueList(action.associateId, action.fromDate, action.toDate)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getFrontOfficeRecentPatientQueueListSuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getFrontOfficeRecentPatientQueueListFailure({
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

    getDashboardDataForDoctor$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getDoctorRecentPatientList),

            mergeMap((action) =>
                this.appointmentService
                    .getDoctorRecentPatientList(action.associateId, action.fromDate, action.toDate)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getDoctorRecentPatientListSuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getDoctorRecentPatientListFailure({
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

    getAppointmentListByReceptionist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getAppointmentListByRiceptionist),

            mergeMap((action) =>
                this.appointmentService
                    .getAppointmentListForReceptionist(action.associateId, action.fromDate, action.toDate)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getAppointmentListByRiceptionistSuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getAppointmentListByRiceptionistFailure({
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

    getAppointmentCheckInListByReceptionist$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getAppointmentCheckInListByRiceptionist),

            mergeMap((action) =>
                this.appointmentService
                    .getAppointmentCheckinListForReceptionist(action.fromDate, action.toDate)
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getAppointmentCheckInListByRiceptionistSuccess({
                                Appointments: response
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getAppointmentCheckInListByRiceptionistFailure({
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

    getAppointmentStatusList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AppointmentActions.getAppointmentStatusList),

            mergeMap((action) =>
                this.appointmentService
                    .getAppointmentStatusList()
                    .pipe(
                        map((response: any) =>
                            AppointmentActions.getAppointmentStatusListSuccess({
                                statusList: response.data
                            })
                        ),

                        catchError((error) =>
                            of(
                                AppointmentActions.getAppointmentStatusListFailure({
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
