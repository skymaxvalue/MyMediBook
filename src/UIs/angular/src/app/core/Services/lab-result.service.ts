import { Injectable, signal } from "@angular/core";
import { LabResultModel } from "../Models/lab-result.model";
import { environment } from "src/environments/environment";
import { LabResult } from "src/app/Utility/EndPointsOfAPI";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: "root",
})
export class LabResultService {
    // private readonly resultsSignal = signal<LabResultModel[]>(LAB_RESULTS);

    constructor(private http: HttpClient) {

    }
    // Dummy


    GetMyLabResultsByPatientId(patientId: number) {
        return this.http.get(
            `${environment.OpenIdConnect.apiUrl}${LabResult.GET_LAB_RESULT_BY_PATIENT_ID}${patientId}`
        );
    }
}