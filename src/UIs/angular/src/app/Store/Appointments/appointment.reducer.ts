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
    })),
    on(AppointmentActions.getAgeType, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AppointmentActions.getAgeTypeSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        ageType: action.ageType
    })),

    on(AppointmentActions.getAgeTypeFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(AppointmentActions.getRelationType, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AppointmentActions.getRelationTypeSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        relations: action.Relations
    })),

    on(AppointmentActions.getRelationTypeFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))
    ,
    on(AppointmentActions.getMyAppointments, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AppointmentActions.getMyAppointmentsSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        Appointments: action.Appointments
    })),

    on(AppointmentActions.getMyAppointmentsFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))
    ,
    on(AppointmentActions.cancelMyAppointment, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AppointmentActions.cancelMyAppointmentSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        canceledAppoint: action.canceledAppoint
    })),

    on(AppointmentActions.cancelMyAppointmentFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    })),
    on(AppointmentActions.rescheduleMyAppointment, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(AppointmentActions.rescheduleMyAppointmentSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        rescheduledAppointment: action.rescheduledAppointment
    })),

    on(AppointmentActions.rescheduleMyAppointmentFailure, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error
    }))
);