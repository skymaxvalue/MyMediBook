import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState } from './appointment.state';

export const selectAppointmentState =
    createFeatureSelector<AppointmentState>(
        'appointment'
    );

export const selectAgeType = createSelector(
    selectAppointmentState,
    state => state.ageType
);  