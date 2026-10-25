import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as AuthSelector from "./auth.selectors";

@Injectable({
  providedIn: "root",
})
export class AuthFacade {
  constructor(private store: Store) {}

  selectLoggedInUser$ = this.store.pipe(select(AuthSelector.selectLoginUser));
}
