import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { PrescriptionRefillApiService } from '../service/prescription-refill.api.service';
import { PrescriptionRefillActions as A } from './prescription-refill.actions';

const message = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback);

@Injectable()
export class PrescriptionRefillEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(PrescriptionRefillApiService);

  searchPatients$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.searchPatients),
      switchMap(({ criteria }) =>
        this.api.searchPatients(criteria).pipe(
          map((patients) => A.searchPatientsSuccess({ patients })),
          catchError((e) => of(A.searchPatientsFailure({ error: message(e, 'Patient search failed') }))),
        ),
      ),
    ),
  );

  selectPatient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.selectPatient),
      switchMap(({ patientId }) =>
        this.api.getPatientDetails(patientId).pipe(
          map((details) => A.loadPatientDetailsSuccess({ details })),
          catchError((e) => of(A.loadPatientDetailsFailure({ error: message(e, 'Could not load patient') }))),
        ),
      ),
    ),
  );

  loadPhysicians$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadPhysicians),
      exhaustMap(() =>
        this.api.getPhysicians().pipe(
          map((physicians) => A.loadPhysiciansSuccess({ physicians })),
          catchError((e) => of(A.loadPhysiciansFailure({ error: message(e, 'Could not load physicians') }))),
        ),
      ),
    ),
  );

  // exhaustMap: a double-click on Submit must not create two refill requests.
  submitRefill$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.submitRefill),
      exhaustMap(({ payload }) =>
        this.api.submitRefill(payload).pipe(
          map((result) => A.submitRefillSuccess({ result })),
          catchError((e) => of(A.submitRefillFailure({ error: message(e, 'Submit failed') }))),
        ),
      ),
    ),
  );

  saveDraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.saveDraft),
      exhaustMap(({ payload }) =>
        this.api.saveDraft(payload).pipe(
          map((result) => A.saveDraftSuccess({ result })),
          catchError((e) => of(A.saveDraftFailure({ error: message(e, 'Could not save draft') }))),
        ),
      ),
    ),
  );
}
