import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as S from "./doctor.selectors";

@Injectable({ providedIn: "root" })
export class DoctorFacade {
  getDoctorList$ = this.store.pipe(select(S.selectDoctorSpecialities));

  constructor(private store: Store) {}
}
