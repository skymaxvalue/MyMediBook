import { Store } from "@ngrx/store";
import * as S from "./common.selectors";
import { Injectable } from "@angular/core";
import * as A from "./common.actions";
import { Dialog } from "@angular/cdk/dialog";
import { switchMap, map, catchError, of, tap } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CommonService } from "../../core/Services/common/common.service";
import { PatientSelectionDialogComponent } from "../../Pages/Front-Office-View/physician-consultation/patient-selection-dialog/patient-selection-dialog.component";
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

  openPatientSwitchDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(A.openPatientSwitchDialog),
        tap(() => {
          const patients = this.store.selectSignal(S.selectSearchedPatientList)();
          const dialogRef = this.dialog.open(PatientSelectionDialogComponent, {
            width: "600px",
            maxWidth: "95vw",
            height: "auto",
            maxHeight: "85vh",
            data: patients,
          });
          console.log("Patients from store:", patients);
          console.log("Patients count:", patients?.length);

          dialogRef.closed.subscribe((patient: any) => {
            if (patient) {
              this.store.dispatch(A.patientSelectedFromSearch({ patient }));
            }
          });
        })
      ),
    { dispatch: false }
  );
}
