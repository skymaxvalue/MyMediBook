import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, forkJoin, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import * as A from "./front-office.actions";
import * as S from "./front-office.selectors";
import { VISIT_TYPE_IDS, VISIT_PURPOSE_IDS } from "../consultation.constants";
import { ConsultationService } from "../../core/Services/front-office/consultation.service";

const msg = (e: any, fallback: string) => e?.error?.message || e?.message || fallback;

@Injectable()
export class Effects {
  private actions$ = inject(Actions);
  private service = inject(ConsultationService);
  private store = inject(Store);

}
