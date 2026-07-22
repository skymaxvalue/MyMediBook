import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { APIEndpoints } from "../Utility/EndPointsOfAPI";
import { AssociateRequest, CreateScheduleRequest } from "../Models/Association-model";
import { USE_ASSOCIATION_TOKEN } from "../logging/http-context-tokens";

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

  getAllSpecialities() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_ALL_SPECIALITYLIST}`
    );
  }

  getAllDepartments() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_DEPARTMENT}`
    );
  }

  getAllRoles() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_ROLES}`
    );
  }

  registerAssociate(data: AssociateRequest) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.REGISTER_ASSOCIATION}`, data
    );
  }

  getAllRoleDepSpeci() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_ROLE_SPECIALITY_AVAILABITY}`
    );
  }

  getAllWeeksDays() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_DAYS_OF_WEEKEND}`
    );
  }

  getAllAssociates() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_ASSOCIATE_LIST}`,
      {
        context: new HttpContext().set(
          USE_ASSOCIATION_TOKEN,
          true
        )
      }
    )
  }

  createAssociateSchedule(data: CreateScheduleRequest) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.CREATE_SCHEDULE_ASSOCIATE}`, data
    );
  }
  getDoctorAvalabilityTimeSlot(data: any) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${APIEndpoints.GET_TIME_SLOTE_BYDOCTOR_ID}`, data
    );
  }
}
