import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { PatientApiEndPoint } from "../../../utils/API/ApiEndPoints";
@Injectable({ providedIn: "root" })
export class ConsultationService {
  private http = inject(HttpClient);
  private apiUrl = environment.OpenIdConnect.apiUrl;

  searchPatients(payload: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}${PatientApiEndPoint.SEARCH_PATIENT_REQUEST}`, payload)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }
  getPatientByContact(contactNo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Patient/GetPatientByContact/${contactNo}`);
  }
  getDoctors(departmentName?: string): Observable<any> {
    let params = new HttpParams();
    if (departmentName) params = params.set("departmentName", departmentName);
    return this.http.get(`${this.apiUrl}/Doctor/GetDoctorSpecialityList`, { params });
  }
  getTimeSlots(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Doctor/GetDoctorTimeSlotById`, payload);
  }
  getAgeTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Master/GetAgeTypeList`);
  }
  getRelations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Master/GetRelationTypeList`);
  }
  requestOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/RequestOtp`, { email });
  }
  verifyOtp(email: string, otpCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/VerifyOtp`, { email, otpCode });
  }
  createAppointment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Appointment/CreateAppointment`, payload);
  }
  // [Certain] no such endpoint exists in the swagger yet. Backend needs to add it.
  saveIntake(_appointmentId: number, _intake: any): Observable<any> {
    throw new Error("Intake endpoint not implemented on backend");
  }
}
