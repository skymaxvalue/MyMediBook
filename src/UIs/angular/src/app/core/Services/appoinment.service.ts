import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppointmentBooking } from '../Models/Appointment-Model';
import { environment } from 'src/environments/environment';
import { APIEndpoints, AppointmentApiEndPoint, MasterAPIEndPoints } from '../../Utility/EndPointsOfAPI';

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
      `${this.apiUrl}${AppointmentApiEndPoint.CREATE_APPOINTMENT}`,
      appointment
    );
  }
  getAgeType() {
    return this.http.get(`${this.apiUrl}${MasterAPIEndPoints.GET_AGE_TYPE}`)
  }
  getRelationType() {
    return this.http.get(`${this.apiUrl}${MasterAPIEndPoints.GET_RELATIONSHIP_TYPE}`)
  }
  getMyAppoitmentsByPatientID(patientId: number) {
    return this.http.get(`${this.apiUrl}${AppointmentApiEndPoint.GET_MYAPPOINTMENTS_BY_PATIONT_ID}${patientId}`)
  }
  cancelAppoitmentsByPatientID(patientId: number, appointmentId: number, associateRole: string, lastUpdatedBy: string, cancelReason: string) {
    return this.http.delete(`${this.apiUrl}${AppointmentApiEndPoint.CANCEL_MY_APPOINTMENT}`, {
      body: { patientId, appointmentId, associateRole, lastUpdatedBy, cancelReason }
    })
  }
  rescheduleAppoitmentsByPatientID({ patientId, appointmentId, associateId, slotId, visitPurpose, visitType, lastUpdatedBy, associateRole, rescheduleReason }: { patientId: number, appointmentId: number, associateId: number, slotId: number, visitPurpose: any, visitType: any, lastUpdatedBy: any, associateRole: any, rescheduleReason: any }) {
    return this.http.put(`${this.apiUrl}${AppointmentApiEndPoint.RESCHEULE_MY_APPOINTMENT}`, { patientId, appointmentId, associateId, slotId, visitPurpose, visitType, lastUpdatedBy, associateRole, rescheduleReason })
  }
  getAppointmentListByAssociateId(associateId: number) {
    return this.http.get(`${this.apiUrl}${AppointmentApiEndPoint.GET_APPOINTMENT_LIST_BY_ASSOCIATE_LIST}${associateId}`)
  }
  getDashboardSummery(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(`${this.apiUrl}${APIEndpoints.GET_DASHBOARD_DATA}`, { associateId, fromDate, toDate })
  }
  getDashboardSummeryForReceptionist(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(`${this.apiUrl}${APIEndpoints.GET_DASHBOARD_DATA_FOR_RECEPTIONIST}`, { associateId, fromDate, toDate })
  }
  getDashboardSummeryForDoctor(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(`${this.apiUrl}${APIEndpoints.GET_DASHBOARD_DATA_FOR_DOCTOR}`, { associateId, fromDate, toDate })
  }
}
