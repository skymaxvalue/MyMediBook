import { createFeatureSelector, createSelector } from '@ngrx/store';
import { labResultState } from './lab-result.state';

export const selectLabResultState =
    createFeatureSelector<labResultState>(
        'labresult'
    );



export const selectMyAllLabResultList = createSelector(
    selectLabResultState,
    state => state.LabResultList
);

