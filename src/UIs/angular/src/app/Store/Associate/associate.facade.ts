import { Injectable } from "@angular/core";
import { select, Store } from "@ngrx/store";
import * as A from "./associate.actions";
import * as S from "./associate.selectors";
@Injectable({
  providedIn: "root",
})
export class AssociateFacade {
  selectedDoctor$ = this.store.pipe(select(S.selectAsssocicateById));

  constructor(private store: Store) {}

  getAssociateById(associateId: number) {
    this.store.dispatch(A.GetAssociateById({ associateId }));
  }
  setSelectedAssociateId(associateId: number) {
    this.store.dispatch(A.SetSelectedAssociateId({ associateId }));
  }
  clearSelectedAssociateId() {
    this.store.dispatch(A.ClearSelectedAssociateId());
  }
}
