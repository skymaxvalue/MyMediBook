import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as AuthSelectors from "./auth.selectors";
import * as AuthActions from "./auth.actions";
import { ListRequestModel } from "../../core/Models/list-request.model";
import { UpdateConsultationStatusRequestModel } from "../../core/Models/update-appointment-status.model";

@Injectable({
  providedIn: "root",
})
export class AuthFacade {
  constructor(private store: Store) {}

  logOut() {
    this.store.dispatch(AuthActions.LogOut());
  }
}
