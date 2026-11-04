import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as S from "./doctor.selectors";
import * as A from "./doctor.action";

@Injectable({ providedIn: "root" })
export class DoctorFacade {
  getDoctorList$ = this.store.pipe(select(S.selectDoctorSpecialities));

  constructor(private store: Store) {}

  getDoctorList() {
    this.store.dispatch(A.loadDoctorSpecialities());
  }
}
