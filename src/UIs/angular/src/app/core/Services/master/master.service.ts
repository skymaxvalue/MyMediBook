import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { MasterEndPoints } from "src/app/Utility/EndPointsOfAPI";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private apiUrl = environment.OpenIdConnect.apiUrl;
  constructor(private http: HttpClient) {}

  getStatusKeyList() {
    return this.http.get<any>(`${this.apiUrl}${MasterEndPoints.STATUS_KEY_LIST}`).pipe(
      map((resp) => {
        return resp?.data;
      })
    );
  }
  getOrganizationList() {
    return this.http.get<any>(`${this.apiUrl}${MasterEndPoints.ORGANISATION_LIST}`).pipe(
      map((resp) => {
        return resp?.data;
      })
    );
  }
}
