import { createReducer, on } from '@ngrx/store';

import * as PaymentActions from './payment.actions';
import { initialPaymentState } from './payment.state';

export const paymentReducer = createReducer(
    initialPaymentState,

    on(PaymentActions.searchPatients, (state, { payload }) => ({
        ...state,
        loading: true,
        error: null,
        searchRequest: payload,
        patients: []
    })),

    on(PaymentActions.searchPatientsSuccess, (state, { patients }) => ({
        ...state,
        patients,
        loading: false,
        error: null
    })),

    on(PaymentActions.searchPatientsFailure, (state, { error }) => ({
        ...state,
        patients: [],
        loading: false,
        error
    })),

    on(PaymentActions.getPaymentListByPatientId, (state, { patientId }) => ({
        ...state,
        loading: true,
        error: null,
        paymentList: []
    })),

    on(PaymentActions.getPaymentListByPatientIdSuccess, (state, { paymentList }) => ({
        ...state,
        paymentList,
        loading: false,
        error: null
    })),

    on(PaymentActions.getPaymentListByPatientIdFailure, (state, { error }) => ({
        ...state,
        paymentList: [],
        loading: false,
        error
    }))
);