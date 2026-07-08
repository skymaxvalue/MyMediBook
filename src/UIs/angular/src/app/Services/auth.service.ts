import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable, Subscription, timer } from 'rxjs';
import { PatientRegister, LoginRequest } from '../Models/Patient-Model';
import { environment } from '../../environments/environment';
import { APIEndpoints } from '../Utility/EndPointsOfAPI'

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private refreshSubscription?: Subscription;


  // API Base URL
  private apiUrl = environment.OpenIdConnect.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  // Login API
  loginPatient(data: LoginRequest): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}${APIEndpoints.PATIENT_LOGIN}`,
      data
    );
  }
  requestOTP(email: any) {
    return this.http.post<any>(
      `${this.apiUrl}${APIEndpoints.REQUEST_OTP}`,
      email
    );
  }

  // Self Registration API
  registerPatient(
    patient: PatientRegister
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}${APIEndpoints.PATIENT_REGISTER}`,
      patient
    );
  }

  startRefreshTimer() {

    // Previous timer cancel kara
    this.stopRefreshTimer();

    // 55 minutes
    const refreshTime = 55 * 60 * 1000;

    this.refreshSubscription = timer(refreshTime, refreshTime).subscribe(() => {
      this.callRefreshToken();
    });
  }

  stopRefreshTimer() {
    this.refreshSubscription?.unsubscribe();
  }

  callRefreshToken(): Observable<any> {

    const refreshToken = localStorage.getItem('refreshToken');

    return this.http.post<any>(
      `${this.apiUrl}${APIEndpoints.REFRESH_TOKEN}`,
      {
        refreshToken
      }
    );

  }
  logout() {
    localStorage.clear();

  }


  // getQuestion API
  getSecurityQuestions(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${APIEndpoints.GET_SECURITY_QUESTIONS}`
    );

  }

  // getCountries API
  getCountries(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${APIEndpoints.GET_COUNTRIES}`
    );
  }

  // getStates API
  getStates(countryId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${APIEndpoints.GET_STAETES}${countryId}`
    );
  }

  // getCities API
  getCities(stateId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${APIEndpoints.GET_CITIES}${stateId}`
    );
  }



}
