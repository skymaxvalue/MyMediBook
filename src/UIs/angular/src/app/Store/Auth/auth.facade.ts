import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as AuthSelector from "./auth.selectors";
import * as AuthActions from "./auth.actions";

@Injectable({
  providedIn: "root",
})
export class AuthFacade {
  selectLoggedInUser$ = this.store.pipe(select(AuthSelector.selectLoginUser));
  selectCountry$ = this.store.pipe(select(AuthSelector.selectCountry));
  selectCity$ = this.store.pipe(select(AuthSelector.selectCity));
  selectState$ = this.store.pipe(select(AuthSelector.selectState));

  constructor(private store: Store) {}

  logOut() {
    this.store.dispatch(AuthActions.LogOut());
  }
  getCountries() {
    this.store.dispatch(AuthActions.getCountries());
  }
  getCities(stateId: number) {
    this.store.dispatch(AuthActions.getCities({ stateId }));
  }
  getStates(countryId: number) {
    this.store.dispatch(AuthActions.getStates({ countryId }));
  }
}
