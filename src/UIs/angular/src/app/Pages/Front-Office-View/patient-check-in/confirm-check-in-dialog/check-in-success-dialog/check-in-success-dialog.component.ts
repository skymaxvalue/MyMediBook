import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import * as AppointmentActions from "../../../../../Store/Appointments/appointment.actions";
import { AssociateFacade } from "../../../../../Store/Associate/associate.facade";
import { AppointmentFacade } from "../../../../../Store/Appointments/appointment.facade";

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
    private store: Store,
    private associateFacade: AssociateFacade,
    private appointmentFacade: AppointmentFacade
  ) {}

  viewQueue(): void {
    const doctorId = this.data?.doctorProfile?.associateId;
    if (doctorId == null) {
      console.warn("No associateId in dialog data:", this.data);
      return;
    }
    this.dialogRef.close();
    this.associateFacade.setSelectedAssociateId(doctorId);
    this.appointmentFacade.redirectToAppointmentCheckInsPage(doctorId);
  }
  done(): void {
    this.dialogRef.close("done");
  }
}
