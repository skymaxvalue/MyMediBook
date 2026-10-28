import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as AppointmentAction from "src/app/Store/Appointments/appointment.actions";
import { Store } from "@ngrx/store";
@Component({
  imports: [],
  selector: "app-confirm-check-in-dialog",
  styleUrl: "./confirm-check-in-dialog.component.css",
  templateUrl: "./confirm-check-in-dialog.component.html",
})
export class ConfirmCheckInDialogComponent {
  appointmentId: number = this.data.appointment.appointmentId;

  constructor(
    private dialogRef: MatDialogRef<ConfirmCheckInDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment: any },
    public store: Store
  ) {}

  confirmCheckIn(): void {
    this.store.dispatch(
      AppointmentAction.confirmPatientCheckIn({ appointmentId: this.appointmentId })
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
