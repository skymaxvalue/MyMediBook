import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import { Observable, Subscription, timer } from 'rxjs';
import { PatientRegister, LoginRequest } from '../Models/Patient-Model';
import { environment } from '../../environments/environment';
import { AuthEndPoints, MasterAPIEndPoints, LocationAPIEndPoint } from '../Utility/EndPointsOfAPI';


@Injectable({
  providedIn: "root",
})
export class AuthService {


  // API Base URL
  private apiUrl = environment.OpenIdConnect.apiUrl
  private refreshSubscription?: Subscription;
  constructor(
    private http: HttpClient
  ) { }

  // Login API
  loginPatient(data: LoginRequest, userRole: string): Observable<any> {
    if (userRole === 'patient') {
      return this.http.post<any>(
        `${this.apiUrl}${AuthEndPoints.PATIENT_LOGIN}`,
        data
      );
    } else {
      return this.http.post<any>(
        `${this.apiUrl}${AuthEndPoints.ASSOCIATE_LOGIN}`,
        data
      );
    }

  }
  requestOTP(email: any) {
    return this.http.post<any>(
      `${this.apiUrl}${AuthEndPoints.REQUEST_OTP}`,
      email
    );
  }

  // Self Registration API
  registerPatient(
    patient: PatientRegister
  ): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}${AuthEndPoints.PATIENT_REGISTER}`,
      patient
    );
  }

  startRefreshTimer() {
    // alert("start Refresh ")
    this.stopRefreshTimer();

    const loginTime = Number(localStorage.getItem('loginTime'));

    if (!loginTime) {
      return;
    }
    const refreshAfter = 55 * 60 * 1000; // 55 minutes
    const elapsed = Date.now() - loginTime;
    const remaining = refreshAfter - elapsed;

    if (remaining <= 0) {

      this.callRefreshToken().subscribe({
        next: (res) => {

          localStorage.setItem('token', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);

          localStorage.setItem('loginTime', Date.now().toString());

          // Restart timer
          this.startRefreshTimer();
        },
        error: () => {
          this.logout();
        }
      });

    } else {

      this.refreshSubscription = timer(remaining).subscribe(() => {

        this.callRefreshToken().subscribe({
          next: (res) => {

            localStorage.setItem('token', res.token);
            localStorage.setItem('refreshToken', res.refreshToken);

            localStorage.setItem('loginTime', Date.now().toString());

            // Restart timer
            this.startRefreshTimer();
          },
          error: () => {
            this.logout();
          }
        });

      });

    }


  }


  stopRefreshTimer() {
    // alert("stopeRefresh time")
    this.refreshSubscription?.unsubscribe();
  }

  callRefreshToken(): Observable<any> {
    // alert("abc")
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('token')

    return this.http.post<any>(
      `${this.apiUrl}${AuthEndPoints.REFRESH_TOKEN}`,
      {

        refreshToken,
        accessToken
      }
    );

  }
  logout() {
    this.stopRefreshTimer(); // Timer stop karo

    // localStorage.clear();    // Token aur user data remove karo

    // Login page par redirect karo
    // window.location.href = '/login';
  }

  // getQuestion API
  getSecurityQuestions(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${MasterAPIEndPoints.GET_SECURITY_QUESTIONS}`
    );

  }

  // getCountries API
  getCountries(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${LocationAPIEndPoint.GET_COUNTRIES}`
    );
  }

  // getStates API
  getStates(countryId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${LocationAPIEndPoint.GET_STAETES}${countryId}`
    );
  }

  // getCities API
  getCities(stateId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}${LocationAPIEndPoint.GET_CITIES}${stateId}`
    );
  }



}
