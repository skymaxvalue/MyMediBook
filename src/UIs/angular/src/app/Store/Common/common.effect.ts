import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { switchMap, map, catchError, of, take, combineLatest } from "rxjs";
import * as A from "./common.actions";
import * as S from "./common.selectors";
import { ISearchPatientRequestModel } from "../../core/Models/common/search-patient.model";
import { CommonService } from "../../core/Services/common/common.service";

@Injectable()
export class CommonEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private commonService: CommonService
  ) {}

  SearchPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.searchPatients),
      switchMap(() =>
        combineLatest({
          fromDate: this.store.select(S.selectSearchByFromDate),
          toDate: this.store.select(S.selectSearchByEndDate),
          dob: this.store.select(S.selectSearchByDob),
          mobileNo: this.store.select(S.selectSearchByMobileNo),
          name: this.store.select(S.selectSearchByName),
        }).pipe(
          take(1),
          switchMap(({ fromDate, toDate, dob, mobileNo, name }) => {
            const payload: ISearchPatientRequestModel = {
              fromDate,
              toDate,
              dob: dob,
              mobileNo,
              name,
            };

            return this.commonService.searchPatients(payload).pipe(
              map((response) => A.searchPatientsSuccess({ response })),
              catchError((error) => of(A.searchPatientsFailure({ error })))
            );
          })
        )
      )
    )
  );
}
