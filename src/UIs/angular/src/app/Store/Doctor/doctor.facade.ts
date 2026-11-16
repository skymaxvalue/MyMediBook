import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as S from "./doctor.selectors";
import * as A from "./doctor.action";
import { IDataRequestModel } from "../../core/Models/common/data-request.model";

@Injectable({ providedIn: "root" })
export class DoctorFacade {
  getDoctorList$ = this.store.pipe(select(S.selectDoctorSpecialities));
  selectDoctorTimeSlotList$ = this.store.pipe(select(S.selectDoctorTimeSlotList));
  filteredDoctors$ = this.store.select(S.selectFilteredDoctors);

  constructor(private store: Store) {}

  filterDoctors(searchTerm: string): void {
    this.store.dispatch(A.filterDoctors({ searchTerm }));
  }
  getDoctorList() {
    this.store.dispatch(A.loadDoctorSpecialities());
  }
  getDoctorTimeSlotList(payload: IDataRequestModel) {
    this.store.dispatch(A.getTimeSloteByDoctorID({ payload }));
  }
}
