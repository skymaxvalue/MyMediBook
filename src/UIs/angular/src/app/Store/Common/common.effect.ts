import { Store } from "@ngrx/store";
import * as S from "./common.selectors";
import { Injectable } from "@angular/core";
import * as A from "./common.actions";
import { Dialog } from "@angular/cdk/dialog";
import { switchMap, map, catchError, of, tap, filter, exhaustMap } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommonService } from "../../core/Services/common/common.service";
import { PatientSelectionDialogComponent } from "../../shared/Components/shared-patient-search/patient-selection-dialog/patient-selection-dialog.component";
import { ISearchPatientResponseModel } from "../../core/Models/common/search-patient.model";

@Injectable()
export class CommonEffects {
  constructor(
    private actions$: Actions,
    private commonService: CommonService,
    private dialog: Dialog,
    private store: Store
  ) {}

  SearchPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.searchPatients),
      switchMap(({ payload }) =>
        this.commonService.searchPatients(payload).pipe(
          map((response) => A.searchPatientsSuccess({ response })),
          catchError((error) => of(A.searchPatientsFailure({ error })))
        )
      )
    )
  );

  openPatientSwitchDialog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.openPatientSwitchDialog),
      exhaustMap(
        () =>
          this.dialog.open<ISearchPatientResponseModel | null>(PatientSelectionDialogComponent, {
            width: "600px",
            maxWidth: "95vw",
            height: "auto",
            maxHeight: "85vh",
            // no `data`: the dialog reads the store itself
          }).closed
      ),
      filter((patient): patient is ISearchPatientResponseModel => !!patient),
      map((patient) => A.patientSelectedFromSearch({ patient }))
    )
  );

  patientSelectedFromSearch$ = this.actions$.pipe(
    ofType(A.patientSelectedFromSearch),
    map((a) => a.patient)
  );
}
