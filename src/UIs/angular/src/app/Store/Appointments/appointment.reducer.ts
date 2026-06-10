import { createReducer, on } from '@ngrx/store';
import * as AppointmentActions from './appointment.actions';
import { initialAppointmentState } from './appointment.state';

export const appointmentReducer = createReducer(
    initialAppointmentState,

    on(AppointmentActions.createAppointment, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AppointmentActions.createAppointmentSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        appointment: action.appointment
    })),

    on(AppointmentActions.createAppointmentFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))
);