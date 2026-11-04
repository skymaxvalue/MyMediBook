import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as MasterSelectors from "./master.selectors";
import * as MasterActions from "./master.actions";
@Injectable({
  providedIn: "root",
})
export class MasterFacade {
  statusKeyList$ = this.store.pipe(select(MasterSelectors.selectStatuskeyList));
  organisationList$ = this.store.pipe(select(MasterSelectors.selectOrganisationList));
  getRelationsList$ = this.store.pipe(select(MasterSelectors.selectRelationList));
  getOtpTypeList$ = this.store.pipe(select(MasterSelectors.selectOtpTypeList));

  constructor(private store: Store) {}

  getOrganisationList() {
    this.store.dispatch(MasterActions.GetOrganisationList());
  }
  getStatusKeyList() {
    this.store.dispatch(MasterActions.GetStatusKeyList());
  }
  loadRelationTypeList() {
    this.store.dispatch(MasterActions.getRelationTypeList());
  }
  loadOtpTypeList() {
    this.store.dispatch(MasterActions.getOtpTypeList());
  }
}
