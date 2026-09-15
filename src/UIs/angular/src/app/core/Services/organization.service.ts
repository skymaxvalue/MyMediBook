import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Organization } from "src/app/Utility/EndPointsOfAPI";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrganizationService {

  constructor(private http: HttpClient) {

  }

  getOrganizationList() {
    return this.http.get(`${environment.OpenIdConnect.apiUrl}${Organization.ORGANIZATION_LIST}`)
  }
}
