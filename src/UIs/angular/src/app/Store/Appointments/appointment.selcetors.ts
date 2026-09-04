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
export const selectRelationShipType = createSelector(
    selectAppointmentState,
    state => state.relations
);
export const selectMyAppointmentList = createSelector(
    selectAppointmentState,
    state => state.Appointments
);
export const selectCanceledAppointment = createSelector(
    selectAppointmentState,
    state => state.canceledAppoint
);
export const selectRescheduledAppointment = createSelector(
    selectAppointmentState,
    state => state.rescheduledAppointment
);
export const selectCreateAppointmentRes = createSelector(
    selectAppointmentState,
    state => state.appointment
);
export const selectAppointmentListByAssociateID = createSelector(
    selectAppointmentState,
    state => state.Appointments
);
export const selectDashboardDataSummery = createSelector(
    selectAppointmentState,
    state => state.Appointments
);

export const selectDashboardDataSummeryForReceptionist = createSelector(
    selectAppointmentState,
    state => state.Appointments
);

export const selectDashboardDataSummeryForDoctor = createSelector(
    selectAppointmentState,
    state => state.Appointments
);

