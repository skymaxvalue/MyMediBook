import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { PatientRegister, LoginRequest } from '../Models/Patient-Model';
import { environment } from '../../../environments/environment';
import { APIEndpoints, MedicineOrderEndPoints, PatientApiEndPoint } from '../../Utility/EndPointsOfAPI'

@Injectable({
  providedIn: "root",
})
export class PatientService {
  // API Base URL
  private apiUrl = environment.OpenIdConnect.apiUrl

  constructor(
    private http: HttpClient) {

  }

  getPatientById(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}${PatientApiEndPoint.GET_PATIENT_PROFILE_BY_ID}${data.id}`,
      data
    );
  }
  updatePatientById(data: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}${PatientApiEndPoint.UPDATE_PATIONT_DTAILS}`,
      data
    );
  }

  getProfileListByPatientById(patientId: any): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}${PatientApiEndPoint.GET_PROFILE_BASED_ON_PATIENT}${patientId}`
    );
  }

  getProfileDataByPRofile_Id(profileId: any): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}${PatientApiEndPoint.GET_PROFILE_BASED_ON_PROFILEID}${profileId}`
    );
  }

  getAllMediceneByPatientId(patientId: any): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}${MedicineOrderEndPoints.GET_MEDICINE_OF_PATIENT}`, { patientId }
    );
  }


}
