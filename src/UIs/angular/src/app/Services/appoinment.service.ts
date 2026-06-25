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
}
