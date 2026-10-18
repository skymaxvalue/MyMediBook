import { Injectable } from "@angular/core";
import * as MasterActions from "./master.actions";
import { catchError, map, mergeMap, of } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { MasterService } from "../../core/Services/master/master.service";

@Injectable()
export class MasterEffects {
  constructor(
    private actions$: Actions,
    private masterService: MasterService
  ) {}
  GetStatusKeyList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterActions.GetStatusKeyList),
      mergeMap(() =>
        this.masterService.getStatusKeyList().pipe(
          map((response) => MasterActions.GetStatusKeyListSuccess({ response })),
          catchError((error) =>
            of(
              MasterActions.GetStatusKeyListFailure({
                error,
              })
            )
          )
        )
      )
    )
  );

  GetOrganisationList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterActions.GetOrganisationList),

      mergeMap(() =>
        this.masterService.getOrganizationList().pipe(
          map((response: any) =>
            MasterActions.GetOrganisationListSuccess({
              response,
            })
          ),

          catchError((error) =>
            of(
              MasterActions.GetOrganisationListFailure({
                error: error?.message || "Getting Organization Data Failed",
              })
            )
          )
        )
      )
    )
  );
}
