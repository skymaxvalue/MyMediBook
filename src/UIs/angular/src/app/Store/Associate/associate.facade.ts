import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as MasterActions from "./associate.actions";
@Injectable({
  providedIn: "root",
})
export class AssociateFacade {
  constructor(private store: Store) {}

  setSelectedAssociateId(associateId: number) {
    this.store.dispatch(MasterActions.SetSelectedAssociateId({ associateId }));
  }
  clearSelectedAssociateId() {
    this.store.dispatch(MasterActions.ClearSelectedAssociateId());
  }
}
