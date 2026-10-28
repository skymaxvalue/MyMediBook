import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { PatientApiEndPoint } from "../../../utils/API/ApiEndPoints";
import { ISearchPatientRequestModel } from "../../Models/common/search-patient.model";
@Injectable({ providedIn: "root" })
export class CommonService {
  private http = inject(HttpClient);
  private apiUrl = environment.OpenIdConnect.apiUrl;

  searchPatients(payload: ISearchPatientRequestModel): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}${PatientApiEndPoint.SEARCH_PATIENT_REQUEST}`, payload)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }
}
