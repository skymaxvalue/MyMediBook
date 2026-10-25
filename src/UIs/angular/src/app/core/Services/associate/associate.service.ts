import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AssociateEndPoints, MasterEndPoints } from "src/app/utils/API/ApiEndPoints";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AssociateService {
  private apiUrl = environment.OpenIdConnect.apiUrl;
  constructor(private http: HttpClient) { }

  getAssociateById(associateId: number): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}${AssociateEndPoints.GET_ASSOCIATE_BY_ITS_ID}/${associateId}`)
      .pipe(
        map((resp) => {
          return resp?.data;
        })
      );
  }
}
