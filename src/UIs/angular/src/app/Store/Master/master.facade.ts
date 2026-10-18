import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as MasterSelectors from "./master.selectors";
import * as MasterActions from "./master.actions";
@Injectable({
  providedIn: "root",
})
export class MasterFacade {
  constructor(private store: Store) {}

  stausKeyList$ = this.store.pipe(select(MasterSelectors.selectStatuskeyList));
  organisationList$ = this.store.pipe(select(MasterSelectors.selectOrganisationList));

  getOrganisationList() {
    this.store.dispatch(MasterActions.GetOrganisationList());
  }
  getStatusKeyList() {
    this.store.dispatch(MasterActions.GetStatusKeyList());
  }
}
