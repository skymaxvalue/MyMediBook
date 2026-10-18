import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageEndPoints } from "src/app/Utility/EndPointsOfAPI";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  constructor(private http: HttpClient) {

  }

  GetMyMessages_ByPatientId(patientId: number) {
    return this.http.get(
      `${environment.OpenIdConnect.apiUrl}${MessageEndPoints.GET_MESSAGE_BY_ITS_ID}${patientId}`
    );
  }

  updateMessageToRead(messageId: number, isRead: boolean) {

    return this.http.request(
      'GET',
      `${environment.OpenIdConnect.apiUrl}${MessageEndPoints.UPDATE_MESSAGE_BY_ID}`,
      {
        body: {
          messageId: messageId,
          isRead: isRead
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
