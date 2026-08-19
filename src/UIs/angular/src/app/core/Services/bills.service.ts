import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BillingAPiEndPoints } from "src/app/Utility/EndPointsOfAPI";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class BillsService {

  constructor(private http: HttpClient) {

  }
  // Dummy


  GetMyBillsByPatientId(patientId: number) {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${BillingAPiEndPoints.GET_ALL_BILL_BY_PATIENT_ID}${patientId}`
    );
  }
}
