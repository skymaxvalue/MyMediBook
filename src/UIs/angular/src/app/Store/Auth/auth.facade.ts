import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as AuthSelector from "./auth.selectors";
import * as AuthActions from "./auth.actions";

@Injectable({
  providedIn: "root",
})
export class AuthFacade {
  selectLoggedInUser$ = this.store.pipe(select(AuthSelector.selectLoginUser));

  constructor(private store: Store) {}

  logOut() {
    this.store.dispatch(AuthActions.LogOut());
  }
}
