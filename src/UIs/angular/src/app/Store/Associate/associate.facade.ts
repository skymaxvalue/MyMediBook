import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as MasterSelectors from "./associate.selectors";
import * as MasterActions from "./associate.actions";
@Injectable({
  providedIn: "root",
})
export class AssociateFacade {
  constructor(private store: Store) {}

  // selected$ = this.store.pipe(select(MasterSelectors.selectStatuskeyList));
  // organisationList$ = this.store.pipe(select(MasterSelectors.selectOrganisationList));

  setSelectedAssociateId(associateId: number) {
    this.store.dispatch(MasterActions.SetSelectedAssociateId({ associateId }));
  }
  clearSelectedAssociateId() {
    this.store.dispatch(MasterActions.ClearSelectedAssociateId());
  }
}
