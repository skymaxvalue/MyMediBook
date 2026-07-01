import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentBooking } from '../Models/Appointment-Model';
import { environment } from 'src/environments/environment';
import { APIEndpoints } from '../Utility/EndPointsOfAPI';

@Injectable({
  providedIn: "root",
})
export class AppoinmentService {
  private apiUrl = environment.OpenIdConnect.apiUrl

  constructor(private http: HttpClient) { }

  createAppointment(
    appointment: AppointmentBooking
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}${APIEndpoints.CREATE_APPOINTMENT}`,
      appointment
    );
  }
  getAgeType() {
    return this.http.get(`${this.apiUrl}${APIEndpoints.GET_AGE_TYPE}`)
  }
  getRelationType() {
    return this.http.get(`${this.apiUrl}${APIEndpoints.GET_RELATIONSHIP_TYPE}`)
  }
  getMyAppoitmentsByPatientID(patientId: number) {
    return this.http.get(`${this.apiUrl}${APIEndpoints.GET_MYAPPOINTMENTS_BY_PATIONT_ID}${patientId}`)
  }
  cancelAppoitmentsByPatientID(patientId: number, appointmentId: number) {
    return this.http.delete(`${this.apiUrl}${APIEndpoints.CANCEL_MY_APPOINTMENT}?appointmentId=${appointmentId}&patientId=${patientId}`)
  }
  rescheduleAppoitmentsByPatientID({ patientId, appointmentId, associateId, slotId, visitPurpose, visitType }: { patientId: number, appointmentId: number, associateId: number, slotId: number, visitPurpose: any, visitType: any }) {
    return this.http.put(`${this.apiUrl}${APIEndpoints.RESCHEULE_MY_APPOINTMENT}`, { patientId, appointmentId, associateId, slotId, visitPurpose, visitType })
  }
}
