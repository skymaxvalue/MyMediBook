import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import * as AppointmentActions from "../../../../../Store/Appointments/appointment.actions";
@Component({
  imports: [],
  selector: "app-check-in-success-dialog",
  styleUrl: "./check-in-success-dialog.component.css",
  templateUrl: "./check-in-success-dialog.component.html",
})
export class CheckInSuccessDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<CheckInSuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {}

  viewQueue(): void {
    console.log(this.data);
    this.store.dispatch(
      AppointmentActions.redirectToAppointmentCheckIns(this.data.doctorProfile.associateId)
    );
    // this .router.navigate(["/front-office/doctor-queue"], {
    //   queryParams: {
    //     doctor: this.selectedAppointment.doctor,
    //   },
    // });
  }
  done(): void {
    this.dialogRef.close("done");
  }
}
