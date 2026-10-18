import { Injectable } from "@angular/core";
import * as AssociateActions from "./associate.actions";
import { catchError, filter, map, mergeMap, of } from "rxjs";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { AssociateService } from "../../core/Services/associate/associate.service";
import * as AssociateSelectors from "./associate.selectors";
import { Store } from "@ngrx/store";
@Injectable()
export class MasterEffects {
  constructor(
    private actions$: Actions,
    private associateService: AssociateService,
    private store: Store
  ) {}

  GetAssociateById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssociateActions.GetAssociateById),
      concatLatestFrom(() => this.store.select(AssociateSelectors.selectedAssociateId)),
      filter(([associateId]) => !!associateId && associateId > 0),
      mergeMap(([, associateId]) =>
        this.associateService.getAssociateById(associateId).pipe(
          map((response) => AssociateActions.GetAssociateByIdSuccess({ response })),
          catchError((error) =>
            of(
              AssociateActions.GetAssociateByIdFailure({
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
