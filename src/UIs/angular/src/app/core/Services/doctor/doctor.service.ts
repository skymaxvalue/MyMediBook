import {
  AssociateEndPoints,
  DoctorEndPoints,
  MasterEndPoints,
  AuthEndPoints,
} from "../../../utils/API/ApiEndPoints";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  AssociateRequest,
  CreateScheduleRequest,
  UpdateAssociateScheduleRequest,
} from "../../Models/associate/Association-model";

@Injectable({
  providedIn: "root",
})
export class DoctorService {
  constructor(private http: HttpClient) {}
  getDoctorSpecialities() {
    return this.http.get(`${environment.OpenIdConnect.apiUrl}${DoctorEndPoints.DOCTOR_LIST}`);
  }

  getAllSpecialities() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${DoctorEndPoints.GET_ALL_SPECIALITYLIST}`
    );
  }

  // getAllDepartments() {
  //   return this.http.get(`${environment.OpenIdConnect.apiUrl}${DoctorEndPoints.GET_DEPARTMENT}`);
  // }

  getAllRoles() {
    return this.http.get(`${environment.OpenIdConnect.apiUrl}${MasterEndPoints.GET_ROLES}`);
  }

  registerAssociate(data: AssociateRequest) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${AuthEndPoints.REGISTER_ASSOCIATION}`,
      data
    );
  }

  getAllRoleDepSpeci() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${MasterEndPoints.GET_ROLE_SPECIALITY_AVAILABITY}`
    );
  }

  getAllWeeksDays() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${MasterEndPoints.GET_DAYS_OF_WEEKEND}`
    );
  }

  getAllAssociates() {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${AssociateEndPoints.GET_ASSOCIATE_LIST}`
    );
  }

  createAssociateSchedule(data: CreateScheduleRequest) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${AssociateEndPoints.CREATE_SCHEDULE_ASSOCIATE}`,
      data
    );
  }
  getDoctorAvalabilityTimeSlot(data: any) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${DoctorEndPoints.GET_TIME_SLOT_BY_DOCTOR_ID}`,
      data
    );
  }

  getAssociateByAssociateID(associateId: any) {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${AssociateEndPoints.GET_ASSOCIATE_BY_ITS_ID}${associateId.associateId}`
    );
  }
  updateAssociateSchedule(data: UpdateAssociateScheduleRequest) {
    return this.http.post(
      `${environment.OpenIdConnect.apiUrl}${AssociateEndPoints.UPDATE_ASSOCIATE_BY_ITS_ID}`,
      data
    );
  }

  deleteAssociateSchedule(data: UpdateAssociateScheduleRequest) {
    return this.http.delete(
      `${environment.OpenIdConnect.apiUrl}${AssociateEndPoints.DELETE_ASSOCIATE_BY_ITS_ID}`,
      { body: data }
    );
  }
}
