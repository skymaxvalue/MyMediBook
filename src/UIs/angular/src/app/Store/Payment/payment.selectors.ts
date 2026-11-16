import {
    createFeatureSelector,
    createSelector
} from '@ngrx/store';

import { PaymentState } from './payment.state';

export const selectPaymentState =
    createFeatureSelector<PaymentState>('payment');

export const selectPatients = createSelector(
    selectPaymentState,
    state => state.patients
);

export const selectPaymentLoading = createSelector(
    selectPaymentState,
    state => state.loading
);

export const selectPaymentError = createSelector(
    selectPaymentState,
    state => state.error
);