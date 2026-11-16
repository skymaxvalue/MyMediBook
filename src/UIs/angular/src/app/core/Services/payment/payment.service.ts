import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

import { environment } from "../../../../environments/environment";
import { PatientApiEndPoint } from "../../../utils/API/ApiEndPoints";
import { ISearchPatientRequestModel, ISearchPatientResponseModel } from "../../Models/common/search-patient.model";

@Injectable({
    providedIn: "root"
})
export class PaymentService {
    private http = inject(HttpClient);
    private apiUrl = environment.OpenIdConnect.apiUrl;

    searchPatients(
        requestData: ISearchPatientRequestModel
    ): Observable<ISearchPatientResponseModel[]> {
        return this.http
            .post<{ data: ISearchPatientResponseModel[] }>(
                `${this.apiUrl}${PatientApiEndPoint.SEARCH_PATIENT_REQUEST}`,
                requestData
            )
            .pipe(
                map((res) => res.data || [])
            );
    }
}