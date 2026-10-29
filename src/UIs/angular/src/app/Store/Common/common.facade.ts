import { Injectable } from "@angular/core";
import { Store, select } from "@ngrx/store";
import * as A from "./common.actions";
import * as S from "./common.selectors";
import { ISearchPatientRequestModel } from "../../core/Models/common/search-patient.model";

@Injectable({ providedIn: "root" })
export class CommonFacade {
  searchedPatient$ = this.store.pipe(select(S.selectSearchedPatientList));

  constructor(private store: Store) {}

  searchPatient(payload: ISearchPatientRequestModel) {
    this.store.dispatch(A.searchPatients({ payload }));
  }
  searchByFromAndEndDate(fromDate: string, endDate: string) {
    this.store.dispatch(A.searchByFromAndEndDate({ fromDate, endDate }));
  }

  searchByDOB(DOB: string) {
    this.store.dispatch(A.searchByDOB({ DOB }));
  }

  searchByName(name: string) {
    this.store.dispatch(A.searchByName({ name }));
  }

  searchByPhoneNumber(phoneNumber: number) {
    this.store.dispatch(A.searchByPhoneNumber({ phoneNumber }));
  }

  clearPatientSearch(){
    this.store.dispatch(A.clearPatientSearch());
  }
}
