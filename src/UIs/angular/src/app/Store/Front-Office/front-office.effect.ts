import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import * as A from './front-office.actions';
import { ConsultationService } from '../../core/Services/front-office/consultation.service';

@Injectable()
export class FrontOfficeEffects {

  submitConsultation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.submitConsultation),

      switchMap(({ formValue }) =>
        this.consultationService.submitConsultation(formValue).pipe(
          map((response) =>
            A.submitConsultationSuccess({
              confirmation: response
            })
          ),
          catchError((error) =>
            of(
              A.submitConsultationFailure({
                error: error?.error?.message || 'Failed to submit consultation'
              })
            )
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private consultationService: ConsultationService
  ) {}
}