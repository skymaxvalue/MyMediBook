import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  PatientSearchCriteria,
  RefillRequestPayload,
} from '../prescription-refill.models/Model';
import { PrescriptionRefillActions as A } from './prescription-refill.actions';
import * as S from './prescription-refill.selectors';

@Injectable({ providedIn: 'root' })
export class PrescriptionRefillFacade {
  private readonly store = inject(Store);

  readonly searchResults$ = this.store.select(S.selectSearchResults);
  readonly searching$ = this.store.select(S.selectSearching);
  readonly noResults$ = this.store.select(S.selectNoResults);
  readonly details$ = this.store.select(S.selectDetails);
  readonly loadingDetails$ = this.store.select(S.selectLoadingDetails);
  readonly medications$ = this.store.select(S.selectActiveMedications);
  readonly physicians$ = this.store.select(S.selectPhysicians);
  readonly submitting$ = this.store.select(S.selectSubmitting);
  readonly savingDraft$ = this.store.select(S.selectSavingDraft);
  readonly submitResult$ = this.store.select(S.selectSubmitResult);
  readonly draftResult$ = this.store.select(S.selectDraftResult);
  readonly error$ = this.store.select(S.selectError);

  init(): void {
    this.store.dispatch(A.loadPhysicians());
  }
  searchPatients(criteria: PatientSearchCriteria): void {
    this.store.dispatch(A.searchPatients({ criteria }));
  }
  clearSearch(): void {
    this.store.dispatch(A.clearSearch());
  }
  selectPatient(patientId: string): void {
    this.store.dispatch(A.selectPatient({ patientId }));
  }
  submit(payload: RefillRequestPayload): void {
    this.store.dispatch(A.submitRefill({ payload }));
  }
  saveDraft(payload: Partial<RefillRequestPayload>): void {
    this.store.dispatch(A.saveDraft({ payload }));
  }
  clearResults(): void {
    this.store.dispatch(A.clearResults());
  }
  reset(): void {
    this.store.dispatch(A.resetForm());
  }
}
