import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as AppointmentActions from "./appointment.actions";
import * as AppointmentSelectors from "./appointment.selectors";
import { ListRequestModel } from "../../core/Models/list-request.model";
import { UpdateConsultationStatusRequestModel } from "../../core/Models/update-appointment-status.model";
@Injectable({
  providedIn: "root",
})
export class AppointmentFacade {
  constructor(private store: Store) {}

  doctorAppointmentQueueList$ = this.store.pipe(
    select(AppointmentSelectors.selectDoctorAppointmentQueueList)
  );

  getDoctorAppointmentQueueList(payload: ListRequestModel) {
    this.store.dispatch(AppointmentActions.GetDoctorAppointmentQueueList({ payload }));
  }
  updateConsultationStatus(payload: UpdateConsultationStatusRequestModel) {
    this.store.dispatch(AppointmentActions.UpdateConsultationStatus({ payload }));
  }
  redirectToAppointmentCheckInsPage(doctorId: number) {
    this.store.dispatch(AppointmentActions.redirectToAppointmentCheckIns({ doctorId }));
  }
}
