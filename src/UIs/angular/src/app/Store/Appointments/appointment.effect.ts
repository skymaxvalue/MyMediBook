import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AppointmentActions from "./appointment.actions";
import { AppointmentService } from "../../core/Services/appointment/appointment.service";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { ConfirmCheckInDialogComponent } from "../../Pages/Front-Office-View/patient-check-in/confirm-check-in-dialog/confirm-check-in-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { UpdateAppointmentCheckInRequestModel } from "../../core/Models/update-appointment-status.model";
import { CheckInSuccessDialogComponent } from "../../Pages/Front-Office-View/patient-check-in/confirm-check-in-dialog/check-in-success-dialog/check-in-success-dialog.component";
import { Router } from "@angular/router";

@Injectable()
export class AppointmentEffects {
  constructor(
    private actions$: Actions,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),

      mergeMap((action) =>
        this.appointmentService.createAppointment(action.appointment).pipe(
          map((response: any) =>
            AppointmentActions.createAppointmentSuccess({
              appointment: response.data,
            })
          ),

          catchError((error) =>
            of(
              AppointmentActions.createAppointmentFailure({
                error: error?.message || "Appointment Booking Failed",
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
        this.appointmentService.getAgeType().pipe(
          map((response: any) =>
            AppointmentActions.getAgeTypeSuccess({
              ageType: response,
            })
          ),

          catchError((error) =>
            of(
              AppointmentActions.getAgeTypeFailure({
                error: error?.message || "Appointment Booking Failed",
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
        this.appointmentService.getRelationType().pipe(
          map((response: any) =>
            AppointmentActions.getRelationTypeSuccess({
              Relations: response,
            })
          ),

          catchError((error) =>
            of(
              AppointmentActions.getRelationTypeFailure({
                error: error?.message || "Getting Relation Data Failed",
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
        this.appointmentService.getMyAppoitmentsByPatientID(action.patientId).pipe(
          map((response: any) =>
            AppointmentActions.getMyAppointmentsSuccess({
              Appointments: response,
            })
          ),

          catchError((error) =>
            of(
              AppointmentActions.getMyAppointmentsFailure({
                error: error?.message || "Getting Relation Data Failed",
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
          .cancelAppoitmentsByPatientID(
            action.patientId,
            action.appointmentId,
            action.associateRole,
            action.lastUpdatedBy,
            action.cancelReason
          )
          .pipe(
            map((response: any) =>
              AppointmentActions.cancelMyAppointmentSuccess({
                canceledAppoint: response,
              })
            ),

            catchError((error) =>
              of(
                AppointmentActions.cancelMyAppointmentFailure({
                  error: error?.message || "Getting Relation Data Failed",
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
          .rescheduleAppoitmentsByPatientID({
            patientId: action.patientId,
            appointmentId: action.appointmentId,
            associateId: action.associateId,
            slotId: action.slotId,
            visitPurpose: action.visitPurpose,
            visitType: action.visitType,
            lastUpdatedBy: action.lastUpdatedBy,
            associateRole: action.associateRole,
            rescheduleReason: action.rescheduleReason,
          })
          .pipe(
            map((response: any) =>
              AppointmentActions.rescheduleMyAppointmentSuccess({
                rescheduledAppointment: response,
              })
            ),

            catchError((error) =>
              of(
                AppointmentActions.rescheduleMyAppointmentFailure({
                  error: error?.message || "Getting Relation Data Failed",
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
        this.appointmentService.getAppointmentListByAssociateId(action.associateId).pipe(
          map((response: any) =>
            AppointmentActions.getAppointmentListByAssociateIdSuccess({
              Appointments: response,
            })
          ),

          catchError((error) =>
            of(
              AppointmentActions.getAppointmentListByAssociateIdFailure({
                error: error?.message || "Getting Relation Data Failed",
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
                Appointments: response,
              })
            ),

            catchError((error) =>
              of(
                AppointmentActions.getDashboardSummaryFailure({
                  error: error?.message || "Getting Relation Data Failed",
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
                Appointments: response,
              })
            ),

            catchError((error) =>
              of(
                AppointmentActions.getFrontOfficeRecentPatientQueueListFailure({
                  error: error?.message || "Getting Relation Data Failed",
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
                Appointments: response,
              })
            ),

            catchError((error) =>
              of(
                AppointmentActions.getDoctorRecentPatientListFailure({
                  error: error?.message || "Getting Relation Data Failed",
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
                Appointments: response,
              })
            ),

            catchError((error) =>
              of(
                AppointmentActions.getAppointmentListByRiceptionistFailure({
                  error: error?.message || "Getting Relation Data Failed",
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
            map((response) => {
              return AppointmentActions.getAppointmentCheckInListByRiceptionistSuccess({
                Appointments: response,
              });
            }),

            catchError((error) =>
              of(
                AppointmentActions.getAppointmentCheckInListByRiceptionistFailure({
                  error: error,
                })
              )
            )
          )
      )
    )
  );

  OpenPatientCheckInDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.openPatientCheckInDialog),
        map((action) => {
          return this.dialog.open(ConfirmCheckInDialogComponent, {
            width: "500px",
            data: {
              appointment: action.appointment,
            },
          });
        })
      ),
    { dispatch: false }
  );

  OpenConfirmPatientCheckInDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.openConfirmPatientCheckInDialog),
        map((action) => {
          return this.dialog.open(CheckInSuccessDialogComponent, {
            width: "500px",
            data: {
              appointment: action.appointment,
            },
          });
        })
      ),
    { dispatch: false }
  );

  UpdateAppointmentCheckInStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.confirmPatientCheckIn),
      mergeMap((action) => {
        const payload: UpdateAppointmentCheckInRequestModel = {
          AppointmentId: action.appointmentId,
          IsCheckedIn: true,
        };
        return this.appointmentService.updateCheckInStatus(payload).pipe(
          map((response) => {
            return AppointmentActions.confirmPatientCheckInSuccess({
              response,
            });
          }),
          catchError((error) => of(AppointmentActions.confirmPatientCheckInFailure({ error })))
        );
      })
    )
  );

  UpdateAppointmentCheckInStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.confirmPatientCheckInSuccess),
        map((action) => {
          this.dialog.closeAll();
          console.log("action.response", action.response);
          return this.dialog.open(CheckInSuccessDialogComponent, {
            width: "500px",
            data: action.response,
          });
        })
      ),
    { dispatch: false }
  );

  RedirectToAppointmentCheckInPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppointmentActions.redirectToAppointmentCheckIns),
        tap(({ doctorId }) => this.router.navigate(["/front-office/doctor-queue", doctorId]))
      ),
    { dispatch: false }
  );

  GetDoctorAppointmentQueueList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.GetDoctorAppointmentQueueList),
      mergeMap((action) =>
        this.appointmentService.getDoctorAppointmentQueueList(action.payload).pipe(
          map((response) => {
            return AppointmentActions.GetDoctorAppointmentQueueListSuccess({
              response,
            });
          }),

          catchError((error) =>
            of(
              AppointmentActions.GetDoctorAppointmentQueueListFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  UpdateDoctorAppointmentConsultationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.UpdateConsultationStatus),
      mergeMap((action) => {
        return this.appointmentService.updateConsultationStatus(action.payload).pipe(
          map((response) => {
            return AppointmentActions.UpdateConsultationStatusSuccess({
              response,
            });
          }),
          catchError((error) => of(AppointmentActions.UpdateConsultationStatusFailure({ error })))
        );
      })
    )
  );
}
