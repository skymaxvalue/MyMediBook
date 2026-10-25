import { tap } from "rxjs";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as NavActions from "./navigation.action";
import { Router } from "@angular/router";

@Injectable()
export class NavigationEffects {
  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          NavActions.NavigateToPatientHospitalSelectionPage,
          NavActions.NavigateToPatientDashboardPage,
          NavActions.NavigateToDoctorDashboardPage,
          NavActions.NavigateToFrontOfficeDashboardPage,
          NavActions.NavigateToAdminDashboardPage
        ),
        tap((action) => this.router.navigate([this.ROUTE_BY_ACTION[action.type]]))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router
  ) {}

  ROUTE_BY_ACTION: Record<string, string> = {
    [NavActions.NavigateToPatientHospitalSelectionPage.type]: "/select-hospital",
    [NavActions.NavigateToPatientDashboardPage.type]: "/patient/dashboard",
    [NavActions.NavigateToDoctorDashboardPage.type]: "/doctor/dashboard",
    [NavActions.NavigateToFrontOfficeDashboardPage.type]: "/front-office/dashboard",
    [NavActions.NavigateToAdminDashboardPage.type]: "/admin/dashboard",
  };
}
