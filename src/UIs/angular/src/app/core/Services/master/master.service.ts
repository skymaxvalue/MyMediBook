import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { MasterEndPoints } from "src/app/utils/API/ApiEndPoints";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MasterService {
  private apiUrl = environment.OpenIdConnect.apiUrl;
  constructor(private http: HttpClient) {}

  getStatusKeyList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${MasterEndPoints.STATUS_KEY_LIST}`).pipe(
      map((resp) => {
        return resp?.data;
      })
    );
  }
  getOrganizationList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${MasterEndPoints.ORGANISATION_LIST}`).pipe(
      map((resp) => {
        return resp?.data;
      })
    );
  }
  getRelations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${MasterEndPoints.GET_RELATIONSHIP_TYPE}`).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }
  getOtpTypeList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${MasterEndPoints.GET_OTP_TYPE_LIST}`).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }
}
