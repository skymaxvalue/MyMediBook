import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  APIEndpoints,
  AppointmentApiEndPoint,
  MasterAPIEndPoints,
} from "../../../Utility/EndPointsOfAPI";
import {
  UpdateAppointmentCheckInRequestModel,
  UpdateConsultationStatusRequestModel,
} from "../../Models/update-appointment-status.model";
import { AppointmentRequestModel } from "../../Models/appointment/appointment.model";
import { ListRequestModel } from "../../Models/list-request.model";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  private apiUrl = environment.OpenIdConnect.apiUrl;

  constructor(private http: HttpClient) {}

  createAppointment(appointment: AppointmentRequestModel): Observable<any> {
    return this.http.post(
      `${this.apiUrl}${AppointmentApiEndPoint.CREATE_APPOINTMENT}`,
      appointment
    );
  }
  getAgeType() {
    return this.http.get(`${this.apiUrl}${MasterAPIEndPoints.GET_AGE_TYPE}`);
  }
  getRelationType() {
    return this.http.get(`${this.apiUrl}${MasterAPIEndPoints.GET_RELATIONSHIP_TYPE}`);
  }
  getMyAppoitmentsByPatientID(patientId: number) {
    return this.http.get(
      `${this.apiUrl}${AppointmentApiEndPoint.GET_MYAPPOINTMENTS_BY_PATIONT_ID}`
    );
  }
  cancelAppoitmentsByPatientID(
    patientId: number,
    appointmentId: number,
    associateRole: string,
    lastUpdatedBy: string,
    cancelReason: string
  ) {
    return this.http.delete(`${this.apiUrl}${AppointmentApiEndPoint.CANCEL_MY_APPOINTMENT}`, {
      body: { patientId, appointmentId, associateRole, lastUpdatedBy, cancelReason },
    });
  }
  rescheduleAppoitmentsByPatientID({
    patientId,
    appointmentId,
    associateId,
    slotId,
    visitPurpose,
    visitType,
    lastUpdatedBy,
    associateRole,
    rescheduleReason,
  }: {
    patientId: number;
    appointmentId: number;
    associateId: number;
    slotId: number;
    visitPurpose: any;
    visitType: any;
    lastUpdatedBy: any;
    associateRole: any;
    rescheduleReason: any;
  }) {
    return this.http.put(`${this.apiUrl}${AppointmentApiEndPoint.RESCHEULE_MY_APPOINTMENT}`, {
      patientId,
      appointmentId,
      associateId,
      slotId,
      visitPurpose,
      visitType,
      lastUpdatedBy,
      associateRole,
      rescheduleReason,
    });
  }
  getAppointmentListByAssociateId(associateId: number) {
    return this.http.get(
      `${this.apiUrl}${AppointmentApiEndPoint.GET_APPOINTMENT_LIST_BY_ASSOCIATE_LIST}`
    );
  }
  getDashboardSummary(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(`${this.apiUrl}${APIEndpoints.GET_DASHBOARD_SUMMARY}`, {
      associateId,
      fromDate,
      toDate,
    });
  }
  getFrontOfficeRecentPatientQueueList(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(
      `${this.apiUrl}${APIEndpoints.GET_FRONTOFFICE_RECENT_PATIENTS_QUEUE_LIST}`,
      { associateId, fromDate, toDate }
    );
  }
  getDoctorRecentPatientList(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(`${this.apiUrl}${APIEndpoints.GET_DOCTOR_RECENT_PATIENT_LIST}`, {
      associateId,
      fromDate,
      toDate,
    });
  }
  getAppointmentListForReceptionist(associateId: number, fromDate: string, toDate: string) {
    return this.http.post(
      `${this.apiUrl}${AppointmentApiEndPoint.GET_APPOINTMENT_LIST_FOR_RECEPTIONIST}`,

      {
        associateId: associateId.toString(),
        fromDate,
        toDate,
        pageSize: 0,
        pageNumber: 0,
      }
    );
  }
  getAppointmentCheckinListForReceptionist(fromDate: string, toDate: string): Observable<any[]> {
    return this.http
      .post<any>(
        `${this.apiUrl}${AppointmentApiEndPoint.GET_APPOINTMENT_CHECK_IN_LIST_FOR_RECEPTIONIST}`,
        { fromDate, toDate, pageSize: 0, pageNumber: 0 }
      )
      .pipe(
        map((resp) => {
          return resp?.data;
        })
      );
  }

  updateCheckInStatus(payload: UpdateAppointmentCheckInRequestModel) {
    return this.http
      .post<any>(
        `${this.apiUrl}${AppointmentApiEndPoint.UPDATE_APPOINTMENT_CHECK_IN_STATUS}`,
        payload
      )
      .pipe(
        map((resp) => {
          return resp?.data;
        })
      );
  }
  getDoctorAppointmentQueueList(payload: ListRequestModel) {
    return this.http
      .post<any>(
        `${this.apiUrl}${AppointmentApiEndPoint.GET_APPOINTMENT_CHECKED_IN_LIST_FOR_DOCTOR}`,
        payload
      )
      .pipe(
        map((resp) => {
          return resp?.data;
        })
      );
  }
  updateConsultationStatus(payload: UpdateConsultationStatusRequestModel) {
    return this.http
      .post<any>(
        `${this.apiUrl}${AppointmentApiEndPoint.UPDATE_APPOINTMENT_CONSULTATION_STATUS}`,
        payload
      )
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }
}
