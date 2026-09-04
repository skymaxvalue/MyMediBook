import { createFeatureSelector, createSelector } from '@ngrx/store';
import { billsState } from './billing.state';

export const selectLabResultState =
    createFeatureSelector<billsState>(
        'bills'
    );



export const selectMyAllLabResultList = createSelector(
    selectLabResultState,
    state => state.myBillList
);

