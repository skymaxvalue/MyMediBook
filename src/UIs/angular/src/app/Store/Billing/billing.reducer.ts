import { createReducer, on } from '@ngrx/store';
import * as BillAction from './billing.actions';
import { initialLabResultState } from './billing.state';

export const BillReducer = createReducer(
    initialLabResultState,



    on(BillAction.getMyAllBills, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(BillAction.getMyAllBillsSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        myBillList: action.myBillList
    })),

    on(BillAction.getMyAllBillsFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))


);