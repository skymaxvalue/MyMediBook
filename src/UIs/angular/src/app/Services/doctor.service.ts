import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { APIEndpoints } from "../Utility/EndPointsOfAPI";

@Injectable({
  providedIn: "root",
})
export class DoctorService {

  constructor(
    private http: HttpClient) {

  }
  getDoctorSpecialities() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_SPECIALITIES}`
    );
  }
}
